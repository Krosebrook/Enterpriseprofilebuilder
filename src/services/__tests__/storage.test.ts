import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../storage';
import type { User, Project } from '../../types/domain';

describe('Storage Service with Caching', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.clearCache();
  });

  describe('User Management', () => {
    it('should store and retrieve user', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'editor',
        preferences: {
          theme: 'dark',
          notifications: true,
          reducedMotion: false,
        },
      };

      storageService.setUser(user);
      const retrieved = storageService.getUser();

      expect(retrieved).toEqual(user);
    });

    it('should use cache on second retrieval', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'editor',
        preferences: {
          theme: 'dark',
          notifications: true,
          reducedMotion: false,
        },
      };

      storageService.setUser(user);
      
      // First retrieval - cache miss
      storageService.getUser();
      const stats1 = storageService.getCacheStats();
      
      // Second retrieval - cache hit
      storageService.getUser();
      const stats2 = storageService.getCacheStats();

      expect(stats2.hits).toBeGreaterThan(stats1.hits);
    });

    it('should invalidate user cache', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'editor',
        preferences: {
          theme: 'dark',
          notifications: true,
          reducedMotion: false,
        },
      };

      storageService.setUser(user);
      storageService.getUser(); // Cache it
      storageService.invalidateUserCache();
      
      const stats = storageService.getCacheStats();
      expect(stats.invalidations).toBeGreaterThan(0);
    });
  });

  describe('Project Management', () => {
    it('should store and retrieve projects', () => {
      const project: Project = {
        id: 'project-1',
        name: 'Test Project',
        description: 'Test Description',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: 'user-1',
      };

      storageService.saveProject(project);
      const projects = storageService.getProjects();

      expect(projects).toHaveLength(1);
      expect(projects[0]).toEqual(project);
    });

    it('should update existing project', () => {
      const project: Project = {
        id: 'project-1',
        name: 'Test Project',
        description: 'Test Description',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: 'user-1',
      };

      storageService.saveProject(project);
      
      const updatedProject = {
        ...project,
        name: 'Updated Project',
        status: 'archived' as const,
      };
      
      storageService.saveProject(updatedProject);
      const projects = storageService.getProjects();

      expect(projects).toHaveLength(1);
      expect(projects[0].name).toBe('Updated Project');
      expect(projects[0].status).toBe('archived');
    });

    it('should cache projects list', () => {
      const project: Project = {
        id: 'project-1',
        name: 'Test Project',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: 'user-1',
      };

      storageService.saveProject(project);
      
      // First retrieval
      storageService.getProjects();
      const stats1 = storageService.getCacheStats();
      
      // Second retrieval - should hit cache
      storageService.getProjects();
      const stats2 = storageService.getCacheStats();

      expect(stats2.hits).toBeGreaterThan(stats1.hits);
    });

    it('should invalidate projects cache', () => {
      const project: Project = {
        id: 'project-1',
        name: 'Test Project',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: 'user-1',
      };

      storageService.saveProject(project);
      storageService.getProjects(); // Cache it
      storageService.invalidateProjectsCache();
      
      const stats = storageService.getCacheStats();
      expect(stats.invalidations).toBeGreaterThan(0);
    });
  });

  describe('Cache Statistics', () => {
    it('should track cache hits and misses', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'editor',
        preferences: {
          theme: 'dark',
          notifications: true,
          reducedMotion: false,
        },
      };

      // Clear cache first to ensure clean state
      storageService.clearCache();
      storageService.setUser(user);
      
      // Invalidate cache to test miss behavior
      storageService.invalidateUserCache();
      
      // First get after invalidation - miss
      storageService.getUser();
      
      // Second and third get - hits
      storageService.getUser();
      storageService.getUser();
      
      const stats = storageService.getCacheStats();
      
      expect(stats.hits).toBeGreaterThanOrEqual(2);
      expect(stats.misses).toBeGreaterThanOrEqual(1);
      expect(stats.hitRate).toBeGreaterThan(0);
    });

    it('should calculate hit rate correctly', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'editor',
        preferences: {
          theme: 'dark',
          notifications: true,
          reducedMotion: false,
        },
      };

      // Clear cache first
      storageService.clearCache();
      storageService.setUser(user);
      
      // Invalidate to create a miss
      storageService.invalidateUserCache();
      
      // 1 miss
      storageService.getUser();
      
      // 2 hits
      storageService.getUser();
      storageService.getUser();
      
      const stats = storageService.getCacheStats();
      
      // Hit rate should be around 66% (2 hits out of 3 total)
      expect(stats.hitRate).toBeGreaterThan(60);
      expect(stats.hitRate).toBeLessThanOrEqual(70);
    });

    it('should clear all cache', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'editor',
        preferences: {
          theme: 'dark',
          notifications: true,
          reducedMotion: false,
        },
      };

      storageService.setUser(user);
      storageService.getUser();
      
      storageService.clearCache();
      const stats = storageService.getCacheStats();
      
      expect(stats.size).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('Theme Management', () => {
    it('should store and retrieve theme preference', () => {
      storageService.setTheme('dark');
      expect(storageService.getTheme()).toBe('dark');
    });

    it('should default to system theme', () => {
      expect(storageService.getTheme()).toBe('system');
    });
  });
});
