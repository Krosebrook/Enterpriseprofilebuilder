import React, { ReactNode } from 'react';
import { NavigationProvider } from '../contexts/NavigationContext';
import { ToastProvider } from '../contexts/ToastContext';
import { QueryProvider } from '../lib/queryClient';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <NavigationProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </NavigationProvider>
    </QueryProvider>
  );
}