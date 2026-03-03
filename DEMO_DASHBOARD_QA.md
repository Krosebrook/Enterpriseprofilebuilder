# Demo Dashboard - Questions & Answers Guide

## 10 Essential Questions for Demo Readiness Auditor

This document provides the questions I asked (implicitly through the implementation) and shows how to answer them for your specific deployment.

---

### **Question 1: What are the specific tools/apps you need to monitor?**

**Why this matters:** The dashboard needs exact URLs to check status.

**How to answer:**
1. List every tool you'll demo
2. Include the full URL (with https://)
3. Give each a descriptive name

**Example Answer:**
```
- AI Agent Builder: https://app.example.com/agents
- PRD Generator: https://app.example.com/prd
- Integration Marketplace: https://app.example.com/integrations
- Main Dashboard: https://app.example.com/
- Documentation Site: https://docs.example.com
- API Backend: https://api.example.com
```

**Where to configure:** Edit `src/config/demo-dashboard-config.ts` - `DEFAULT_TOOL_TARGETS` array

---

### **Question 2: Which tools require authentication/login?**

**Why this matters:** The dashboard won't attempt to check authenticated endpoints (to avoid triggering security alerts or rate limits).

**How to answer:**
Mark each tool as:
- `requiresAuth: true` - Needs login, skip checking
- `requiresAuth: false` - Public, can check directly

**Example Answer:**
```
- Main Dashboard: Public (false)
- Admin Panel: Requires login (true)
- API Backend: Requires API key (true)
- Documentation: Public (false)
```

**Where to configure:** In each tool's config, set the `requiresAuth` boolean:
```typescript
{
  id: 'admin',
  name: 'Admin Panel',
  url: 'https://app.example.com/admin',
  requiresAuth: true, // <-- HERE
}
```

---

### **Question 3: What defines "finished" vs "in progress" vs "broken"?**

**Why this matters:** Determines how the dashboard interprets responses.

**Current implementation:**
- **Finished**: HTTP 200-299 or opaque response (CORS mode)
- **Broken**: HTTP 4xx/5xx, timeout, or network error
- **Requires Login**: Flagged by `requiresAuth: true`
- **In Progress**: Not used in current implementation (reserved for future use)

**How to customize:**
If you need custom logic (e.g., checking for specific text on page), edit `src/services/demo-dashboard-service.ts` - `checkToolStatus` function.

**Example customization:**
```typescript
// After fetch, check response text
const text = await response.text();
if (text.includes('maintenance')) {
  status = 'in-progress';
} else if (text.includes('error')) {
  status = 'broken';
} else {
  status = 'finished';
}
```

---

### **Question 4: Do any of these URLs have dedicated health check/status endpoints?**

**Why this matters:** Health endpoints are faster and more reliable than checking main pages.

**How to answer:**
List any tools with dedicated health checks:
```
- API Backend: https://api.example.com/health
- Database: https://db.example.com/status
- Worker Service: https://worker.example.com/healthz
```

**Where to configure:** Add `healthCheckEndpoint` to tool config:
```typescript
{
  id: 'api',
  name: 'API Backend',
  url: 'https://api.example.com',
  healthCheckEndpoint: 'https://api.example.com/health', // <-- HERE
}
```

---

### **Question 5: What's an acceptable timeout for each check?**

**Why this matters:** Prevents the dashboard from hanging on slow/dead services.

**Default:** 10 seconds (10000ms)

**How to answer:**
Consider each tool's typical response time:
- **Fast APIs**: 2-5 seconds
- **Normal web apps**: 5-10 seconds
- **Slow external services**: 15-30 seconds

**Example Answer:**
```
- API Backend: 5 seconds (fast)
- Main App: 10 seconds (default)
- External Integration: 30 seconds (slow)
```

**Where to configure:**
```typescript
{
  id: 'api',
  name: 'API',
  url: '...',
  timeout: 5000, // 5 seconds (in milliseconds)
}
```

**Global default:** Edit `DEFAULT_DASHBOARD_CONFIG.defaultTimeout` in config file

---

### **Question 6: What information do you want visible for each tool on the dashboard?**

**Current implementation shows:**
- Tool name
- Description
- URL (with clickable link)
- Status badge (colored indicator)
- Category
- Response time
- HTTP status code
- Last checked timestamp
- Error messages (if any)
- Cache indicator

**How to customize:**
Edit `src/components/demo-dashboard/ToolStatusCard.tsx` to show/hide fields or add new ones.

**Example: Hide status code**
Remove or comment out:
```typescript
{result.statusCode && (
  <div>...</div>
)}
```

---

### **Question 7: Where should this dashboard live in your current app?**

**Current implementation:** New route accessible via navigation menu

**Options:**
1. **Integrated route** (current): Accessible from nav menu as "Demo Dashboard"
2. **Standalone page**: Remove from nav, access via direct URL
3. **Modal/popup**: Open in overlay instead of full page
4. **Separate app**: Deploy as independent application

**How to change:**
- **Remove from nav**: Delete entry from `src/data/navigation.ts`
- **Make standalone**: Access via `/#demo-dashboard` in URL
- **Modal**: Wrap `<DemoDashboard />` in a Dialog component

---

### **Question 8: What grouping/organization do you want for the tools?**

**Current implementation:** Tools grouped by category

**Categories available:**
- `ai-features` - AI-powered tools
- `core-platform` - Main application features
- `integrations` - Third-party connections
- `documentation` - Docs and guides
- `infrastructure` - Backend services
- `other` - Miscellaneous

**How to customize:**
1. Edit categories in `src/types/demo-dashboard.ts` - `ToolCategory` type
2. Assign categories in `src/config/demo-dashboard-config.ts`

**Example: Add "mobile-apps" category**
```typescript
// In types file
export type ToolCategory = 
  | 'ai-features'
  | 'core-platform'
  | 'integrations'
  | 'documentation'
  | 'infrastructure'
  | 'mobile-apps' // <-- NEW
  | 'other';

// In config file
{
  id: 'ios-app',
  name: 'iOS App',
  category: 'mobile-apps', // <-- USE IT
}
```

**Alternative:** For flat list without grouping, modify `DemoDashboard.tsx` to not group by category.

---

### **Question 9: What should happen during the demo if a check fails when you click refresh?**

**Current implementation:** 
- Shows last cached status with indicator
- Displays "Using cached data" message
- Yellow warning: "Check failed - using cached data"

**Behavior:**
1. Click "Refresh Status"
2. If check fails (network error, timeout):
   - Keep showing previous cached data
   - Mark results as `isFromCache: true`
   - Show warning banner
3. Dashboard remains functional

**How to customize:**
Edit `DemoDashboard.tsx` - `handleRefresh` function:

**Option A: Hide cache indicator**
```typescript
// Remove the yellow warning
{lastCheckFailed && (
  <span className="ml-2 text-yellow-600">
    (Check failed - using cached data)
  </span>
)}
```

**Option B: Show error modal**
```typescript
if (error) {
  setShowErrorModal(true);
}
```

**Option C: Clear all data on failure**
```typescript
if (error) {
  setSnapshot(null); // Clear instead of keeping cache
}
```

---

### **Question 10: What's your preferred visual style for status indicators?**

**Current implementation:** 
- Traffic light colors (green, yellow, red, blue)
- Rounded badge pills
- Colored dot + text label
- Radix UI design system compatibility

**Color scheme:**
- 🟢 Green: Working/Finished
- 🟡 Yellow: In Progress
- 🔴 Red: Broken/Error
- 🔵 Blue: Requires Login
- ⚪ Gray: Unknown

**How to customize:**

**Option A: Different colors**
Edit `src/components/demo-dashboard/StatusBadge.tsx`:
```typescript
const colorClasses = {
  green: 'bg-emerald-100 text-emerald-800', // Different green
  red: 'bg-rose-100 text-rose-800',         // Different red
  // etc.
}
```

**Option B: Icons instead of dots**
```typescript
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Replace colored dot with icon
{status === 'finished' && <CheckCircle />}
{status === 'broken' && <XCircle />}
```

**Option C: Progress bars**
Replace badge with progress bar showing uptime percentage.

---

## Summary: Configuration Checklist

Before your demo, answer these questions by editing the config:

1. ✅ Add all tool URLs in `demo-dashboard-config.ts`
2. ✅ Mark which tools require authentication
3. ✅ Review status logic (default is HTTP-based)
4. ✅ Add health check endpoints if available
5. ✅ Set appropriate timeouts (default 10s)
6. ✅ Verify visible fields meet your needs (default is comprehensive)
7. ✅ Confirm dashboard location (integrated in nav menu)
8. ✅ Organize tools by category
9. ✅ Test cache behavior (shows last known status)
10. ✅ Review visual style (traffic light colors with badges)

**Quick start:** Most users only need to edit `src/config/demo-dashboard-config.ts` and replace the URLs with their actual tools!

---

## Need Help?

See the full documentation:
- `DEMO_DASHBOARD_GUIDE.md` - Complete technical guide
- `DEMO_DASHBOARD_CHECKLIST.md` - Quick pre-demo checklist
- Source code comments in all files

The dashboard is designed to work with sensible defaults. Customize only what you need!
