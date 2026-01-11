# Role Persistence via localStorage

**WSJF:** 12.0 | **Category:** Feature | **Priority:** P0 | **Effort:** 1 day

## Goal

Remember user's selected role across sessions by persisting to localStorage, eliminating repeated selections and improving UX for returning users.

## Scope

**In Scope:**
- Persist selected role to localStorage
- Load role on app mount
- Update role in real-time across tabs (storage event)
- Default to "All Roles" for first-time users
- Clear role on logout (if auth implemented)

**Out of Scope:**
- Backend role sync (covered in Issue #6)
- Role-based content recommendations

## Acceptance Criteria

- [ ] Selected role saved to localStorage on change
- [ ] Role loaded from localStorage on app mount
- [ ] Role persists across browser sessions
- [ ] Role syncs across tabs (storage event listener)
- [ ] Default role: "All Roles" for new users
- [ ] Tests for persistence logic

## Negative Cases / Edge Cases

- **localStorage unavailable:** Graceful fallback (session-only)
- **Corrupted data:** Validate and reset to default
- **Role no longer exists:** Reset to default (if roles change)
- **Private browsing:** Works in-session, doesn't persist

## Security Constraints

- **XSS:** Sanitize role value before storing
- **Data tampering:** Validate role on load (must be valid role ID)

## Performance Constraints

- Storage operation <1ms
- Load operation <1ms

## Verification Steps

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

## Files Likely to Change

- `src/hooks/useLocalStorage.ts` (already exists, enhance if needed)
- `src/components/RoleSelector.tsx` (add persistence)
- `src/contexts/RoleContext.tsx` (new context)
- `src/providers/AppProvider.tsx` (add RoleContext)
- `src/hooks/useLocalStorage.test.ts` (add tests)

## Related Issues

- Related: #6 (backend sync will build on this)
- Related: #7 (auth logout should clear role)

## Reference

Full details: `BACKLOG_WSJF_PRIORITIZED.md` - Issue #11
