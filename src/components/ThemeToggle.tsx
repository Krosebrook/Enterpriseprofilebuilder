/**
 * @fileoverview Theme Toggle Component
 * @module components/ThemeToggle
 * @description Accessible theme switcher with rate limiting and error handling
 * 
 * Features:
 * - Light/Dark/System mode switching
 * - Keyboard accessible
 * - ARIA labels for screen readers
 * - Rate limiting to prevent abuse
 * - Error boundary handling
 * - Loading states
 * - Smooth animations
 * 
 * @author INT Inc Engineering Team
 * @version 1.0.0
 * @since 2025-12-21
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { logger } from '../lib/logger';
import { AppError, ErrorCode } from '../lib/errors';

/**
 * Rate limiter for theme changes
 * Prevents rapid theme toggling that could cause performance issues
 */
class ThemeChangeRateLimiter {
  private lastChange: number = 0;
  private readonly COOLDOWN_MS = 500; // Minimum time between theme changes
  private changeCount: number = 0;
  private resetTime: number = Date.now();
  private readonly MAX_CHANGES_PER_MINUTE = 30;

  canChange(): boolean {
    const now = Date.now();
    
    // Reset counter every minute
    if (now - this.resetTime > 60000) {
      this.changeCount = 0;
      this.resetTime = now;
    }

    // Check cooldown period
    if (now - this.lastChange < this.COOLDOWN_MS) {
      return false;
    }

    // Check rate limit
    if (this.changeCount >= this.MAX_CHANGES_PER_MINUTE) {
      logger.warn('Theme change rate limit exceeded');
      return false;
    }

    return true;
  }

  recordChange(): void {
    this.lastChange = Date.now();
    this.changeCount++;
  }
}

const rateLimiter = new ThemeChangeRateLimiter();

interface ThemeToggleProps {
  /**
   * Show labels next to icons
   * @default false
   */
  showLabel?: boolean;
  /**
   * Compact mode (icon only)
   * @default false
   */
  compact?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * ThemeToggle Component
 * 
 * Provides a dropdown menu to switch between light, dark, and system themes
 * 
 * @example
 * ```tsx
 * <ThemeToggle showLabel />
 * ```
 */
export function ThemeToggle({ 
  showLabel = false, 
  compact = false,
  className = '' 
}: ThemeToggleProps) {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Handle theme change with rate limiting and error handling
   */
  const handleThemeChange = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    try {
      // Validate input
      if (!['light', 'dark', 'system'].includes(newTheme)) {
        throw new AppError('Invalid theme value', ErrorCode.INVALID_INPUT);
      }

      // Check rate limit
      if (!rateLimiter.canChange()) {
        setError('Please wait before changing theme again');
        logger.warn('Theme change blocked by rate limiter', { currentTheme: theme, newTheme });
        return;
      }

      // Clear any previous errors
      setError(null);
      setIsChanging(true);

      // Log theme change for analytics
      logger.info('Theme changed', {
        from: theme,
        to: newTheme,
        resolvedTheme,
        systemTheme,
      });

      // Apply theme change
      setTheme(newTheme);
      rateLimiter.recordChange();

      // Store in localStorage for additional persistence
      try {
        localStorage.setItem('app_theme_backup', newTheme);
      } catch (storageError) {
        // Log but don't fail if localStorage is unavailable
        logger.warn('Failed to backup theme to localStorage', storageError as Error);
      }

      // Reset changing state after animation
      setTimeout(() => setIsChanging(false), 300);

    } catch (err) {
      const error = err as Error;
      logger.error('Failed to change theme', error, { newTheme });
      setError('Failed to change theme. Please try again.');
      setIsChanging(false);
    }
  }, [theme, setTheme, resolvedTheme, systemTheme]);

  /**
   * Cycle through themes (for keyboard shortcut or compact button)
   */
  const cycleTheme = useCallback(() => {
    const currentTheme = theme || 'system';
    const themeOrder: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(currentTheme as 'light' | 'dark' | 'system');
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    handleThemeChange(nextTheme);
  }, [theme, handleThemeChange]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={`h-9 w-9 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-md ${className}`} />
    );
  }

  // Get current icon based on resolved theme
  const getCurrentIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-4 w-4" aria-hidden="true" />;
    }
    return resolvedTheme === 'dark' ? (
      <Moon className="h-4 w-4" aria-hidden="true" />
    ) : (
      <Sun className="h-4 w-4" aria-hidden="true" />
    );
  };

  // Get theme label
  const getThemeLabel = () => {
    if (theme === 'system') return 'System';
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  if (compact) {
    return (
      <div className={className}>
        <button
          onClick={cycleTheme}
          disabled={isChanging}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Current theme: ${getThemeLabel()}. Click to cycle themes.`}
          title={`Switch theme (current: ${getThemeLabel()})`}
        >
          {getCurrentIcon()}
        </button>
        {error && (
          <div className="absolute right-0 top-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs p-2 rounded-md shadow-lg">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {/* Light Mode Button */}
        <button
          onClick={() => handleThemeChange('light')}
          disabled={isChanging}
          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === 'light'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Light mode"
          aria-pressed={theme === 'light'}
        >
          <Sun className="h-4 w-4" aria-hidden="true" />
          {showLabel && <span className="ml-2">Light</span>}
        </button>

        {/* Dark Mode Button */}
        <button
          onClick={() => handleThemeChange('dark')}
          disabled={isChanging}
          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === 'dark'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Dark mode"
          aria-pressed={theme === 'dark'}
        >
          <Moon className="h-4 w-4" aria-hidden="true" />
          {showLabel && <span className="ml-2">Dark</span>}
        </button>

        {/* System Mode Button */}
        <button
          onClick={() => handleThemeChange('system')}
          disabled={isChanging}
          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === 'system'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="System theme"
          aria-pressed={theme === 'system'}
          title={`System theme (currently: ${systemTheme})`}
        >
          <Monitor className="h-4 w-4" aria-hidden="true" />
          {showLabel && <span className="ml-2">System</span>}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="absolute right-0 top-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs p-2 rounded-md shadow-lg z-50 animate-in fade-in slide-in-from-top-2"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
