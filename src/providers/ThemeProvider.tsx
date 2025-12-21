/**
 * @fileoverview Theme Provider using next-themes
 * @module providers/ThemeProvider
 * @description Production-grade theme management with dark/light/system modes
 * 
 * Features:
 * - Automatic system preference detection
 * - Persistent theme storage
 * - No flash of unstyled content (FOUC)
 * - Accessibility support
 * - Type-safe theme values
 * 
 * @author INT Inc Engineering Team
 * @version 1.0.0
 * @since 2025-12-21
 */

import React, { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps as NextThemesProviderProps } from 'next-themes';

interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Default theme to use on first visit
   * @default 'system'
   */
  defaultTheme?: 'light' | 'dark' | 'system';
  /**
   * Storage key for theme persistence
   * @default 'app_theme'
   */
  storageKey?: string;
  /**
   * Enable system theme detection
   * @default true
   */
  enableSystem?: boolean;
  /**
   * Disable transitions on theme change
   * @default true
   */
  disableTransitionOnChange?: boolean;
}

/**
 * ThemeProvider Component
 * Wraps the application to provide theme context
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'app_theme',
  enableSystem = true,
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  // Define allowed themes
  const themes: NextThemesProviderProps['themes'] = ['light', 'dark'];

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      themes={themes}
      disableTransitionOnChange={disableTransitionOnChange}
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
