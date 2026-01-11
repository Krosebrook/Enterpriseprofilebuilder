# Security Headers & CSP Configuration

**WSJF:** 9.5 | **Category:** Security | **Priority:** P0 | **Effort:** 1 day

## Goal

Harden application security by implementing HTTP security headers (CSP, HSTS, X-Frame-Options) and Content Security Policy to prevent XSS, clickjacking, and other web vulnerabilities.

## Scope

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

## Acceptance Criteria

- [ ] CSP header configured (script-src, style-src, img-src, connect-src)
- [ ] CSP allows inline scripts/styles only where necessary (with nonces)
- [ ] HSTS header with max-age=31536000 (1 year)
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy configured (camera, microphone off)
- [ ] CSP violations logged (if reporting endpoint exists)
- [ ] Security headers audit (securityheaders.com A rating)

## Negative Cases / Edge Cases

- **Inline scripts break:** Add nonces or refactor to external scripts
- **Third-party scripts blocked:** Whitelist necessary domains
- **CSP too strict:** App breaks → Loosen incrementally
- **CSP too loose:** Security gaps → Tighten incrementally

## Security Constraints

- **CSP nonces:** Regenerate on every request
- **HSTS preload:** Consider adding to preload list
- **Avoid unsafe-inline:** Refactor inline scripts/styles

## Performance Constraints

- Security headers add <1KB to response
- No performance impact on client

## Verification Steps

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

## Files Likely to Change

- `vite.config.ts` (add headers plugin)
- `index.html` (add CSP meta tag for development)
- `src/middleware/security.ts` (new, if backend exists)
- `.htaccess` or `vercel.json` (deployment config)
- `netlify.toml` (if Netlify)
- `docs/SECURITY.md` (document security headers)

## Related Issues

- Blocks: #5 (analytics needs CSP whitelist)
- Related: #7 (auth cookies need secure flags)

## Reference

Full details: `BACKLOG_WSJF_PRIORITIZED.md` - Issue #18
