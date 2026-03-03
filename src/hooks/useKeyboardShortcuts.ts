import { useEffect } from 'react';

type ShortcutHandler = () => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  handler: ShortcutHandler;
}

/**
 * Custom hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrl, alt, shift, handler }) => {
        const ctrlMatch = ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const altMatch = alt ? event.altKey : !event.altKey;
        const shiftMatch = shift ? event.shiftKey : !event.shiftKey;

        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          ctrlMatch &&
          altMatch &&
          shiftMatch
        ) {
          event.preventDefault();
          handler();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
