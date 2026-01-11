# Implement In-App Notification Center with Real-time Updates

## W: What (Desired Change)

Implement a comprehensive, user-facing **Notification Center** that provides users with real-time system alerts, deployment updates, agent status changes, and security warnings. The feature must integrate seamlessly with the existing Enterprise Profile Builder architecture, leveraging the already-defined `Notification` interface in `src/types/domain.ts`.

### Specific Requirements:

1. **Notification Bell Icon** in the main header with an unread count badge
2. **Notification Panel** (slide-out drawer) displaying:
   - Notifications grouped by type (info, success, warning, error)
   - Timestamp for each notification
   - Mark as read/unread functionality
   - Clear all and delete individual notifications
   - Action buttons where applicable (e.g., "View Deployment", "Review Agent")
3. **Notification Store** using Zustand for state management (consistent with Agent Builder pattern)
4. **Persistence** using localStorage to maintain notifications across sessions
5. **Filtering** by notification type and read/unread status
6. **Integration Points**:
   - Agent Builder: Notify when agents are saved, deleted, or test runs complete
   - Deployment: Alert on phase status changes or task completions
   - Operations: Warning for system health degradation
   - Security: Critical alerts for DLP triggers or compliance violations

### User Experience Goals:
- Non-intrusive notification delivery via bell icon (no blocking modals)
- Quick scan of recent activity without leaving current page
- Easy dismissal and management of notification history
- Clear visual hierarchy: Critical > Warning > Info > Success

---

## R: Rules (Constraints, Non-Goals, Security, Performance)

### Constraints:
1. **No Backend Changes**: Notifications are client-side only. No Supabase real-time subscriptions or webhooks in this phase.
2. **No External Services**: No push notifications, email, SMS, or third-party notification services (e.g., Firebase Cloud Messaging).
3. **Existing Stack Only**: Use React, TypeScript, Zustand, Radix UI components (already in package.json).
4. **Mobile Responsive**: Must work on mobile viewports (375px+) with appropriate touch targets.
5. **Accessibility**: WCAG 2.1 AA compliant (keyboard navigation, ARIA labels, screen reader support).

### Non-Goals:
- ❌ Real-time backend notifications (Phase 12 future work)
- ❌ User-configurable notification preferences (settings UI for enabling/disabling types)
- ❌ Email digests or scheduled notification summaries
- ❌ Notification channels (e.g., Slack, Teams integration)
- ❌ Notification templates or admin management UI

### Security Requirements:
1. **No Secrets in Notifications**: Never include API keys, tokens, passwords, or PII in notification content.
2. **Input Sanitization**: All notification text must be sanitized to prevent XSS attacks.
3. **Storage Limits**: Implement a max notification history of 100 items to prevent localStorage abuse.
4. **Rate Limiting**: Prevent notification spam by throttling duplicate notifications (same type/message within 5 seconds).

### Performance Requirements:
1. **Render Performance**: Notification panel must open in <200ms.
2. **Storage Efficiency**: Use JSON.stringify compression and prune old notifications (>30 days) automatically.
3. **Memory Management**: Clear dismissed notifications from memory after 24 hours.
4. **Animation Performance**: Use CSS transforms (not position changes) for smooth 60fps animations.

---

## A: Acceptance (Testable Criteria + UI States)

### Acceptance Criteria:

#### AC-1: Notification Bell Icon
**Given** a user is on any page of the app  
**When** they look at the main header  
**Then** they see a bell icon (Lucide `Bell` component) in the top-right corner  
**And** the icon displays a red badge with unread count if unread notifications exist  
**And** clicking the bell opens the notification panel

**Visual State**:
- No unread: Bell icon with gray color (`text-slate-600`)
- Has unread: Bell icon with amber color (`text-amber-600`) + badge with count (`bg-red-500 text-white text-xs`)

---

#### AC-2: Notification Panel - Display
**Given** a user clicks the notification bell  
**When** the panel opens  
**Then** they see a slide-out drawer from the right side (400px wide on desktop, full-width on mobile)  
**And** the panel header shows "Notifications" with a close button (X icon)  
**And** notifications are displayed in reverse chronological order (newest first)  
**And** each notification card shows:
- Type icon (Info/Success/Warning/Error with appropriate color)
- Title (bold, 16px)
- Message (14px, multi-line)
- Relative timestamp ("2 minutes ago", "1 hour ago", "3 days ago")
- Unread indicator (blue dot if unread)
- Delete button (trash icon, only visible on hover)
- Optional action button (e.g., "View Details")

**Empty State**:
- If no notifications: Display centered icon with text "No notifications yet"

---

#### AC-3: Notification Types & Styling
**Given** notifications of different types exist  
**Then** each type has distinct visual styling:

| Type    | Icon          | Border Color   | BG Color       | Icon Color     |
|---------|---------------|----------------|----------------|----------------|
| info    | Info          | border-blue-200| bg-blue-50     | text-blue-600  |
| success | CheckCircle2  | border-green-200| bg-green-50   | text-green-600 |
| warning | AlertTriangle | border-amber-200| bg-amber-50   | text-amber-600 |
| error   | AlertCircle   | border-red-200 | bg-red-50      | text-red-600   |

---

#### AC-4: Mark as Read/Unread
**Given** a notification is displayed  
**When** a user clicks anywhere on the notification card (except action buttons)  
**Then** the notification is marked as read  
**And** the blue unread dot disappears  
**And** the unread count badge on the bell icon decrements by 1  
**And** the notification's `read` property is updated in localStorage

**Reversibility**:
- Right-clicking a notification shows context menu with "Mark as Unread" option
- Clicking "Mark as Unread" toggles the read status back

---

#### AC-5: Delete Notifications
**Given** a user hovers over a notification  
**When** they click the trash icon  
**Then** the notification is removed from the list with a fade-out animation (300ms)  
**And** the notification is deleted from localStorage  
**And** if the notification was unread, the unread count decrements

---

#### AC-6: Clear All Notifications
**Given** the notification panel is open and contains notifications  
**When** a user clicks "Clear All" button in the panel header  
**Then** a confirmation dialog appears: "Clear all notifications? This cannot be undone."  
**And** if confirmed, all notifications are deleted  
**And** the panel shows the empty state  
**And** the bell icon badge disappears

---

#### AC-7: Filter Notifications
**Given** the notification panel is open  
**When** a user clicks the filter dropdown  
**Then** they see options: "All", "Unread", "Info", "Success", "Warning", "Error"  
**And** selecting a filter updates the displayed notifications accordingly  
**And** the filter selection persists until the panel is closed

---

#### AC-8: Notification Actions
**Given** a notification has an associated action  
**When** the user clicks the action button (e.g., "View Deployment")  
**Then** the notification panel closes  
**And** the user is navigated to the appropriate section  
**And** the notification is marked as read

**Example Actions**:
- Agent Saved → "View Agent" (navigate to Agent Builder, load that agent)
- Deployment Task Completed → "View Deployment" (navigate to Deployment phase)
- Security Alert → "Review Baseline" (navigate to Baseline section)

---

#### AC-9: Integration - Agent Builder
**Given** a user saves an agent in the Agent Builder  
**When** the save operation completes  
**Then** a success notification is added: "Agent saved successfully"  
**And** the notification includes the agent name in the message  
**And** an action button "View Agent" is provided

**Given** a user deletes an agent  
**Then** an info notification is added: "Agent deleted"

---

#### AC-10: Integration - Deployment
**Given** a deployment phase status changes to "completed"  
**When** the status update occurs  
**Then** a success notification is added: "Deployment Phase X completed"  
**And** an action button "View Deployment" is provided

**Given** a deployment task is marked "blocked"  
**Then** a warning notification is added: "Deployment task blocked: [task name]"

---

#### AC-11: Integration - System Health
**Given** the system health status changes to "degraded"  
**When** the status update is detected  
**Then** a warning notification is added: "System performance degraded: [service name]"  
**And** an action button "View Status" is provided

**Given** the system health status changes to "down"  
**Then** an error notification is added: "Critical: [service name] is unavailable"

---

#### AC-12: Persistence Across Sessions
**Given** a user has 5 unread notifications  
**When** they close the browser and reopen the app  
**Then** the bell icon shows the unread count of 5  
**And** all notifications are still present in the panel  
**And** read/unread status is preserved

---

#### AC-13: Auto-Pruning Old Notifications
**Given** a user has 100 notifications in storage  
**When** a new notification is added  
**Then** the oldest notification is automatically deleted  
**And** the total count remains at 100

**Given** a notification is older than 30 days  
**When** the app loads  
**Then** the old notification is automatically removed

---

#### AC-14: Keyboard Accessibility
**Given** a user is using keyboard navigation  
**When** they press Tab repeatedly  
**Then** focus moves through: bell icon → notification cards → action buttons → delete buttons → close button  
**And** pressing Enter on the bell icon opens/closes the panel  
**And** pressing Escape closes the panel  
**And** pressing Enter on a notification card marks it as read

---

#### AC-15: Mobile Responsiveness
**Given** a user on a mobile device (375px width)  
**When** they open the notification panel  
**Then** the panel takes full width of the screen  
**And** notifications are stacked vertically with adequate spacing  
**And** touch targets are at least 44x44px  
**And** the close button is easily reachable in the top-right

---

### Visual Design Notes:
- **Panel Animation**: Slide in from right with `ease-out` (300ms)
- **Notification Card Spacing**: 12px gap between cards, 16px padding inside
- **Typography**: Title (`font-semibold text-base`), Message (`text-sm text-slate-600`)
- **Max Height**: Panel scrolls after 600px height, sticky header
- **Z-index**: Panel at `z-50`, overlay at `z-40`

---

## P: Plan (Implementation Steps + Files to Touch)

### Implementation Steps:

#### Step 1: Create Notification Store (30 min)
**File**: `src/features/notifications/hooks/useNotificationStore.ts` (new)

- Create Zustand store with:
  - State: `notifications: Notification[]`, `filter: 'all' | 'unread' | NotificationType`
  - Actions:
    - `addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void`
    - `markAsRead(id: string): void`
    - `toggleRead(id: string): void`
    - `deleteNotification(id: string): void`
    - `clearAll(): void`
    - `setFilter(filter: string): void`
  - Middleware: `persist` (localStorage key: `notification-center-storage`)
  - Auto-prune logic: Delete notifications older than 30 days on load
  - Max 100 notifications: Remove oldest when adding 101st

**Key Logic**:
```typescript
addNotification: (notif) => {
  const id = crypto.randomUUID();
  const timestamp = Date.now();
  set((state) => {
    let newNotifications = [{ ...notif, id, timestamp, read: false }, ...state.notifications];
    // Prune if > 100
    if (newNotifications.length > 100) {
      newNotifications = newNotifications.slice(0, 100);
    }
    return { notifications: newNotifications };
  });
}
```

---

#### Step 2: Create Notification Panel Component (60 min)
**File**: `src/features/notifications/components/NotificationPanel.tsx` (new)

- Radix UI Dialog component for slide-out drawer
- Header with "Notifications" title, filter dropdown, "Clear All" button, close button
- Scrollable notification list
- Empty state UI
- Use Radix `DropdownMenu` for filter
- Use `AlertDialog` for "Clear All" confirmation

**Key Props**:
```typescript
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Filter Implementation**:
```typescript
const filteredNotifications = useMemo(() => {
  let filtered = notifications;
  if (filter === 'unread') {
    filtered = filtered.filter(n => !n.read);
  } else if (filter !== 'all') {
    filtered = filtered.filter(n => n.type === filter);
  }
  return filtered;
}, [notifications, filter]);
```

---

#### Step 3: Create Notification Card Component (30 min)
**File**: `src/features/notifications/components/NotificationCard.tsx` (new)

- Display notification with appropriate icon, color, and styling
- Hover effect to show delete button
- Click handler to mark as read
- Optional action button
- Relative timestamp using `date-fns` (`formatDistanceToNow`)

**Timestamp Logic**:
```typescript
import { formatDistanceToNow } from 'date-fns';

const relativeTime = formatDistanceToNow(notification.timestamp, { addSuffix: true });
```

---

#### Step 4: Create Notification Bell Component (30 min)
**File**: `src/features/notifications/components/NotificationBell.tsx` (new)

- Lucide `Bell` icon with conditional styling
- Unread count badge (only show if > 0)
- Click handler to toggle panel
- Tooltip: "Notifications"

**Unread Count Logic**:
```typescript
const unreadCount = notifications.filter(n => !n.read).length;
```

---

#### Step 5: Integrate Bell into Header (15 min)
**File**: `src/components/layout/MainLayout.tsx` (modify)

- Import `NotificationBell` and `NotificationPanel`
- Add state for `isPanelOpen`
- Place bell in header's top-right (before user menu if exists)
- Render `NotificationPanel` conditionally

**Layout Addition**:
```tsx
<header className="flex items-center justify-between px-6 py-4">
  <div>Logo / Title</div>
  <div className="flex items-center gap-4">
    <NotificationBell onClick={() => setIsPanelOpen(true)} />
  </div>
</header>
<NotificationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
```

---

#### Step 6: Add Notification Triggers - Agent Builder (20 min)
**File**: `src/features/agents/AgentBuilder.tsx` (modify)

- Import `useNotificationStore`
- Call `addNotification` after `saveCurrentAgent` succeeds
- Call `addNotification` after `deleteAgent` succeeds

**Example**:
```typescript
const { addNotification } = useNotificationStore();

const handleSave = () => {
  saveCurrentAgent();
  addNotification({
    type: 'success',
    title: 'Agent Saved',
    message: `${name} has been saved to your library.`,
    action: {
      label: 'View Agent',
      onClick: () => {
        // Already in Agent Builder, no navigation needed
      }
    }
  });
};
```

---

#### Step 7: Add Notification Triggers - Deployment (20 min)
**File**: `src/features/deployment/Deployment.tsx` (modify)

- Import `useNotificationStore`
- Add `useEffect` to watch for phase status changes
- Trigger notifications when phase completes or task is blocked

**Example**:
```typescript
useEffect(() => {
  const completedPhases = allDeploymentPhases.filter(p => p.status === 'completed');
  // Compare with previous state (use useRef to track)
  // If new completion detected, add notification
}, [allDeploymentPhases]);
```

---

#### Step 8: Add Notification Triggers - System Health (20 min)
**File**: `src/features/dashboard/Dashboard.tsx` (modify)

- Import `useNotificationStore`
- Mock a system health check (since no real backend)
- Trigger warning/error notifications when status degrades

**Example**:
```typescript
// Simulate system health check
useEffect(() => {
  const healthCheckInterval = setInterval(() => {
    const randomCheck = Math.random();
    if (randomCheck < 0.1) { // 10% chance of degraded
      addNotification({
        type: 'warning',
        title: 'Performance Degraded',
        message: 'Model latency exceeds threshold (1.2s)',
        action: {
          label: 'View Baseline',
          onClick: () => setActiveSection('baseline')
        }
      });
    }
  }, 60000); // Check every 60 seconds
  return () => clearInterval(healthCheckInterval);
}, []);
```

---

#### Step 9: Add Sanitization Utility (15 min)
**File**: `src/utils/sanitize.ts` (new)

- Create `sanitizeNotificationText` function to prevent XSS
- Use DOMPurify or simple regex to strip HTML tags

**Example**:
```typescript
export function sanitizeNotificationText(text: string): string {
  // Strip HTML tags and dangerous characters
  return text.replace(/<[^>]*>/g, '').trim();
}
```

- Apply sanitization in `addNotification` action before storing

---

#### Step 10: Add Rate Limiting (15 min)
**File**: `src/features/notifications/hooks/useNotificationStore.ts` (modify)

- Track recent notifications in memory (Map with key: `${type}-${title}`, value: timestamp)
- In `addNotification`, check if duplicate exists within last 5 seconds
- If yes, skip adding notification

**Example**:
```typescript
const recentNotifications = new Map<string, number>();

addNotification: (notif) => {
  const key = `${notif.type}-${notif.title}`;
  const now = Date.now();
  const lastTime = recentNotifications.get(key);
  
  if (lastTime && now - lastTime < 5000) {
    // Duplicate within 5 seconds, skip
    return;
  }
  
  recentNotifications.set(key, now);
  // ... rest of add logic
}
```

---

#### Step 11: Update Types (10 min)
**File**: `src/types/domain.ts` (verify)

- Ensure `Notification` interface matches implementation needs
- Current interface looks good, but verify `action.onClick` signature

---

#### Step 12: Add Tests - Unit Tests (60 min)
**File**: `src/features/notifications/hooks/useNotificationStore.test.ts` (new)

Test coverage:
- Adding a notification
- Marking as read/unread
- Deleting a notification
- Clearing all notifications
- Auto-pruning (>100 notifications, >30 days)
- Rate limiting (duplicate prevention)
- Filtering (all, unread, by type)
- localStorage persistence (mock `localStorage`)

**Example Test**:
```typescript
import { renderHook, act } from '@testing-library/react';
import { useNotificationStore } from './useNotificationStore';

describe('useNotificationStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('adds a notification', () => {
    const { result } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.addNotification({
        type: 'info',
        title: 'Test',
        message: 'Test message'
      });
    });
    
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].title).toBe('Test');
    expect(result.current.notifications[0].read).toBe(false);
  });
  
  // ... more tests
});
```

---

#### Step 13: Add Tests - Component Tests (60 min)
**File**: `src/features/notifications/components/NotificationPanel.test.tsx` (new)

Test coverage:
- Panel opens and closes
- Displays notifications correctly
- Empty state renders when no notifications
- Filter works (all, unread, by type)
- Clear All confirmation dialog
- Notification card interactions (mark read, delete)
- Keyboard navigation (Tab, Enter, Escape)

**Example Test**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationPanel } from './NotificationPanel';
import { useNotificationStore } from '../hooks/useNotificationStore';

jest.mock('../hooks/useNotificationStore');

describe('NotificationPanel', () => {
  test('renders notifications', () => {
    (useNotificationStore as jest.Mock).mockReturnValue({
      notifications: [
        { id: '1', type: 'info', title: 'Test', message: 'Message', timestamp: Date.now(), read: false }
      ],
      filter: 'all',
      markAsRead: jest.fn(),
      deleteNotification: jest.fn()
    });
    
    render(<NotificationPanel isOpen={true} onClose={jest.fn()} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });
  
  // ... more tests
});
```

---

#### Step 14: Add E2E Test (30 min)
**File**: `src/tests/e2e/notifications.spec.ts` (new)

Test flow:
1. User saves an agent → notification appears
2. User clicks bell → panel opens with notification
3. User clicks notification → marked as read
4. User deletes notification → removed from list
5. User reloads page → notifications persist

**Example Test**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Notification Center', () => {
  test('full notification workflow', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Agent Builder
    await page.click('text=Agent Builder');
    
    // Save an agent (trigger notification)
    await page.fill('input[name="agentName"]', 'Test Agent');
    await page.click('button:has-text("Save Agent")');
    
    // Check bell has unread badge
    const bell = page.locator('[data-testid="notification-bell"]');
    await expect(bell.locator('[data-testid="unread-badge"]')).toBeVisible();
    await expect(bell.locator('[data-testid="unread-badge"]')).toHaveText('1');
    
    // Open notification panel
    await bell.click();
    const panel = page.locator('[data-testid="notification-panel"]');
    await expect(panel).toBeVisible();
    
    // Check notification content
    await expect(panel.locator('text=Agent Saved')).toBeVisible();
    await expect(panel.locator('text=Test Agent')).toBeVisible();
    
    // Mark as read by clicking
    const notification = panel.locator('[data-testid="notification-card"]').first();
    await notification.click();
    await expect(notification.locator('[data-testid="unread-indicator"]')).not.toBeVisible();
    
    // Delete notification
    await notification.hover();
    await notification.locator('[data-testid="delete-button"]').click();
    await expect(notification).not.toBeVisible();
    
    // Close panel
    await page.click('[data-testid="close-panel"]');
    await expect(panel).not.toBeVisible();
    
    // Reload and verify persistence (should be empty now)
    await page.reload();
    await bell.click();
    await expect(panel.locator('text=No notifications yet')).toBeVisible();
  });
});
```

---

#### Step 15: Update Documentation (20 min)
**Files**:
- `src/features/notifications/README.md` (new)
- `src/CHANGELOG.md` (modify)

**README Content**:
```markdown
# Notification Center

## Overview
The Notification Center provides real-time, in-app notifications for system events, agent updates, and deployment changes.

## Features
- Real-time notification display
- Unread count badge
- Filter by type and read status
- Persistent storage (localStorage)
- Keyboard accessible
- Mobile responsive

## Usage

### Adding a Notification
```typescript
import { useNotificationStore } from '@/features/notifications/hooks/useNotificationStore';

const { addNotification } = useNotificationStore();

addNotification({
  type: 'success',
  title: 'Operation Complete',
  message: 'Your task has finished successfully.',
  action: {
    label: 'View Details',
    onClick: () => navigateToDetails()
  }
});
```

### Notification Types
- `info`: General information
- `success`: Successful operations
- `warning`: Non-critical issues
- `error`: Critical errors

## Architecture
- **Store**: Zustand with localStorage persistence
- **Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Testing
Run tests: `npm run test -- notifications`
```

**CHANGELOG Update**:
```markdown
## [Unreleased]

### Added
- **Notification Center**: In-app notification system with real-time updates
  - Bell icon with unread count badge
  - Slide-out notification panel
  - Filter by type and read status
  - Persistent localStorage storage
  - Integration with Agent Builder, Deployment, and System Health
  - Full keyboard accessibility
  - Mobile responsive design
```

---

### File Summary:

#### New Files (10):
1. `src/features/notifications/hooks/useNotificationStore.ts` - Zustand store
2. `src/features/notifications/components/NotificationPanel.tsx` - Main panel UI
3. `src/features/notifications/components/NotificationCard.tsx` - Individual notification card
4. `src/features/notifications/components/NotificationBell.tsx` - Bell icon component
5. `src/features/notifications/README.md` - Documentation
6. `src/utils/sanitize.ts` - XSS prevention utility
7. `src/features/notifications/hooks/useNotificationStore.test.ts` - Unit tests
8. `src/features/notifications/components/NotificationPanel.test.tsx` - Component tests
9. `src/tests/e2e/notifications.spec.ts` - E2E tests
10. `src/features/notifications/index.ts` - Barrel export

#### Modified Files (4):
1. `src/components/layout/MainLayout.tsx` - Add bell and panel
2. `src/features/agents/AgentBuilder.tsx` - Add notification triggers
3. `src/features/deployment/Deployment.tsx` - Add notification triggers
4. `src/features/dashboard/Dashboard.tsx` - Add notification triggers
5. `src/CHANGELOG.md` - Update with new feature

---

### Dependency Check:
All required dependencies already exist in `package.json`:
- `zustand` - State management
- `@radix-ui/react-dialog` - Panel drawer
- `@radix-ui/react-dropdown-menu` - Filter dropdown
- `@radix-ui/react-alert-dialog` - Clear All confirmation
- `lucide-react` - Icons
- `date-fns` - Timestamp formatting
- `@playwright/test` - E2E testing
- `vitest` - Unit testing (assumed, or use existing test framework)

**No new dependencies required.**

---

### Edge Cases & Failure Modes:

#### Edge Case 1: localStorage Full
**Scenario**: User's localStorage quota is exceeded  
**Handling**: Wrap `localStorage.setItem` in try-catch, fall back to in-memory storage only, show warning notification

#### Edge Case 2: Malformed Notification Data
**Scenario**: Corrupted localStorage data on load  
**Handling**: Clear corrupted data, log error to console, start with empty notification array

#### Edge Case 3: Rapid Notification Spam
**Scenario**: Bug triggers 100+ notifications in 1 second  
**Handling**: Rate limiting prevents this (max 1 per type/title per 5 seconds)

#### Edge Case 4: Very Long Notification Text
**Scenario**: Message text exceeds reasonable length  
**Handling**: CSS `line-clamp-3` to truncate after 3 lines, no "Read More" needed for MVP

#### Edge Case 5: Notification While Panel Open
**Scenario**: New notification arrives while user has panel open  
**Handling**: New notification appears at top of list, auto-scroll to top with smooth animation

#### Edge Case 6: Browser Back Button
**Scenario**: User navigates via notification action, then presses back  
**Handling**: No special handling needed, standard browser history works

#### Edge Case 7: Multiple Tabs Open
**Scenario**: User has app open in 2 tabs, adds notification in one tab  
**Handling**: Each tab has independent notification state (localStorage sync not in scope for MVP)

#### Edge Case 8: Network Offline
**Scenario**: User is offline  
**Handling**: Notifications still work (client-side only), no impact

---

### Verification Steps:

#### Build Verification:
```bash
# 1. Install dependencies (if any new packages added, but none are)
npm install

# 2. Run TypeScript compiler
npm run build

# Expected: No TypeScript errors, build completes successfully
```

#### Lint Verification:
```bash
# 3. Run linter
npm run lint

# Expected: No linting errors
```

#### Unit Test Verification:
```bash
# 4. Run unit tests
npm run test -- notifications

# Expected: All tests pass
# - useNotificationStore: 10+ tests covering all actions
# - NotificationPanel: 8+ tests covering UI interactions
```

#### E2E Test Verification:
```bash
# 5. Run E2E tests
npx playwright test src/tests/e2e/notifications.spec.ts

# Expected: Full workflow test passes
```

#### Manual Verification:
```bash
# 6. Start dev server
npm run dev

# Open browser to localhost:5173
```

**Manual Test Checklist**:
- [ ] Bell icon visible in header
- [ ] Saving an agent adds notification (check bell badge)
- [ ] Clicking bell opens panel from right
- [ ] Notification displays with correct icon, title, message, timestamp
- [ ] Clicking notification marks it as read (blue dot disappears)
- [ ] Hovering notification shows delete button
- [ ] Clicking delete removes notification
- [ ] Filter dropdown works (All, Unread, Info, Success, Warning, Error)
- [ ] "Clear All" shows confirmation dialog
- [ ] Confirming "Clear All" removes all notifications
- [ ] Closing and reopening browser preserves notifications
- [ ] Keyboard navigation: Tab through elements, Enter to open/close, Escape to close
- [ ] Mobile view (resize to 375px): Panel full-width, touch targets adequate
- [ ] Action button navigates to correct section and marks notification as read
- [ ] Adding 101st notification auto-deletes oldest

#### Accessibility Verification:
```bash
# 7. Run accessibility audit (if tooling exists)
# Or manually test with screen reader (NVDA/JAWS)

# Check:
- [ ] Bell has aria-label="Notifications"
- [ ] Unread count has aria-live="polite"
- [ ] Panel has role="dialog" and aria-labelledby
- [ ] Each notification has semantic heading
- [ ] Keyboard focus is visible (outline)
- [ ] Screen reader announces notification type and content
```

#### Performance Verification:
```bash
# 8. Test with 100 notifications
# In browser console:
for (let i = 0; i < 100; i++) {
  useNotificationStore.getState().addNotification({
    type: 'info',
    title: `Test ${i}`,
    message: `Message ${i}`
  });
}

# Check:
- [ ] Panel opens in <200ms (use Performance tab)
- [ ] Scrolling is smooth (60fps)
- [ ] No memory leaks (check Memory tab over 1 minute)
```

#### Security Verification:
```bash
# 9. Test XSS prevention
# Try adding notification with malicious content:
useNotificationStore.getState().addNotification({
  type: 'info',
  title: '<script>alert("XSS")</script>',
  message: '<img src=x onerror=alert("XSS")>'
});

# Expected: Script tags rendered as plain text, no alert
```

---

### Smoke Test Checklist (Post-Deployment):

**Pre-Deployment**:
- [ ] All tests pass (unit, component, E2E)
- [ ] Build completes without errors
- [ ] No console errors in dev mode
- [ ] Accessibility audit passes
- [ ] Code review approved (see PR checklist below)

**Post-Deployment**:
- [ ] Navigate to production URL
- [ ] Bell icon visible in header
- [ ] Click bell, panel opens
- [ ] Trigger a test notification (save agent)
- [ ] Notification appears in panel
- [ ] Mark as read works
- [ ] Delete works
- [ ] Filter works
- [ ] Clear All works
- [ ] Reload page, notifications persist
- [ ] Mobile responsive (test on real device if possible)
- [ ] No JavaScript errors in console
- [ ] Monitor localStorage usage (should be <1MB for 100 notifications)

---

## Additional Notes:

### Future Enhancements (Out of Scope):
1. **Real-time Backend Sync**: Supabase real-time subscriptions for multi-device sync
2. **Notification Preferences**: UI to enable/disable notification types
3. **Email Digests**: Daily/weekly email summary of notifications
4. **Push Notifications**: Browser push API for background notifications
5. **Notification Templates**: Admin UI to create custom notification formats
6. **Analytics**: Track notification engagement (open rate, click-through rate)
7. **Bulk Actions**: Select multiple notifications, mark all as read, delete selected
8. **Search**: Search within notification history
9. **Categories**: Group notifications by feature area (Agent, Deployment, System)
10. **Notification Settings per User**: Stored in Supabase user profile

### Performance Considerations:
- **Virtual Scrolling**: If notification count exceeds 100 in future, implement with `react-window`
- **Debounce Filtering**: Debounce filter changes to prevent re-renders on rapid clicks
- **Memo Components**: Use `React.memo` on `NotificationCard` to prevent unnecessary re-renders

### Security Best Practices:
- Never include sensitive data (tokens, keys, PII) in notifications
- All user-generated content must be sanitized
- Rate limit notification creation to prevent abuse
- Implement max storage limits to prevent localStorage DOS

---

## Success Metrics:

### Quantitative:
- **Feature Adoption**: 80%+ of active users interact with notification center within first week
- **Engagement**: Average 5+ notification actions per user per day
- **Performance**: Panel open time <200ms on 95th percentile
- **Reliability**: 0 client-side errors related to notifications

### Qualitative:
- Users report improved awareness of system events
- Reduced support tickets for "How do I know when X completes?"
- Positive feedback on non-intrusive notification delivery
- No accessibility complaints

---

## Timeline Estimate:

| Task                          | Time    | Dependencies |
|-------------------------------|---------|--------------|
| Step 1: Notification Store    | 30 min  | None         |
| Step 2: Notification Panel    | 60 min  | Step 1       |
| Step 3: Notification Card     | 30 min  | Step 1       |
| Step 4: Notification Bell     | 30 min  | Step 1       |
| Step 5: Integrate into Header | 15 min  | Steps 2,4    |
| Step 6: Agent Integration     | 20 min  | Steps 1-5    |
| Step 7: Deployment Integration| 20 min  | Steps 1-5    |
| Step 8: Dashboard Integration | 20 min  | Steps 1-5    |
| Step 9: Sanitization Utility  | 15 min  | None         |
| Step 10: Rate Limiting        | 15 min  | Step 1       |
| Step 11: Update Types         | 10 min  | None         |
| Step 12: Unit Tests           | 60 min  | Steps 1-10   |
| Step 13: Component Tests      | 60 min  | Steps 1-10   |
| Step 14: E2E Tests            | 30 min  | Steps 1-10   |
| Step 15: Documentation        | 20 min  | Steps 1-14   |
| **Total**                     | **6h 15min** |          |

**Recommended Sprint**: 1 sprint (2 weeks) with 1 developer

---

## Risk Assessment:

| Risk                          | Probability | Impact | Mitigation                                     |
|-------------------------------|-------------|--------|------------------------------------------------|
| localStorage quota exceeded   | Medium      | Low    | Try-catch with fallback to in-memory storage   |
| Performance degradation (100+ notifications) | Low | Medium | Auto-pruning, virtual scrolling in future |
| Notification spam from bugs   | Low         | Medium | Rate limiting per type/title                   |
| Accessibility issues          | Low         | High   | Comprehensive keyboard and ARIA testing        |
| Browser compatibility         | Low         | Low    | Radix UI handles cross-browser concerns        |

---
