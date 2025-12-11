import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFocus?: () => void;
  isSearching?: boolean;
}

export function SearchBar({ searchQuery, onSearchChange, onFocus, isSearching = false }: SearchBarProps) {
  return (
    <div className="flex-1 max-w-md relative">
      <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        placeholder="Search documentation..."
        className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        aria-label="Search documentation"
      />
      {isSearching && (
        <Loader2 className="w-5 h-5 text-amber-500 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
      )}
      {!isSearching && searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}