# Performance & Resilience Improvement Issues

This document contains GitHub issues to be created for incremental performance and resilience improvements.

---

## Issue 1: Implement Code Splitting for Heavy Feature Modules

**Title:** Add code splitting with React.lazy for feature modules to reduce initial bundle size

**Labels:** performance, enhancement, good-first-issue

**Description:**

### Problem
Currently, all feature modules are loaded synchronously, increasing the initial bundle size and slowing down first page load. Heavy components like ExecutiveDashboard, TestPlayground, and SetupWizard should be loaded on-demand.

### Solution
Implement React.lazy and Suspense to code-split feature modules that aren't immediately needed on page load.

### Implementation Plan

1. **Identify heavy modules** (>50KB):
   - `src/features/agents/components/TestPlayground.tsx`
   - `src/features/ecosystem/components/SetupWizard.tsx`  
   - `src/components/ExecutiveDashboard.tsx`
   - `src/components/sections/InteractiveTutorial.tsx`

2. **Wrap with React.lazy:**
   ```tsx
   const TestPlayground = lazy(() => import('./features/agents/components/TestPlayground'));
   const SetupWizard = lazy(() => import('./features/ecosystem/components/SetupWizard'));
   ```

3. **Add Suspense boundaries with loading states:**
   ```tsx
   <Suspense fallback={<LoadingState type="skeleton" label="Loading module..." />}>
     <TestPlayground />
   </Suspense>
   ```

### Acceptance Criteria
- [ ] Heavy modules are lazy-loaded
- [ ] Suspense boundaries have appropriate loading states
- [ ] Initial bundle size reduced by at least 20%
- [ ] No visual regressions
- [ ] Error boundaries work with lazy components

### Files to Modify
- `src/App.tsx` or feature container components
- Add LoadingState components where needed

### Testing
- Test that features load correctly when accessed
- Verify loading states appear briefly
- Test error scenarios (network failures)

---

## Issue 2: Add Request Deduplication for API Calls

**Title:** Implement request deduplication to prevent redundant API calls

**Labels:** performance, enhancement, backend

**Description:**

### Problem
Multiple components may trigger the same API request simultaneously, wasting bandwidth and server resources. This is especially problematic for data that doesn't change frequently.

### Solution
Create a request cache/deduplication layer that:
1. Caches in-flight requests
2. Returns the same promise for duplicate requests
3. Implements short-term memory cache (5-30 seconds)

### Implementation Plan

1. **Create RequestCache utility:**
   ```typescript
   // src/lib/request-cache.ts
   class RequestCache {
     private cache: Map<string, Promise<any>>;
     private results: Map<string, { data: any; timestamp: number }>;
     
     async fetch<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T>
   }
   ```

2. **Wrap API calls:**
   ```typescript
   // Before
   const data = await fetch('/api/data').then(r => r.json());
   
   // After  
   const data = await requestCache.fetch('api-data', () => 
     fetch('/api/data').then(r => r.json()),
     5000 // 5 second TTL
   );
   ```

### Acceptance Criteria
- [ ] Duplicate requests within TTL return cached data
- [ ] In-flight requests are deduplicated
- [ ] Cache can be invalidated manually
- [ ] Memory usage is bounded
- [ ] Works with the existing async-handler utility

### Files to Create
- `src/lib/request-cache.ts`

### Files to Modify
- API calling hooks/services

---

## Issue 3: Add Retry Logic to Critical User Actions

**Title:** Implement automatic retry with exponential backoff for critical operations

**Labels:** resilience, enhancement, user-experience

**Description:**

### Problem
Network failures or temporary server issues can cause user actions to fail. Critical operations like saving data should automatically retry before showing an error.

### Solution
Use the existing `async-handler.ts` retry utilities to wrap critical operations with automatic retry logic.

### Implementation Plan

1. **Identify critical operations:**
   - Saving agent configurations (zustand persistence)
   - Saving bookmarks
   - Saving user preferences
   - Any API writes

2. **Wrap with retry:**
   ```typescript
   import { retry, shouldRetryNetworkError } from '@/lib/async-handler';
   
   const saved = await retry(
     () => saveAgentConfig(config),
     { 
       maxRetries: 3,
       shouldRetry: shouldRetryNetworkError,
       errorMessage: 'Failed to save configuration'
     }
   );
   ```

3. **Add user feedback:**
   - Show spinner during retry
   - Show toast notification on failure
   - Provide manual retry button

### Acceptance Criteria
- [ ] Critical save operations retry 2-3 times
- [ ] Exponential backoff is used (1s, 2s, 4s)
- [ ] Users see feedback during retries
- [ ] Non-retriable errors (4xx) don't retry
- [ ] Network errors trigger retry
- [ ] Success/failure toasts are shown

### Files to Modify
- `src/features/agents/hooks/useAgentStore.ts`
- `src/services/storage.ts`
- Any components that perform writes

---

## Issue 4: Migrate LocalStorage to Versioned Storage

**Title:** Migrate all localStorage usage to versioned SafeStorage utility

**Labels:** reliability, enhancement, breaking-change

**Description:**

### Problem
Current localStorage usage lacks:
- Version checking (can break on schema changes)
- Safe JSON parsing (can crash on corruption)
- TTL/expiration support
- Quota management

### Solution
Migrate from direct `localStorage` usage to the new `SafeStorage` utility from `lib/storage.ts`.

### Implementation Plan

1. **Migrate utils/storage.ts:**
   ```typescript
   // Before
   const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
   
   // After
   import { storage } from '@/lib/storage';
   const bookmarks = storage.getItem('bookmarks', [], { version: 1 });
   ```

2. **Migrate services/storage.ts:**
   - Update `getUser`, `setUser`, etc. to use SafeStorage
   - Add version numbers to all stored data

3. **Update zustand persist middleware:**
   - Configure to use versioned storage
   - Add migration function for version changes

### Acceptance Criteria
- [ ] All direct localStorage calls replaced
- [ ] All stored data has version numbers
- [ ] Safe parsing prevents crashes
- [ ] Storage quota is monitored
- [ ] Migration path for existing users
- [ ] Backward compatibility maintained

### Files to Modify
- `src/utils/storage.ts`
- `src/services/storage.ts`
- `src/hooks/useLocalStorage.ts`
- `src/features/*/hooks/*Store.ts` (zustand stores)

### Breaking Changes
- Existing localStorage data may need migration
- Add migration script or clear old data

---

## Issue 5: Add Loading States to Async Components

**Title:** Add skeleton/spinner loading states to components with async operations

**Labels:** ux, enhancement, good-first-issue

**Description:**

### Problem
Components that load data asynchronously don't show loading states, causing:
- Perceived slowness
- Layout shifts
- Confusion about whether the app is working

### Solution
Add LoadingState components to all components that perform async operations.

### Implementation Plan

1. **Identify components with async operations:**
   ```bash
   grep -r "useEffect.*fetch\|useState.*loading" src/components
   ```

2. **Add loading states:**
   ```tsx
   import { LoadingState } from '@/components/ui/LoadingState';
   
   function MyComponent() {
     const [loading, setLoading] = useState(true);
     const [data, setData] = useState(null);
     
     return (
       <LoadingState isLoading={loading} type="skeleton">
         <ActualContent data={data} />
       </LoadingState>
     );
   }
   ```

3. **Add empty states:**
   ```tsx
   import { EmptyState } from '@/components/ui/EmptyState';
   
   if (!data || data.length === 0) {
     return (
       <EmptyState 
         icon="inbox"
         title="No data found"
         description="Try adjusting your filters"
       />
     );
   }
   ```

### Acceptance Criteria
- [ ] All async components show loading states
- [ ] Skeleton screens used for content-heavy components
- [ ] Spinners used for quick operations
- [ ] Empty states show when no data
- [ ] No layout shifts during load
- [ ] Loading states accessible (aria-label)

### Components to Update
- `src/components/ContentViewer.tsx`
- `src/features/*/components/*.tsx` (any with data fetching)
- Dashboard components

---

## Issue 6: Implement Error Recovery UI

**Title:** Add user-friendly error recovery options to error states

**Labels:** ux, resilience, enhancement

**Description:**

### Problem
When errors occur, users see generic error messages with no clear way to recover except reloading the entire page.

### Solution
Enhance error states with:
1. Specific error messages
2. Recovery actions (retry, go back, reset)
3. Helpful context about what went wrong

### Implementation Plan

1. **Create ErrorFallback component:**
   ```tsx
   // src/components/ui/ErrorFallback.tsx
   interface ErrorFallbackProps {
     error: Error;
     resetError: () => void;
     showDetails?: boolean;
   }
   ```

2. **Update ErrorBoundary:**
   - Add retry callback
   - Add "go back" option
   - Show error details in dev mode only
   - Log to error tracking service

3. **Add inline error states:**
   ```tsx
   // For non-critical errors that don't need boundary
   <ErrorState 
     title="Failed to load data"
     message={error.message}
     action={{ label: "Try Again", onClick: handleRetry }}
   />
   ```

### Acceptance Criteria
- [ ] Error boundaries have retry functionality
- [ ] Inline errors have clear messages
- [ ] Recovery actions are obvious
- [ ] Errors are logged properly
- [ ] Dev mode shows stack traces
- [ ] Production hides sensitive info

### Files to Modify
- `src/components/ErrorBoundary.tsx`
- Create `src/components/ui/ErrorState.tsx`

---

## Issue 7: Add Performance Monitoring Hooks

**Title:** Implement usePerformanceMonitor hook for tracking component render performance

**Labels:** performance, monitoring, enhancement

**Description:**

### Problem
No visibility into which components are slow or causing performance issues. React DevTools helps, but runtime monitoring is needed for production insights.

### Solution
Create hooks that:
1. Track component mount/render times
2. Detect slow renders (>16ms)
3. Log performance metrics
4. Warn about performance issues in dev

### Implementation Plan

1. **Create usePerformanceMonitor hook:**
   ```typescript
   // src/hooks/usePerformanceMonitor.ts
   export function usePerformanceMonitor(componentName: string, threshold = 16) {
     useEffect(() => {
       const start = performance.now();
       return () => {
         const duration = performance.now() - start;
         if (duration > threshold) {
           logger.warn(`Slow render: ${componentName}`, { duration });
         }
       };
     });
   }
   ```

2. **Add to heavy components:**
   ```tsx
   function HeavyComponent() {
     usePerformanceMonitor('HeavyComponent');
     // ...
   }
   ```

3. **Create performance dashboard view:**
   - Show slowest components
   - Show render counts
   - Export performance data

### Acceptance Criteria
- [ ] Hook tracks mount/unmount times
- [ ] Slow renders logged in dev mode
- [ ] Minimal performance overhead
- [ ] Can be toggled off in production
- [ ] Integrates with existing logger

### Files to Create
- `src/hooks/usePerformanceMonitor.ts`
- `src/hooks/useRenderCount.ts` (bonus)

---

## Issue 8: Add Network Status Indicator

**Title:** Show network status indicator and offline mode support

**Labels:** ux, resilience, enhancement

**Description:**

### Problem
Users don't know if failures are due to network issues or bugs. Offline state isn't clearly communicated.

### Solution
Add:
1. Network status indicator (online/offline)
2. Offline banner at top of page
3. Queue operations when offline
4. Sync when back online

### Implementation Plan

1. **Create useNetworkStatus hook:**
   ```typescript
   export function useNetworkStatus() {
     const [isOnline, setIsOnline] = useState(navigator.onLine);
     
     useEffect(() => {
       const handleOnline = () => setIsOnline(true);
       const handleOffline = () => setIsOnline(false);
       
       window.addEventListener('online', handleOnline);
       window.addEventListener('offline', handleOffline);
       
       return () => {
         window.removeEventListener('online', handleOnline);
         window.removeEventListener('offline', handleOffline);
       };
     }, []);
     
     return isOnline;
   }
   ```

2. **Add NetworkStatusBanner component:**
   ```tsx
   function NetworkStatusBanner() {
     const isOnline = useNetworkStatus();
     
     if (isOnline) return null;
     
     return (
       <div className="bg-yellow-500 text-white p-2 text-center">
         ⚠️ You are offline. Some features may not work.
       </div>
     );
   }
   ```

3. **Update async operations:**
   - Check network status before API calls
   - Show appropriate errors for offline state
   - Queue writes when offline (optional)

### Acceptance Criteria
- [ ] Network status hook works correctly
- [ ] Offline banner shows when offline
- [ ] Banner disappears when online
- [ ] API calls detect offline state
- [ ] Helpful error messages for offline users
- [ ] Works across all browsers

### Files to Create
- `src/hooks/useNetworkStatus.ts`
- `src/components/NetworkStatusBanner.tsx`

### Files to Modify
- `src/App.tsx` (add banner)
- `src/lib/async-handler.ts` (check network status)

---

## Priority & Sequencing

**High Priority (Do First):**
1. Issue 5: Add Loading States (quick wins, visible impact)
2. Issue 4: Migrate to Versioned Storage (foundational, prevents bugs)
3. Issue 3: Add Retry Logic (reliability improvement)

**Medium Priority (Next):**
4. Issue 1: Code Splitting (performance optimization)
5. Issue 6: Error Recovery UI (better UX)
6. Issue 8: Network Status Indicator (resilience)

**Lower Priority (Future):**
7. Issue 2: Request Deduplication (optimization, if API-heavy)
8. Issue 7: Performance Monitoring (nice-to-have, dev tool)

---

## How to Create Issues

For each issue above:

1. Go to GitHub repository
2. Click "Issues" → "New Issue"
3. Copy the **Title** as issue title
4. Copy the **Description** section as issue body
5. Add the specified **Labels**
6. Assign to appropriate milestone
7. Link related issues if any

---

## Notes

- These issues are intentionally small and focused
- Each can be completed in 1-3 days
- Issues can be tackled in parallel by different team members
- All improvements are backward-compatible unless noted
