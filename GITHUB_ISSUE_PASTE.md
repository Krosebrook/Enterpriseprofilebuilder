# GitHub Issue - Ready to Paste

## Issue Title
```
Implement In-App Notification Center with Real-time Updates
```

## Labels to Add
```
enhancement, feature, ui, high-priority
```

## Issue Body (Copy Everything Below)

---

## 🎯 W: What (Desired Change)

Implement a comprehensive, user-facing **Notification Center** that provides users with real-time system alerts, deployment updates, agent status changes, and security warnings. The feature must integrate seamlessly with the existing Enterprise Profile Builder architecture, leveraging the already-defined `Notification` interface in `src/types/domain.ts`.

### Core Requirements:

1. **Notification Bell Icon** in main header with unread count badge
2. **Notification Panel** (slide-out drawer) with:
   - Notifications grouped by type (info, success, warning, error)
   - Timestamp for each notification
   - Mark as read/unread functionality
   - Clear all and delete individual notifications
   - Action buttons where applicable
3. **Notification Store** using Zustand for state management
4. **Persistence** using localStorage
5. **Filtering** by type and read/unread status
6. **Integration Points**:
   - Agent Builder: Notify when agents saved/deleted or test runs complete
   - Deployment: Alert on phase status changes or task completions
   - Operations: Warning for system health degradation
   - Security: Critical alerts for DLP triggers or compliance violations

---

## 🚫 R: Rules (Constraints & Non-Goals)

### Constraints:
- ✅ **Client-side only** - No backend changes, no Supabase real-time
- ✅ **Existing stack only** - React, TypeScript, Zustand, Radix UI (already in package.json)
- ✅ **No new dependencies** - All required packages already installed
- ✅ **Mobile responsive** - Works at 375px+ with 44x44px touch targets
- ✅ **WCAG 2.1 AA compliant** - Full keyboard navigation, ARIA labels, screen reader support

### Non-Goals (Future Work):
- ❌ Real-time backend notifications
- ❌ User notification preferences UI
- ❌ Email digests or scheduled summaries
- ❌ Third-party integrations (Slack, Teams)
- ❌ Notification templates or admin management

### Security:
- 🔒 **No secrets in notifications** - Never include API keys, tokens, passwords, PII
- 🔒 **Input sanitization** - All text sanitized to prevent XSS
- 🔒 **Storage limits** - Max 100 notifications to prevent localStorage abuse
- 🔒 **Rate limiting** - Prevent spam (max 1 duplicate per 5 seconds)

### Performance:
- ⚡ Panel opens in <200ms
- ⚡ Auto-prune notifications >30 days old
- ⚡ 60fps animations using CSS transforms
- ⚡ Memory-efficient localStorage management

---

## ✅ A: Acceptance Criteria

### AC-1: Bell Icon Display
- **Given** user on any page  
- **When** they view the header  
- **Then** see bell icon in top-right with red badge showing unread count (if >0)

### AC-2: Notification Panel
- **Given** user clicks bell  
- **When** panel opens  
- **Then** see 400px-wide drawer (desktop) or full-width (mobile) with notifications in reverse chronological order

### AC-3: Notification Card Display
Each notification shows:
- Type icon with color (Info=blue, Success=green, Warning=amber, Error=red)
- Bold title (16px)
- Message (14px, multi-line)
- Relative timestamp ("2 minutes ago")
- Unread indicator (blue dot)
- Delete button (on hover)
- Optional action button

### AC-4: Mark as Read/Unread
- **Given** user clicks notification card  
- **Then** marked as read, blue dot disappears, unread count decrements  
- **And** right-click shows "Mark as Unread" option

### AC-5: Delete Notifications
- **Given** user hovers over notification  
- **When** clicks trash icon  
- **Then** notification removed with fade-out animation, deleted from localStorage

### AC-6: Clear All
- **Given** panel open with notifications  
- **When** clicks "Clear All"  
- **Then** confirmation dialog appears  
- **And** if confirmed, all notifications deleted

### AC-7: Filter Notifications
- **Given** panel open  
- **When** clicks filter dropdown  
- **Then** see options: All, Unread, Info, Success, Warning, Error  
- **And** notifications filtered accordingly

### AC-8: Notification Actions
- **Given** notification has action button  
- **When** user clicks action  
- **Then** navigates to appropriate section, notification marked as read, panel closes

### AC-9: Agent Builder Integration
- **Given** user saves/deletes agent  
- **Then** success/info notification added with agent name, "View Agent" action button

### AC-10: Deployment Integration
- **Given** deployment phase completes or task blocked  
- **Then** success/warning notification added with "View Deployment" action

### AC-11: System Health Integration
- **Given** system health degrades or goes down  
- **Then** warning/error notification added with "View Status" action

### AC-12: Persistence
- **Given** user has unread notifications  
- **When** closes and reopens browser  
- **Then** all notifications and read/unread status preserved

### AC-13: Auto-Pruning
- **Given** 100 notifications in storage  
- **When** new notification added  
- **Then** oldest automatically deleted  
- **And** notifications >30 days auto-removed on app load

### AC-14: Keyboard Accessibility
- Tab through all interactive elements
- Enter opens/closes panel
- Escape closes panel
- All actions keyboard-accessible

### AC-15: Mobile Responsive
- Panel full-width on mobile (375px)
- Touch targets ≥44x44px
- Smooth scrolling, no horizontal overflow

---

## 🛠️ P: Plan (Implementation Steps)

### Files to Create (10 new):
1. `src/features/notifications/hooks/useNotificationStore.ts` - Zustand store with persist
2. `src/features/notifications/components/NotificationPanel.tsx` - Main panel UI
3. `src/features/notifications/components/NotificationCard.tsx` - Individual card
4. `src/features/notifications/components/NotificationBell.tsx` - Bell icon
5. `src/features/notifications/README.md` - Documentation
6. `src/utils/sanitize.ts` - XSS prevention
7. `src/features/notifications/hooks/useNotificationStore.test.ts` - Unit tests
8. `src/features/notifications/components/NotificationPanel.test.tsx` - Component tests
9. `src/tests/e2e/notifications.spec.ts` - E2E tests
10. `src/features/notifications/index.ts` - Barrel export

### Files to Modify (4):
1. `src/components/layout/MainLayout.tsx` - Add bell and panel
2. `src/features/agents/AgentBuilder.tsx` - Add notification triggers
3. `src/features/deployment/Deployment.tsx` - Add notification triggers
4. `src/features/dashboard/Dashboard.tsx` - Add system health notifications
5. `src/CHANGELOG.md` - Document new feature

### Implementation Steps (6h 15min):

1. **Create Notification Store** (30min)
   - Zustand with persist middleware
   - Actions: add, markAsRead, delete, clearAll, setFilter
   - Auto-prune: >100 items, >30 days
   - Rate limiting: duplicate prevention

2. **Create UI Components** (2h)
   - NotificationPanel with Radix Dialog
   - NotificationCard with type-based styling
   - NotificationBell with badge
   - Use Lucide icons, Tailwind CSS

3. **Integrate into App** (1h)
   - Add bell to MainLayout header
   - Wire up notification triggers in Agent Builder, Deployment, Dashboard
   - Add sanitization utility

4. **Testing** (2h 30min)
   - Unit tests for store (10+ tests)
   - Component tests for Panel (8+ tests)
   - E2E test for full workflow
   - Accessibility testing

5. **Documentation** (20min)
   - Feature README
   - Update CHANGELOG
   - Code comments

### Timeline:
**1 sprint (2 weeks)** with 1 developer

---

## 🧪 Verification Steps

### Build & Test
```bash
# 1. Install (no new deps needed)
npm install

# 2. Build
npm run build
# Expected: No errors

# 3. Lint
npm run lint
# Expected: No errors

# 4. Run tests
npm run test -- notifications
npx playwright test src/tests/e2e/notifications.spec.ts
# Expected: All pass

# 5. Start dev server
npm run dev
# Open http://localhost:5173
```

### Manual Testing Checklist
- [ ] Bell icon visible in header
- [ ] Saving agent adds notification (check badge)
- [ ] Clicking bell opens panel from right
- [ ] Notification displays correctly (icon, title, message, timestamp)
- [ ] Clicking notification marks as read
- [ ] Delete button works
- [ ] Filter dropdown works (All, Unread, by Type)
- [ ] Clear All confirmation dialog
- [ ] Persistence across browser sessions
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Mobile responsive (resize to 375px)
- [ ] Action button navigates correctly
- [ ] 101st notification auto-deletes oldest

### Security Testing
```javascript
// Test XSS prevention in browser console
useNotificationStore.getState().addNotification({
  type: 'info',
  title: '<script>alert("XSS")</script>',
  message: '<img src=x onerror=alert("XSS")>'
});
// Expected: Script tags rendered as plain text, no alert
```

### Performance Testing
```javascript
// Test with 100 notifications
for (let i = 0; i < 100; i++) {
  useNotificationStore.getState().addNotification({
    type: 'info',
    title: `Test ${i}`,
    message: `Message ${i}`
  });
}
// Expected: Panel opens <200ms, smooth scrolling
```

### Accessibility Testing
- [ ] Screen reader announces notifications correctly
- [ ] All interactive elements focusable
- [ ] Focus indicators visible
- [ ] ARIA labels present (`aria-label`, `aria-live`)
- [ ] Color contrast meets WCAG AA

---

## 🐛 Edge Cases Handled

1. **localStorage Full**: Try-catch with fallback to in-memory storage, warning notification
2. **Malformed Data**: Clear corrupted localStorage, start fresh
3. **Rapid Spam**: Rate limiting prevents duplicate notifications
4. **Long Text**: CSS `line-clamp-3` truncates after 3 lines
5. **Notification While Panel Open**: Auto-scroll to top
6. **Browser Back Button**: Standard history navigation works
7. **Multiple Tabs**: Independent state per tab (no cross-tab sync in MVP)
8. **Offline Mode**: Notifications still work (client-side only)

---

## 📊 Success Metrics

### Quantitative:
- 80%+ users interact with notification center in first week
- Average 5+ notification actions per user per day
- Panel open time <200ms on 95th percentile
- 0 client-side errors related to notifications

### Qualitative:
- Improved awareness of system events
- Reduced "How do I know when X completes?" support tickets
- Positive feedback on non-intrusive delivery
- No accessibility complaints

---

## 🔄 Future Enhancements (Out of Scope)

1. Real-time backend sync (Supabase real-time subscriptions)
2. User notification preferences UI
3. Email digests
4. Browser push notifications
5. Admin notification templates
6. Analytics tracking (open rate, CTR)
7. Bulk actions (select multiple, mark all as read)
8. Search notification history
9. Categories/tags

---

## 📚 References

- [Notification type definition](./src/types/domain.ts#L59-L72)
- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [Zustand persist middleware](https://github.com/pmndrs/zustand#persist-middleware)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Full implementation details](./ISSUE_NOTIFICATION_CENTER.md)
- [PR Review Checklist](./PR_REVIEW_CHECKLIST_NOTIFICATION_CENTER.md)

---

## 🎯 Definition of Done

- [ ] All 15 acceptance criteria met
- [ ] All tests pass (unit, component, E2E)
- [ ] No TypeScript or lint errors
- [ ] Security verification complete (no XSS, no secrets)
- [ ] Accessibility audit passes (keyboard, ARIA, screen reader)
- [ ] Mobile responsive verified (375px, 768px, 1024px+)
- [ ] Documentation complete (README, CHANGELOG)
- [ ] Code reviewed and approved (see PR checklist)
- [ ] Performance metrics met (<200ms, 60fps)
- [ ] Edge cases tested and handled

---

**Estimated Effort**: 6-8 hours development time  
**Priority**: High  
**Complexity**: Medium  
**Risk**: Low (no backend changes, existing patterns)
