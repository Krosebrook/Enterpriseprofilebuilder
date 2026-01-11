/**
 * @fileoverview Enhanced localStorage utility with versioning and safe parsing
 * @module lib/storage
 * @description Production-grade localStorage wrapper with error handling, versioning, and migration support
 */

import { logger } from './logger';

/**
 * Storage value wrapper with version information
 */
interface StorageValue<T> {
  version: number;
  data: T;
  timestamp: number;
}

/**
 * Storage options
 */
interface StorageOptions {
  version?: number;
  ttl?: number; // Time to live in milliseconds
}

/**
 * Safe localStorage utility with versioning and error handling
 */
export class SafeStorage {
  private prefix: string;

  constructor(prefix: string = 'app') {
    this.prefix = prefix;
  }

  /**
   * Get prefixed key
   */
  private getKey(key: string): string {
    return `${this.prefix}_${key}`;
  }

  /**
   * Safe JSON parse with fallback
   */
  private safeParse<T>(value: string | null, fallback: T): T {
    if (!value) return fallback;

    try {
      return JSON.parse(value);
    } catch (error) {
      logger.warn('Failed to parse stored value', { key: value, error });
      return fallback;
    }
  }

  /**
   * Check if value has expired
   */
  private isExpired(timestamp: number, ttl?: number): boolean {
    if (!ttl) return false;
    return Date.now() - timestamp > ttl;
  }

  /**
   * Get item from localStorage with version checking
   */
  getItem<T>(key: string, fallback: T, options: StorageOptions = {}): T {
    if (typeof window === 'undefined') return fallback;

    try {
      const prefixedKey = this.getKey(key);
      const stored = localStorage.getItem(prefixedKey);

      if (!stored) return fallback;

      const parsed = this.safeParse<StorageValue<T>>(stored, { 
        version: 0, 
        data: fallback, 
        timestamp: Date.now() 
      });

      // Check version mismatch
      if (options.version && parsed.version !== options.version) {
        logger.info('Storage version mismatch, using fallback', { 
          key, 
          expected: options.version, 
          actual: parsed.version 
        });
        // Clear old version
        this.removeItem(key);
        return fallback;
      }

      // Check expiration
      if (this.isExpired(parsed.timestamp, options.ttl)) {
        logger.debug('Storage value expired', { key });
        this.removeItem(key);
        return fallback;
      }

      return parsed.data;
    } catch (error) {
      logger.error('Failed to get item from storage', error as Error, { key });
      return fallback;
    }
  }

  /**
   * Set item in localStorage with version
   */
  setItem<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const prefixedKey = this.getKey(key);
      const wrappedValue: StorageValue<T> = {
        version: options.version || 1,
        data: value,
        timestamp: Date.now()
      };

      localStorage.setItem(prefixedKey, JSON.stringify(wrappedValue));
      return true;
    } catch (error) {
      // Handle quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        logger.error('Storage quota exceeded', error, { key });
        // Attempt to free up space
        this.cleanup();
      } else {
        logger.error('Failed to set item in storage', error as Error, { key });
      }
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      const prefixedKey = this.getKey(key);
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      logger.error('Failed to remove item from storage', error as Error, { key });
    }
  }

  /**
   * Clear all items with this prefix
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      logger.error('Failed to clear storage', error as Error);
    }
  }

  /**
   * Cleanup expired items
   */
  cleanup(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (!key.startsWith(this.prefix)) return;

        try {
          const value = localStorage.getItem(key);
          if (!value) return;

          const parsed = JSON.parse(value) as StorageValue<unknown>;
          // Remove items older than 30 days by default
          if (this.isExpired(parsed.timestamp, 30 * 24 * 60 * 60 * 1000)) {
            localStorage.removeItem(key);
            logger.debug('Cleaned up expired storage item', { key });
          }
        } catch {
          // Invalid format, remove it
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      logger.error('Failed to cleanup storage', error as Error);
    }
  }

  /**
   * Get storage usage info
   */
  getUsageInfo(): { used: number; available: number; percentage: number } | null {
    if (typeof window === 'undefined') return null;

    try {
      // Estimate storage usage
      let used = 0;
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          used += (key.length + (value?.length || 0)) * 2; // UTF-16 encoding
        }
      });

      // Most browsers limit localStorage to 5-10MB
      const available = 5 * 1024 * 1024; // Assume 5MB
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch (error) {
      logger.error('Failed to get storage usage info', error as Error);
      return null;
    }
  }
}

/**
 * Default storage instance
 */
export const storage = new SafeStorage('cpb');

/**
 * Storage helpers for common patterns
 */
export const storageHelpers = {
  /**
   * Get with fallback and type safety
   */
  get<T>(key: string, fallback: T, version?: number): T {
    return storage.getItem(key, fallback, { version });
  },

  /**
   * Set with version
   */
  set<T>(key: string, value: T, version?: number): boolean {
    return storage.setItem(key, value, { version });
  },

  /**
   * Remove item
   */
  remove(key: string): void {
    storage.removeItem(key);
  },

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};
