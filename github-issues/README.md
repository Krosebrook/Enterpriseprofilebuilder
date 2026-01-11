# GitHub Issues - Ready to Paste

This directory contains 18 individual issue files ready to be copied and pasted directly into GitHub Issues.

## How to Use

1. Go to https://github.com/Krosebrook/Enterpriseprofilebuilder/issues/new
2. Open the corresponding `issue-XX.md` file
3. Copy the entire contents
4. Paste into GitHub Issue form
5. Add labels: Priority (P0-P3), Category, WSJF score
6. Submit issue

## Recommended Order

**Start with these 5 (Week 1):**
1. `issue-18.md` - Security Headers (P0, 1 day)
2. `issue-01.md` - CI/CD Pipeline (P1, 2 days)
3. `issue-03.md` - Error Boundaries (P0, 2 days)
4. `issue-11.md` - Role Persistence (P0, 1 day)
5. `issue-04.md` - Loading States (P1, 2 days)

**Then continue with:**
- Week 2-3: issues 2, 5
- Week 4-5: issues 10, 12, 16
- Week 5-7: issues 6, 7
- Week 7-9: issues 15, 8, 9
- Week 9-10: issues 14, 13, 17

## Labels to Add

**Priority:**
- P0 (Critical): #3, #11, #18
- P1 (High): #1, #2, #4, #5, #9, #10
- P2 (Medium): #6, #7, #8, #12, #13, #16, #17
- P3 (Low): #14, #15

**Category:**
- Infrastructure: #1
- Testing: #2
- Reliability: #3
- UX: #4, #16
- Observability: #5
- Backend: #6
- Security: #7, #18
- Compliance: #8
- Performance: #9
- Feature: #10, #11, #12
- Marketing: #13
- Resilience: #14
- Admin: #15
- Docs: #17

**WSJF Score:** Add as label (e.g., "WSJF: 12.5")

## Issue Dependencies

Track these in GitHub issue links:

- #7 depends on #6
- #15 depends on #6, #7
- #5 depends on #18 (CSP config)
- #2 depends on #3, #4 (test error/loading states)

All issues reference: `BACKLOG_WSJF_PRIORITIZED.md` for full context.
