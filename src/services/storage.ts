import { Project, User, UserPreferences } from '../types/domain';

const STORAGE_KEYS = {
  USER: 'app_user',
  PROJECTS: 'app_projects',
  THEME: 'app_theme',
} as const;

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// In-memory cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// In-memory cache store
class CacheStore {
  private cache = new Map<string, CacheEntry<unknown>>();
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    invalidations: 0,
  };

  get<T>(key: string, ttl: number = CACHE_TTL): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if cache entry is still valid
    const isExpired = Date.now() - entry.timestamp > ttl;
    if (isExpired) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    this.stats.sets++;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.stats.invalidations++;
  }

  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.stats.invalidations++;
      }
    });
  }

  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      invalidations: 0,
    };
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }
}

// Global cache instance
const cache = new CacheStore();

export const storageService = {
  getUser: (): User | null => {
    // Try cache first
    const cacheKey = `user:${STORAGE_KEYS.USER}`;
    const cachedUser = cache.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    // Cache miss - load from localStorage
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      const user: User | null = data ? (JSON.parse(data) as User) : null;
      
      // Store in cache if found
      if (user) {
        cache.set(cacheKey, user);
      }
      
      return user;
    } catch (e) {
      console.error('Failed to parse user from storage', e);
      return null;
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    // Update cache
    const cacheKey = `user:${STORAGE_KEYS.USER}`;
    cache.set(cacheKey, user);
  },

  getProjects: (): Project[] => {
    // Try cache first
    const cacheKey = `projects:${STORAGE_KEYS.PROJECTS}`;
    const cachedProjects = cache.get<Project[]>(cacheKey);
    if (cachedProjects) {
      return cachedProjects;
    }

    // Cache miss - load from localStorage
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const projects: Project[] = data ? (JSON.parse(data) as Project[]) : [];
      
      // Store in cache
      cache.set(cacheKey, projects);
      
      return projects;
    } catch (e) {
      console.error('Failed to parse projects from storage', e);
      return [];
    }
  },

  saveProject: (project: Project): void => {
    const projects = storageService.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    
    // Update cache
    const cacheKey = `projects:${STORAGE_KEYS.PROJECTS}`;
    cache.set(cacheKey, projects);
  },

  getTheme: (): UserPreferences['theme'] => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as UserPreferences['theme']) || 'system';
  },

  setTheme: (theme: UserPreferences['theme']): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  // Cache management methods
  clearCache: (): void => {
    cache.clear();
  },

  invalidateUserCache: (): void => {
    cache.invalidate(`user:${STORAGE_KEYS.USER}`);
  },

  invalidateProjectsCache: (): void => {
    cache.invalidate(`projects:${STORAGE_KEYS.PROJECTS}`);
  },

  getCacheStats: () => {
    return cache.getStats();
  },
};
