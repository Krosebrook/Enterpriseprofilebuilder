# Security Hardening GitHub Issues
## Agent-Friendly Issue Templates

**Created:** 2026-01-11  
**Sprint:** Security Hardening - Auth/Input/Secrets Tightening  
**Team:** INT Inc Security & Engineering

---

## Summary

These 5 issues provide a complete security hardening roadmap targeting the most critical security gaps identified in the threat model:

| # | Title | Priority | Effort | Impact |
|---|-------|----------|--------|--------|
| 1 | Add Security Headers to HTML and Vite Configuration | P1 | 2-4h | HIGH |
| 2 | Enable Dependabot and Automated Dependency Scanning | P2 | 1-2h | MEDIUM |
| 3 | Implement Enhanced Rate Limiting and Request Throttling | P2 | 4-6h | MEDIUM |
| 4 | Add Session Management and CSRF Protection (Auth Prep) | P3 | 8-12h | LOW |
| 5 | Implement Security Event Logging and Monitoring | P2 | 6-8h | HIGH |

**Total Effort:** 21-32 hours (3-4 sprint weeks)

---

## Issue #1: Add Security Headers to HTML and Vite Configuration

### Priority: P1 (High)
### Labels: `security`, `configuration`, `P1`
### Effort: 2-4 hours

### Goal
Implement Content Security Policy (CSP) and other security headers to protect against XSS, clickjacking, and MIME-sniffing attacks.

### Scope
- Add security headers to `index.html`
- Configure Vite to inject security headers
- Implement CSP with nonce-based script approval
- Add X-Frame-Options, X-Content-Type-Options, Referrer-Policy

### Acceptance Criteria
- [ ] Security meta tags in index.html (CSP, X-Frame-Options, etc.)
- [ ] Vite config adds headers in production
- [ ] CSP allows legitimate scripts only
- [ ] No CSP violations in console
- [ ] Verified with security headers testing tool

### Files Likely to Change
- `index.html`
- `vite.config.ts`
- `src/config/app.config.ts`

### Verification
```bash
npm run build
npx serve build
curl -I http://localhost:3000
# Check for security headers
```

---

## Issue #2: Enable Dependabot and Automated Dependency Scanning

### Priority: P2 (Medium)
### Labels: `security`, `dependencies`, `automation`, `P2`
### Effort: 1-2 hours

### Goal
Enable GitHub Dependabot to automatically detect and fix dependency vulnerabilities.

### Scope
- Configure Dependabot for npm dependencies
- Set up automated security update PRs
- Configure vulnerability alerts
- Add dependency scanning to CI/CD
- Create policy for reviewing security updates

### Acceptance Criteria
- [ ] `.github/dependabot.yml` configuration created
- [ ] Dependabot alerts enabled in repository settings
- [ ] Automated PRs for vulnerable dependencies
- [ ] CI/CD runs `npm audit` on every commit
- [ ] Documentation on security update policy
- [ ] No critical/high vulnerabilities in dependencies

### Files Likely to Change
- `.github/dependabot.yml` (new)
- `docs/DEPENDENCY_POLICY.md` (new)
- `README.md` (add badge)

### Verification
```bash
gh api repos/OWNER/REPO/vulnerability-alerts
npm audit
```

---

## Issue #3: Implement Enhanced Rate Limiting and Request Throttling

### Priority: P2 (Medium)
### Labels: `security`, `api`, `performance`, `P2`
### Effort: 4-6 hours

### Goal
Implement robust client-side and server-side rate limiting to prevent API abuse.

### Scope
- Enhance existing client-side rate limiter
- Add per-endpoint rate limiting
- Implement exponential backoff for retries
- Add rate limit headers to responses
- Create user-facing rate limit notifications

### Acceptance Criteria
- [ ] Enhanced RateLimiter with per-endpoint limits
- [ ] Exponential backoff for failed requests
- [ ] User-friendly rate limit error messages
- [ ] Rate limit status displayed in UI
- [ ] Monitoring dashboard for violations
- [ ] Documentation on rate limit policies

### Files Likely to Change
- `src/lib/rate-limiter.ts` (new)
- `src/lib/api/chat.ts`
- `src/lib/api/architect.ts`
- `src/components/RateLimitBanner.tsx` (new)

### Verification
```bash
# Send 15 rapid requests
# Verify rate limit after 10
# Check exponential backoff
```

---

## Issue #4: Add Session Management and CSRF Protection (Auth Prep)

### Priority: P3 (Low - Future Enhancement)
### Labels: `security`, `auth`, `future`, `P3`
### Effort: 8-12 hours

### Goal
Prepare application for future authentication by implementing session management infrastructure and CSRF protection.

### Scope
- Design session management architecture
- Implement secure cookie handling
- Add CSRF token generation and validation
- Create auth middleware framework
- Document auth integration guide

### Acceptance Criteria
- [ ] Session management hooks created
- [ ] CSRF token middleware implemented
- [ ] Secure cookie configuration (HttpOnly, Secure, SameSite)
- [ ] Auth context provider (anonymous user for now)
- [ ] Documentation on enabling auth
- [ ] No breaking changes to current functionality

### Files Likely to Change
- `src/contexts/AuthContext.tsx` (new)
- `src/lib/auth/session.ts` (new)
- `src/lib/auth/csrf.ts` (new)
- `docs/AUTH_INTEGRATION_GUIDE.md` (new)

### Verification
```bash
# Check cookie flags in DevTools
# Test CSRF validation
# Test session expiration
```

---

## Issue #5: Implement Security Event Logging and Monitoring

### Priority: P2 (Medium)
### Labels: `security`, `monitoring`, `observability`, `P2`
### Effort: 6-8 hours

### Goal
Enhance existing logger to capture security events and integrate with monitoring tools.

### Scope
- Extend logger with security event types
- Add structured logging for security events
- Integrate with Sentry or similar service
- Create security event dashboard
- Implement alerting for critical events
- Add log retention and rotation policies

### Acceptance Criteria
- [ ] SecurityLogger class with event taxonomy
- [ ] Integration with Sentry or CloudWatch
- [ ] Real-time alerts for critical events
- [ ] Security dashboard showing key metrics
- [ ] Log retention policy (90 days)
- [ ] Correlation IDs for request tracking
- [ ] PII scrubbing in logs

### Files Likely to Change
- `src/lib/security-logger.ts` (new)
- `src/lib/monitoring.ts` (new)
- `src/lib/logger.ts`
- `docs/SECURITY_MONITORING.md` (new)

### Verification
```bash
npm install @sentry/react
# Configure VITE_SENTRY_DSN
# Trigger security event
# Check Sentry dashboard
```

---

## Implementation Priority

**Recommended Order:**
1. **Issue #1** (Security headers) - Quick win, high impact
2. **Issue #2** (Dependabot) - Low effort, continuous benefit
3. **Issue #5** (Security logging) - Enables monitoring
4. **Issue #3** (Rate limiting) - Prevents abuse
5. **Issue #4** (Auth prep) - Future-proofing, lowest priority

---

## Additional Context

### Current Security Status
✅ **Implemented This Sprint:**
- Environment variable management (env.config.ts)
- Input validation schemas (validation.ts)
- CI/CD secret scanning (security-scan.yml)
- .env.example template
- .gitignore for sensitive files
- Threat model documentation

⚠️ **Gaps to Address (These Issues):**
- Security headers not enforced
- No automated dependency scanning
- Basic rate limiting only
- No auth infrastructure
- Limited security monitoring

### Threat Model Alignment

| Threat | Current Status | Addressed By |
|--------|---------------|--------------|
| T-1: XSS | Partial | Issue #1 (CSP) |
| T-2: Prompt Injection | ✅ Mitigated | N/A (existing) |
| T-3: Secrets Exposure | ✅ Fixed | N/A (completed) |
| T-4: Dependency Vulns | ⚠️ Manual only | Issue #2 |
| T-5: Input Validation | ✅ Fixed | N/A (completed) |
| T-6: State Tampering | Acceptable | N/A |
| T-7: Rate Limiting | ⚠️ Basic | Issue #3 |
| T-8: CSRF | N/A (no auth) | Issue #4 |

### References
- Threat Model: `docs/THREAT_MODEL.md`
- Security Policy: `src/SECURITY.md`
- Environment Config: `src/config/env.config.ts`
- Validation: `src/lib/validation.ts`
- CI Security: `.github/workflows/security-scan.yml`
