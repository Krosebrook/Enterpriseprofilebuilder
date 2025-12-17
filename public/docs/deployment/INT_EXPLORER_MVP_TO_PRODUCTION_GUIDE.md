# INT PLATFORM EXPLORER: MVP → PRODUCTION-GRADE TRANSFORMATION
## Clean, Modular Architecture Strategy Post-MVP

**TL;DR:** MVP ships fast (5 weeks), but code is duct-taped. Post-MVP (weeks 6–10), systematically refactor into enterprise-grade modules that scale to 10K+ users.

---

## PART I: MVP PHASE (Weeks 1–5) — "Get It Working"

### What MVP Code Looks Like
- Feature-complete but messy
- Inline logic, minimal abstraction
- Limited error handling
- Basic testing (happy path only)
- Duplication across components
- Coupled dependencies
- No observability
- Works, but hard to extend

### Example: Messy MVP Code
```typescript
// Bad: Inline logic, no abstraction (Week 1 reality)
export function ExplorerPage() {
  const [platforms, setPlatforms] = useState([]);
  const [filters, setFilters] = useState({});
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch, filter, sort all in one component
  useEffect(() => {
    setLoading(true);
    fetch('/api/platforms?provider=' + filters.provider)
      .then(r => r.json())
      .then(data => {
        let filtered = data;
        if (filters.search) {
          filtered = data.filter(p => 
            p.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        filtered.sort((a, b) => a.marketShare - b.marketShare);
        setPlatforms(filtered);
        setLoading(false);
      })
      .catch(e => setError(e.message));
  }, [filters]);

  return (
    <div>
      <input 
        onChange={(e) => setFilters({...filters, search: e.target.value})}
        placeholder="Search"
      />
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <div className="grid">
        {platforms.map(p => (
          <div 
            key={p.id}
            onClick={() => setComparison([...comparison, p.id])}
            className="p-4 border rounded"
          >
            <h3>{p.name}</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Why MVP Code is Messy
- **Time pressure:** 5-week deadline, ship fast
- **Premature optimization is the root of all evil:** Build before optimizing
- **Good enough:** Works for MVP scope (16 platforms)
- **Single responsibility? No:** Components do everything
- **Testability:** Low (can't test filtering logic in isolation)
- **Reusability:** Zero (logic locked in component)

### MVP Goals (All Met ✅)
- ✅ All v3.1 features ported
- ✅ <2s load time
- ✅ Lighthouse 95+
- ✅ 0 critical security issues
- ✅ Ready for 100 DAU

---

## PART II: POST-MVP TRANSFORMATION (Weeks 6–10) — "Make It Right"

### Philosophy: "Show It Works → Show It's Built Right"

After launch, refactor systematically from the bottom up:
1. **Utils** (pure, testable functions)
2. **Hooks** (state logic extraction)
3. **Services** (business logic, API calls)
4. **Components** (UI only, no logic)
5. **Pages** (composition, routing)

### The Transformation Roadmap

```
WEEK 6: Extract Logic from Components
  ├─ Move filtering logic → useFilters hook
  ├─ Move sorting logic → useSorting hook
  ├─ Move search logic → useSearch hook
  └─ Deliverable: All state/effects extracted

WEEK 7: Create Domain Services
  ├─ platformService (fetch, cache, transform)
  ├─ comparisonService (save, retrieve, export)
  ├─ assessmentService (calculate, recommend)
  └─ Deliverable: Services with 100% test coverage

WEEK 8: Rebuild Components as UI-Only
  ├─ PlatformCard → visual only (props-driven)
  ├─ FilterPanel → visual only (onChange callbacks)
  ├─ ExplorerPage → orchestration (hooks + services)
  └─ Deliverable: Storybook with 30+ stories

WEEK 9: Add Advanced Patterns
  ├─ Error boundaries (component-level error handling)
  ├─ Suspense (code splitting, lazy loading)
  ├─ Portal (modals, dropdowns out of DOM)
  ├─ Context (avoid prop drilling)
  └─ Deliverable: Patterns documented

WEEK 10: Polish & Documentation
  ├─ Type definitions (strict TypeScript)
  ├─ Integration tests (E2E scenarios)
  ├─ Performance audits (no regressions)
  ├─ Architecture decision records (ADRs)
  └─ Deliverable: Production-ready codebase
```

---

## PART III: CONCRETE REFACTORING EXAMPLES

### Example 1: Extracting Filtering Logic (Week 6)

**BEFORE (Messy MVP):**
```typescript
// In ExplorerPage.tsx (250 lines, does everything)
const [platforms, setPlatforms] = useState([]);
const [filters, setFilters] = useState({});
const [filtered, setFiltered] = useState([]);

useEffect(() => {
  let result = platforms;
  
  if (filters.provider !== 'all') {
    result = result.filter(p => p.provider === filters.provider);
  }
  
  if (filters.search) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  
  if (filters.category !== 'all') {
    result = result.filter(p => p.category === filters.category);
  }
  
  const [field, dir] = filters.sortBy.split('-');
  result = result.sort((a, b) => {
    const cmp = a[field] < b[field] ? -1 : 1;
    return dir === 'asc' ? cmp : -cmp;
  });
  
  setFiltered(result);
}, [platforms, filters]);
```

**AFTER (Production-grade):**

```typescript
// src/utils/filtering.ts (isolated, testable)
export type FilterSpec = {
  provider?: string;
  search?: string;
  category?: string;
  sortBy?: string;
};

/**
 * Apply filtering and sorting to platforms.
 * Pure function, no side effects.
 * @param platforms - Input array
 * @param filters - Filter specification
 * @returns Filtered and sorted array
 */
export function applyFilters(
  platforms: Platform[],
  filters: FilterSpec
): Platform[] {
  let result = [...platforms];

  // Filter by provider
  if (filters.provider && filters.provider !== 'all') {
    result = filterByProvider(result, filters.provider);
  }

  // Filter by search
  if (filters.search?.trim()) {
    result = filterBySearch(result, filters.search);
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    result = filterByCategory(result, filters.category);
  }

  // Sort
  if (filters.sortBy) {
    result = sortPlatforms(result, filters.sortBy);
  }

  return result;
}

// Composable, single-responsibility functions
function filterByProvider(platforms: Platform[], provider: string): Platform[] {
  return platforms.filter(p => p.provider === provider);
}

function filterBySearch(platforms: Platform[], query: string): Platform[] {
  const q = query.toLowerCase();
  return platforms.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

function filterByCategory(platforms: Platform[], category: string): Platform[] {
  return platforms.filter(p => p.category === category);
}

function sortPlatforms(platforms: Platform[], sortBy: string): Platform[] {
  const [field, direction] = sortBy.split('-');
  return [...platforms].sort((a, b) => {
    const aVal = a[field as keyof Platform];
    const bVal = b[field as keyof Platform];
    
    if (typeof aVal !== 'number' || typeof bVal !== 'number') {
      return 0; // Can't sort non-numeric fields
    }
    
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return direction === 'asc' ? comparison : -comparison;
  });
}

// ============================================
// src/utils/filtering.test.ts
// ============================================
import { describe, it, expect } from 'vitest';
import { applyFilters } from './filtering';

const mockPlatforms = [
  { id: '1', name: 'Claude API', provider: 'Anthropic', category: 'LLM', marketShare: 15 },
  { id: '2', name: 'GPT-4', provider: 'OpenAI', category: 'LLM', marketShare: 40 },
  { id: '3', name: 'Gemini', provider: 'Google', category: 'LLM', marketShare: 20 },
];

describe('applyFilters', () => {
  it('should filter by provider', () => {
    const result = applyFilters(mockPlatforms, { provider: 'Anthropic' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Claude API');
  });

  it('should filter by search (case-insensitive)', () => {
    const result = applyFilters(mockPlatforms, { search: 'claude' });
    expect(result).toHaveLength(1);
  });

  it('should sort by market share descending', () => {
    const result = applyFilters(mockPlatforms, { sortBy: 'marketShare-desc' });
    expect(result[0].marketShare).toBe(40);
    expect(result[2].marketShare).toBe(15);
  });

  it('should combine filters (provider + search)', () => {
    const result = applyFilters(mockPlatforms, {
      provider: 'Anthropic',
      search: 'claude'
    });
    expect(result).toHaveLength(1);
  });

  it('should handle empty results gracefully', () => {
    const result = applyFilters(mockPlatforms, { provider: 'NonExistent' });
    expect(result).toHaveLength(0);
  });
});
```

**Component Now (Week 8):**
```typescript
// src/components/ExplorerPage/ExplorerPage.tsx
// Now: Simple, orchestration-only, no logic
export function ExplorerPage() {
  const { data: platforms, isLoading, error } = usePlatforms();
  const { filters, updateFilter } = useFilters();
  
  const filteredPlatforms = useMemo(
    () => applyFilters(platforms, filters),
    [platforms, filters]
  );

  return (
    <div className="space-y-4">
      <FilterPanel filters={filters} onChange={updateFilter} />
      
      {isLoading && <LoadingSkeleton />}
      {error && <ErrorBoundary error={error} />}
      
      {filteredPlatforms.length === 0 && (
        <EmptyState message="No platforms match your criteria" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlatforms.map(platform => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            onCompare={() => {/* ... */}}
          />
        ))}
      </div>
    </div>
  );
}
```

---

### Example 2: Creating Domain Services (Week 7)

**Problem:** API calls scattered everywhere, no caching, no error handling

**BEFORE (MVP):**
```typescript
// In 5 different components...
const [platforms, setPlatforms] = useState([]);

useEffect(() => {
  fetch('/api/platforms')
    .then(r => r.json())
    .then(data => setPlatforms(data))
    .catch(e => console.error(e));
}, []);
```

**AFTER (Production):**

```typescript
// src/services/platformService.ts
import { queryClient } from '@/lib/queryClient';
import * as Sentry from '@sentry/react';

type GetPlatformsOptions = {
  cache?: 'short' | 'long'; // 1 min vs 5 min
  forceRefresh?: boolean;
};

/**
 * Fetch all platforms with intelligent caching.
 * Uses React Query for deduplication and cache management.
 */
export async function getPlatforms(
  options: GetPlatformsOptions = {}
): Promise<Platform[]> {
  const cacheTime = options.cache === 'long' ? 5 * 60 * 1000 : 60 * 1000;

  try {
    const response = await api.get('/platforms');
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format');
    }

    // Transform API response to internal format
    return response.data.map(transformPlatformDTO);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { service: 'platformService', operation: 'getPlatforms' }
    });
    throw new PlatformServiceError('Failed to fetch platforms', error);
  }
}

/**
 * Get single platform with full details.
 */
export async function getPlatform(id: string): Promise<Platform> {
  try {
    const response = await api.get(`/platforms/${id}`);
    return transformPlatformDTO(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NotFoundError(`Platform ${id} not found`);
    }
    throw new PlatformServiceError('Failed to fetch platform', error);
  }
}

/**
 * Search platforms with debouncing.
 */
export async function searchPlatforms(query: string): Promise<Platform[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await api.get('/platforms/search', {
      params: { q: query.trim() }
    });
    return response.data.map(transformPlatformDTO);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { service: 'platformService', operation: 'searchPlatforms' }
    });
    throw new PlatformServiceError('Search failed', error);
  }
}

// Transform API DTO to internal type (versioning, renaming, etc.)
function transformPlatformDTO(dto: any): Platform {
  return {
    id: dto.id,
    name: dto.name,
    provider: dto.provider,
    description: dto.description,
    marketShare: dto.market_share, // API uses snake_case
    strengths: dto.strengths || [],
    useCases: dto.use_cases || [],
    // ... more mappings
  };
}

// Custom error types for better error handling
export class PlatformServiceError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'PlatformServiceError';
    this.cause = cause;
  }
}

export class NotFoundError extends PlatformServiceError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// ============================================
// src/hooks/usePlatforms.ts (Layer above service)
// ============================================
import { useQuery, UseQueryResult } from 'react-query';
import { getPlatforms } from '@/services/platformService';

export function usePlatforms(): UseQueryResult<Platform[], Error> {
  return useQuery(
    ['platforms'], // Query key
    () => getPlatforms({ cache: 'long' }), // Fetch function
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        // Global error handling
        if (error instanceof NotFoundError) {
          // Handle 404
        } else if (error instanceof PlatformServiceError) {
          // Handle service error
        }
      }
    }
  );
}

// ============================================
// Usage in components (now simple)
// ============================================
export function ExplorerPage() {
  const { data: platforms = [], isLoading, error } = usePlatforms();
  
  // That's it. No fetch logic, no error handling, no caching logic.
  // All handled by service + hook.
  
  return (
    <>
      {isLoading && <Spinner />}
      {error && <ErrorBoundary error={error} />}
      {platforms.map(p => <PlatformCard key={p.id} platform={p} />)}
    </>
  );
}
```

---

### Example 3: Rebuilding Components as Pure UI (Week 8)

**BEFORE (Messy MVP):**
```typescript
// 300 lines, does everything
export function PlatformCard({ platform, onSelect }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Track view
    trackEvent('platform_viewed', { platformId: platform.id });
    setHasViewed(true);
  }, [platform.id]);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    trackEvent('platform_expanded', { platformId: platform.id });
  };

  return (
    <div 
      onClick={handleClick}
      className={`p-4 border rounded ${isExpanded ? 'shadow-lg' : 'shadow'}`}
    >
      {/* ... inline HTML ... */}
    </div>
  );
}
```

**AFTER (Production-grade):**

```typescript
// src/components/PlatformCard/PlatformCard.tsx
// Pure UI component: no side effects, no state, no logic
import React from 'react';
import { Platform } from '@/types/Platform';
import { PlatformBadge } from './PlatformBadge';
import { PlatformStrengths } from './PlatformStrengths';
import { PlatformActions } from './PlatformActions';

export interface PlatformCardProps {
  platform: Platform;
  isSelected?: boolean;
  isLoading?: boolean;
  onSelect?: (id: string) => void;
  onAddCompare?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

/**
 * PlatformCard: Pure presentational component
 * 
 * Props-driven, no side effects, fully controllable.
 * Parent handles state, events, analytics.
 * 
 * Storybook stories:
 *  - Default state
 *  - Selected state
 *  - Loading state
 *  - Disabled state
 *  - Hover state
 */
export const PlatformCard = React.memo(function PlatformCard({
  platform,
  isSelected = false,
  isLoading = false,
  onSelect,
  onAddCompare,
  onViewDetails
}: PlatformCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect?.(platform.id);
  };

  const handleAddCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddCompare?.(platform.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(platform.id);
  };

  return (
    <article
      onClick={handleClick}
      className={clsx(
        'platform-card',
        'rounded-lg border-2 transition-all duration-200 cursor-pointer',
        isLoading && 'opacity-50 cursor-wait',
        isSelected
          ? 'border-orange-500 shadow-lg'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      )}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Platform: ${platform.name}`}
    >
      {/* Header */}
      <header className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {platform.name}
            </h3>
            <p className="text-sm text-gray-600">{platform.provider}</p>
          </div>
          <PlatformBadge priority={platform.intPriority} />
        </div>
        <p className="text-sm text-gray-700 line-clamp-2">
          {platform.description}
        </p>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 gap-4 p-6 bg-gray-50 border-b border-gray-100">
        <Stat label="Pricing" value={platform.pricing} />
        <Stat label="Context Window" value={platform.contextWindow} />
      </section>

      {/* Strengths */}
      <section className="p-6">
        <PlatformStrengths strengths={platform.strengths.slice(0, 3)} />
      </section>

      {/* Actions */}
      <footer className="flex gap-3 p-6 border-t border-gray-100">
        <button
          onClick={handleAddCompare}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSelected ? '✓ Added' : 'Add to Compare'}
        </button>
        <button
          onClick={handleViewDetails}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          aria-label="View platform details"
        >
          ℹ️
        </button>
      </footer>
    </article>
  );
});

PlatformCard.displayName = 'PlatformCard';

// ============================================
// Separate: Storybook stories (100% coverage)
// ============================================
// src/components/PlatformCard/PlatformCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PlatformCard } from './PlatformCard';

const meta: Meta<typeof PlatformCard> = {
  component: PlatformCard,
  parameters: { layout: 'centered' }
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlatform = {
  id: '1',
  name: 'Claude API',
  provider: 'Anthropic',
  description: 'State-of-the-art language model',
  pricing: '$3/$15 per 1M tokens',
  contextWindow: '200K',
  strengths: ['Safe', 'Fast', 'Capable'],
  intPriority: 'high'
} as const;

export const Default: Story = {
  args: { platform: mockPlatform }
};

export const Selected: Story = {
  args: {
    platform: mockPlatform,
    isSelected: true
  }
};

export const Loading: Story = {
  args: {
    platform: mockPlatform,
    isLoading: true
  }
};

export const WithHandlers: Story = {
  args: {
    platform: mockPlatform,
    onSelect: (id) => console.log('Selected:', id),
    onAddCompare: (id) => console.log('Compare:', id),
    onViewDetails: (id) => console.log('Details:', id)
  }
};

// ============================================
// Tests: Pure unit tests (no mocking API)
// ============================================
// src/components/PlatformCard/PlatformCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PlatformCard } from './PlatformCard';

describe('PlatformCard', () => {
  const mockPlatform = {
    id: '1',
    name: 'Claude',
    provider: 'Anthropic',
    description: 'AI model',
    pricing: '$3/$15',
    contextWindow: '200K',
    strengths: ['Safe'],
    intPriority: 'high'
  };

  it('renders platform name and provider', () => {
    render(<PlatformCard platform={mockPlatform} />);
    expect(screen.getByText('Claude')).toBeInTheDocument();
    expect(screen.getByText('Anthropic')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<PlatformCard platform={mockPlatform} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByRole('button', { name: /platform: claude/i }));
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('shows selected state', () => {
    render(<PlatformCard platform={mockPlatform} isSelected={true} />);
    expect(screen.getByRole('button')).toHaveClass('border-orange-500');
  });

  it('disables buttons when loading', () => {
    render(<PlatformCard platform={mockPlatform} isLoading={true} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });
});
```

**Usage (Now simple):**
```typescript
export function ExplorerPage() {
  const { data: platforms = [] } = usePlatforms();
  const { comparison, addComparison } = useComparison();
  
  const handleSelectPlatform = (id: string) => {
    trackEvent('platform_selected', { platformId: id });
  };
  
  const handleViewDetails = (id: string) => {
    navigate(`/platform/${id}`);
  };

  return (
    <div className="grid gap-4">
      {platforms.map(platform => (
        <PlatformCard
          key={platform.id}
          platform={platform}
          isSelected={comparison.includes(platform.id)}
          onSelect={handleSelectPlatform}
          onAddCompare={addComparison}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
}
```

---

## PART IV: ARCHITECTURE PATTERNS (Post-MVP)

### 1. Error Handling Strategy

**BEFORE (MVP):**
```typescript
// Silent failures, confusing errors
.catch(e => console.error(e));
```

**AFTER (Production):**

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, context);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404, { resource });
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super('Rate limited', 'RATE_LIMIT', 429, { retryAfter });
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super('Unauthorized', 'UNAUTHORIZED', 401);
  }
}

// src/lib/errorHandler.ts
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    // Already typed, just return
    return error;
  }

  if (error instanceof Error) {
    // Convert standard Error
    return new AppError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      { originalError: error.name }
    );
  }

  // Unknown error type
  return new AppError('Unknown error occurred', 'UNKNOWN_ERROR', 500);
}

// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: AppError | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown): { error: AppError } {
    return { error: handleError(error) };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    const appError = handleError(error);
    
    // Log to Sentry with full context
    Sentry.captureException(appError, {
      tags: {
        boundary: 'ErrorBoundary',
        code: appError.code
      },
      extra: {
        componentStack: errorInfo.componentStack,
        context: appError.context
      }
    });
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <ErrorDisplay
          title={error.message}
          code={error.code}
          statusCode={error.statusCode}
          context={error.context}
          onRetry={() => this.setState({ error: null })}
        />
      );
    }

    return this.props.children;
  }
}
```

### 2. Caching Strategy

```typescript
// src/lib/cache.ts
import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long before data is considered "stale"
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Cache time: how long to keep unused data in cache
      cacheTime: 1000 * 60 * 30, // 30 minutes

      // Retry strategy: exponential backoff
      retry: (failureCount, error) => {
        // Don't retry 4xx errors (client's fault)
        if (error instanceof Error && error.message.includes('404')) {
          return false;
        }
        // Retry up to 3 times
        return failureCount < 3;
      },

      retryDelay: (attemptIndex) => {
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      }
    },
    mutations: {
      retry: 1
    }
  }
});

// Cache invalidation helpers
export function invalidatePlatforms() {
  queryClient.invalidateQueries(['platforms']);
}

export function invalidatePlatform(id: string) {
  queryClient.invalidateQueries(['platform', id]);
}

export function invalidateComparisons() {
  queryClient.invalidateQueries(['comparisons']);
}
```

### 3. Type-Safe API Layer

```typescript
// src/services/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import { AppError, RateLimitError, UnauthorizedError } from '@/lib/errors';

// API Response types (match your backend)
export type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  timestamp: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}>;

// Type-safe API instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
});

// Request interceptor: add auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle specific error types
    if (error.response?.status === 401) {
      // Clear auth and redirect
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      throw new UnauthorizedError();
    }

    if (error.response?.status === 429) {
      const retryAfter = parseInt(
        error.response.headers['retry-after'] || '60'
      );
      throw new RateLimitError(retryAfter);
    }

    if (error.response?.status === 404) {
      throw new AppError('Not found', 'NOT_FOUND', 404);
    }

    throw new AppError(
      error.message,
      'API_ERROR',
      error.response?.status || 500,
      { endpoint: error.config?.url }
    );
  }
);

// Type-safe method helpers
export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const response = await api.get<ApiResponse<T>>(url);
    return response.data.data;
  },

  async post<T, D = any>(url: string, data: D): Promise<T> {
    const response = await api.post<ApiResponse<T>>(url, data);
    return response.data.data;
  },

  async put<T, D = any>(url: string, data: D): Promise<T> {
    const response = await api.put<ApiResponse<T>>(url, data);
    return response.data.data;
  },

  async delete<T>(url: string): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data.data;
  }
};
```

### 4. Testing Pyramid

```typescript
// Unit: Pure functions (Filtering, formatting, etc.)
// Coverage: 100%
// Time: Instant

// Integration: Components + hooks + services
// Coverage: 80%
// Time: Fast

// E2E: Full user flows (Playwright/Cypress)
// Coverage: 50% (critical paths)
// Time: Slow (run on CI only)

// src/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.stories.ts',
        '**/*.d.ts'
      ],
      lines: 80,      // Fail if <80% lines covered
      functions: 80,
      branches: 70,
      statements: 80
    }
  }
});

// Run tests with coverage
// npm run test:coverage
```

---

## PART V: WEEK-BY-WEEK EXECUTION (Post-MVP)

### Week 6: Extract Logic from Components

**Daily Goals:**
- Extract filtering logic → `useFilters` hook
- Extract sorting logic → `useSorting` hook  
- Extract search logic → `useSearch` hook
- Extract pagination logic → `usePagination` hook

**Metrics:**
- ✅ 0 props drilling
- ✅ 100% test coverage on hooks
- ✅ Components <200 lines each

**Deliverable:** All state management extracted from components

---

### Week 7: Build Domain Services

**Daily Goals:**
- Create `platformService` (fetch, search, filter)
- Create `comparisonService` (save, retrieve, export)
- Create `assessmentService` (calculate, recommend)
- Create error boundaries + error types

**Metrics:**
- ✅ All services 100% tested
- ✅ Custom error types for each domain
- ✅ Proper error handling + logging

**Deliverable:** Services layer with comprehensive error handling

---

### Week 8: Rebuild Components as Pure UI

**Daily Goals:**
- Rebuild PlatformCard as pure UI
- Rebuild FilterPanel as pure UI
- Rebuild ComparisonModal as pure UI
- Create Storybook with 30+ stories

**Metrics:**
- ✅ 0 side effects in components
- ✅ 100% props-driven
- ✅ Storybook accessible to designers

**Deliverable:** Component library with visual regression testing

---

### Week 9: Add Advanced Patterns

**Daily Goals:**
- Implement Error Boundaries
- Implement Suspense for code splitting
- Implement Portal for modals
- Implement Context for avoiding prop drilling

**Metrics:**
- ✅ Error handling at all levels
- ✅ <1% runtime errors in prod
- ✅ No prop drilling >3 levels

**Deliverable:** Production patterns documented in ADRs

---

### Week 10: Polish & Prepare for Scale

**Daily Goals:**
- Strict TypeScript (no `any`)
- Integration tests (E2E user flows)
- Performance audits (no regressions)
- Architecture decision records (ADRs)

**Metrics:**
- ✅ 0 TypeScript errors (`strict: true`)
- ✅ >80% test coverage
- ✅ Lighthouse 95+
- ✅ <100ms API responses (p95)

**Deliverable:** Production-ready, scalable codebase

---

## PART VI: ARCHITECTURE DECISION RECORDS (ADRs)

Create ADRs documenting why you made certain choices:

```markdown
# ADR-001: Use Zustand for State Management

## Context
MVP used local state (useState) scattered across components.
This doesn't scale beyond 16 platforms.

## Decision
Use Zustand for global state (filters, comparison, preferences).

## Consequences
✅ Pros:
- Minimal boilerplate vs Redux
- Persistent storage for preferences
- Dev tools (Redux DevTools)
- Time-travel debugging

❌ Cons:
- Another dependency
- Learning curve for team

## Alternatives Considered
1. Redux (too much boilerplate)
2. Context API (prop drilling)
3. MobX (overkill)

## Status: ACCEPTED (Post-MVP)
```

---

## PART VII: MIGRATION CHECKLIST (MVP → Production)

### Code Quality (Week 6–7)
- [ ] Extract all state logic to hooks
- [ ] Move all API calls to services
- [ ] Create custom error types
- [ ] Remove all `console.log()` debugging
- [ ] TypeScript strict mode enabled
- [ ] 0 ESLint warnings

### Components (Week 8)
- [ ] All components <200 lines
- [ ] 0 side effects in components
- [ ] Proper prop typing (no `any`)
- [ ] All interactive elements accessible (ARIA)
- [ ] Storybook stories for all components
- [ ] Visual regression tests

### Testing (Week 9–10)
- [ ] Unit tests for all utils (100% coverage)
- [ ] Unit tests for all hooks (100% coverage)
- [ ] Integration tests for critical flows (80% coverage)
- [ ] E2E tests for user journeys (50% coverage)
- [ ] Accessibility tests (WCAG AA)

### Performance (Week 9–10)
- [ ] Bundle size <150KB gzipped
- [ ] First paint <2s
- [ ] Lighthouse 95+
- [ ] Core Web Vitals all green
- [ ] No prop drilling >3 levels
- [ ] Proper code splitting (lazy load routes)

### Security (Week 9–10)
- [ ] All secrets in env variables
- [ ] Input validation on all forms
- [ ] CSRF protection
- [ ] XSS prevention (CSP headers)
- [ ] SQL injection prevention (parameterized queries)
- [ ] Rate limiting on API calls

### Documentation (Week 10)
- [ ] ADRs for all major decisions
- [ ] Component library in Storybook
- [ ] API documentation (Swagger)
- [ ] Developer guide (setup, common tasks)
- [ ] Deployment runbook
- [ ] Incident response playbook

---

## PART VIII: BEFORE / AFTER COMPARISON

| Aspect | MVP (Weeks 1–5) | Production (Weeks 6–10) |
|--------|-----------------|------------------------|
| **LOC per file** | 300–500 | <200 |
| **Test coverage** | 40% | 85%+ |
| **Type safety** | Partial | Strict |
| **Error handling** | Try-catch only | Domain errors + boundaries |
| **API calls** | In components | Services layer |
| **State logic** | Scattered useState | Hooks + Zustand |
| **Component state** | Yes | No (props only) |
| **Side effects** | Many | Minimal (hooks only) |
| **Code reuse** | Low | High |
| **Testability** | Hard | Easy |
| **Scalability** | 16 platforms | 10K+ users |
| **Debugging** | console.log | Sentry + DevTools |
| **Type errors** | ~100 | ~0 |
| **Runtime errors** | 5–10% | <1% |
| **Onboarding time** | 2 weeks | 2–3 days |

---

## PART IX: TEAM SETUP POST-MVP

### Role-Based Responsibilities

**Technical Lead**
- Code reviews for architecture
- Approve ADRs
- Manage tech debt backlog
- Performance audits

**Senior Engineer**
- Refactor Week 6–7
- Mentor junior engineers
- Design patterns
- Storybook setup

**Mid-Level Engineer**
- Component refactoring Week 8
- Test writing
- Bug fixes

**Junior Engineer**
- Test writing
- Documentation
- Small refactors
- QA

**Designer**
- Storybook review
- Visual regression testing
- Component specs

---

## PART X: KEY PRINCIPLES

### 1. **Single Responsibility Principle**
- Each function/component/service does ONE thing
- If explaining it requires "and" → split it

### 2. **Composition Over Configuration**
- Smaller, reusable pieces
- Compose into larger features
- Not giant all-in-one components

### 3. **Type Safety**
- `strict: true` in tsconfig
- No `any` types
- Discriminated unions for error handling

### 4. **Testability First**
- If hard to test → design is wrong
- Pure functions are testable
- No side effects in business logic

### 5. **Performance Matters**
- Measure, don't guess
- React DevTools Profiler
- Network tab, Lighthouse

### 6. **Documentation**
- Code is read 10x more than written
- Comments explain "why", not "what"
- ADRs document decisions

---

## PART XI: RESOURCES

### Key Files to Create Post-MVP

```
src/
├── lib/
│   ├── errors.ts            # Custom error types
│   ├── errorHandler.ts      # Error handling logic
│   ├── cache.ts             # React Query config
│   └── queryClient.ts       # Query client instance
├── services/
│   ├── platformService.ts   # Domain logic
│   ├── comparisonService.ts
│   ├── assessmentService.ts
│   └── api.ts               # Type-safe API layer
├── hooks/
│   ├── usePlatforms.ts      # Fetch + cache
│   ├── useFilters.ts        # Filter state
│   ├── useSorting.ts        # Sort state
│   ├── useComparison.ts     # Comparison state
│   └── useSearch.ts         # Search state
├── components/
│   ├── PlatformCard/        # Pure UI component
│   │   ├── PlatformCard.tsx
│   │   ├── PlatformCard.test.tsx
│   │   ├── PlatformCard.stories.tsx
│   │   └── PlatformBadge.tsx
│   ├── ExplorerPage/        # Orchestration component
│   │   ├── ExplorerPage.tsx
│   │   └── ExplorerPage.test.tsx
│   └── ErrorBoundary.tsx    # Error handling
├── test/
│   ├── setup.ts             # Test configuration
│   ├── mocks/
│   │   ├── platformMocks.ts
│   │   └── apiMocks.ts
│   └── fixtures/
│       └── mockData.ts
└── __docs__/
    └── ADRs/
        ├── ADR-001-state-management.md
        ├── ADR-002-error-handling.md
        └── ADR-003-component-architecture.md
```

---

## SUMMARY

**MVP (Weeks 1–5):** Get it working
- Monolithic, messy, fast
- Good enough for 100 DAU
- ~12 hours engineering

**Post-MVP (Weeks 6–10):** Make it right
- Modular, clean, maintainable
- Ready for 10K+ users
- ~80 hours engineering

**Result:** Production-grade codebase that scales with the team.

---

**Status:** Ready for post-MVP refactoring  
**Next:** Run Week 6 checklist  
**Questions?** Refer to specific examples above
