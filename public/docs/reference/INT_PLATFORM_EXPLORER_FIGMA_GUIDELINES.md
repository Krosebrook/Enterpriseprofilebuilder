# INT PLATFORM EXPLORER: FIGMA DESIGN GUIDELINES
## System Guidelines + Extended Design Patterns

---

## GENERAL GUIDELINES

### Layout & Responsiveness
* **Only use absolute positioning when necessary.** Opt for responsive, well-structured layouts using flexbox and grid by default
* **Mobile-first approach:** Design for 375px minimum width, scale up to 1920px maximum
* **Breakpoints:** 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
* **Spacing scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px (use multiples of 4)
* **Max container width:** 1200px for content, 1440px for full-bleed sections
* **Grid system:** 12-column grid for desktop, 4-column for tablet, 2-column for mobile

### Code & Component Organization
* **Refactor components as you go.** Keep individual component files <300 lines
* **One component per file.** Helper functions and utilities in separate `utils/` folder
* **Component naming:** PascalCase for components (PlatformCard.tsx), kebab-case for files (platform-card.tsx)
* **Avoid component props drilling:** Use Zustand store for state that multiple components need
* **Accessibility first:** Every interactive element needs keyboard nav, ARIA labels, and focus states
* **Keep exports clean:** Use barrel exports (index.ts) for component folders

### Color & Contrast
* **Color contrast minimum:** 4.5:1 for normal text, 3:1 for large text (WCAG AA)
* **Never rely on color alone:** Use icons, patterns, or text labels alongside color
* **Test all colors** with WCAG contrast checker before finalizing
* **Dark mode support:** Design tokens should include light/dark variants from day one

### Consistency & Quality Gates
* **One source of truth:** Figma tokens = CSS variables = React component props
* **Before shipping:** 0 accessibility issues, Lighthouse 95+, <1% error rate
* **Visual regression testing:** Screenshot all components in light/dark modes
* **Performance first:** Lazy-load images, code-split components, optimize bundles

---

## DESIGN SYSTEM GUIDELINES

### Typography System
* **Base font-size:** 16px (for root sizing reference)
* **Font family:** Inter for UI, JetBrains Mono for code
* **Font weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
* **Line height:** 1.5 for body text, 1.2 for headings, 1.4 for lists
* **Letter spacing:** 0 for body, -0.01em for headings >24px

| Scale | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1** | 32px | 700 | 1.2 | Page titles |
| **H2** | 24px | 700 | 1.2 | Section headers |
| **H3** | 20px | 600 | 1.3 | Subsection headers |
| **H4** | 16px | 600 | 1.4 | Card titles |
| **Body** | 14px | 400 | 1.5 | Main text content |
| **Small** | 12px | 400 | 1.4 | Helper text, labels |
| **Tiny** | 11px | 500 | 1.3 | Badges, timestamps |
| **Code** | 13px | 400 | 1.6 | Code blocks, monospace |

### Color Palette

#### Primary Colors
| Token | Value | Use Case |
|-------|-------|----------|
| **primary** | #E88A1D (Orange) | CTAs, active states, highlights |
| **primary-hover** | #D07614 | Hover states on primary |
| **primary-active** | #B85C0C | Pressed/active states |
| **primary-disabled** | #F0C9A1 | Disabled buttons |

#### Semantic Colors
| Token | Light | Dark | Use Case |
|-------|-------|------|----------|
| **success** | #10B981 | #6EE7B7 | Approved, passed, active |
| **warning** | #F59E0B | #FCD34D | Caution, pending, needs attention |
| **error** | #EF4444 | #FCA5A5 | Errors, failed, blocked |
| **info** | #3B82F6 | #93C5FD | Information, neutral alerts |

#### Neutral Colors (Light Mode)
| Token | Value | Use Case |
|-------|-------|----------|
| **gray-50** | #F9FAFB | Backgrounds, hover states |
| **gray-100** | #F3F4F6 | Subtle backgrounds |
| **gray-200** | #E5E7EB | Borders, dividers |
| **gray-300** | #D1D5DB | Subtle borders |
| **gray-600** | #4B5563 | Secondary text |
| **gray-900** | #111827 | Primary text |

#### Neutral Colors (Dark Mode)
| Token | Value | Use Case |
|-------|-------|----------|
| **gray-50-dark** | #09090B | Primary text |
| **gray-900-dark** | #F9FAFB | Backgrounds |
| **gray-800-dark** | #18181B | Card backgrounds |

#### Background Colors
| Token | Value | Use Case |
|-------|-------|----------|
| **bg-default** | #FFFCF8 (Warm white) | Page background |
| **bg-card** | #FFFFFF | Card backgrounds |
| **bg-elevated** | #F9FAFB | Elevated surfaces (modals) |
| **bg-overlay** | rgba(17, 24, 39, 0.5) | Modal overlay |

### Spacing System
* **Use 8px base unit:** All spacing should be multiples of 4px or 8px
* **Consistent gaps:** Use 8px, 12px, 16px, 24px, 32px, 48px
* **Card padding:** 16px (mobile), 24px (desktop)
* **Section margins:** 32px (mobile), 48px (desktop)
* **Container margins:** 16px horizontal (mobile), 32px (tablet), 64px (desktop)

### Border Radius
| Token | Value | Use Case |
|-------|-------|----------|
| **radius-none** | 0px | Sharp corners (rare) |
| **radius-sm** | 4px | Small inputs, badges |
| **radius-md** | 6px | Most components |
| **radius-lg** | 8px | Cards, modals |
| **radius-xl** | 12px | Large sections |
| **radius-full** | 9999px | Pills, avatars |

### Shadow System
| Token | CSS | Use Case |
|-------|-----|----------|
| **shadow-sm** | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| **shadow-md** | 0 4px 6px rgba(0,0,0,0.1) | Card hover, dropdowns |
| **shadow-lg** | 0 10px 15px rgba(0,0,0,0.1) | Modals, elevated content |
| **shadow-xl** | 0 20px 25px rgba(0,0,0,0.15) | Maximum elevation |

---

## COMPONENT GUIDELINES

### Buttons

#### Primary Button
* **Purpose:** Main action in a section/page (submit, create, save)
* **Visual:** Solid fill with primary color (#E88A1D), white text
* **Padding:** 10px 16px (small), 12px 20px (medium), 14px 24px (large)
* **Border radius:** 6px
* **States:**
  - **Normal:** #E88A1D background, white text
  - **Hover:** #D07614 (darker), slight shadow increase
  - **Active:** #B85C0C (even darker), no shadow
  - **Disabled:** #F0C9A1 background, 50% opacity
  - **Loading:** Show spinner, disable interaction
* **Never use more than one primary button per section**
* **Icons:** Always 16px × 16px, left-aligned with 8px gap

#### Secondary Button
* **Purpose:** Alternative or supporting actions
* **Visual:** Outlined with primary color, transparent background, border 2px
* **Padding:** Same as primary
* **Border radius:** 6px
* **States:**
  - **Normal:** 2px border #E88A1D, #E88A1D text
  - **Hover:** Light fill #FEF3E2
  - **Active:** #E88A1D text, darker border
  - **Disabled:** Border #D1D5DB, text #9CA3AF

#### Tertiary Button
* **Purpose:** Least important actions (cancel, dismiss, learn more)
* **Visual:** Text-only, no border, no fill
* **Padding:** Same vertical, less horizontal (8px 12px)
* **States:**
  - **Normal:** Text #3B82F6 (blue)
  - **Hover:** Text #1D4ED8 (darker blue), light background
  - **Active:** Darker text, no background
  - **Disabled:** Text #D1D5DB (gray)

#### Button Size Grid
| Size | Height | Padding | Font |
|------|--------|---------|------|
| **sm** | 32px | 8px 12px | 12px semibold |
| **md** | 40px | 10px 16px | 14px semibold |
| **lg** | 48px | 12px 20px | 16px semibold |

### Text Inputs

#### Standard Input
* **Height:** 40px
* **Border:** 1px #D1D5DB, 2px #3B82F6 on focus
* **Padding:** 8px 12px
* **Border radius:** 6px
* **Font size:** 14px
* **Background:** #FFFFFF
* **Placeholder color:** #9CA3AF (gray-400)
* **Focus outline:** 2px solid #3B82F6, offset 2px

#### Error State
* **Border:** 2px #EF4444 (red)
* **Icon:** Red error icon (16px) on right
* **Message:** 12px red text below input, margin-top 4px

#### Disabled State
* **Background:** #F9FAFB (gray-50)
* **Border:** 1px #E5E7EB (gray-200)
* **Text:** #9CA3AF (gray-400)
* **Cursor:** not-allowed

### Cards

#### Standard Card
* **Background:** #FFFFFF
* **Border:** 1px #E5E7EB, no shadow by default
* **Border radius:** 8px
* **Padding:** 16px (mobile), 24px (desktop)
* **Spacing between cards:** 16px
* **Hover state:** 
  - Border changes to #D1D5DB
  - Add 0 4px 6px rgba(0,0,0,0.1) shadow
  - Slight scale up (1.02) if clickable

#### Platform Card (v3.1 style)
* **Width:** Full on mobile, 300px on desktop (3-column grid)
* **Height:** Auto (flexible)
* **Header:** 
  - Title (16px bold) + provider name (12px gray)
  - Priority badge (top right): 8px padding, 4px border radius
* **Description:** 14px body text, 2-line truncation with ellipsis
* **Quick stats grid:** 2 columns, 16px gap, background #F9FAFB
* **Footer buttons:** Primary (Add to Compare), secondary (Details)
* **Selected state:** 2px border #E88A1D, shadow-lg

### Modals

#### Standard Modal
* **Overlay:** rgba(17, 24, 39, 0.5), backdrop blur 4px
* **Modal size:** 
  - Mobile: 95vw, max 400px
  - Desktop: 600px (small), 800px (medium), 1000px (large)
* **Border radius:** 12px
* **Background:** #FFFFFF
* **Box shadow:** 0 20px 25px rgba(0,0,0,0.15)
* **Padding:** 24px
* **Close button:** Top right, 32px × 32px icon button

#### Modal Header
* **Title:** 20px bold (H3)
* **Subtitle:** 14px gray text below title
* **Always include close button (X icon)**

#### Modal Footer
* **Buttons:** Right-aligned, 12px gap
* **Primary button on right:** Save/Submit
* **Secondary button on left:** Cancel/Close
* **Sticky to bottom** of modal with border-top

### Navigation Tabs

#### Tab Bar
* **Background:** #FFFFFF
* **Border-bottom:** 2px #E5E7EB
* **Height:** 56px
* **Padding:** 0 16px (mobile), 0 32px (desktop)

#### Tab Item
* **Inactive:**
  - Text: 14px semibold #666
  - Border-bottom: 2px transparent
  - Padding: 16px 12px
* **Active:**
  - Text: 14px semibold #E88A1D
  - Border-bottom: 2px solid #E88A1D
  - Background: transparent
* **Hover:**
  - Text: #333
  - Border-bottom: 2px #D1D5DB (preview of active)
* **Icon + text:** 6px gap, 16px icon size

### Filters & Dropdowns

#### Filter Button
* **State: Default**
  - Style: Secondary button with filter icon (16px)
  - Text: "Filter" or specific filter name
* **State: Active**
  - Background: Light #FEF3E2
  - Badge count: Red #EF4444 in top-right corner
* **Dropdown:** Opens below button, 200px min width

#### Dropdown Menu
* **Background:** #FFFFFF
* **Border:** 1px #E5E7EB
* **Shadow:** shadow-lg
* **Border radius:** 8px
* **Z-index:** 1000 (above other content)
* **Item padding:** 12px 16px
* **Item hover:** Background #F9FAFB
* **Item height:** 40px
* **Separator:** 1px #E5E7EB between sections

### Search Input

#### Search Field
* **Width:** Full width on mobile, max 300px on desktop
* **Height:** 40px
* **Icon:** Search icon (16px) on left with 8px padding
* **Padding:** 8px 12px 8px 36px (to accommodate icon)
* **Placeholder:** "Search platforms, features, vendors..."
* **Clear button:** X icon (16px) on right when input has text

#### Search Results
* **Display as dropdown** below search field
* **Item:** 40px height, 12px padding, hover #F9FAFB
* **Match highlighting:** Bold #E88A1D
* **Max height:** 300px, scrollable if overflow

### Badges & Labels

#### Badge Styles
| Type | Background | Text Color | Use Case |
|------|-----------|-----------|----------|
| **Primary** | #E88A1D | White | Selected, active |
| **Success** | #D1FAE5 | #047857 | Approved, passed |
| **Warning** | #FEF3C7 | #D97706 | Pending, attention |
| **Error** | #FEE2E2 | #DC2626 | Failed, blocked |
| **Neutral** | #F3F4F6 | #374151 | Informational |

#### Badge Specifications
* **Padding:** 4px 8px
* **Border radius:** 4px (sm) or 12px (pill)
* **Font:** 12px semibold
* **Height:** 24px (pill), 20px (rectangular)
* **Max width:** 100px with text truncation
* **Icon:** 12px × 12px, left-aligned with 4px gap

### Comparison Matrix

#### Table Header
* **Background:** #F9FAFB
* **Border-bottom:** 2px #E5E7EB
* **Padding:** 12px 16px
* **Font:** 12px semibold uppercase, #666
* **Sticky header:** Stays visible when scrolling

#### Table Rows
* **Height:** 48px
* **Padding:** 12px 16px
* **Border-bottom:** 1px #E5E7EB
* **Alternating background:** Every even row #F9FAFB (subtle stripe)
* **Hover state:** Background #F3F4F6

#### Table Cells
* **Min width:** 120px for platform names, 80px for features
* **Text alignment:** Left-aligned for text, center for checkmarks
* **Checkmark:** ✓ in #10B981 (success green)
* **Partial support:** ~ in #F59E0B (warning amber)

### Comparison View
* **Max platforms:** 4 side-by-side
* **Card width:** 250px on desktop, full width on mobile
* **Vertical alignment:** All cards should be same height
* **Sticky action buttons:** Bottom-aligned across all cards
* **Remove button:** X icon in top-right, only visible on hover

### ROI Calculator

#### Input Section
* **Layout:** 2-column grid on desktop, 1 column on mobile
* **Label:** 12px semibold, #333, margin-bottom 4px
* **Input:** Standard 40px input with unit label on right (12px gray)
* **Helper text:** 12px gray below input for context

#### Results Section
* **Result card:** Each metric in own card (bg #F9FAFB, border 1px #E5E7EB)
* **Metric name:** 12px semibold gray (label)
* **Metric value:** 24px bold #333 (primary value)
* **Metric delta:** 12px green text (change indicator)
* **Tooltip on hover:** Show calculation details

#### Chart Visualization
* **Type:** Bar or line chart showing ROI over time
* **Colors:** 
  - Primary metric: #E88A1D
  - Comparison metric: #3B82F6
* **Grid lines:** 1px #E5E7EB
* **Legend:** Below chart, 12px text
* **Interactive:** Hover to show exact values

### Assessment Survey

#### Progress Indicator
* **Style:** Step dots or progress bar
* **Position:** Top of card/modal
* **Current step:** Filled #E88A1D circle with number
* **Completed steps:** Checkmark in filled circle
* **Future steps:** Empty circle with number

#### Question Card
* **Layout:** 
  - Question (16px semibold) at top
  - Description/context (12px gray) below
  - 16px gap, then options below
* **Option layout:** 
  - Radio buttons (single select) or checkboxes (multi)
  - 8px padding around, full-width clickable area
  - 12px text, left-aligned after icon
* **Selected state:** 
  - Background #FEF3E2
  - Border 2px #E88A1D
* **Error state:** 
  - Red border 2px #EF4444
  - Error text below: "This field is required"

#### Navigation
* **Back button:** Secondary (disabled if step 1)
* **Next button:** Primary (disabled if validation fails)
* **Submit button:** Primary, large, on final step

---

## ADD YOUR OWN GUIDELINES HERE

### Extended Guidelines: 10 Additional Best Practices

#### 1. **Data Visualization Standards**
* **Chart types:** Bar charts for comparisons, line charts for trends, pie charts only for 2–5 categories max
* **Color usage:** Use sequential or diverging color scales, never rainbow gradients
* **Tooltips:** Show exact values on hover, include units (e.g., "$13,350/year")
* **Labels:** All axes must be labeled with units; use abbreviations where space is tight (e.g., "Cost ($K)")
* **Legend:** Always include; place outside chart area or inside upper-right corner if space allows
* **Data point clarity:** Use distinct shapes (circles, squares) for different data series
* **Grid lines:** Light gray 1px for readability, never too dark
* **Responsive:** Stack charts vertically on mobile if side-by-side doesn't fit

#### 2. **Loading & Empty States**
* **Loading skeleton:** Show placeholder with 8px rounded bars matching content layout, animated 1s fade loop
* **Loading spinner:** 24px–32px diameter, 2px stroke, rotating indefinitely
* **Timeout:** Show error message after 30s of loading ("Check your connection")
* **Empty state:**
  - Centered illustration (120px square max)
  - Headline: 16px semibold describing situation
  - Description: 14px gray text with action
  - CTA button: "Create First [Item]" or "Import Data"
* **Skeleton color:** #E5E7EB (gray-200) with subtle shimmer animation
* **Error skeletons:** Red tint, "Try again" button overlaid

#### 3. **Form Validation & Error Handling**
* **Real-time validation:** Show errors on blur (not onChange), highlight field with red border
* **Inline errors:** Below field, 12px red text (#EF4444), with icon (⚠️)
* **Contextual help:** Gray 12px text above input explaining what to enter (e.g., "e.g., john@example.com")
* **Success validation:** Green checkmark (#10B981) on right side of field after valid input
* **Form-level errors:** Red banner at top with icon + "Please fix X errors" + scroll to first error on submit
* **Phone numbers:** Auto-format as user types (e.g., "+1 (555) 123-4567")
* **Dates:** Use consistent format "Jun 10, 2025" (never MM/DD/YYYY or other ambiguous formats)
* **Disabled vs. hidden fields:** Disabled (grayed out, 50% opacity) > hidden (confuses users)

#### 4. **Navigation & Information Architecture**
* **Breadcrumbs:** Always show on desktop, mobile drawer instead of breadcrumbs
* **Back button:** Always available (chevron + "Back"), click takes user to previous page state (not homepage)
* **Active state:** Current page highlighted in nav with bold + colored left border
* **Hover states:** All nav items show subtle background change on hover
* **Mobile nav:** Hamburger menu (3 horizontal lines), slide-out drawer from left, 250px width
* **Sticky header:** Keep main nav visible when scrolling (but allow hide on scroll down, show on scroll up)
* **Footer links:** Grouped by category (Product, Company, Legal), each <5 links

#### 5. **Accessibility & Inclusive Design**
* **Keyboard navigation:** All interactive elements accessible via Tab key (visual focus indicator 2px blue border)
* **ARIA labels:** Buttons need aria-label if icon-only; forms need associated label elements
* **Screen reader support:** Don't hide visual text; use aria-hidden for decorative icons
* **Color blindness:** Always pair colors with patterns (stripes, dots) in data viz
* **Font sizes:** Never below 12px; 14px minimum for body text
* **Touch targets:** All clickable elements ≥44px × 44px (mobile requirement)
* **Skip links:** "Skip to main content" link hidden by default, visible on first Tab
* **Alt text:** Every image needs alt text describing purpose (not "image.jpg")
* **Semantic HTML:** Use `<button>` not `<div onclick>`, use `<label>` for form inputs
* **Motion:** Respect prefers-reduced-motion CSS media query; disable animations if user preference set

#### 6. **Performance & Optimization**
* **Image optimization:** Max 100KB per image on web; use WebP with JPEG fallback; lazy-load below fold
* **Font loading:** Limit to 2 font families, 3 weights max; use system fonts as fallback
* **Code splitting:** Lazy-load views (Assessment, Financial) only when user navigates there
* **Bundle size:** Keep JS <150KB gzipped; if larger, code-split further
* **Caching strategy:** Platform data cached 5 min; user preferences cached indefinitely
* **API throttling:** No more than 1 request/second from UI; debounce search input 300ms
* **CSS:** Use critical CSS (inline above fold), defer non-critical styles
* **Third-party scripts:** Load after page interactive; Google Analytics, Sentry deferred
* **Monitoring:** Track Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), First Input Delay (FID)

#### 7. **Micro-interactions & Animations**
* **Transition duration:** 150ms for interactive (hover), 300ms for page transitions, 500ms for modals
* **Easing function:** Use ease-in-out for most animations; ease-out for entrance, ease-in for exit
* **Hover feedback:** Subtle (background color change OR slight scale 1.02 OR shadow increase)
* **Button press:** 50ms darker background, no delay (feels responsive)
* **Loading spinner:** 1s rotation loop, no easing (linear)
* **Tooltip entrance:** Fade in 150ms, offset 4px from trigger
* **Drawer slide:** 300ms slide from left/right edge, hardware accelerated (transform: translateX)
* **Page transition:** Fade out current (150ms), fade in new (150ms) = 300ms total
* **Avoid:** Bouncy animations, >500ms durations (feels slow), multiple simultaneous animations

#### 8. **Dark Mode Implementation**
* **Color tokens:** Define light & dark variants for every color
  - Text: #111827 (light), #F9FAFB (dark)
  - Background: #FFFCF8 (light), #09090B (dark)
  - Card: #FFFFFF (light), #18181B (dark)
* **CSS variable approach:** `--color-text: var(--color-text-light)` in light mode, override in dark mode
* **System preference:** Use `prefers-color-scheme: dark` media query to detect OS setting
* **Toggle button:** Show sun/moon icon in header; click to toggle + save preference to localStorage
* **Smooth transition:** 200ms fade when switching modes
* **Images:** May need lightened for dark backgrounds (use CSS filter: brightness)
* **Contrast check:** Revalidate all colors in dark mode (especially grays)

#### 9. **Export & Sharing Features**
* **Export formats:** PDF (formatted), CSV (data), JSON (raw), Markdown (readable)
* **PDF generation:** Include header (company name, date), footer (page number), page breaks before new sections
* **CSV export:** Include headers, escape special characters, handle Unicode properly
* **JSON export:** Pretty-print (2-space indent), include metadata (exportDate, platform, version)
* **Markdown export:** Use heading hierarchy (# ## ###), bold for titles, bullet lists for features
* **Sharing:** Generate short URL with comparison ID (e.g., int.app/compare/abc123), shareable by email
* **Watermark:** "Generated by INT Platform Explorer v4.0" at bottom of exports
* **Timestamp:** Always include export date/time in file name and footer

#### 10. **Analytics & User Feedback**
* **Event tracking:** Track: view platform, add to comparison, export downloaded, assessment completed, ROI calculated
* **Event data:** Include platform name, timestamp, user ID (hashed), session ID, feature used
* **Funnel tracking:** Track drop-off: Explorer → Add to Compare → Export Download (where do users leave?)
* **User feedback:** Add "Was this helpful?" toggle on assessment results, collect open feedback
* **A/B testing:** Randomize button colors, copy, order; track which converts better
* **Dashboard metrics:**
  - Daily active users (DAU)
  - Average session duration (target: >3 min)
  - Export download rate (target: >10% of sessions)
  - Assessment completion rate (target: >20%)
  - Feature usage heatmap (which tabs get most traffic?)
* **Alerts:** Page >1% error rate, >1s p95 latency, <95% uptime for 1 hour
* **Privacy:** Hash user IDs, don't track PII, comply with GDPR/CCPA, offer opt-out option
* **Retention:** Track weekly active users, monthly return rate; set target: 40% weekly retention

---

## QUALITY GATES (BEFORE SHIPPING)

- [ ] **Design consistency:** All colors match design tokens, typography follows scale
- [ ] **Accessibility:** WCAG AA compliant (4.5:1 contrast, keyboard nav works, ARIA labels present)
- [ ] **Responsive:** Mobile (375px), tablet (768px), desktop (1440px) all work without horizontal scroll
- [ ] **Performance:** Lighthouse 95+, First Paint <1.5s, TTI <3s, Bundle <150KB gzipped
- [ ] **Interactions:** All hover states, focus states, disabled states, error states defined
- [ ] **Loading states:** Skeleton loaders or spinners for all data-fetching components
- [ ] **Empty states:** Designed UI for zero data, error states, timeout states
- [ ] **Cross-browser:** Tested on Chrome, Firefox, Safari, Edge (latest versions)
- [ ] **Dark mode:** All colors work in light and dark modes
- [ ] **Animations:** 150ms–500ms durations, ease-in-out timing, no jank
- [ ] **Error handling:** User-friendly error messages (not stack traces)
- [ ] **Spacing:** All padding/margin multiples of 4px or 8px
- [ ] **Typography:** Headings bold, body regular, proper font sizes applied
- [ ] **Images:** Optimized (<100KB), lazy-loaded, alt text present
- [ ] **Forms:** All inputs have labels, validation messages, error states
- [ ] **Security:** No sensitive data in localStorage, form data encrypted in transit
- [ ] **Internationalization:** Prepared for future multi-language support (date format, text direction)

---

## COMPONENT INVENTORY (Ready for Development)

### Atomic Components (Reusable)
- Button (Primary, Secondary, Tertiary, sizes: sm/md/lg)
- Input (Text, number, email, search, with error/success states)
- Checkbox & Radio
- Dropdown & Select
- Badge & Label
- Card (standard, platform, elevated)
- Modal (small, medium, large)
- Tabs
- Toast/Notification
- Loader/Spinner
- Icon set (20px, 24px)

### Composite Components (Built from atoms)
- Search bar (with icon, clear button, results dropdown)
- Filter panel (collapsible, multiple select options)
- Platform card (title, stats, actions)
- Comparison matrix (sticky header, responsive)
- ROI calculator (inputs, results, chart)
- Assessment form (progress, questions, validation)
- Navigation (header, tabs, drawer)

### Page Layouts
- Explorer page (grid of platforms + filters)
- Assessment page (form + results)
- Comparison page (side-by-side cards)
- Financial page (ROI, calculator, insights)
- Glossary page (searchable terms + sources)

---

**Status:** Design system complete, ready for handoff to development team  
**Next:** Export design tokens to CSS, implement component library in React  
**Questions:** Reference component guidelines above, ensure all quality gates pass before shipping
