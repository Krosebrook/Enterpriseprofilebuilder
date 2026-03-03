import { Section } from '../types';

const STORAGE_KEYS = {
  COMPLETED_TASKS: 'completed_tasks',
  VIEW_HISTORY: 'view_history',
  BOOKMARKS: 'bookmarks',
  THEME: 'theme',
};

// Task Management
export const getCompletedTasks = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
  return stored ? JSON.parse(stored) : [];
};

export const isTaskCompleted = (taskId: string): boolean => {
  const completed = getCompletedTasks();
  return completed.includes(taskId);
};

export const markTaskCompleted = (taskId: string): void => {
  const completed = getCompletedTasks();
  if (!completed.includes(taskId)) {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify([...completed, taskId]));
  }
};

export const markTaskIncomplete = (taskId: string): void => {
  const completed = getCompletedTasks();
  const updated = completed.filter(id => id !== taskId);
  localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(updated));
};

// View History
export const addToViewHistory = (section: Section): void => {
  if (typeof window === 'undefined') return;
  const history = getViewHistory();
  const updated = [section, ...history.filter(s => s !== section)].slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.VIEW_HISTORY, JSON.stringify(updated));
};

export const getViewHistory = (): Section[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.VIEW_HISTORY);
  return stored ? JSON.parse(stored) : [];
};

// Bookmarks
export const getBookmarks = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
  return stored ? JSON.parse(stored) : [];
};

export const toggleBookmark = (id: string): boolean => {
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.includes(id);
  let updated;
  
  if (isBookmarked) {
    updated = bookmarks.filter(b => b !== id);
  } else {
    updated = [...bookmarks, id];
  }
  
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  return !isBookmarked;
};

export const isBookmarked = (id: string): boolean => {
  return getBookmarks().includes(id);
};
