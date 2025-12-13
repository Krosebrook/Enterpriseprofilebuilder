import { Project, User, UserPreferences } from '../types/domain';

const STORAGE_KEYS = {
  USER: 'app_user',
  PROJECTS: 'app_projects',
  THEME: 'app_theme',
} as const;

export const storageService = {
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to parse user from storage', e);
      return null;
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
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
  }
};
