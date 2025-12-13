import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFocus?: () => void;
  isSearching?: boolean;
}

export function SearchBar({ searchQuery, onSearchChange, onFocus, isSearching = false }: SearchBarProps) {
  return (
    <div className="flex-1 max-w-md relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <Search className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        placeholder="Search documentation (cmd+k)..."
        className="block w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 sm:text-sm shadow-sm"
        aria-label="Search documentation"
      />
      
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {isSearching ? (
          <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
        ) : searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block border border-slate-200 rounded px-1.5 text-[10px] font-medium text-slate-400 bg-white shadow-sm">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
