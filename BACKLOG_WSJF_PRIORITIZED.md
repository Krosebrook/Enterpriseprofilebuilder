# Enterprise Profile Builder - WSJF Prioritized Backlog
**Generated:** 2026-01-11  
**Repository:** Krosebrook/Enterpriseprofilebuilder  
**Status:** Ready for GitHub Copilot Agent Implementation

---

## Executive Summary

This backlog was derived from a comprehensive analysis of the Enterprise Profile Builder codebase. The application is a React/TypeScript/Vite-based knowledge portal for Claude AI usage at INT Inc. Current implementation includes content delivery, search, bookmarks, role filtering, and security features. **Key gaps identified:** No authentication/authorization, minimal testing infrastructure, no CI/CD pipeline, missing backend synchronization, no analytics/telemetry, incomplete accessibility compliance, and missing operational runbooks.

**Methodology:** Each issue has been scored using Weighted Shortest Job First (WSJF) = (Business Value + Time Criticality + Risk Reduction/Opportunity Enablement) / Job Size. Issues are agent-friendly with clear scope, acceptance criteria, and verification steps.

---

## A) WSJF PRIORITIZATION TABLE

| Rank | Issue # | Title | BV | TC | RR/OE | Job Size | WSJF | Category |
|------|---------|-------|----|----|-------|----------|------|----------|
| 1 | #1 | CI/CD Pipeline with GitHub Actions | 8 | 9 | 10 | 3 | 9.0 | Infrastructure |
| 2 | #2 | Comprehensive Test Suite (Unit + Integration) | 9 | 8 | 10 | 5 | 5.4 | Testing |
| 3 | #3 | Error Boundary Enhancement & Global Error Handling | 8 | 9 | 8 | 2 | 12.5 | Reliability |
| 4 | #4 | Loading States & Skeleton Screens | 7 | 8 | 6 | 2 | 10.5 | UX |
| 5 | #5 | Analytics & Telemetry Infrastructure | 8 | 6 | 9 | 3 | 7.7 | Observability |
| 6 | #6 | Supabase Backend Integration for Cross-Device Sync | 9 | 5 | 10 | 8 | 3.0 | Backend |
| 7 | #7 | Authentication & Authorization (Supabase Auth) | 10 | 6 | 10 | 8 | 3.25 | Security |
| 8 | #8 | WCAG 2.1 AA Accessibility Audit & Fixes | 7 | 5 | 8 | 5 | 4.0 | Compliance |
| 9 | #9 | Performance Optimization (Bundle Size, Code Splitting) | 6 | 7 | 7 | 3 | 6.7 | Performance |
| 10 | #10 | Fuzzy Search with Fuse.js | 6 | 4 | 5 | 2 | 7.5 | Feature |
| 11 | #11 | Role Persistence via localStorage | 5 | 3 | 4 | 1 | 12.0 | Feature |
| 12 | #12 | Deployment Checklist CSV Export | 5 | 3 | 5 | 2 | 6.5 | Feature |
| 13 | #13 | SEO & Meta Tags Optimization | 4 | 3 | 5 | 2 | 6.0 | Marketing |
| 14 | #14 | Offline Support & Service Worker | 5 | 2 | 6 | 5 | 2.6 | Resilience |
| 15 | #15 | Admin Dashboard for Content Management | 7 | 2 | 8 | 8 | 2.125 | Admin |
| 16 | #16 | User Onboarding Tour (First-Time UX) | 6 | 4 | 5 | 3 | 5.0 | UX |
| 17 | #17 | Documentation: Architecture & Deployment Runbooks | 5 | 6 | 7 | 3 | 6.0 | Docs |
| 18 | #18 | Security Headers & CSP Configuration | 6 | 5 | 8 | 2 | 9.5 | Security |

**Top 5 Issues to Implement First:**
1. **#3** - Error Boundary Enhancement & Global Error Handling (WSJF: 12.5)
2. **#11** - Role Persistence via localStorage (WSJF: 12.0)
3. **#4** - Loading States & Skeleton Screens (WSJF: 10.5)
4. **#18** - Security Headers & CSP Configuration (WSJF: 9.5)
5. **#1** - CI/CD Pipeline with GitHub Actions (WSJF: 9.0)


---

## B) GITHUB ISSUE BODIES (Ready to Paste)

### Issue #1: CI/CD Pipeline with GitHub Actions
**WSJF: 9.0** | **Category:** Infrastructure | **Priority:** P1

#### Goal
Establish automated CI/CD pipeline using GitHub Actions to enable continuous integration, automated testing, security scanning, and deployment preview for every PR.

#### Scope
**In Scope:**
- GitHub Actions workflows for CI (lint, test, build)
- Automated dependency vulnerability scanning
- PR preview deployment (Vercel/Netlify/Cloudflare Pages)
- Build artifact caching
- Status checks enforcement

**Out of Scope:**
- Production deployment automation (manual gate retained)
- Infrastructure as Code (IaC) for cloud resources
- Multi-environment strategies beyond preview

#### Acceptance Criteria
- [ ] `.github/workflows/ci.yml` exists and runs on PR events
- [ ] CI workflow runs: `npm install`, `npm run build`, `npm test`
- [ ] Build artifacts cached between runs (node_modules)
- [ ] Dependency scanning with Dependabot or GitHub Security
- [ ] PR deployments generate unique preview URLs
- [ ] All workflows complete in <5 minutes for typical changes
- [ ] Status badges added to README.md
- [ ] Branch protection rules require CI passing before merge

#### Negative Cases / Edge Cases
- **Failed build:** CI must fail loudly with clear error messages
- **Flaky tests:** Implement retry logic (max 2 retries)
- **Large dependency changes:** Cache invalidation works correctly
- **Concurrent PRs:** No race conditions in deployments
- **Branch naming:** Works with all valid Git branch names (including special chars)

#### Security Constraints
- **Secrets Management:** All API keys stored in GitHub Secrets (never in code)
- **Third-party Actions:** Only use verified actions from trusted publishers
- **Token Permissions:** Use `GITHUB_TOKEN` with minimal required permissions
- **Audit Logging:** All deployments logged with commit SHA, author, timestamp

#### Performance Constraints
- CI workflow total runtime <5 minutes
- Preview deployment propagation <2 minutes
- Build cache hit rate >80% for incremental changes
- Maximum workflow concurrency: 10 concurrent jobs

#### Verification Steps
**Automated:**
```bash
# Trigger CI locally
act -j ci  # Using nektos/act
# Or commit and push to PR
git checkout -b test/ci-validation
git commit --allow-empty -m "test: CI validation"
git push origin test/ci-validation
```

**Manual:**
1. Create test PR with intentional lint error → CI fails ✓
2. Fix error, push → CI passes ✓
3. Check preview URL loads correctly ✓
4. Verify GitHub UI shows status checks ✓
5. Confirm cache reuse in subsequent runs (check logs for cache hit) ✓

#### Files Likely to Change
- `.github/workflows/ci.yml` (new)
- `.github/workflows/deploy-preview.yml` (new)
- `.github/dependabot.yml` (new)
- `README.md` (add badges)
- `package.json` (add lint script if missing)
- `.gitignore` (add workflow artifacts)

---

### Issue #2: Comprehensive Test Suite (Unit + Integration)
**WSJF: 5.4** | **Category:** Testing | **Priority:** P1

#### Goal
Establish comprehensive test coverage (target: 80%+) for critical application features using Vitest for unit tests and extending Playwright for E2E, ensuring confidence in refactoring and preventing regressions.

#### Scope
**In Scope:**
- Unit tests for utilities (`src/utils/`, `src/lib/`)
- Component tests for UI elements (`src/components/ui/`)
- Integration tests for features (search, bookmarks, navigation)
- E2E smoke tests for critical user flows
- Test coverage reporting
- Test setup/teardown utilities

**Out of Scope:**
- Visual regression testing
- Load/performance testing
- Security penetration testing
- Snapshot testing (too brittle for this stage)

#### Acceptance Criteria
- [ ] Vitest configured with TypeScript support
- [ ] Test coverage >80% for `src/utils/`, `src/lib/`
- [ ] Component tests for Button, Card, Modal, SearchBar, RoleSelector
- [ ] Integration tests for: search functionality, bookmark add/remove, role filtering
- [ ] E2E tests extended beyond current 1 spec file (target: 5 critical flows)
- [ ] Coverage report generated (`npm run test:coverage`)
- [ ] Tests run in CI pipeline
- [ ] All tests pass with 0 flakes

#### Negative Cases / Edge Cases
- **Empty state testing:** Search with no results, no bookmarks saved
- **Boundary values:** Very long search queries (1000+ chars)
- **Race conditions:** Rapid clicking bookmark button
- **Browser storage failures:** localStorage unavailable/full
- **Network failures:** Offline mode graceful degradation

#### Security Constraints
- **No secrets in tests:** Use mock data for auth tokens
- **Isolated test environment:** Tests don't interact with production data
- **XSS testing:** Verify sanitization of user inputs in tests
- **Input validation:** Test with malicious payloads (SQL injection patterns, XSS)

#### Performance Constraints
- Unit test suite runs in <10 seconds
- Integration tests run in <30 seconds
- E2E suite runs in <3 minutes
- Tests parallelizable (no shared state dependencies)

#### Verification Steps
**Automated:**
```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Check coverage thresholds
npm run test:coverage -- --reporter=json-summary
# Verify coverage.json shows >80%
```

**Manual:**
1. Introduce intentional bug in search → test fails ✓
2. Fix bug → test passes ✓
3. Check coverage report HTML (`coverage/index.html`) ✓
4. Run E2E in headed mode → visually confirm flows ✓

#### Files Likely to Change
- `vitest.config.ts` (new)
- `src/utils/*.test.ts` (new files)
- `src/lib/*.test.ts` (new files)
- `src/components/ui/*.test.tsx` (new files)
- `src/features/**/*.test.tsx` (new files)
- `src/tests/e2e/*.spec.ts` (expand existing)
- `src/tests/setup.ts` (new test utilities)
- `package.json` (add test scripts)
- `.github/workflows/ci.yml` (add test step)


### Issue #3: Error Boundary Enhancement & Global Error Handling
**WSJF: 12.5** | **Category:** Reliability | **Priority:** P0

#### Goal
Harden error handling across the application with granular error boundaries, automatic error reporting, user-friendly fallbacks, and retry mechanisms to prevent total app crashes and improve debugging.

#### Scope
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

#### Acceptance Criteria
- [ ] Feature-level error boundaries for: Search, Content Viewer, Navigation, Bookmarks
- [ ] Network errors show toast with retry button
- [ ] Unhandled promise rejections caught globally
- [ ] Error boundary fallback shows: error message, reload button, "report issue" link
- [ ] Console errors include: timestamp, component stack, user action context
- [ ] ErrorBoundary component supports custom fallback prop
- [ ] Error state clears when user navigates away
- [ ] Tests for error boundary rendering and reset

#### Negative Cases / Edge Cases
- **Nested errors:** Error in error boundary fallback (should not infinite loop)
- **Async errors:** Errors in useEffect, event handlers caught
- **Network timeout:** Request takes >30s → show timeout error
- **Malformed API response:** Invalid JSON handled gracefully
- **Memory errors:** Large data loads cause OOM → degraded mode

#### Security Constraints
- **No PII in logs:** Sanitize user input before logging
- **Stack trace filtering:** Don't expose internal file paths to users
- **Error messages:** Generic messages to users, detailed logs for devs
- **Rate limiting:** Prevent error log spam (max 10 errors/minute)

#### Performance Constraints
- Error boundary overhead <1ms in happy path
- Error logging non-blocking (async)
- Fallback UI renders in <100ms
- Toast notifications queue (max 3 visible at once)

#### Verification Steps
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

#### Files Likely to Change
- `src/components/ErrorBoundary.tsx` (enhance)
- `src/components/ErrorBoundary.test.tsx` (new)
- `src/components/features/SearchErrorBoundary.tsx` (new)
- `src/components/features/ContentErrorBoundary.tsx` (new)
- `src/lib/errors.ts` (enhance with error classes)
- `src/lib/logger.ts` (structured logging)
- `src/hooks/useErrorHandler.ts` (new)
- `src/App.tsx` (wrap features with boundaries)
- `src/utils/errorReporting.ts` (new)

---

### Issue #4: Loading States & Skeleton Screens
**WSJF: 10.5** | **Category:** UX | **Priority:** P1

#### Goal
Eliminate jarring content shifts and improve perceived performance by implementing skeleton screens and loading indicators for all async operations (content loading, search, navigation).

#### Scope
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

#### Acceptance Criteria
- [ ] Skeleton screens match final content layout (avoid layout shift)
- [ ] Loading indicators appear after 200ms delay (avoid flash)
- [ ] All async buttons show loading state with disabled state
- [ ] Suspense boundaries for lazy-loaded routes
- [ ] Content fades in smoothly (300ms transition)
- [ ] Loading states accessible (aria-busy, aria-live)
- [ ] No CLS (Cumulative Layout Shift) >0.1

#### Negative Cases / Edge Cases
- **Fast connections:** Loading state too brief → no flash of loading
- **Slow connections:** Loading state shows immediately
- **Failed loads:** Loading → Error state transition
- **Cancelled operations:** User navigates away mid-load → cleanup
- **Multiple concurrent loads:** Independent loading states don't conflict

#### Security Constraints
- **Loading state timing:** Don't leak timing information (side-channel attacks)
- **Data loading:** Don't render sensitive data before auth check completes

#### Performance Constraints
- Skeleton components render in <16ms (60fps)
- No layout thrashing (batch DOM reads/writes)
- Skeleton animations use CSS transforms (GPU accelerated)
- Maximum of 3 concurrent animations

#### Verification Steps
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

#### Files Likely to Change
- `src/components/ui/Skeleton.tsx` (new)
- `src/components/ui/Spinner.tsx` (new)
- `src/components/ContentViewer.tsx` (add loading state)
- `src/components/SearchResults.tsx` (add skeleton)
- `src/components/sections/RoleProfiles.tsx` (add skeleton)
- `src/components/sections/DeploymentDashboard.tsx` (add skeleton)
- `src/hooks/useAsyncState.ts` (new)
- `src/App.tsx` (add Suspense boundaries)
- `src/index.css` (add skeleton animations)


### Issue #5: Analytics & Telemetry Infrastructure
**WSJF: 7.7** | **Category:** Observability | **Priority:** P1

#### Goal
Implement privacy-preserving telemetry to track feature adoption, user journeys, and performance metrics, enabling data-driven product decisions without compromising user privacy.

#### Scope
**In Scope:**
- Page view tracking
- Feature usage tracking (search, bookmark, role filter, export)
- Performance metrics (page load time, TTFB, FCP, LCP)
- Error rate tracking
- User flow analytics (heatmaps concept)
- Privacy-first (no PII, no tracking cookies)
- GDPR-compliant opt-in banner

**Out of Scope:**
- User identification/authentication tracking
- A/B testing framework
- Custom event funnels (future)
- Real-time dashboards

#### Acceptance Criteria
- [ ] Analytics provider integrated (PostHog/Plausible/self-hosted)
- [ ] Page views tracked automatically
- [ ] Custom events: `search_performed`, `bookmark_added`, `role_filtered`, `content_copied`, `pdf_exported`
- [ ] Performance metrics sent: FCP, LCP, CLS, TTFB
- [ ] Error events tracked with error type & component
- [ ] Privacy banner shown on first visit with opt-in/opt-out
- [ ] Analytics disabled if user opts out (respected across sessions)
- [ ] No data sent to third parties without consent
- [ ] Analytics dashboard accessible to product team

#### Negative Cases / Edge Cases
- **Opt-out:** All tracking stops immediately, cookies cleared
- **Ad blockers:** Analytics gracefully fails (no console errors)
- **Offline mode:** Events queued and sent when online
- **High-frequency events:** Debounced (max 1 event/second per type)
- **Invalid events:** Validation before sending

#### Security Constraints
- **No PII:** Never track emails, names, IP addresses (anonymize)
- **Consent required:** No tracking before explicit opt-in
- **Data retention:** Max 90 days (configurable)
- **Encryption:** Analytics payloads sent over HTTPS only
- **CSP compliance:** Analytics scripts allowed in CSP

#### Performance Constraints
- Analytics script size <10KB
- Event tracking overhead <5ms
- Non-blocking (async script loading)
- Max 100 events/session (prevent abuse)

#### Verification Steps
**Automated:**
```bash
# Test analytics module
npm run test -- src/utils/analytics.test.ts
```

**Manual:**
1. Open app → Privacy banner appears ✓
2. Accept analytics → Event sent ✓
3. Search term → `search_performed` event logged ✓
4. Add bookmark → `bookmark_added` event logged ✓
5. Check browser DevTools Network → Events sent to analytics endpoint ✓
6. Opt out → No more events sent ✓
7. Check analytics dashboard → Data appears ✓

#### Files Likely to Change
- `src/utils/analytics.ts` (enhance)
- `src/utils/analytics.test.ts` (new)
- `src/components/PrivacyBanner.tsx` (new)
- `src/hooks/useAnalytics.ts` (new)
- `src/contexts/AnalyticsContext.tsx` (new)
- `src/providers/AppProvider.tsx` (add analytics provider)
- `src/App.tsx` (add privacy banner)
- `index.html` (add analytics script tag)
- `.env.example` (add analytics keys)
- `vite.config.ts` (define analytics env vars)

---

### Issue #11: Role Persistence via localStorage
**WSJF: 12.0** | **Category:** Feature | **Priority:** P0

#### Goal
Remember user's selected role across sessions by persisting to localStorage, eliminating repeated selections and improving UX for returning users.

#### Scope
**In Scope:**
- Persist selected role to localStorage
- Load role on app mount
- Update role in real-time across tabs (storage event)
- Default to "All Roles" for first-time users
- Clear role on logout (if auth implemented)

**Out of Scope:**
- Backend role sync (covered in Issue #6)
- Role-based content recommendations

#### Acceptance Criteria
- [ ] Selected role saved to localStorage on change
- [ ] Role loaded from localStorage on app mount
- [ ] Role persists across browser sessions
- [ ] Role syncs across tabs (storage event listener)
- [ ] Default role: "All Roles" for new users
- [ ] Tests for persistence logic

#### Negative Cases / Edge Cases
- **localStorage unavailable:** Graceful fallback (session-only)
- **Corrupted data:** Validate and reset to default
- **Role no longer exists:** Reset to default (if roles change)
- **Private browsing:** Works in-session, doesn't persist

#### Security Constraints
- **XSS:** Sanitize role value before storing
- **Data tampering:** Validate role on load (must be valid role ID)

#### Performance Constraints
- Storage operation <1ms
- Load operation <1ms

#### Verification Steps
**Automated:**
```bash
# Test role persistence
npm run test -- src/hooks/useLocalStorage.test.ts
npm run test -- src/components/RoleSelector.test.tsx
```

**Manual:**
1. Select "Finance" role ✓
2. Refresh page → "Finance" still selected ✓
3. Close browser → Reopen → "Finance" still selected ✓
4. Open second tab → "Finance" selected automatically ✓
5. Change to "Engineering" in tab 1 → Tab 2 updates ✓
6. Clear localStorage → Defaults to "All Roles" ✓

#### Files Likely to Change
- `src/hooks/useLocalStorage.ts` (already exists, enhance if needed)
- `src/components/RoleSelector.tsx` (add persistence)
- `src/contexts/RoleContext.tsx` (new context)
- `src/providers/AppProvider.tsx` (add RoleContext)
- `src/hooks/useLocalStorage.test.ts` (add tests)

---

### Issue #18: Security Headers & CSP Configuration
**WSJF: 9.5** | **Category:** Security | **Priority:** P0

#### Goal
Harden application security by implementing HTTP security headers (CSP, HSTS, X-Frame-Options) and Content Security Policy to prevent XSS, clickjacking, and other web vulnerabilities.

#### Scope
**In Scope:**
- Content Security Policy (CSP) header
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options (DENY)
- X-Content-Type-Options (nosniff)
- Referrer-Policy (strict-origin-when-cross-origin)
- Permissions-Policy
- CSP reporting endpoint (if backend exists)

**Out of Scope:**
- WAF (Web Application Firewall)
- DDoS protection
- Rate limiting (future)

#### Acceptance Criteria
- [ ] CSP header configured (script-src, style-src, img-src, connect-src)
- [ ] CSP allows inline scripts/styles only where necessary (with nonces)
- [ ] HSTS header with max-age=31536000 (1 year)
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy configured (camera, microphone off)
- [ ] CSP violations logged (if reporting endpoint exists)
- [ ] Security headers audit (securityheaders.com A rating)

#### Negative Cases / Edge Cases
- **Inline scripts break:** Add nonces or refactor to external scripts
- **Third-party scripts blocked:** Whitelist necessary domains
- **CSP too strict:** App breaks → Loosen incrementally
- **CSP too loose:** Security gaps → Tighten incrementally

#### Security Constraints
- **CSP nonces:** Regenerate on every request
- **HSTS preload:** Consider adding to preload list
- **Avoid unsafe-inline:** Refactor inline scripts/styles

#### Performance Constraints
- Security headers add <1KB to response
- No performance impact on client

#### Verification Steps
**Automated:**
```bash
# Security headers test
npm run test:security-headers

# Or use curl
curl -I https://your-app.com | grep -E "(Content-Security-Policy|Strict-Transport-Security)"
```

**Manual:**
1. Deploy with security headers ✓
2. Visit securityheaders.com → Enter URL → Score A ✓
3. Check browser DevTools Console → No CSP violations ✓
4. Test in all major browsers → No broken functionality ✓
5. Verify HSTS → Force HTTPS redirect ✓
6. Test iframe embedding → Blocked by X-Frame-Options ✓

#### Files Likely to Change
- `vite.config.ts` (add headers plugin)
- `index.html` (add CSP meta tag for development)
- `src/middleware/security.ts` (new, if backend exists)
- `.htaccess` or `vercel.json` (deployment config)
- `netlify.toml` (if Netlify)
- `docs/SECURITY.md` (document security headers)


### Issue #10: Fuzzy Search with Fuse.js
**WSJF: 7.5** | **Category:** Feature | **Priority:** P1

#### Goal
Improve search UX by implementing fuzzy matching to handle typos, partial matches, and variations, increasing search result relevance and user satisfaction.

#### Scope
**In Scope:**
- Integrate Fuse.js library
- Fuzzy search across all content (features, FAQ, best practices, roles)
- Search result ranking by relevance score
- Highlight matched text in results
- Configurable fuzzy threshold
- Performance optimization for large datasets

**Out of Scope:**
- Full-text search backend (Algolia/Elasticsearch)
- Search suggestions/autocomplete (future)
- Search analytics (covered in Issue #5)

#### Acceptance Criteria
- [ ] Fuse.js installed and configured
- [ ] Search works with typos (e.g., "securtiy" → "security")
- [ ] Partial matches returned (e.g., "deply" → "deployment")
- [ ] Results ranked by relevance (0-1 score)
- [ ] Matched text highlighted in results
- [ ] Search response time <100ms for 1000 items
- [ ] Configurable threshold (0.3-0.5 range)
- [ ] Tests for fuzzy matching

#### Files Likely to Change
- `src/hooks/useSearch.ts` (integrate Fuse.js)
- `src/hooks/useSearch.test.ts` (add fuzzy tests)
- `src/utils/search.ts` (add Fuse.js config)
- `src/components/SearchResults.tsx` (add highlighting)
- `package.json` (add fuse.js dependency)

---

### Issue #6: Supabase Backend Integration for Cross-Device Sync
**WSJF: 3.0** | **Category:** Backend | **Priority:** P2

#### Goal
Enable users to access their bookmarks, progress, and preferences across devices by integrating Supabase as a backend, replacing localStorage-only persistence with cloud synchronization.

#### Scope
**In Scope:**
- Supabase project setup (DB schema, RLS policies)
- Database tables: `users`, `bookmarks`, `progress`, `preferences`
- Sync localStorage → Supabase on user action
- Real-time sync across devices (Supabase Realtime)
- Conflict resolution (last-write-wins)
- Offline-first (localStorage cache, sync when online)

**Out of Scope:**
- Authentication (separate issue #7)
- File storage (for now)
- Custom backend API (use Supabase client directly)

#### Files Likely to Change
- `src/lib/supabase.ts` (new Supabase client)
- `src/services/sync.ts` (new sync service)
- `src/services/bookmarks.ts` (add Supabase calls)
- `src/hooks/useBookmarks.ts` (use sync service)
- `supabase/migrations/001_initial_schema.sql` (new)
- `.env.example` (add Supabase keys)

---

### Issue #7: Authentication & Authorization (Supabase Auth)
**WSJF: 3.25** | **Category:** Security | **Priority:** P2

#### Goal
Implement user authentication using Supabase Auth with magic link/SSO support, enabling personalized experiences, data isolation, and role-based content access.

#### Scope
**In Scope:**
- Supabase Auth integration (magic link, OAuth)
- Login/signup flows
- Session management
- Protected routes (redirect unauthenticated users)
- User profile page
- Logout functionality
- Role-based access control (RBAC) for admin features

#### Files Likely to Change
- `src/pages/Login.tsx` (new)
- `src/pages/Profile.tsx` (new)
- `src/components/AuthProvider.tsx` (new)
- `src/components/ProtectedRoute.tsx` (new)
- `src/hooks/useAuth.ts` (new)
- `src/App.tsx` (add auth routes)

---

### Issue #9: Performance Optimization (Bundle Size, Code Splitting)
**WSJF: 6.7** | **Category:** Performance | **Priority:** P1

#### Goal
Reduce initial bundle size by 50%+ and improve page load times through code splitting, tree shaking, and lazy loading.

#### Acceptance Criteria
- [ ] Main bundle <200KB (gzipped)
- [ ] Initial page load <1.5s (Fast 3G)
- [ ] Lighthouse performance score >90
- [ ] Route-based code splitting: each page <50KB chunk
- [ ] Heavy components lazy loaded (RoleProfiles, Charts)

#### Files Likely to Change
- `vite.config.ts` (add chunk splitting config)
- `src/App.tsx` (add React.lazy for routes)
- `src/components/sections/RoleProfiles.tsx` (lazy load)
- `package.json` (remove unused deps)

---

### Issue #12: Deployment Checklist CSV Export
**WSJF: 6.5** | **Category:** Feature | **Priority:** P2

#### Goal
Enable users to export deployment checklist progress as CSV for reporting to management and integration with project tracking tools.

#### Acceptance Criteria
- [ ] "Export CSV" button on Deployment Dashboard
- [ ] CSV includes columns: Phase, Task, Status, Priority, Completed Date
- [ ] CSV respects current filters (role, phase)
- [ ] File downloaded with timestamp in filename
- [ ] Export completes in <500ms for 100 tasks

#### Files Likely to Change
- `src/utils/csvExport.ts` (new)
- `src/components/sections/DeploymentDashboard.tsx` (add export button)
- `src/hooks/useDeploymentExport.ts` (new)

---

### Issue #8: WCAG 2.1 AA Accessibility Audit & Fixes
**WSJF: 4.0** | **Category:** Compliance | **Priority:** P2

#### Goal
Achieve WCAG 2.1 Level AA compliance to ensure the application is usable by people with disabilities.

#### Acceptance Criteria
- [ ] Lighthouse accessibility score 100
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast ratios >4.5:1
- [ ] Screen reader announces all page sections
- [ ] Focus indicators visible on all elements

#### Files Likely to Change
- `src/components/ui/Button.tsx` (add aria-label)
- `src/components/ui/Modal.tsx` (add focus trap)
- `src/components/Navigation.tsx` (add skip link)
- `src/index.css` (add focus styles)

---

### Issue #16: User Onboarding Tour (First-Time UX)
**WSJF: 5.0** | **Category:** UX | **Priority:** P2

#### Goal
Reduce friction for first-time users by implementing an interactive onboarding tour guiding them through key features.

#### Acceptance Criteria
- [ ] Onboarding modal appears on first visit
- [ ] Tour steps: Welcome → Search → Role Filter → Bookmarks → Deployment
- [ ] "Skip" and "Next/Back" buttons
- [ ] Tour completion saved to localStorage
- [ ] Replay option in user menu

#### Files Likely to Change
- `src/components/OnboardingTour.tsx` (new)
- `src/hooks/useOnboarding.ts` (new)
- `package.json` (add react-joyride)

---

### Issue #17: Documentation: Architecture & Deployment Runbooks
**WSJF: 6.0** | **Category:** Docs | **Priority:** P2

#### Goal
Create comprehensive documentation for developers and operators covering system architecture, setup, deployment, and troubleshooting.

#### Acceptance Criteria
- [ ] `/docs` directory created
- [ ] `docs/ARCHITECTURE.md` documenting system design
- [ ] `docs/DEVELOPMENT.md` with setup instructions
- [ ] `docs/DEPLOYMENT.md` with deployment steps
- [ ] `docs/TROUBLESHOOTING.md` with common issues

#### Files Likely to Change
- `docs/ARCHITECTURE.md` (new)
- `docs/DEVELOPMENT.md` (new)
- `docs/DEPLOYMENT.md` (new)
- `docs/TROUBLESHOOTING.md` (new)
- `CONTRIBUTING.md` (new)

---

### Issue #13: SEO & Meta Tags Optimization
**WSJF: 6.0** | **Category:** Marketing | **Priority:** P2

#### Goal
Improve discoverability and social sharing with comprehensive SEO meta tags and Open Graph tags.

#### Acceptance Criteria
- [ ] Each page has unique title and meta description
- [ ] Open Graph tags for social sharing
- [ ] robots.txt and sitemap.xml
- [ ] Lighthouse SEO score 100

#### Files Likely to Change
- `index.html` (add meta tags)
- `src/components/SEO.tsx` (new)
- `public/robots.txt` (new)
- `public/sitemap.xml` (new)

---

### Issue #14: Offline Support & Service Worker
**WSJF: 2.6** | **Category:** Resilience | **Priority:** P3

#### Goal
Enable basic offline functionality using a service worker to cache static assets and previously viewed content.

#### Acceptance Criteria
- [ ] Service worker registered on app load
- [ ] Static assets cached on install
- [ ] Visited pages cached on request
- [ ] Offline fallback page shown when no cache

#### Files Likely to Change
- `public/service-worker.js` (new)
- `src/utils/registerServiceWorker.ts` (new)
- `src/main.tsx` (register SW)

---

### Issue #15: Admin Dashboard for Content Management
**WSJF: 2.125** | **Category:** Admin | **Priority:** P3

#### Goal
Build an admin dashboard allowing non-technical team members to update content without editing code.

#### Acceptance Criteria
- [ ] Admin dashboard at `/admin` (requires admin role)
- [ ] Content editor with markdown preview
- [ ] CRUD operations for FAQ, Best Practices, Tutorials
- [ ] Changes saved to Supabase
- [ ] Audit log shows user, action, timestamp

#### Files Likely to Change
- `src/pages/admin/Dashboard.tsx` (new)
- `src/pages/admin/ContentEditor.tsx` (new)
- `src/components/admin/MarkdownEditor.tsx` (new)
- `supabase/migrations/004_content_tables.sql` (new)


---

## C) DEPENDENCY ORDERING

### Phase 0: Foundation (Week 1)
**Must complete before any other work:**
- **#18** - Security Headers & CSP Configuration (1 day)
- **#1** - CI/CD Pipeline with GitHub Actions (2 days)

*Rationale:* Security and CI are prerequisites for all future work. Security headers must be in place before any deployment, and CI automates validation of all subsequent PRs.

### Phase 1: Reliability & UX (Week 2)
**Depends on Phase 0:**
- **#3** - Error Boundary Enhancement (2 days, can start immediately after CI)
- **#11** - Role Persistence (1 day, simple, no dependencies)
- **#4** - Loading States (2 days, depends on error boundaries for fallback)

*Rationale:* Core stability features that improve UX without requiring backend changes.

### Phase 2: Testing & Quality (Week 3)
**Depends on Phase 1:**
- **#2** - Comprehensive Test Suite (5 days)

*Rationale:* Tests should cover the enhanced error handling and loading states from Phase 1. Starting tests earlier risks rewriting as error handling evolves.

### Phase 3: Observability (Week 3-4)
**Depends on Phase 0:**
- **#5** - Analytics & Telemetry (3 days, requires CSP to whitelist analytics domain)

*Rationale:* Analytics provides data for prioritizing remaining features. Needs CSP configured to allow analytics scripts.

### Phase 4: Features (Week 4-5)
**Can run in parallel (no dependencies):**
- **#10** - Fuzzy Search (2 days)
- **#12** - Deployment Checklist CSV Export (2 days)
- **#16** - User Onboarding Tour (3 days)

*Rationale:* These are independent feature additions that don't affect each other.

### Phase 5: Backend Integration (Week 5-7)
**Must be sequential:**
1. **#6** - Supabase Backend Integration (8 days, must come first)
2. **#7** - Authentication & Authorization (8 days, depends on #6)

*Rationale:* Auth depends on Supabase setup. Both must be complete before admin dashboard.

### Phase 6: Advanced Features (Week 7-9)
**Depends on Phase 5:**
- **#15** - Admin Dashboard (8 days, depends on #6, #7)
- **#8** - WCAG 2.1 AA Accessibility (5 days, can be done anytime, but easier after all UI settled)
- **#9** - Performance Optimization (3 days, should be last to optimize final bundle)

*Rationale:* Admin dashboard needs auth. Accessibility and performance are best done after all features exist to avoid rework.

### Phase 7: Resilience & Docs (Week 9-10)
**Can run in parallel (low priority):**
- **#14** - Offline Support (5 days)
- **#13** - SEO & Meta Tags (2 days)
- **#17** - Documentation (3 days)

*Rationale:* These are polish items that can be added anytime without blocking other work.

---

## Summary of Recommendations

### Immediate Start (Week 1)
1. Issue #18 - Security Headers (1 day)
2. Issue #1 - CI/CD Pipeline (2 days)
3. Issue #3 - Error Boundaries (2 days)
4. Issue #11 - Role Persistence (1 day)

### Quick Wins (High WSJF, Low Effort)
- **#11** (WSJF: 12.0, 1 day) - Role Persistence
- **#3** (WSJF: 12.5, 2 days) - Error Boundaries
- **#4** (WSJF: 10.5, 2 days) - Loading States
- **#18** (WSJF: 9.5, 1 day) - Security Headers

### High-Value, Longer-Term
- **#2** - Tests (5 days, WSJF: 5.4) - Critical for maintainability
- **#6 + #7** - Backend + Auth (16 days combined, WSJF: ~3.1) - Unlocks cross-device features

### Deferred (Low WSJF)
- **#14** - Offline Support (WSJF: 2.6)
- **#15** - Admin Dashboard (WSJF: 2.125)

---

## Repo-Specific Context

### Current Architecture
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Radix UI components
- **State:** React Context (Navigation, Toast) + Zustand (data)
- **Storage:** localStorage only (no backend currently)
- **Testing:** 2 test files (1 unit, 1 E2E with Playwright)
- **Build:** Vite with SWC (fast builds)
- **Security:** Prompt injection defense implemented, but no CSP/headers

### Current Features (From Repo Analysis)
✅ **Implemented:**
- Content delivery (features, FAQ, deployment, best practices, roles)
- Search functionality (basic, no fuzzy matching)
- Bookmarks (localStorage only)
- Role filtering
- Copy to clipboard
- Print functionality
- Interactive tutorials
- Deployment phase tracking
- Security: Prompt injection defense system
- Error boundary (basic, root-level only)
- Toast notifications
- Dark mode support
- Keyboard shortcuts (Cmd+K search)

❌ **Missing (Identified Gaps):**
- No authentication/authorization
- No backend (all data static)
- No CI/CD pipeline (no .github/workflows)
- Minimal test coverage (<10%)
- No analytics/telemetry
- No accessibility audit
- No performance optimization
- No SEO meta tags
- No offline support
- No admin panel
- No deployment runbooks
- No security headers (CSP, HSTS, etc.)

### Key Files for Agent Reference
- `src/App.tsx` - Main application entry
- `src/providers/AppProvider.tsx` - Context providers
- `src/components/ErrorBoundary.tsx` - Error handling (needs enhancement)
- `src/hooks/useLocalStorage.ts` - Storage abstraction
- `src/utils/search.ts` - Search logic (needs Fuse.js)
- `src/data/` - Static content definitions
- `src/security/prompt-injection-defense.ts` - Security implementation (TODO markers present)
- `vite.config.ts` - Build configuration
- `package.json` - Dependencies (no test/lint scripts yet)

### Technical Debt Markers Found
- `src/security/prompt-injection-defense.ts:348` - TODO: Send notification to security team
- `src/security/prompt-injection-defense.ts:358` - TODO: Implement approval workflow
- `src/security/prompt-injection-defense.ts:571` - TODO: Integrate with actual Claude API
- `src/security/prompt-injection-defense.ts:582` - TODO: Send to Sentry or security monitoring system

---

## Final Notes

This backlog represents 18 discrete, agent-executable issues totaling approximately **70-80 person-days** of work. Each issue is scoped to be completable in 1-8 days by a GitHub Copilot coding agent with minimal ambiguity.

**WSJF prioritization ensures:**
- Highest-risk items (security, CI/CD) addressed first
- Quick wins (role persistence, error boundaries) delivered early
- Large efforts (backend, auth) deferred until foundation is solid
- Dependencies clearly mapped to prevent blocking

**Agent-Friendly Design:**
- Clear acceptance criteria (checkbox format)
- Explicit file lists (no guessing)
- Verification commands (copy-paste ready)
- Negative cases documented (edge case handling)
- Security/performance constraints explicit

**Next Steps:**
1. Copy each issue section (starting with "### Issue #X") into GitHub Issues UI
2. Label with category (Infrastructure, Testing, Security, etc.)
3. Assign priority (P0-P3) and WSJF score in issue description
4. Link dependencies in GitHub (e.g., Issue #7 depends on #6)
5. Start with Phase 0 issues (#18, #1)

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-11  
**Prepared For:** GitHub Copilot Coding Agent  
**Prepared By:** Autonomous Agent (Backlog Extraction Task)
