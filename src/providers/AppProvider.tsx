import React, { ReactNode } from 'react';
import { NavigationProvider } from '../contexts/NavigationContext';
import { ToastProvider } from '../contexts/ToastContext';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <NavigationProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </NavigationProvider>
  );
}
