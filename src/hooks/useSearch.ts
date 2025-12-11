import { useState, useEffect, useCallback } from 'react';
import { SearchResult } from '../types';
import { searchContent } from '../utils/search';
import { trackSearch } from '../utils/analytics';

/**
 * Custom hook for search functionality with debouncing
 */
export function useSearch(query: string, debounceMs: number = 300) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate async search (in case we want to add API search later)
    setTimeout(() => {
      const searchResults = searchContent(searchQuery);
      setResults(searchResults);
      setIsSearching(false);
      trackSearch(searchQuery, searchResults.length);
    }, 100);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, performSearch]);

  return { results, isSearching };
}
