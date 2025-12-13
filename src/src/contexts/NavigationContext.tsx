import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Section, Role } from '../types';
import { useRouter, RouteSection } from '../hooks/useRouter';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { trackPageView } from '../utils/analytics';
import { addToViewHistory } from '../utils/storage';

interface NavigationContextType {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const { section, params, navigate } = useRouter();
  
  // Sidebar state (UI preference, local storage only)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Role State: URL > LocalStorage > Default
  const [storedRole, setStoredRole] = useLocalStorage<Role>('selected-role', 'All');
  const selectedRole = (params.role as Role) || storedRole;

  // Search State: URL > Empty
  const searchQuery = params.q || '';

  // Effect: Sync Role change to Storage
  useEffect(() => {
    if (params.role && params.role !== storedRole) {
      setStoredRole(params.role as Role);
    }
  }, [params.role, storedRole, setStoredRole]);

  // Actions
  const setActiveSection = (newSection: Section) => {
    navigate(newSection as RouteSection, { ...params }); // Preserve other params like role
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Analytics & History
    trackPageView(newSection, selectedRole);
    addToViewHistory(newSection);
  };

  const setSelectedRole = (newRole: Role) => {
    setStoredRole(newRole);
    // Update URL to reflect role change for shareability
    navigate(section, { ...params, role: newRole });
    trackPageView(section, newRole);
  };

  const setSearchQuery = (query: string) => {
    // Debounce URL update? For now, instant.
    // In a real app, we'd debounce the navigate call.
    const newParams = { ...params };
    if (query) {
      newParams.q = query;
    } else {
      delete newParams.q;
    }
    navigate(section, newParams);
  };

  return (
    <NavigationContext.Provider
      value={{
        activeSection: section as Section,
        setActiveSection,
        selectedRole,
        setSelectedRole,
        searchQuery,
        setSearchQuery,
        isSidebarCollapsed,
        toggleSidebar: () => setIsSidebarCollapsed(prev => !prev),
        setSidebarCollapsed: setIsSidebarCollapsed,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
