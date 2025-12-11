import { UserPreferences, Role } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'claude-profile-builder-preferences',
  BOOKMARKS: 'claude-profile-builder-bookmarks',
  COMPLETED_TASKS: 'claude-profile-builder-completed-tasks',
  VIEW_HISTORY: 'claude-profile-builder-view-history'
} as const;

/**
 * Get user preferences from localStorage
 */
export function getPreferences(): UserPreferences {
  const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse preferences:', e);
    }
  }

  return {
    role: 'All',
    theme: 'light',
    fontSize: 'medium',
    bookmarks: [],
    completedTasks: [],
    viewHistory: []
  };
}

/**
 * Save user preferences to localStorage
 */
export function savePreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
}

/**
 * Update a specific preference
 */
export function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  const prefs = getPreferences();
  prefs[key] = value;
  savePreferences(prefs);
}

/**
 * Add a bookmark
 */
export function addBookmark(id: string): void {
  const prefs = getPreferences();
  if (!prefs.bookmarks.includes(id)) {
    prefs.bookmarks.push(id);
    savePreferences(prefs);
  }
}

/**
 * Remove a bookmark
 */
export function removeBookmark(id: string): void {
  const prefs = getPreferences();
  prefs.bookmarks = prefs.bookmarks.filter(b => b !== id);
  savePreferences(prefs);
}

/**
 * Check if an item is bookmarked
 */
export function isBookmarked(id: string): boolean {
  const prefs = getPreferences();
  return prefs.bookmarks.includes(id);
}

/**
 * Mark a task as completed
 */
export function markTaskCompleted(taskId: string): void {
  const prefs = getPreferences();
  if (!prefs.completedTasks.includes(taskId)) {
    prefs.completedTasks.push(taskId);
    savePreferences(prefs);
  }
}

/**
 * Mark a task as incomplete
 */
export function markTaskIncomplete(taskId: string): void {
  const prefs = getPreferences();
  prefs.completedTasks = prefs.completedTasks.filter(t => t !== taskId);
  savePreferences(prefs);
}

/**
 * Check if a task is completed
 */
export function isTaskCompleted(taskId: string): boolean {
  const prefs = getPreferences();
  return prefs.completedTasks.includes(taskId);
}

/**
 * Add to view history
 */
export function addToViewHistory(section: string): void {
  const prefs = getPreferences();
  
  // Remove if already exists to move to front
  prefs.viewHistory = prefs.viewHistory.filter(s => s !== section);
  
  // Add to front
  prefs.viewHistory.unshift(section);
  
  // Keep only last 10
  prefs.viewHistory = prefs.viewHistory.slice(0, 10);
  
  savePreferences(prefs);
}

/**
 * Get deployment progress (percentage of completed tasks)
 */
export function getDeploymentProgress(): number {
  const prefs = getPreferences();
  // This would calculate based on total deployment tasks
  // For now, return a simple percentage
  return (prefs.completedTasks.length / 30) * 100; // Assuming 30 total tasks
}

/**
 * Clear all data
 */
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
