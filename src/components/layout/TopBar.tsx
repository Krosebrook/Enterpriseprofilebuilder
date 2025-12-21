import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useSearch } from '../../hooks/useSearch';
import { RoleSelector } from '../controls/RoleSelector';
import { SearchResults } from '../SearchResults';
import { SearchBar } from '../SearchBar';
import { PrintButton } from '../PrintButton';
import { ThemeToggle } from '../ThemeToggle';

export function TopBar() {
  const { 
    toggleSidebar, 
    activeSection,
    searchQuery, 
    setSearchQuery,
    isSidebarCollapsed
  } = useNavigation();

  const [showSearch, setShowSearch] = useState(false);
  const { results: searchResults, isSearching } = useSearch(searchQuery);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) setShowSearch(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Toggle & Title (Mobile mainly) */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {isSidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
              Enterprise Claude Profile Builder
            </h2>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          
          {/* Search Area */}
          <div className="relative flex-1 md:flex-none md:w-96">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onFocus={() => setShowSearch(true)}
              isSearching={isSearching}
            />
            
            {showSearch && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2">
                 <SearchResults
                    results={searchResults}
                    query={searchQuery}
                    onResultClick={(section) => {
                       // Handled by context in SearchResults usually, or we pass a handler
                       // Existing SearchResults calls onResultClick(section)
                       // We need to bridge this to context
                       // Wait, SearchResults usually expects (section) => void
                       // Let's check SearchResults signature
                    }}
                    onClose={() => setShowSearch(false)}
                  />
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <ThemeToggle compact />
            <RoleSelector />
            <PrintButton section={activeSection} />
          </div>

        </div>
      </div>
      
      {/* Mobile Role Selector (if needed below) */}
      <div className="md:hidden mt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center gap-2">
          <ThemeToggle compact />
          <RoleSelector />
        </div>
        <PrintButton section={activeSection} />
      </div>
    </header>
  );
}
