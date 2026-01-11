# Error Boundary Enhancement & Global Error Handling

**WSJF:** 12.5 | **Category:** Reliability | **Priority:** P0 | **Effort:** 2 days

## Goal

Harden error handling across the application with granular error boundaries, automatic error reporting, user-friendly fallbacks, and retry mechanisms to prevent total app crashes and improve debugging.

## Scope

**In Scope:**
- Multiple error boundaries at feature level (not just app root)
- Network error handling with retry logic
- User-facing error messages (actionable, non-technical)
- Error logging to console (structured logs)
- Toast notifications for recoverable errors
- Fallback UI components

**Out of Scope:**
- External error tracking service (Sentry) integration (future issue)
- Backend error aggregation
- Historical error analytics

## Acceptance Criteria

- [ ] Feature-level error boundaries for: Search, Content Viewer, Navigation, Bookmarks
- [ ] Network errors show toast with retry button
- [ ] Unhandled promise rejections caught globally
- [ ] Error boundary fallback shows: error message, reload button, "report issue" link
- [ ] Console errors include: timestamp, component stack, user action context
- [ ] ErrorBoundary component supports custom fallback prop
- [ ] Error state clears when user navigates away
- [ ] Tests for error boundary rendering and reset

## Negative Cases / Edge Cases

- **Nested errors:** Error in error boundary fallback (should not infinite loop)
- **Async errors:** Errors in useEffect, event handlers caught
- **Network timeout:** Request takes >30s → show timeout error
- **Malformed API response:** Invalid JSON handled gracefully
- **Memory errors:** Large data loads cause OOM → degraded mode

## Security Constraints

- **No PII in logs:** Sanitize user input before logging
- **Stack trace filtering:** Don't expose internal file paths to users
- **Error messages:** Generic messages to users, detailed logs for devs
- **Rate limiting:** Prevent error log spam (max 10 errors/minute)

## Performance Constraints

- Error boundary overhead <1ms in happy path
- Error logging non-blocking (async)
- Fallback UI renders in <100ms
- Toast notifications queue (max 3 visible at once)

## Verification Steps

**Automated:**
```bash
# Run error handling tests
npm run test -- --grep="error"

# Test error boundary
npm run test -- src/components/ErrorBoundary.test.tsx
```

**Manual:**
1. Simulate component error → Error boundary fallback shows ✓
2. Click reload → App recovers ✓
3. Simulate network error → Toast appears with retry ✓
4. Click retry → Request retries successfully ✓
5. Check console logs → Structured error logged ✓
6. Navigate to different section → Error state clears ✓

## Files Likely to Change

- `src/components/ErrorBoundary.tsx` (enhance)
- `src/components/ErrorBoundary.test.tsx` (new)
- `src/components/features/SearchErrorBoundary.tsx` (new)
- `src/components/features/ContentErrorBoundary.tsx` (new)
- `src/lib/errors.ts` (enhance with error classes)
- `src/lib/logger.ts` (structured logging)
- `src/hooks/useErrorHandler.ts` (new)
- `src/App.tsx` (wrap features with boundaries)
- `src/utils/errorReporting.ts` (new)

## Related Issues

- Blocks: #2 (tests should cover error handling)
- Related: #5 (error tracking telemetry)

## Reference

Full details: `BACKLOG_WSJF_PRIORITIZED.md` - Issue #3
