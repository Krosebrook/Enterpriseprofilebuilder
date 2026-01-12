# UX Developer Implementation Checklist
**Quick Reference for Engineers**

---

## ✅ Accessibility Checklist (P0 Critical)

### Every Time You Create an Icon-Only Button:
```tsx
// ❌ BAD
<Button><SaveIcon /></Button>

// ✅ GOOD
<Button aria-label="Save agent">
  <SaveIcon aria-hidden="true" />
</Button>
```

### Every Time You Create a Form Input:
```tsx
// ❌ BAD
<input placeholder="Name" />

// ✅ GOOD
<Label htmlFor="agent-name">Agent Name</Label>
<Input 
  id="agent-name" 
  placeholder="e.g., Customer Support Bot"
  aria-describedby="name-help"
/>
<p id="name-help" className="text-sm text-gray-500">
  Give your agent a descriptive name
</p>
```

### Every Time You Create a Slider:
```tsx
// ❌ BAD
<Slider value={temp} onChange={setTemp} />

// ✅ GOOD
<Label htmlFor="temperature">Temperature: {temp.toFixed(1)}</Label>
<Slider
  id="temperature"
  value={[temp]}
  onValueChange={(val) => setTemp(val[0])}
  aria-label="Agent temperature"
  aria-valuemin={0}
  aria-valuemax={1}
  aria-valuenow={temp}
  aria-describedby="temp-description"
/>
<p id="temp-description" className="text-xs text-gray-500">
  Lower = consistent, Higher = creative
</p>
```

### Every Time You Display Dynamic Content (Chat, Notifications):
```tsx
// ❌ BAD
<div>{messages.map(msg => <p>{msg.text}</p>)}</div>

// ✅ GOOD
<div 
  role="log"
  aria-live="polite"
  aria-atomic="false"
  aria-label="Chat messages"
>
  {messages.map(msg => (
    <div key={msg.id} role="article" aria-label={`${msg.role} message`}>
      {msg.text}
    </div>
  ))}
</div>
```

### Every Time You Create Tabs:
```tsx
// ❌ BAD
<div onClick={() => setTab('config')}>Config</div>

// ✅ GOOD
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList role="tablist" aria-label="Agent settings">
    <TabsTrigger 
      value="config"
      role="tab"
      aria-selected={activeTab === 'config'}
      aria-controls="config-panel"
    >
      Configuration
    </TabsTrigger>
  </TabsList>
  <TabsContent 
    value="config"
    id="config-panel"
    role="tabpanel"
  >
    {/* Content */}
  </TabsContent>
</Tabs>
```

---

## ✅ Responsive Design Checklist (P1 High)

### Every Time You Create a Layout:
```tsx
// ❌ BAD (Doesn't stack on mobile)
<div className="flex gap-6">
  <div className="w-1/2">Left</div>
  <div className="w-1/2">Right</div>
</div>

// ✅ GOOD (Stacks on mobile)
<div className="flex flex-col lg:flex-row gap-6">
  <div className="w-full lg:w-1/2">Left</div>
  <div className="w-full lg:w-1/2">Right</div>
</div>
```

### Every Time You Create a Button:
```css
/* ❌ BAD - Too small on mobile */
button {
  height: 32px;
  width: auto;
}

/* ✅ GOOD - Touch-friendly */
button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

### Every Time You Create an Input:
```tsx
// ❌ BAD (iOS zooms in on focus)
<Input className="text-14" />

// ✅ GOOD (iOS won't zoom)
<Input className="text-base" /> {/* 16px minimum on mobile */}
```

### Breakpoint Reference:
```tsx
// Use Tailwind responsive prefixes
className="
  text-sm          // Mobile (default)
  sm:text-base     // ≥640px
  md:text-lg       // ≥768px
  lg:text-xl       // ≥1024px
  xl:text-2xl      // ≥1280px
"
```

---

## ✅ Unsaved Changes Checklist (P0 Critical)

### Every Time You Create a Form:
```tsx
function MyForm() {
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    // Compare current state to initial state
    setHasChanges(/* logic */);
  }, [formData]);

  // Browser warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // In-app navigation
  const handleBack = () => {
    if (hasChanges) {
      const confirmed = confirm('You have unsaved changes. Continue?');
      if (!confirmed) return;
    }
    navigate(-1);
  };

  return (
    <>
      {/* Visual indicator */}
      {hasChanges && (
        <div className="flex items-center gap-2 text-orange-600">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Unsaved changes
        </div>
      )}
      {/* Form fields */}
    </>
  );
}
```

---

## ✅ Status Indicator Checklist (P1 High)

### Never Use Color Alone:
```tsx
// ❌ BAD (Color only)
<Badge className="bg-green-500">Active</Badge>
<Badge className="bg-red-500">Error</Badge>

// ✅ GOOD (Icon + Color + Text)
<StatusBadge status="active" />   {/* ✓ Active (green) */}
<StatusBadge status="error" />    {/* ⚠ Error (red) */}
```

### Pattern Library:
- ✅ Active / Success → `<CheckCircle>` + Green
- ❌ Inactive / Disabled → `<XCircle>` + Gray
- ⚠️ Error / Warning → `<AlertTriangle>` + Red/Yellow
- ⏱️ Pending / Loading → `<Clock>` or `<Loader>` + Blue
- ℹ️ Info → `<Info>` + Blue

---

## ✅ Component Reusability Checklist

### Before Creating a Component, Check:
1. ❓ Does this already exist in `/components/ui/*`?
2. ❓ Can I extend an existing component instead?
3. ❓ Will this be used in 3+ places?
4. ❓ Does this need to be configurable?

### Component File Structure:
```
/components/
  ui/                    ← Reusable base components
    Button.tsx
    Input.tsx
    Badge.tsx
  common/                ← Shared app components
    SectionHeader.tsx
    StatusBadge.tsx
  [feature]/             ← Feature-specific components
    AgentCard.tsx
```

---

## ✅ Performance Checklist

### Every Time You Import an Icon:
```tsx
// ❌ BAD (Imports all icons)
import * as Icons from 'lucide-react';

// ✅ GOOD (Tree-shakeable)
import { Save, Send, Settings } from 'lucide-react';
```

### Every Time You Load Images:
```tsx
// ❌ BAD (No lazy loading)
<img src={largeImage} />

// ✅ GOOD (Lazy + optimized)
<img 
  src={optimizedImage}
  loading="lazy"
  alt="Descriptive alt text"
/>
```

### Every Time You Create a List:
```tsx
// ❌ BAD (Re-renders all items)
{agents.map(agent => <AgentCard agent={agent} />)}

// ✅ GOOD (Stable keys)
{agents.map(agent => (
  <AgentCard key={agent.id} agent={agent} />
))}
```

---

## ✅ Error Handling Checklist

### Every Time You Make an API Call:
```tsx
// ❌ BAD (Silent failure)
const data = await fetch('/api/agents');

// ✅ GOOD (User-friendly error)
try {
  const data = await fetch('/api/agents');
  if (!data.ok) throw new Error('Failed to load agents');
  return data.json();
} catch (error) {
  addToast({
    title: 'Error Loading Agents',
    description: 'Please check your connection and try again.',
    type: 'error'
  });
  console.error('Agent fetch error:', error);
}
```

### Error Message Best Practices:
- ❌ "Error 500" → ✅ "Something went wrong. Please try again."
- ❌ "Invalid input" → ✅ "Agent name must be at least 3 characters"
- ❌ "API timeout" → ✅ "Taking longer than expected. Please wait..."

---

## ✅ Code Review Checklist

Before submitting a PR, verify:

### Accessibility:
- [ ] All icon buttons have `aria-label`
- [ ] All form inputs have associated `<Label>`
- [ ] All dynamic content has `aria-live` region
- [ ] Tab order is logical
- [ ] Focus indicators are visible

### Responsive Design:
- [ ] Layout tested at 375px (mobile)
- [ ] Layout tested at 768px (tablet)
- [ ] Layout tested at 1440px (desktop)
- [ ] Touch targets ≥44px on mobile
- [ ] No horizontal scroll at any breakpoint

### Data Integrity:
- [ ] Unsaved changes warning implemented
- [ ] Form validation with error messages
- [ ] Loading states for async actions
- [ ] Error boundaries catch exceptions

### Visual Design:
- [ ] Colors follow design tokens (see Guidelines.md)
- [ ] Spacing uses 4px/8px multiples
- [ ] Typography follows scale (see Guidelines.md)
- [ ] Status indicators use icons + color + text

### Performance:
- [ ] Images lazy-loaded
- [ ] Icons tree-shaken (individual imports)
- [ ] Lists use stable keys
- [ ] No unnecessary re-renders

---

## 🔧 Testing Commands

```bash
# Run accessibility audit
npm run test:a11y

# Run on real devices (Playwright)
npm run test:e2e -- --project=mobile
npm run test:e2e -- --project=tablet
npm run test:e2e -- --project=desktop

# Visual regression
npm run test:visual

# Check bundle size
npm run build
npm run analyze
```

---

## 📚 Reference Links

- **Design Guidelines:** `/guidelines/Guidelines.md`
- **Component Library:** `/components/ui/*`
- **UX Persona Analysis:** `/src/docs/UX_PERSONA_ANALYSIS.md`
- **Implementation Plan:** `/src/docs/UX_FIXES_IMPLEMENTATION_PLAN.md`

---

## 🆘 Common Mistakes to Avoid

### 1. Icon-Only Buttons Without Labels
```tsx
// ❌ WRONG
<Button><Save /></Button>

// ✅ RIGHT
<Button aria-label="Save agent">
  <Save aria-hidden="true" />
</Button>
```

### 2. Color-Only Status
```tsx
// ❌ WRONG
<div className="text-green-500">Active</div>

// ✅ RIGHT
<StatusBadge status="active" /> {/* Icon + color + text */}
```

### 3. No Unsaved Warning
```tsx
// ❌ WRONG
<Button onClick={() => navigate(-1)}>Back</Button>

// ✅ RIGHT
<Button onClick={handleBackWithConfirmation}>Back</Button>
```

### 4. Non-Responsive Layout
```tsx
// ❌ WRONG
<div className="grid grid-cols-2">

// ✅ RIGHT
<div className="grid grid-cols-1 lg:grid-cols-2">
```

### 5. Missing Input Labels
```tsx
// ❌ WRONG
<input placeholder="Name" />

// ✅ RIGHT
<Label htmlFor="name">Name</Label>
<Input id="name" placeholder="e.g., John Doe" />
```

---

## ✨ Pro Tips

1. **Test with keyboard only** - Unplug your mouse for 5 minutes
2. **Test at 200% zoom** - Does the layout break?
3. **Test with screen reader** - Install NVDA (free on Windows)
4. **Test on actual mobile device** - Simulators aren't enough
5. **Use Chrome DevTools** - Lighthouse + aXe + device emulation

---

**Keep this document open while coding!** 

**Questions?** Check `/src/docs/UX_PERSONA_ANALYSIS.md` for detailed examples.

---

**Last Updated:** January 12, 2026  
**Version:** 1.0
