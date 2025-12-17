# INT PLATFORM EXPLORER v4.0: WEEK 1 TECHNICAL SPEC
## Phase 1: Core Architecture Refactor

**Objective:** Transition from monolithic HTML (12K+ lines) to modular React app  
**Timeline:** 5 business days  
**Team:** 2 full-stack engineers  
**Output:** Production-ready React scaffolding with state management + API structure  

---

## DAY 1: SETUP & SCAFFOLDING

### 1.1 Project Initialization (2 hours)

```bash
# Create React + TypeScript project
npm create vite@latest int-explorer -- --template react-ts
cd int-explorer

# Install core dependencies
npm install \
  zustand \
  react-query \
  axios \
  clsx \
  tailwindcss \
  postcss \
  autoprefixer \
  @sentry/react

# Install dev dependencies
npm install -D \
  vitest \
  @testing-library/react \
  @testing-library/jest-dom \
  typescript \
  eslint \
  prettier

# Initialize Tailwind
npx tailwindcss init -p

# Initialize git
git init
git config user.email "dev@intinc.com"
git config user.name "INT Dev Team"
git add .
git commit -m "Initial commit: React + Vite + Tailwind setup"
```

### 1.2 Folder Structure (1 hour)

```
int-explorer/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── manifest.json (PWA)
│   └── robots.txt
├── src/
│   ├── App.tsx (root component)
│   ├── index.css (global styles)
│   ├── main.tsx (entry point)
│   ├── vite-env.d.ts (TypeScript defs)
│   ├── config/
│   │   ├── config.ts (centralized settings)
│   │   ├── themes.ts (color schemes)
│   │   └── features.ts (feature flags)
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── PlatformCard.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── ComparisonModal.tsx
│   │   ├── ExportPanel.tsx
│   │   └── index.ts (barrel exports)
│   ├── hooks/
│   │   ├── usePlatforms.ts
│   │   ├── useFilters.ts
│   │   ├── useComparison.ts
│   │   └── useLocalStorage.ts
│   ├── pages/
│   │   ├── ExplorerPage.tsx
│   │   ├── AssessmentPage.tsx
│   │   └── FinancialPage.tsx
│   ├── types/
│   │   ├── Platform.ts
│   │   ├── Assessment.ts
│   │   └── API.ts
│   ├── utils/
│   │   ├── formatting.ts
│   │   ├── filtering.ts
│   │   ├── export.ts
│   │   ├── api.ts
│   │   └── validation.ts
│   ├── styles/
│   │   ├── variables.css (design tokens)
│   │   ├── base.css (reset, typography)
│   │   ├── components.css (reusable patterns)
│   │   └── responsive.css (breakpoints)
│   ├── store/
│   │   ├── index.ts (Zustand store)
│   │   └── types.ts (store interfaces)
│   ├── data/
│   │   ├── platforms.json (for local dev)
│   │   ├── statistics.json
│   │   └── glossary.json
│   └── services/
│       ├── api.ts (axios instance)
│       ├── analytics.ts (Segment)
│       └── errors.ts (Sentry)
├── tests/
│   ├── components/
│   │   ├── PlatformCard.test.tsx
│   │   └── FilterPanel.test.tsx
│   ├── hooks/
│   │   └── usePlatforms.test.ts
│   └── utils/
│       └── formatting.test.ts
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── tsconfig.json (extend with strict rules)
├── tailwind.config.js
├── vite.config.ts
├── package.json
└── README.md
```

### 1.3 TypeScript Configuration (30 min)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

### 1.4 Environment Variables (30 min)

```
# .env.example
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=INT Platform Explorer
VITE_SENTRY_DSN=
VITE_SEGMENT_KEY=
VITE_GA_ID=
NODE_ENV=development
```

**Deliverable:** Project scaffold ready for component development

---

## DAY 2: STATE MANAGEMENT & UTILITIES

### 2.1 Zustand Store (3 hours)

```typescript
// src/store/index.ts
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { StoreState, Filters, PlatformInState } from './types';

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // APP STATE
        currentTab: 'explorer',
        currentView: 'cards',
        isLoading: false,
        error: null,

        // FILTERS
        filters: {
          provider: 'all',
          category: 'all',
          search: '',
          sortBy: 'marketShare-desc',
          departments: [],
          useCases: [],
          compliance: []
        },

        // COMPARISON
        comparison: [],
        maxCompare: 4,

        // USER PREFERENCES
        preferences: {
          theme: 'light',
          language: 'en',
          exportFormat: 'pdf',
          showAdvanced: false
        },

        // FILTERED DATA
        filteredPlatforms: [],
        totalPlatforms: 0,

        // ACTIONS
        setTab: (tab) => set({ currentTab: tab }),
        setView: (view) => set({ currentView: view }),

        updateFilter: (key, value) =>
          set((state) => ({
            filters: { ...state.filters, [key]: value }
          })),

        addComparison: (platformId) =>
          set((state) => ({
            comparison: [
              ...state.comparison,
              platformId
            ].slice(0, state.maxCompare)
          })),

        removeComparison: (platformId) =>
          set((state) => ({
            comparison: state.comparison.filter((id) => id !== platformId)
          })),

        clearComparison: () => set({ comparison: [] }),

        setPreference: (key, value) =>
          set((state) => ({
            preferences: { ...state.preferences, [key]: value }
          })),

        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        setFilteredPlatforms: (platforms) =>
          set({
            filteredPlatforms: platforms,
            totalPlatforms: platforms.length
          })
      }),
      {
        name: 'int-explorer-storage',
        version: 1,
        // Only persist these fields
        partialize: (state) => ({
          preferences: state.preferences,
          comparison: state.comparison
        })
      }
    )
  )
);

// Selectors (for performance optimization)
export const selectCurrentTab = (state: StoreState) => state.currentTab;
export const selectFilters = (state: StoreState) => state.filters;
export const selectComparison = (state: StoreState) => state.comparison;
export const selectPreferences = (state: StoreState) => state.preferences;
```

### 2.2 API Service Layer (2 hours)

```typescript
// src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const platformAPI = {
  getAll: (filters?: Record<string, any>) =>
    api.get('/platforms', { params: filters }),
  
  getById: (id: string) =>
    api.get(`/platforms/${id}`),
  
  search: (query: string) =>
    api.get('/platforms/search', { params: { q: query } }),
  
  filter: (filters: Record<string, any>) =>
    api.post('/platforms/filter', filters)
};

export const statisticsAPI = {
  getAll: () =>
    api.get('/statistics'),
  
  getByMetric: (metric: string) =>
    api.get(`/statistics/${metric}`)
};

export const comparisonAPI = {
  create: (platforms: string[]) =>
    api.post('/comparisons', { platforms }),
  
  get: (id: string) =>
    api.get(`/comparisons/${id}`),
  
  export: (platforms: string[], format: string) =>
    api.post('/comparisons/export', { platforms, format })
};

export const assessmentAPI = {
  submit: (responses: Record<string, any>) =>
    api.post('/assessments', responses),
  
  getResults: (assessmentId: string) =>
    api.get(`/assessments/${assessmentId}/results`)
};

export default api;
```

### 2.3 Utility Functions (1 hour)

```typescript
// src/utils/formatting.ts
export const formatNumber = (num: number): string =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

export const formatPercentage = (value: number, decimals: number = 1): string =>
  `${(value * 100).toFixed(decimals)}%`;

export const truncate = (str: string, length: number = 50): string =>
  str.length > length ? `${str.substring(0, length)}...` : str;

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// src/utils/filtering.ts
export type FilterFunction = (items: any[], filters: any) => any[];

export const filterByProvider: FilterFunction = (items, filters) => {
  if (filters.provider === 'all') return items;
  return items.filter(item => item.provider === filters.provider);
};

export const filterBySearch: FilterFunction = (items, filters) => {
  if (!filters.search) return items;
  const query = filters.search.toLowerCase();
  return items.filter(
    item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  );
};

export const sortPlatforms = (
  items: any[],
  sortBy: string
): any[] => {
  const [field, direction] = sortBy.split('-');
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const applyAllFilters = (items: any[], filters: any): any[] => {
  let result = items;
  result = filterByProvider(result, filters);
  result = filterBySearch(result, filters);
  result = sortPlatforms(result, filters.sortBy);
  return result;
};
```

**Deliverable:** Complete store, API service, utility functions tested

---

## DAY 3: CORE COMPONENTS

### 3.1 Layout Components (3 hours)

```typescript
// src/components/Header.tsx
import React from 'react';
import { useStore } from '@/store';

export const Header: React.FC = () => {
  const preferences = useStore(state => state.preferences);
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                INT Platform Explorer
              </h1>
              <p className="text-sm text-gray-600">
                v4.0 • Enterprise AI Platform Comparison
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => useStore.setState(prev => ({
                preferences: { ...prev.preferences, theme: preferences.theme === 'light' ? 'dark' : 'light' }
              }))}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              title="Toggle theme"
            >
              {preferences.theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <button
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
              onClick={() => alert('Login not yet implemented')}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
```

```typescript
// src/components/Navigation.tsx
import React from 'react';
import { useStore } from '@/store';

interface NavTab {
  id: string;
  label: string;
  icon: string;
}

const TABS: NavTab[] = [
  { id: 'explorer', label: 'Explorer', icon: '🔍' },
  { id: 'assessment', label: 'Assessment', icon: '📋' },
  { id: 'financial', label: 'Financial', icon: '💰' },
  { id: 'glossary', label: 'Resources', icon: '📚' }
];

export const Navigation: React.FC = () => {
  const currentTab = useStore(state => state.currentTab);
  const setTab = useStore(state => state.setTab);
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`py-4 px-1 border-b-2 transition ${
                currentTab === tab.id
                  ? 'border-orange-500 text-orange-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
```

### 3.2 Platform Card Component (2 hours)

```typescript
// src/components/PlatformCard.tsx
import React from 'react';
import { useStore } from '@/store';
import type { Platform } from '@/types/Platform';
import { formatCurrency } from '@/utils/formatting';

interface PlatformCardProps {
  platform: Platform;
  isSelected?: boolean;
  onCompare?: (id: string) => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  isSelected = false,
  onCompare
}) => {
  const addComparison = useStore(state => state.addComparison);
  
  const handleAddComparison = () => {
    addComparison(platform.id);
    onCompare?.(platform.id);
  };
  
  return (
    <div
      className={`bg-white rounded-lg border-2 transition cursor-pointer hover:shadow-lg ${
        isSelected ? 'border-orange-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{platform.name}</h3>
            <p className="text-sm text-gray-600">{platform.provider}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            platform.intPriority === 'high'
              ? 'bg-red-100 text-red-800'
              : platform.intPriority === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {platform.intPriority}
          </span>
        </div>
        <p className="text-sm text-gray-700 line-clamp-2">
          {platform.description}
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 border-b border-gray-100">
        <div>
          <div className="text-xs text-gray-600 font-semibold">PRICING</div>
          <div className="text-sm font-bold text-gray-900">{platform.pricing}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 font-semibold">CONTEXT</div>
          <div className="text-sm font-bold text-gray-900">{platform.contextWindow}</div>
        </div>
      </div>
      
      {/* Strengths */}
      <div className="p-6">
        <h4 className="text-xs font-semibold text-gray-600 mb-3">KEY STRENGTHS</h4>
        <ul className="space-y-2">
          {platform.strengths.slice(0, 3).map((strength, i) => (
            <li key={i} className="text-sm text-gray-700 flex gap-2">
              <span className="text-green-600">✓</span>
              {strength}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 p-6 border-t border-gray-100">
        <button
          onClick={handleAddComparison}
          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
        >
          {isSelected ? '✓ Added' : 'Add to Compare'}
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          title="View details"
        >
          ℹ️
        </button>
      </div>
    </div>
  );
};
```

**Deliverable:** Reusable, accessible components with TypeScript types

---

## DAY 4: CUSTOM HOOKS & DATA INTEGRATION

### 4.1 Custom Hooks (2 hours)

```typescript
// src/hooks/usePlatforms.ts
import { useQuery } from 'react-query';
import { platformAPI } from '@/services/api';
import type { Platform } from '@/types/Platform';

export const usePlatforms = () => {
  return useQuery<Platform[], Error>(
    ['platforms'],
    () => platformAPI.getAll().then(res => res.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  );
};

// src/hooks/useFilters.ts
import { useCallback } from 'react';
import { useStore } from '@/store';
import { applyAllFilters } from '@/utils/filtering';
import type { Platform } from '@/types/Platform';

export const useFilters = (platforms: Platform[]) => {
  const filters = useStore(state => state.filters);
  const setFiltered = useStore(state => state.setFilteredPlatforms);
  
  const updateFilters = useCallback((newFilters: any) => {
    useStore.setState(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
    
    const filtered = applyAllFilters(platforms, { ...filters, ...newFilters });
    setFiltered(filtered);
  }, [platforms, filters, setFiltered]);
  
  return { filters, updateFilters };
};

// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue] as const;
};
```

### 4.2 Data Integration (1 hour)

```typescript
// src/App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { ExplorerPage } from '@/pages/ExplorerPage';
import { useStore } from '@/store';

const queryClient = new QueryClient();

function App() {
  const currentTab = useStore(state => state.currentTab);
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          {currentTab === 'explorer' && <ExplorerPage />}
          {/* Other pages will be added here */}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
```

**Deliverable:** Fully integrated, data-fetching app scaffold

---

## DAY 5: TESTING & BUILD OPTIMIZATION

### 5.1 Unit Tests (2 hours)

```typescript
// tests/utils/formatting.test.ts
import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatPercentage } from '@/utils/formatting';

describe('Formatting Utilities', () => {
  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });
  
  describe('formatCurrency', () => {
    it('should format as USD currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(13350)).toBe('$13,350');
    });
  });
  
  describe('formatPercentage', () => {
    it('should format as percentage', () => {
      expect(formatPercentage(0.85)).toBe('85.0%');
      expect(formatPercentage(0.123, 2)).toBe('12.30%');
    });
  });
});

// tests/components/PlatformCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlatformCard } from '@/components/PlatformCard';

const mockPlatform = {
  id: '1',
  name: 'Claude API',
  provider: 'Anthropic',
  description: 'Test platform',
  pricing: '$3/$15 per 1M tokens',
  contextWindow: '200K',
  strengths: ['Safe', 'Fast', 'Capable'],
  intPriority: 'high'
};

describe('PlatformCard', () => {
  it('should render platform information', () => {
    render(<PlatformCard platform={mockPlatform} />);
    expect(screen.getByText('Claude API')).toBeInTheDocument();
    expect(screen.getByText('Anthropic')).toBeInTheDocument();
  });
  
  it('should call onCompare when button clicked', () => {
    const onCompare = vi.fn();
    render(<PlatformCard platform={mockPlatform} onCompare={onCompare} />);
    
    const button = screen.getByText(/Add to Compare/i);
    fireEvent.click(button);
    
    expect(onCompare).toHaveBeenCalledWith(mockPlatform.id);
  });
});
```

### 5.2 Build & Performance (1 hour)

```bash
# Add to package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest --coverage",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write src",
    "analyze": "npm run build && npm run build -- --analyzeSize"
  }
}
```

```bash
# Run build
npm run build

# Output should be:
# dist/index.html          2.1 KB │ gzip: 1.0 KB
# dist/assets/index.*.js   187 KB │ gzip: 52 KB
# dist/assets/index.*.css  34 KB  │ gzip: 7 KB
```

**Deliverable:** Tested, optimized build ready for deployment

---

## DELIVERABLES CHECKLIST

### Code Quality
- [ ] All code TypeScript-strict compliant
- [ ] 0 ESLint errors
- [ ] 100% pass Prettier formatting
- [ ] >80% test coverage
- [ ] No security vulnerabilities (npm audit)

### Architecture
- [ ] Zustand store functional (state + actions)
- [ ] API service layer complete (6+ endpoints mocked)
- [ ] Custom hooks working (3+ hooks)
- [ ] Component hierarchy clean (max 3 levels)
- [ ] No prop drilling issues

### Performance
- [ ] Bundle size <200KB (uncompressed)
- [ ] First paint <1.5s
- [ ] JavaScript loads async
- [ ] CSS critical path optimized
- [ ] Images lazy-loaded where applicable

### Accessibility
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation functional
- [ ] Color contrast >4.5:1
- [ ] No focus trap issues
- [ ] Screen reader testing passed

---

## SUCCESS CRITERIA (End of Day 5)

✅ React app scaffold ready for component development  
✅ State management working (Zustand)  
✅ API service layer complete + mocked endpoints  
✅ 4 core components functional (Header, Nav, Card, Layout)  
✅ Custom hooks implemented (usePlatforms, useFilters, useLocalStorage)  
✅ Unit tests passing (>80% coverage)  
✅ Build optimized (<200KB gzipped)  
✅ Ready to begin Phase 2 (backend integration)  

---

**Status:** Ready to begin Week 1 development  
**Team:** 2 full-stack engineers  
**Estimated cost:** $8,000–$12,000 (labor)  
**Expected delivery:** End of Day 5, Friday EOD  

**Next:** Phase 2 (Backend + Database Integration)
