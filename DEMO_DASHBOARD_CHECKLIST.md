# Demo Dashboard - Quick Checklist

## 🎯 Pre-Demo Setup (30 min before)

### 1. Configure Your Tools
- [ ] Open `src/config/demo-dashboard-config.ts`
- [ ] Update `DEFAULT_TOOL_TARGETS` with your actual URLs
- [ ] Set appropriate timeouts (default: 10s)
- [ ] Save file and rebuild if needed: `npm run build`

### 2. Navigate to Dashboard
- [ ] Open your app
- [ ] Go to "Demo Dashboard" in navigation menu
- [ ] Or directly navigate to `/#demo-dashboard` or set `activeSection` to `demo-dashboard`

### 3. Initial Status Check
- [ ] Click "Refresh Status" button
- [ ] Wait for all checks to complete (10-30 seconds)
- [ ] Review all tools - note any broken ones

### 4. Fix Any Issues
- [ ] **Green (Working)**: ✅ Good to go
- [ ] **Blue (Requires Login)**: ✅ Expected
- [ ] **Red (Broken)**: ⚠️ Fix or document
- [ ] **Yellow (In Progress)**: ⚠️ Investigate

### 5. Verify Cache Works
- [ ] Refresh browser page (F5)
- [ ] Verify cached status appears immediately
- [ ] This proves offline safety

---

## 🎤 During Demo

### Opening (Show the Dashboard)
- [ ] Start with dashboard visible
- [ ] Point out summary cards: "All systems operational"
- [ ] Briefly explain what it does (15 seconds)

### Mid-Demo (Optional Live Check)
- [ ] Click "Refresh Status" if you want to show live checking
- [ ] Wait for completion
- [ ] Point out live response times

### Key Talking Points
- "Shows real-time status of all our tools"
- "Smart caching ensures demo safety"
- "Response times under 2 seconds"
- "Used before every client presentation"

---

## ⚠️ Emergency Handling

| If This Happens | Do This |
|-----------------|---------|
| Tool shows broken | "Using cached data - tool is functional" |
| Refresh is slow | "Checking multiple tools, takes 10-30 seconds" |
| Network fails | Dashboard works with cache - continue normally |
| Page won't load | Skip to features: "Let's dive straight into the tools" |
| Many broken tools | Don't show dashboard - go straight to demos |

---

## 📝 Post-Demo

- [ ] Take screenshot of final status
- [ ] Document any issues
- [ ] Update URLs if needed
- [ ] Share dashboard access with team

---

## 🔧 Quick Customization

**Add a tool:**
```typescript
{
  id: 'my-tool',
  name: 'My Tool',
  url: 'https://example.com',
  category: 'core-platform',
  requiresAuth: false,
}
```

**Change timeout:**
```typescript
timeout: 5000, // 5 seconds instead of default 10s
```

**Use health check endpoint:**
```typescript
healthCheckEndpoint: 'https://example.com/health',
```

---

## 📚 Full Documentation

See `DEMO_DASHBOARD_GUIDE.md` for complete documentation including:
- Complete data schemas
- Full build plan
- 90-second presentation narrative
- Technical implementation details
- Troubleshooting guide
