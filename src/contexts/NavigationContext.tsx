import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Section, Role } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { trackPageView } from '../utils/analytics';
import { addToViewHistory } from '../utils/storage';
import { trackEvents } from '../lib/analytics';

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
  const [activeSection, setActiveSection] = useLocalStorage<Section>('active-section', 'overview');
  const [selectedRole, setSelectedRole] = useLocalStorage<Role>('selected-role', 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setSearchQuery(''); // Clear search on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Analytics & History
    trackPageView(section, selectedRole);
    addToViewHistory(section);
    
    // New analytics system
    trackEvents.sectionViewed(section);
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    trackPageView(activeSection, role);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Track search if user has typed at least 3 characters
    if (query.length >= 3) {
      trackEvents.searchPerformed(query, 0); // resultsCount would be updated by search component
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        activeSection,
        setActiveSection: handleSectionChange,
        selectedRole,
        setSelectedRole: handleRoleChange,
        searchQuery,
        setSearchQuery: handleSearchChange,
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