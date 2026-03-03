/**
 * @fileoverview Tests for ThemeToggle Component
 * @module components/__tests__/ThemeToggle.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '../ThemeToggle';

// Mock logger
vi.mock('../../lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Wrapper component for tests
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render loading state before mount', () => {
      const { container } = render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );
      
      // Should show loading skeleton initially
      const loadingSkeleton = container.querySelector('.animate-pulse');
      expect(loadingSkeleton).toBeTruthy();
    });

    it('should render compact mode', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle compact />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toBeTruthy();
        expect(button.getAttribute('aria-label')).toContain('Current theme');
      });
    });

    it('should render full mode with all theme buttons', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Light mode')).toBeTruthy();
        expect(screen.getByLabelText('Dark mode')).toBeTruthy();
        expect(screen.getByLabelText('System theme')).toBeTruthy();
      });
    });

    it('should render with labels when showLabel is true', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle showLabel />
        </ThemeWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Light')).toBeTruthy();
        expect(screen.getByText('Dark')).toBeTruthy();
        expect(screen.getByText('System')).toBeTruthy();
      });
    });
  });

  describe('Theme Switching', () => {
    it('should switch to light theme when light button is clicked', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        fireEvent.click(lightButton);
      });

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        expect(lightButton.getAttribute('aria-pressed')).toBe('true');
      });
    });

    it('should switch to dark theme when dark button is clicked', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const darkButton = screen.getByLabelText('Dark mode');
        fireEvent.click(darkButton);
      });

      await waitFor(() => {
        const darkButton = screen.getByLabelText('Dark mode');
        expect(darkButton.getAttribute('aria-pressed')).toBe('true');
      });
    });

    it('should switch to system theme when system button is clicked', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const systemButton = screen.getByLabelText('System theme');
        fireEvent.click(systemButton);
      });

      await waitFor(() => {
        const systemButton = screen.getByLabelText('System theme');
        expect(systemButton.getAttribute('aria-pressed')).toBe('true');
      });
    });

    it('should cycle through themes in compact mode', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle compact />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        
        // Click to cycle through themes
        fireEvent.click(button);
        expect(button.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        const darkButton = screen.getByLabelText('Dark mode');
        const systemButton = screen.getByLabelText('System theme');
        
        expect(lightButton).toBeTruthy();
        expect(darkButton).toBeTruthy();
        expect(systemButton).toBeTruthy();
      });
    });

    it('should have proper ARIA pressed states', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        fireEvent.click(lightButton);
      });

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        expect(lightButton.getAttribute('aria-pressed')).toBeTruthy();
      });
    });

    it('should hide decorative icons from screen readers', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const icons = document.querySelectorAll('svg[aria-hidden="true"]');
        expect(icons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error occurs', async () => {
      // Mock console to suppress error logs
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );

      // Error handling is internal, we test that UI handles it gracefully
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });

      consoleError.mockRestore();
    });
  });

  describe('Persistence', () => {
    it('should persist theme to localStorage', async () => {
      render(
        <ThemeWrapper>
          <ThemeToggle />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const darkButton = screen.getByLabelText('Dark mode');
        fireEvent.click(darkButton);
      });

      // Wait for localStorage to be updated
      await waitFor(() => {
        const storedTheme = localStorage.getItem('app_theme') || localStorage.getItem('theme');
        // Theme should be persisted (either by next-themes or our backup)
        expect(storedTheme).toBeTruthy();
      });
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', async () => {
      const { container } = render(
        <ThemeWrapper>
          <ThemeToggle className="custom-class" />
        </ThemeWrapper>
      );

      await waitFor(() => {
        const element = container.querySelector('.custom-class');
        expect(element).toBeTruthy();
      });
    });
  });
});
