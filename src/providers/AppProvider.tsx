import { type ReactNode } from 'react';
import { NavigationProvider } from '../contexts/NavigationContext';
import { ToastProvider } from '../contexts/ToastContext';
import { ThemeProvider } from './ThemeProvider';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}
