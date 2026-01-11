# Performance & Resilience Implementation Guide

## Overview

This document provides practical guidance for implementing performance and resilience improvements in the Enterprise Profile Builder application. It complements the detailed issues in `PERFORMANCE_ISSUES.md` with concrete examples and best practices.

---

## Quick Reference

### New Utilities

| Utility | Location | Purpose |
|---------|----------|---------|
| **SafeStorage** | `src/lib/storage.ts` | Versioned localStorage with safe parsing |
| **AsyncHandler** | `src/lib/async-handler.ts` | Retry logic, timeout, error handling |
| **LoadingState** | `src/components/ui/LoadingState.tsx` | Loading spinner/skeleton wrapper |
| **EmptyState** | `src/components/ui/EmptyState.tsx` | Empty data placeholder |
| **LoadingSpinner** | `src/components/ui/LoadingSpinner.tsx` | Standalone spinner component |

### Smoke Tests

```bash
# Run automated smoke tests
npm run smoke-test

# Or directly
bash scripts/smoke-test.sh

# Manual testing
# See MANUAL_SMOKE_TEST.md for step-by-step checklist
```

---

## 1. Using SafeStorage

### Problem
Direct `localStorage` usage can crash the app if:
- Data is corrupted
- JSON parsing fails
- Storage quota is exceeded
- Schema changes break old data

### Solution
Use `SafeStorage` for all localStorage operations.

### Migration Example

**Before:**
```typescript
// ❌ Unsafe - can crash
const data = JSON.parse(localStorage.getItem('key') || '{}');
localStorage.setItem('key', JSON.stringify(data));
```

**After:**
```typescript
// ✅ Safe with versioning
import { storage } from '@/lib/storage';

const data = storage.getItem('key', {}, { version: 1 });
storage.setItem('key', data, { version: 1 });
```

### Advanced Usage

```typescript
import { storage } from '@/lib/storage';

// With TTL (Time To Live)
storage.setItem('cache-key', data, { 
  version: 1, 
  ttl: 5 * 60 * 1000 // 5 minutes
});

// Get with automatic expiration check
const cached = storage.getItem('cache-key', null, { 
  version: 1, 
  ttl: 5 * 60 * 1000 
});

// Check storage usage
const usage = storage.getUsageInfo();
if (usage && usage.percentage > 80) {
  console.warn('Storage nearly full:', usage);
  storage.cleanup(); // Remove expired items
}
```

### Versioning Strategy

```typescript
// Version 1: Initial schema
interface UserPrefsV1 {
  theme: string;
}

// Version 2: Add new field
interface UserPrefsV2 {
  theme: string;
  language: string; // New field
}

// Migration
const prefs = storage.getItem<UserPrefsV2>(
  'user-prefs',
  { theme: 'light', language: 'en' },
  { version: 2 }
);

// If version mismatch, returns default with new schema
```

---

## 2. Using AsyncHandler

### Retry with Exponential Backoff

```typescript
import { retry, safeAsync, shouldRetryNetworkError } from '@/lib/async-handler';

// Automatic retry for network operations
async function saveData(data: any) {
  return retry(
    async () => {
      const response = await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Save failed');
      return response.json();
    },
    {
      maxRetries: 3,
      backoffMs: 1000,
      maxBackoffMs: 5000,
      shouldRetry: shouldRetryNetworkError,
      errorMessage: 'Failed to save data after retries'
    }
  );
}
```

### Safe Async with Result Type

```typescript
import { safeAsync } from '@/lib/async-handler';

async function loadUserData(userId: string) {
  const result = await safeAsync(
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    },
    { errorMessage: 'Failed to load user data' }
  );

  if (result.success) {
    console.log('User data:', result.data);
    return result.data;
  } else {
    console.error('Error:', result.error);
    // Handle error gracefully
    return null;
  }
}
```

### Timeout Protection

```typescript
import { withTimeout } from '@/lib/async-handler';

async function slowOperation() {
  return withTimeout(
    fetch('/api/slow-endpoint'),
    5000, // 5 second timeout
    'Operation took too long'
  );
}
```

### Batch Operations with Concurrency

```typescript
import { batchAsync } from '@/lib/async-handler';

async function processMany(items: string[]) {
  const results = await batchAsync(
    items,
    async (item) => {
      return fetch(`/api/process/${item}`).then(r => r.json());
    },
    {
      concurrency: 5, // Max 5 concurrent requests
      onProgress: (completed, total) => {
        console.log(`Progress: ${completed}/${total}`);
      }
    }
  );

  // Check results
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`Success: ${successful.length}, Failed: ${failed.length}`);
}
```

### Debounce Async Functions

```typescript
import { debounceAsync } from '@/lib/async-handler';

// Search function that debounces
const debouncedSearch = debounceAsync(
  async (query: string) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  },
  300 // 300ms delay
);

// Use in component
function SearchBox() {
  const [query, setQuery] = useState('');
  
  const handleSearch = async (q: string) => {
    setQuery(q);
    try {
      const results = await debouncedSearch(q);
      // Handle results
    } catch (error) {
      // Catches "Debounced" error when superseded
    }
  };
  
  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

---

## 3. Adding Loading States

### Basic Loading State

```typescript
import { LoadingState } from '@/components/ui/LoadingState';

function DataComponent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return (
    <LoadingState isLoading={loading} label="Loading data...">
      <DataDisplay data={data} />
    </LoadingState>
  );
}
```

### Skeleton Loading

```typescript
import { LoadingState } from '@/components/ui/LoadingState';

function ArticleList() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  return (
    <LoadingState 
      isLoading={loading}
      type="skeleton"
      skeletonCount={5}
      skeletonHeight="h-32"
    >
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </LoadingState>
  );
}
```

### Empty State

```typescript
import { EmptyState } from '@/components/ui/EmptyState';

function SearchResults({ results, onReset }) {
  if (results.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No results found"
        description="Try adjusting your search terms"
        action={{
          label: "Clear Search",
          onClick: onReset
        }}
      />
    );
  }

  return <ResultsList results={results} />;
}
```

---

## 4. Code Splitting Pattern

### Lazy Load Heavy Components

```typescript
import { lazy, Suspense } from 'react';
import { LoadingState } from '@/components/ui/LoadingState';

// Lazy load heavy components
const HeavyDashboard = lazy(() => import('./components/HeavyDashboard'));
const ReportBuilder = lazy(() => import('./features/ReportBuilder'));

function App() {
  return (
    <div>
      <Suspense fallback={<LoadingState isLoading={true} label="Loading dashboard..." />}>
        <HeavyDashboard />
      </Suspense>
      
      <Suspense fallback={<LoadingState isLoading={true} type="skeleton" />}>
        <ReportBuilder />
      </Suspense>
    </div>
  );
}
```

### Route-based Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard'))
  },
  {
    path: '/settings',
    component: lazy(() => import('./pages/Settings'))
  }
];

function Router() {
  return routes.map(route => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <Suspense fallback={<LoadingState isLoading={true} />}>
          <route.component />
        </Suspense>
      }
    />
  ));
}
```

---

## 5. Error Handling Patterns

### Component-Level Error Handling

```typescript
import { safeAsync } from '@/lib/async-handler';
import { useToast } from '@/contexts/ToastContext';

function DataEditor() {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: any) => {
    setSaving(true);
    
    const result = await safeAsync(
      async () => {
        return retry(() => saveData(data), {
          maxRetries: 3,
          shouldRetry: shouldRetryNetworkError
        });
      },
      { suppressLog: false }
    );

    setSaving(false);

    if (result.success) {
      addToast({
        type: 'success',
        message: 'Data saved successfully'
      });
    } else {
      addToast({
        type: 'error',
        message: 'Failed to save data. Please try again.'
      });
    }
  };

  return (
    <button onClick={handleSave} disabled={saving}>
      {saving ? 'Saving...' : 'Save'}
    </button>
  );
}
```

### Global Error Handling

```typescript
// In App.tsx or main provider
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
```

---

## 6. Network Status Handling

### Check Before Operations

```typescript
// Custom hook (to be implemented per Issue #8)
function useNetworkStatus() {
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

// Usage
function MyComponent() {
  const isOnline = useNetworkStatus();
  const { addToast } = useToast();

  const handleAction = async () => {
    if (!isOnline) {
      addToast({
        type: 'warning',
        message: 'You are offline. Action will be queued.'
      });
      return;
    }

    // Proceed with online action
    await performAction();
  };

  return (
    <button onClick={handleAction} disabled={!isOnline}>
      {isOnline ? 'Save' : 'Offline'}
    </button>
  );
}
```

---

## 7. Performance Monitoring

### Track Render Performance

```typescript
// Custom hook (to be implemented per Issue #7)
function usePerformanceMonitor(componentName: string, threshold = 16) {
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

// Usage
function HeavyComponent() {
  usePerformanceMonitor('HeavyComponent', 16);
  
  // Component logic
  return <div>...</div>;
}
```

---

## 8. Testing Checklist

### Before Committing

- [ ] Run `npm run smoke-test` - All tests pass
- [ ] Check browser console - No errors
- [ ] Test loading states - Visible and appropriate
- [ ] Test error states - Handled gracefully
- [ ] Test offline mode - Degrades gracefully
- [ ] Check network tab - No excessive requests
- [ ] Verify localStorage - No corruption, has versions
- [ ] Test on slow connection - Still usable

### Before Deploying

- [ ] Complete manual smoke test checklist
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Verify build size is reasonable (<5MB)
- [ ] Check Lighthouse scores (>90 recommended)
- [ ] Verify error tracking is working
- [ ] Test with browser extensions disabled

---

## 9. Best Practices Summary

### DO ✅

- Use `SafeStorage` for all localStorage operations
- Wrap async operations with retry logic
- Show loading states for all async operations
- Show empty states when no data
- Use code splitting for heavy components
- Handle errors gracefully with user feedback
- Monitor storage usage
- Log errors appropriately
- Test offline scenarios
- Use TypeScript for type safety

### DON'T ❌

- Use raw `localStorage.getItem/setItem`
- Let async operations fail silently
- Show blank screens during loading
- Ignore empty data scenarios
- Load everything upfront
- Show technical error messages to users
- Fill localStorage without limits
- Ignore console errors in dev
- Assume users are always online
- Skip error boundaries

---

## 10. Performance Budget

| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| Initial Bundle Size | <2MB | Code split heavy modules |
| First Contentful Paint | <1.5s | Optimize assets, lazy load |
| Time to Interactive | <3s | Reduce JS, defer non-critical |
| localStorage Usage | <2MB | Cleanup old data, reduce cache |
| API Response Time | <500ms | Add loading states, cache |
| Memory Usage | <100MB | Check for leaks, optimize images |

---

## 11. Troubleshooting

### App Crashes on Load

1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
4. Check for corrupted data in DevTools > Application > Local Storage

### Smoke Tests Failing

1. Ensure all dependencies installed: `npm install`
2. Check file permissions on scripts: `chmod +x scripts/smoke-test.sh`
3. Verify Node.js version: `node --version` (should be 18+)
4. Check for uncommitted changes: `git status`

### Performance Issues

1. Run performance profiler in DevTools
2. Check Network tab for excessive requests
3. Use `usePerformanceMonitor` hook to identify slow components
4. Verify code splitting is working (check Network > JS tab)
5. Check localStorage size: `storage.getUsageInfo()`

---

## 12. Next Steps

1. **Create GitHub Issues**
   - Copy issues from `PERFORMANCE_ISSUES.md`
   - Prioritize based on impact
   - Assign to team members

2. **Implement High Priority Items**
   - Code splitting (#1)
   - Migrate to SafeStorage (#4)
   - Add loading states (#5)

3. **Setup Monitoring**
   - Error tracking (Sentry, LogRocket, etc.)
   - Performance monitoring
   - User analytics

4. **Continuous Improvement**
   - Review performance metrics weekly
   - Address user feedback
   - Keep dependencies updated

---

## Resources

- **Smoke Test Script:** `scripts/smoke-test.sh`
- **Manual Checklist:** `MANUAL_SMOKE_TEST.md`
- **GitHub Issues:** `PERFORMANCE_ISSUES.md`
- **Storage Utility:** `src/lib/storage.ts`
- **Async Handler:** `src/lib/async-handler.ts`
- **UI Components:** `src/components/ui/Loading*.tsx`, `EmptyState.tsx`

---

## Support

For questions or issues:
1. Check this guide first
2. Review the code examples
3. Consult `PERFORMANCE_ISSUES.md` for detailed issue descriptions
4. Open a GitHub issue if problem persists
