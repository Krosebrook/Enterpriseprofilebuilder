# Agent PR Checklist

This checklist is designed for GitHub Copilot agents and human developers to ensure high-quality, secure, and performant pull requests.

---

## 📋 Pre-Submission Checklist

### Code Quality
- [ ] All TypeScript strict mode checks pass (no `any`, proper types)
- [ ] Code follows established patterns from `/.github/copilot-instructions.md`
- [ ] Functions have appropriate JSDoc comments for public APIs
- [ ] No unused imports or variables
- [ ] All linting rules pass (`npm run lint`)
- [ ] Code is properly formatted (`npm run format:check`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)

### Testing
- [ ] All existing tests still pass (`npm run test`)
- [ ] New features have E2E tests (Playwright)
- [ ] Edge cases are tested (null/undefined, empty arrays, error states)
- [ ] Manual testing completed for UI changes
- [ ] Tests use `data-testid` attributes for selectors
- [ ] No flaky tests (tests pass consistently)

---

## 🔒 Security Checklist

### Secrets Management
- [ ] No hardcoded secrets (API keys, passwords, tokens, URLs)
- [ ] Environment variables use `VITE_` prefix for client-side
- [ ] `.env.local` and `.env.production` are in `.gitignore`
- [ ] Secrets are accessed via `import.meta.env.VITE_*`
- [ ] Service role keys only used in Edge Functions, never client-side

### Input Validation & Sanitization
- [ ] All user inputs validated before processing
- [ ] User inputs sanitized using `sanitizeInput()` from `/src/security/prompt-injection-defense.ts`
- [ ] No direct use of `innerHTML` with user content (use `textContent`)
- [ ] Form inputs have proper validation (type, length, format)
- [ ] Server-side validation mirrors client-side validation

### Authentication & Authorization
- [ ] Auth tokens validated on server-side (Edge Functions)
- [ ] Supabase Row Level Security (RLS) policies reviewed
- [ ] Client-side only accesses permitted data
- [ ] No privilege escalation paths
- [ ] Session management follows best practices

### Data Protection
- [ ] No PII (Personally Identifiable Information) stored in LocalStorage
- [ ] User IDs are hashed before logging/analytics
- [ ] Sensitive data transmitted over HTTPS only
- [ ] No sensitive data in error messages or logs
- [ ] Data retention policies followed

### Dependencies
- [ ] New dependencies scanned for vulnerabilities (`npm audit`)
- [ ] Dependencies are from trusted sources
- [ ] Dependency versions locked (not using wildcards)
- [ ] License compatibility checked
- [ ] Minimal permissions requested

### Error Handling
- [ ] Errors use custom classes from `/src/lib/errors.ts`
- [ ] User-facing errors don't leak implementation details
- [ ] Stack traces never exposed to end users
- [ ] All errors logged via `/src/lib/logger.ts`
- [ ] Error boundaries catch React errors

---

## ⚡ Performance Checklist

### Bundle Size
- [ ] New dependencies justified (no duplicate functionality)
- [ ] Heavy components lazy-loaded with `React.lazy()`
- [ ] Tree-shaking effective (imports from specific modules)
- [ ] No large JSON files imported directly (use dynamic imports)
- [ ] Bundle size increase < 50KB (check with `npm run build`)

### React Performance
- [ ] Expensive computations memoized with `useMemo()`
- [ ] Callbacks memoized with `useCallback()` when passed to children
- [ ] Pure components wrapped with `React.memo()`
- [ ] No unnecessary re-renders (verified with React DevTools)
- [ ] State updates batched appropriately

### Data Fetching
- [ ] No N+1 query patterns (batch requests where possible)
- [ ] API responses cached appropriately (LocalStorage for user preferences)
- [ ] Stale-while-revalidate pattern used for non-critical data
- [ ] Loading states shown immediately (skeleton screens)
- [ ] Error states handled gracefully with retry mechanisms

### Images & Assets
- [ ] Images optimized (WebP format preferred)
- [ ] Images lazy-loaded below the fold
- [ ] Width and height attributes set (prevent layout shift)
- [ ] Alt text provided for accessibility
- [ ] CDN used for static assets (if applicable)

### Network
- [ ] API calls debounced for search/autocomplete (300ms minimum)
- [ ] WebSocket connections closed properly
- [ ] HTTP/2 multiplexing leveraged (single origin)
- [ ] Compression enabled (gzip/brotli)
- [ ] Cache headers set appropriately

---

## 🧪 Test Checklist

### Unit Tests
- [ ] Business logic has unit tests (if applicable)
- [ ] Utility functions tested with edge cases
- [ ] Error conditions tested
- [ ] Tests are isolated (no shared state)
- [ ] Tests are deterministic (no random data)

### E2E Tests (Playwright)
- [ ] Critical user flows covered
- [ ] Tests use `data-testid` selectors (not CSS classes)
- [ ] Tests wait for elements properly (no fixed waits > 500ms)
- [ ] Tests clean up after themselves
- [ ] Tests run in CI environment

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (ARIA labels)
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Focus indicators visible
- [ ] Forms have proper labels

### Cross-Browser Tests
- [ ] Tested in Chrome/Edge (Chromium)
- [ ] Tested in Firefox (if significant changes)
- [ ] Tested in Safari (if available)
- [ ] Mobile viewport tested (responsive)
- [ ] Touch interactions work on mobile

---

## 🚀 Rollout/Rollback Checklist

### Pre-Deployment
- [ ] Feature flag added if experimental (in `/src/config/app.config.ts`)
- [ ] Database migrations tested (if applicable)
- [ ] Environment variables documented in README
- [ ] Deployment steps documented
- [ ] Rollback plan documented

### Deployment Verification
- [ ] Staging environment deployed successfully
- [ ] Smoke tests pass in staging
- [ ] Performance metrics reviewed (page load time)
- [ ] No new errors in logs
- [ ] Monitoring/alerts configured

### Post-Deployment
- [ ] Production deployment successful
- [ ] Health check endpoints responding
- [ ] Key metrics monitored (error rate, response time)
- [ ] User feedback monitored
- [ ] Analytics tracking verified

### Rollback Plan
- [ ] Previous version tagged in git
- [ ] Rollback procedure documented
- [ ] Database migration rollback tested (if applicable)
- [ ] Rollback can be executed within 5 minutes
- [ ] Team notified of rollback procedure

---

## 🧑‍🔬 Smoke Test Checklist

### Application Start
- [ ] Application loads without console errors
- [ ] No 404 errors for assets
- [ ] No CORS errors
- [ ] Service worker registers (if PWA)
- [ ] Initial page load < 3 seconds

### Navigation
- [ ] Home page renders correctly
- [ ] Navigation menu works
- [ ] All routes load successfully
- [ ] Back/forward buttons work
- [ ] Deep links work (direct URL access)

### Core Features
- [ ] Search functionality works
- [ ] Bookmarks can be added/removed
- [ ] Copy to clipboard works
- [ ] Print functionality works
- [ ] Role selector filters content
- [ ] Responsive on mobile (375px width)

### Data Persistence
- [ ] User preferences saved to LocalStorage
- [ ] Bookmarks persist after reload
- [ ] Analytics events tracked
- [ ] Storage quota not exceeded
- [ ] Old data cleaned up (30-day expiry)

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Offline mode works (if applicable)
- [ ] Error messages user-friendly
- [ ] 404 page displays correctly
- [ ] Error boundaries catch React errors

### Accessibility
- [ ] Tab navigation works
- [ ] Screen reader announces content
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Forms keyboard accessible

---

## 📝 Documentation Checklist

### Code Documentation
- [ ] JSDoc comments for exported functions
- [ ] Complex logic explained with inline comments
- [ ] Type definitions exported and documented
- [ ] Constants documented with purpose
- [ ] No obvious code without explanation

### User Documentation
- [ ] README updated (if setup changed)
- [ ] API docs updated (if endpoints changed)
- [ ] Architecture docs updated (if structure changed)
- [ ] Migration guide provided (if breaking changes)
- [ ] Examples provided for new features

### Developer Documentation
- [ ] Copilot instructions updated (if new patterns)
- [ ] Environment variables documented
- [ ] New npm scripts documented
- [ ] Troubleshooting guide updated
- [ ] Design decisions recorded (ADRs)

---

## 🎯 Definition of Done Summary

A PR is ready to merge when:

1. ✅ All automated checks pass (lint, typecheck, format, tests, build)
2. ✅ All security concerns addressed (no secrets, inputs validated)
3. ✅ Performance impact minimal (no regressions)
4. ✅ Tests cover new code (E2E for user flows)
5. ✅ Documentation updated (code, user, developer)
6. ✅ Code reviewed by at least one team member
7. ✅ Smoke tests pass in staging environment
8. ✅ Rollback plan documented
9. ✅ No unrelated changes (minimal diff)
10. ✅ Branch up to date with main

---

## 🚨 Red Flags - Do Not Merge If:

- ❌ Console errors present in browser
- ❌ TypeScript errors or warnings
- ❌ Tests are failing or skipped
- ❌ Hardcoded secrets found
- ❌ User inputs not validated
- ❌ Bundle size increased > 100KB without justification
- ❌ Breaking changes without migration guide
- ❌ No tests for new features
- ❌ Documentation missing or outdated
- ❌ Code conflicts unresolved

---

## 📚 Resources

- [Copilot Instructions](/.github/copilot-instructions.md)
- [Security Policy](/src/SECURITY.md)
- [Architecture Docs](/src/docs/ARCHITECTURE.md)
- [Testing Guide](/src/docs/TESTING.md)
- [API Documentation](/src/docs/API.md)

---

**Maintained By**: Engineering Team  
**Last Updated**: January 11, 2026  
**Version**: 1.0.0
