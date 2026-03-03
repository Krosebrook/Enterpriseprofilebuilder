import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCompletedTasks,
  isTaskCompleted,
  markTaskCompleted,
  markTaskIncomplete,
  addToViewHistory,
  getViewHistory,
  getBookmarks,
  toggleBookmark,
  isBookmarked,
} from '../storage';
import type { Section } from '../../types';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Task Management', () => {
    it('should return empty array when no tasks completed', () => {
      expect(getCompletedTasks()).toEqual([]);
    });

    it('should mark task as completed', () => {
      markTaskCompleted('task-1');
      expect(getCompletedTasks()).toContain('task-1');
      expect(isTaskCompleted('task-1')).toBe(true);
    });

    it('should not duplicate completed tasks', () => {
      markTaskCompleted('task-1');
      markTaskCompleted('task-1');
      expect(getCompletedTasks()).toEqual(['task-1']);
    });

    it('should mark task as incomplete', () => {
      markTaskCompleted('task-1');
      markTaskCompleted('task-2');
      markTaskIncomplete('task-1');
      
      expect(getCompletedTasks()).not.toContain('task-1');
      expect(getCompletedTasks()).toContain('task-2');
      expect(isTaskCompleted('task-1')).toBe(false);
    });
  });

  describe('View History', () => {
    it('should return empty array when no history', () => {
      expect(getViewHistory()).toEqual([]);
    });

    it('should add section to view history', () => {
      addToViewHistory('features' as Section);
      expect(getViewHistory()).toContain('features');
    });

    it('should move existing section to top of history', () => {
      addToViewHistory('features' as Section);
      addToViewHistory('tools' as Section);
      addToViewHistory('features' as Section);
      
      const history = getViewHistory();
      expect(history[0]).toBe('features');
      expect(history.length).toBe(2);
    });

    it('should limit history to 10 items', () => {
      const sections: Section[] = [
        'overview', 'features', 'tools', 'roles', 'best-practices',
        'faq', 'deployment', 'governance', 'operations', 'reference',
        'baseline', 'ecosystem'
      ];
      
      sections.forEach(section => addToViewHistory(section));
      
      expect(getViewHistory().length).toBe(10);
    });
  });

  describe('Bookmarks', () => {
    it('should return empty array when no bookmarks', () => {
      expect(getBookmarks()).toEqual([]);
    });

    it('should add bookmark', () => {
      const wasBookmarked = toggleBookmark('item-1');
      expect(wasBookmarked).toBe(true);
      expect(getBookmarks()).toContain('item-1');
      expect(isBookmarked('item-1')).toBe(true);
    });

    it('should remove bookmark', () => {
      toggleBookmark('item-1');
      const wasRemoved = toggleBookmark('item-1');
      
      expect(wasRemoved).toBe(false);
      expect(getBookmarks()).not.toContain('item-1');
      expect(isBookmarked('item-1')).toBe(false);
    });

    it('should toggle multiple bookmarks independently', () => {
      toggleBookmark('item-1');
      toggleBookmark('item-2');
      toggleBookmark('item-1');
      
      expect(getBookmarks()).not.toContain('item-1');
      expect(getBookmarks()).toContain('item-2');
    });
  });
});
