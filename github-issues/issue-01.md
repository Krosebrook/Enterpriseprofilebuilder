# CI/CD Pipeline with GitHub Actions

**WSJF:** 9.0 | **Category:** Infrastructure | **Priority:** P1 | **Effort:** 2 days

## Goal

Establish automated CI/CD pipeline using GitHub Actions to enable continuous integration, automated testing, security scanning, and deployment preview for every PR.

## Scope

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

## Acceptance Criteria

- [ ] `.github/workflows/ci.yml` exists and runs on PR events
- [ ] CI workflow runs: `npm install`, `npm run build`, `npm test`
- [ ] Build artifacts cached between runs (node_modules)
- [ ] Dependency scanning with Dependabot or GitHub Security
- [ ] PR deployments generate unique preview URLs
- [ ] All workflows complete in <5 minutes for typical changes
- [ ] Status badges added to README.md
- [ ] Branch protection rules require CI passing before merge

## Negative Cases / Edge Cases

- **Failed build:** CI must fail loudly with clear error messages
- **Flaky tests:** Implement retry logic (max 2 retries)
- **Large dependency changes:** Cache invalidation works correctly
- **Concurrent PRs:** No race conditions in deployments
- **Branch naming:** Works with all valid Git branch names (including special chars)

## Security Constraints

- **Secrets Management:** All API keys stored in GitHub Secrets (never in code)
- **Third-party Actions:** Only use verified actions from trusted publishers
- **Token Permissions:** Use `GITHUB_TOKEN` with minimal required permissions
- **Audit Logging:** All deployments logged with commit SHA, author, timestamp

## Performance Constraints

- CI workflow total runtime <5 minutes
- Preview deployment propagation <2 minutes
- Build cache hit rate >80% for incremental changes
- Maximum workflow concurrency: 10 concurrent jobs

## Verification Steps

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

## Files Likely to Change

- `.github/workflows/ci.yml` (new)
- `.github/workflows/deploy-preview.yml` (new)
- `.github/dependabot.yml` (new)
- `README.md` (add badges)
- `package.json` (add lint script if missing)
- `.gitignore` (add workflow artifacts)

## Related Issues

- Required before: All future PRs
- Enables: Automated testing for #2

## Reference

Full details: `BACKLOG_WSJF_PRIORITIZED.md` - Issue #1
