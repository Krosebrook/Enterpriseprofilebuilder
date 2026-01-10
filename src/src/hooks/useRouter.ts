import { useState, useEffect, useCallback } from 'react';

// Define valid routes to ensure type safety
export type RouteSection = 
  | 'overview'
  | 'baseline'
  | 'features'
  | 'tools'
  | 'roles'
  | 'best-practices'
  | 'operations'
  | 'reference'
  | 'faq'
  | 'deployment'
  | 'governance';

interface RouterState {
  section: RouteSection;
  params: Record<string, string>;
}

export function useRouter() {
  const [route, setRoute] = useState<RouterState>(() => {
    // Initial state from URL
    const params = new URLSearchParams(window.location.search);
    const section = (params.get('section') as RouteSection) || 'overview';
    
    // Parse other params
    const otherParams: Record<string, string> = {};
    params.forEach((value, key) => {
      if (key !== 'section') otherParams[key] = value;
    });

    return { section, params: otherParams };
  });

  const navigate = useCallback((section: RouteSection, params?: Record<string, string>) => {
    const newParams = new URLSearchParams();
    newParams.set('section', section);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
      });
    }

    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.pushState({ section, params }, '', newUrl);
    
    setRoute({ section, params: params || {} });
  }, []);

  // Handle back/forward browser buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as RouterState;
      if (state) {
        setRoute(state);
      } else {
        // Fallback if state is null
        const params = new URLSearchParams(window.location.search);
        const section = (params.get('section') as RouteSection) || 'overview';
        setRoute({ section, params: {} });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    section: route.section,
    params: route.params,
    navigate
  };
}
