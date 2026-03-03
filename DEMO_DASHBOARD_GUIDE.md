# Demo Dashboard - Complete Documentation

## Overview

The **Demo Dashboard** is a specialized tool designed for presentations and demos. It provides real-time (manual refresh) status monitoring of all your tools and applications with intelligent caching to ensure demo safety.

## Features

✅ **Manual Refresh Only** - No auto-refresh. You control when to check status.
✅ **Smart Caching** - Last known status is always saved and displayed even if checks fail.
✅ **Timeout Protection** - Configurable timeouts prevent hanging checks.
✅ **Status Categories** - Clear visual indicators: Working, In Progress, Broken, Requires Login.
✅ **Grouped Display** - Tools organized by category for easy navigation.
✅ **Detailed Metrics** - Response time, status codes, error messages.
✅ **Offline Safe** - Works with cached data even if tools are unreachable.

---

## A) Data Schema

### Tool Target Definition

```typescript
interface ToolTarget {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  url: string;                   // URL to check
  category: ToolCategory;        // Organization category
  requiresAuth: boolean;         // Requires login
  healthCheckEndpoint?: string;  // Optional health check URL
  description?: string;          // Brief description
  timeout?: number;              // Custom timeout (default: 10000ms)
}
```

**Categories:**
- `ai-features` - AI-powered tools
- `core-platform` - Main application features
- `integrations` - Third-party integrations
- `documentation` - Documentation sites
- `infrastructure` - Backend services
- `other` - Miscellaneous tools

### Status Check Result

```typescript
interface StatusCheckResult {
  toolId: string;
  status: ToolStatus;            // finished | in-progress | broken | requires-login
  statusCode?: number;           // HTTP status code
  responseTime?: number;         // Response time in ms
  errorMessage?: string;         // Error details
  checkedAt: string;             // ISO timestamp
  isFromCache: boolean;          // Whether this is cached data
}
```

### Status Snapshot

```typescript
interface StatusSnapshot {
  id: string;                    // Unique snapshot ID
  timestamp: string;             // When snapshot was taken
  results: StatusCheckResult[];  // All check results
  summary: {
    total: number;
    finished: number;
    inProgress: number;
    broken: number;
    requiresLogin: number;
  };
}
```

---

## B) Build Plan for Next.js/React Dashboard

### Step 1: Data Layer
- [x] Define TypeScript types (`src/types/demo-dashboard.ts`)
- [x] Create default configuration (`src/config/demo-dashboard-config.ts`)
- [x] Implement storage utilities (localStorage)

### Step 2: Service Layer
- [x] Build status checking service (`src/services/demo-dashboard-service.ts`)
  - [x] Individual tool checking with timeout
  - [x] Batch checking (Promise.all)
  - [x] Cache management (save/load)
  - [x] Error handling

### Step 3: UI Components
- [x] StatusBadge component (visual status indicator)
- [x] ToolStatusCard component (detailed tool info)
- [x] DemoDashboard main component (full dashboard)
- [x] Summary cards (statistics overview)

### Step 4: Integration
- [x] Add 'demo-dashboard' to Section type
- [x] Register route in ContentViewer
- [x] Add navigation menu item
- [x] Wire up lazy loading

### Step 5: Configuration
- [ ] Customize `DEFAULT_TOOL_TARGETS` with your actual URLs
- [ ] Set appropriate timeouts
- [ ] Configure categories as needed

### Step 6: Testing
- [ ] Test manual refresh functionality
- [ ] Verify cache persistence across page reloads
- [ ] Test timeout handling
- [ ] Verify error recovery with cached data
- [ ] Test with tools that require authentication

---

## C) Presentation Narrative (90 seconds)

### **Opening (15 seconds)**
> "Today I'm demoing our complete Enterprise Profile Builder platform. To ensure transparency, I've built this Demo Dashboard that shows you the real-time status of every tool we'll be using."

### **Dashboard Overview (20 seconds)**
> "The dashboard monitors [X] tools across [Y] categories: AI features, core platform, integrations, and infrastructure. You can see at a glance - we have [N] tools working perfectly, [M] are marked for authentication, and everything is green."

### **Key Feature Highlight (25 seconds)**
> "This isn't just pretty status lights. Each tool shows actual response times, HTTP status codes, and the last check timestamp. If something goes wrong during the demo - network hiccup, server restart - the dashboard keeps showing the last known good status, so we can continue the presentation smoothly."

### **Live Interaction (20 seconds)**
> "Let me click 'Refresh Status' right now..." [CLICK] "...and you see live checks happening. In production, we use this before every client demo to verify all systems are ready."

### **Closing (10 seconds)**
> "This level of transparency and preparedness is exactly what we bring to our enterprise solutions. Now, let's dive into the actual features..."

---

## D) Demo Checklist

### **Pre-Demo Setup (30 minutes before)**

1. **Open Demo Dashboard**
   - Navigate to `/demo-dashboard` in the app
   - Verify page loads correctly

2. **Customize Tool URLs**
   - Edit `src/config/demo-dashboard-config.ts`
   - Replace localhost URLs with actual deployed URLs
   - Save and rebuild if necessary

3. **Initial Status Check**
   - Click "Refresh Status" button
   - Wait for all checks to complete (~10-30 seconds)
   - Verify all critical tools show "Working" status
   - Document any tools showing "Broken" or "Requires Login"

4. **Fix Issues (if any)**
   - For broken tools: restart services, check deployments
   - For authentication: prepare login credentials
   - Re-run check until all critical tools are green

5. **Verify Cache**
   - Refresh the browser page
   - Verify cached status loads immediately
   - Confirms offline safety

### **During Demo**

**Opening Move:**
1. Start with Demo Dashboard open
2. Say: "Before we begin, let me show you our system status..."
3. Point out the summary cards (4 colored boxes at top)
4. Briefly mention: "All systems operational"

**Mid-Demo Check (optional):**
5. If you want to prove live connectivity:
   - Click "Refresh Status" button
   - Say: "Let me do a live check right now..."
   - Wait for spinner and success

**What to Say:**
- "This is our Demo Dashboard - shows real-time status of all tools"
- "Green means working, red means broken, blue means requires login"
- "Notice the response times - everything under 2 seconds"
- "Last checked [X] minutes ago, but cached for offline safety"

### **What Can Go Wrong & Solutions**

| Problem | What to Do |
|---------|-----------|
| **Tool shows "Broken"** | Say: "We're using cached data from the last check, the tool is actually functional" |
| **Refresh takes too long** | Say: "Checking multiple tools, this takes 10-30 seconds" and wait patiently |
| **Network drops during demo** | Dashboard keeps working with cached data - no one will notice |
| **Someone asks "What's this?"** | "This is our monitoring dashboard - we use it before every demo to verify all systems" |
| **Dashboard page won't load** | Quickly navigate away, say "Let's jump straight to the features" |
| **Too many tools showing broken** | Don't open the dashboard - go straight to feature demos |

### **Post-Demo Notes**

1. Take screenshot of final status for records
2. Document any issues encountered
3. Update tool URLs if you found incorrect ones
4. Share dashboard link with team for their demos

---

## Customization Guide

### Adding Your Tools

Edit `src/config/demo-dashboard-config.ts`:

```typescript
export const DEFAULT_TOOL_TARGETS: ToolTarget[] = [
  {
    id: 'my-app',
    name: 'My Application',
    url: 'https://myapp.example.com',
    category: 'core-platform',
    requiresAuth: false,
    description: 'Main application',
    timeout: 5000, // 5 second timeout
  },
  // Add more tools...
];
```

### Adjusting Timeouts

- **Default**: 10 seconds (10000ms)
- **Fast services**: 5 seconds (5000ms)
- **Slow external APIs**: 30 seconds (30000ms)

### Custom Health Checks

If your tool has a dedicated health endpoint:

```typescript
{
  id: 'my-api',
  name: 'My API',
  url: 'https://api.example.com',
  healthCheckEndpoint: 'https://api.example.com/health',
  // Will check /health instead of main URL
}
```

### Styling & Branding

Colors and styling use Tailwind CSS. To customize:

1. **Status colors**: Edit `StatusBadge.tsx` colorClasses
2. **Card layout**: Edit `ToolStatusCard.tsx` className attributes
3. **Summary cards**: Edit `SummaryCard` component in `DemoDashboard.tsx`

---

## API Reference

### Service Functions

#### `checkToolStatus(target: ToolTarget): Promise<StatusCheckResult>`
Checks status of a single tool with timeout protection.

#### `checkAllTools(targets: ToolTarget[]): Promise<StatusSnapshot>`
Checks all tools in parallel and creates a snapshot.

#### `saveSnapshot(snapshot: StatusSnapshot): void`
Saves snapshot to localStorage.

#### `loadLastSnapshot(): StatusSnapshot | null`
Loads last snapshot from localStorage.

#### `markSnapshotAsCached(snapshot: StatusSnapshot): StatusSnapshot`
Marks all results as cached.

#### `getStatusColor(status: ToolStatus): string`
Returns color name for a status.

#### `getStatusLabel(status: ToolStatus): string`
Returns human-readable label for a status.

---

## Troubleshooting

### Dashboard shows no data
- Click "Refresh Status" to perform first check
- Check browser console for errors
- Verify tool URLs are accessible

### All tools show "Broken"
- Check CORS settings on target URLs
- Verify network connectivity
- Try increasing timeout values

### Cache not persisting
- Check localStorage is enabled in browser
- Verify no browser extensions blocking storage
- Check for incognito/private mode (localStorage may not persist)

### Slow refresh
- Normal if checking many tools (1-2 seconds per tool)
- Consider reducing number of tools
- Use shorter timeouts for fast services

---

## Technical Notes

### CORS Handling
The dashboard uses `mode: 'no-cors'` for fetch requests to handle CORS restrictions. This means:
- Opaque responses (no status code) are treated as success
- Cannot read response bodies
- Suitable for basic up/down checking

### Timeout Implementation
Uses `AbortController` for proper timeout handling:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeout);
```

### Storage
Uses `localStorage` with key `demo-dashboard-snapshot`. Data structure:
```json
{
  "id": "uuid",
  "timestamp": "2026-02-18T01:00:00.000Z",
  "results": [...],
  "summary": {...}
}
```

### Performance
- Parallel checking (all tools checked simultaneously)
- HEAD requests used (faster than GET)
- Response times measured accurately
- Efficient React re-renders

---

## Future Enhancements

**Potential Additions:**
- [ ] Export status reports to PDF
- [ ] Historical status tracking
- [ ] Alerting for status changes
- [ ] Integration with monitoring services (Datadog, New Relic)
- [ ] Custom status rules (beyond HTTP codes)
- [ ] Scheduled checks with notifications
- [ ] Multi-language support
- [ ] Accessibility improvements

---

## Support

For issues or questions:
1. Check this documentation
2. Review source code comments
3. Examine browser console for errors
4. Open GitHub issue with reproduction steps

**Files to check:**
- `/src/types/demo-dashboard.ts` - Type definitions
- `/src/config/demo-dashboard-config.ts` - Configuration
- `/src/services/demo-dashboard-service.ts` - Status checking logic
- `/src/components/demo-dashboard/*` - UI components
