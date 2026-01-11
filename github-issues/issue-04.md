# Loading States & Skeleton Screens

**WSJF:** 10.5 | **Category:** UX | **Priority:** P1 | **Effort:** 2 days

## Goal

Eliminate jarring content shifts and improve perceived performance by implementing skeleton screens and loading indicators for all async operations (content loading, search, navigation).

## Scope

**In Scope:**
- Skeleton screens for: Content Viewer, Search Results, Role Profiles, Deployment Dashboard
- Loading spinners for buttons (save, bookmark, copy)
- Suspense boundaries for code splitting
- Progressive enhancement (show partial content while loading)
- Loading state transitions (smooth fade-ins)

**Out of Scope:**
- Optimistic UI updates (future enhancement)
- Prefetching/preloading strategies
- Image lazy loading (nice-to-have)

## Acceptance Criteria

- [ ] Skeleton screens match final content layout (avoid layout shift)
- [ ] Loading indicators appear after 200ms delay (avoid flash)
- [ ] All async buttons show loading state with disabled state
- [ ] Suspense boundaries for lazy-loaded routes
- [ ] Content fades in smoothly (300ms transition)
- [ ] Loading states accessible (aria-busy, aria-live)
- [ ] No CLS (Cumulative Layout Shift) >0.1

## Negative Cases / Edge Cases

- **Fast connections:** Loading state too brief → no flash of loading
- **Slow connections:** Loading state shows immediately
- **Failed loads:** Loading → Error state transition
- **Cancelled operations:** User navigates away mid-load → cleanup
- **Multiple concurrent loads:** Independent loading states don't conflict

## Security Constraints

- **Loading state timing:** Don't leak timing information (side-channel attacks)
- **Data loading:** Don't render sensitive data before auth check completes

## Performance Constraints

- Skeleton components render in <16ms (60fps)
- No layout thrashing (batch DOM reads/writes)
- Skeleton animations use CSS transforms (GPU accelerated)
- Maximum of 3 concurrent animations

## Verification Steps

**Automated:**
```bash
# Test loading states
npm run test -- --grep="loading"

# Lighthouse performance score
npm run lighthouse -- --only-categories=performance
```

**Manual:**
1. Throttle network to Slow 3G in DevTools ✓
2. Navigate to Content Viewer → Skeleton appears ✓
3. Content loads → Smooth fade-in ✓
4. Click bookmark → Button shows spinner ✓
5. Search term → Results skeleton shows ✓
6. Check Chrome DevTools → CLS score <0.1 ✓

## Files Likely to Change

- `src/components/ui/Skeleton.tsx` (new)
- `src/components/ui/Spinner.tsx` (new)
- `src/components/ContentViewer.tsx` (add loading state)
- `src/components/SearchResults.tsx` (add skeleton)
- `src/components/sections/RoleProfiles.tsx` (add skeleton)
- `src/components/sections/DeploymentDashboard.tsx` (add skeleton)
- `src/hooks/useAsyncState.ts` (new)
- `src/App.tsx` (add Suspense boundaries)
- `src/index.css` (add skeleton animations)

## Related Issues

- Depends on: #3 (error boundaries for failed loads)
- Related: #9 (performance optimization)

## Reference

Full details: `BACKLOG_WSJF_PRIORITIZED.md` - Issue #4
