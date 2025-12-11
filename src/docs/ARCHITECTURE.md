# Architecture Documentation

**INT Inc Enterprise Claude Profile Builder**

---

## Table of Contents

1. [Overview](#overview)
2. [Architectural Principles](#architectural-principles)
3. [System Architecture](#system-architecture)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [Performance Architecture](#performance-architecture)
8. [Security Architecture](#security-architecture)
9. [Scalability](#scalability)
10. [Decision Records](#decision-records)

---

## Overview

The INT Inc Claude Profile Builder is architected as a **client-side, data-driven documentation platform** with emphasis on modularity, type safety, and performance. The architecture follows modern React patterns with a clear separation of concerns across presentation, business logic, and data layers.

### Design Goals

1. **Maintainability** - Easy to update content without touching code
2. **Scalability** - Can grow to 100+ pages without performance degradation
3. **Type Safety** - Zero runtime type errors through TypeScript strict mode
4. **Performance** - Sub-second load times, instant interactions
5. **Accessibility** - WCAG 2.1 AA compliant throughout
6. **Security** - No data leakage, audit-ready logging

---

## Architectural Principles

### 1. **Data-Driven Design**

```
Content (Data)  →  Transform (Logic)  →  Render (Components)
```

**Benefits:**
- Content updates don't require code changes
- Easy to version control documentation
- Enables automated testing of content
- Supports multi-language expansion

**Example:**
```typescript
// Data layer - /data/faq.ts
export const faqData: FAQItem[] = [
  { id: 'faq-001', question: '...', answer: '...', level: 'beginner' }
];

// Component layer - /components/sections/FAQ.tsx
export function FAQ() {
  return faqData.map(item => <FAQCard key={item.id} {...item} />);
}
```

### 2. **Composition Over Inheritance**

```
Atomic Components  →  Molecular Components  →  Organism Components
```

**Example:**
```typescript
// Atom
<Button variant="primary">Click Me</Button>

// Molecule
<Card>
  <Badge>New</Badge>
  <Button>Action</Button>
</Card>

// Organism
<Section>
  <Card>...</Card>
  <Card>...</Card>
</Section>
```

### 3. **Single Responsibility**

Each module has one reason to change:

- **Components** - Render UI
- **Hooks** - Encapsulate stateful logic
- **Utils** - Pure functions for transformations
- **Data** - Source of truth for content
- **Types** - Type definitions

### 4. **Dependency Injection**

```typescript
// Configuration is injected, not hard-coded
function SearchBar({ config }: { config: SearchConfig }) {
  const debounceMs = config.debounceMs;
  // ...
}

// Default configuration provided at root
<App config={APP_CONFIG} />
```

### 5. **Offline-First**

```
User Action → LocalStorage → UI Update → Analytics
     ↓
No Network Required
```

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Client)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Presentation Layer (React)               │  │
│  │  ┌────────────┐  ┌──────────┐  ┌─────────────┐  │  │
│  │  │ Components │  │  Styles  │  │  Templates  │  │  │
│  │  └────────────┘  └──────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↑↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Business Logic Layer (Hooks/Utils)        │  │
│  │  ┌────────────┐  ┌──────────┐  ┌─────────────┐  │  │
│  │  │   Hooks    │  │  Utils   │  │  Services   │  │  │
│  │  └────────────┘  └──────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↑↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Data Layer (State/Storage)             │  │
│  │  ┌────────────┐  ┌──────────┐  ┌─────────────┐  │  │
│  │  │    Data    │  │  Storage │  │  Analytics  │  │  │
│  │  └────────────┘  └──────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↑↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Infrastructure Layer                 │  │
│  │  ┌────────────┐  ┌──────────┐  ┌─────────────┐  │  │
│  │  │   Config   │  │  Logger  │  │   Errors    │  │  │
│  │  └────────────┘  └──────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↑↓
           ┌──────────────────────────────┐
           │   Browser LocalStorage API    │
           └──────────────────────────────┘
```

### Layer Responsibilities

#### Presentation Layer
- **Responsibility**: Render UI, handle user interactions
- **Technologies**: React 18, Tailwind CSS, Lucide Icons
- **Key Patterns**: Component composition, prop drilling prevention
- **Output**: DOM updates

#### Business Logic Layer
- **Responsibility**: Process data, implement features
- **Technologies**: Custom hooks, utility functions
- **Key Patterns**: Hook composition, pure functions
- **Output**: Transformed data, side effects

#### Data Layer
- **Responsibility**: Manage state, persist data
- **Technologies**: React state, LocalStorage
- **Key Patterns**: Single source of truth, immutability
- **Output**: Application state

#### Infrastructure Layer
- **Responsibility**: Cross-cutting concerns
- **Technologies**: TypeScript, configuration objects
- **Key Patterns**: Dependency injection, error boundaries
- **Output**: Logs, errors, metrics

---

## Component Architecture

### Component Hierarchy

```
App (Root)
├── Navigation (Sidebar)
│   ├── NavigationItem[]
│   └── Badge[]
├── Header
│   ├── RoleSelector
│   ├── SearchBar
│   │   └── SearchResults
│   │       └── SearchResultItem[]
│   └── PrintButton
├── Main (Content Area)
│   └── ContentViewer
│       ├── Overview
│       ├── BaselinePrompt
│       ├── FeatureGuides
│       │   ├── WebSearchGuide
│       │   ├── MemoryGuide
│       │   ├── ArtifactsGuide
│       │   ├── CodeExecutionGuide
│       │   └── FilesGuide
│       ├── ToolsConnectors
│       ├── RoleProfiles
│       ├── BestPractices
│       ├── FAQ
│       │   └── FAQItem[]
│       └── Deployment
│           └── DeploymentStep[]
├── Footer
└── UI Components
    ├── Button
    ├── Badge
    ├── Card
    ├── Toast (ToastContainer)
    ├── ProgressBar
    ├── Tooltip
    └── BookmarkButton
```

### Component Categories

#### 1. **Layout Components**
```typescript
// Manage page structure
<Navigation />
<Header />
<Main />
<Footer />
```

#### 2. **Container Components**
```typescript
// Manage data and state
<ContentViewer section={activeSection} />
<Deployment onAddToast={addToast} />
```

#### 3. **Presentational Components**
```typescript
// Pure rendering, no state
<Button variant="primary">Click</Button>
<Badge variant="success">Active</Badge>
```

#### 4. **Feature Components**
```typescript
// Specific features
<SearchBar onSearch={handleSearch} />
<BookmarkButton id="item-123" />
```

### Component Design Patterns

#### Pattern 1: Compound Components

```typescript
// Parent provides context
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

#### Pattern 2: Render Props

```typescript
<DataProvider>
  {({ data, loading }) => (
    loading ? <Spinner /> : <Content data={data} />
  )}
</DataProvider>
```

#### Pattern 3: Higher-Order Components

```typescript
const WithAnalytics = (Component) => (props) => {
  useEffect(() => trackPageView(), []);
  return <Component {...props} />;
};

export default WithAnalytics(MyPage);
```

---

## Data Flow

### Unidirectional Data Flow

```
User Action
    ↓
Event Handler
    ↓
State Update
    ↓
Re-render
    ↓
DOM Update
    ↓
User Sees Change
```

### Example: Search Flow

```typescript
// 1. User types in search box
<SearchBar onChange={handleSearchChange} />

// 2. Event fires with query
const handleSearchChange = (query: string) => {
  setSearchQuery(query);
};

// 3. Hook performs search (debounced)
const { results } = useSearch(searchQuery, 300);

// 4. Results update
useEffect(() => {
  const matches = searchContent(query);
  setResults(matches);
}, [query]);

// 5. UI updates
{results.map(result => <SearchResult {...result} />)}
```

### State Flow Diagram

```
┌─────────────────────────────────────────┐
│         User Interaction                │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Event Handler (onClick, etc)       │
└─────────────────┬───────────────────────┘
                  ↓
          ┌───────────────┐
          │ Local State?  │
          └───┬───────┬───┘
          Yes ↓       ↓ No
    ┌─────────────┐  ┌──────────────┐
    │  useState   │  │ localStorage │
    └──────┬──────┘  └──────┬───────┘
           ↓                ↓
    ┌─────────────────────────────┐
    │      State Updated          │
    └─────────────┬───────────────┘
                  ↓
    ┌─────────────────────────────┐
    │     Component Re-renders    │
    └─────────────┬───────────────┘
                  ↓
    ┌─────────────────────────────┐
    │        DOM Updates          │
    └─────────────────────────────┘
```

---

## State Management

### State Categories

#### 1. **UI State** (React State)
```typescript
// Ephemeral, doesn't need persistence
const [isOpen, setIsOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState<string[]>([]);
```

#### 2. **Application State** (LocalStorage)
```typescript
// Persisted across sessions
const [activeSection, setActiveSection] = useLocalStorage('section', 'overview');
const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', []);
```

#### 3. **Server State** (Future: React Query)
```typescript
// Cached data from APIs
const { data, isLoading } = useQuery('key', fetchFn);
```

### State Management Strategy

```
Local UI State (useState)
    ↓ (if needs persistence)
LocalStorage State (useLocalStorage)
    ↓ (if needs sharing)
Context State (useContext)
    ↓ (if needs caching)
Server State (React Query)
```

### State Synchronization

```typescript
// Sync state between components and storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

---

## Performance Architecture

### Performance Budget

| Metric | Budget | Strategy |
|--------|--------|----------|
| **Bundle Size** | <150KB | Code splitting, tree shaking |
| **First Paint** | <1.5s | Critical CSS inline, lazy load |
| **TTI** | <3s | Defer non-critical JS |
| **Search Latency** | <100ms | Debouncing, memoization |
| **Animation FPS** | 60fps | CSS transforms, requestAnimationFrame |

### Optimization Techniques

#### 1. **Code Splitting**

```typescript
// Section-based lazy loading
const Overview = lazy(() => import('./sections/Overview'));
const FAQ = lazy(() => import('./sections/FAQ'));

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/overview" element={<Overview />} />
    <Route path="/faq" element={<FAQ />} />
  </Routes>
</Suspense>
```

#### 2. **Memoization**

```typescript
// Expensive computations
const sortedResults = useMemo(() => {
  return searchResults.sort((a, b) => b.relevance - a.relevance);
}, [searchResults]);

// Expensive components
export default memo(ExpensiveComponent, (prev, next) => {
  return prev.id === next.id;
});
```

#### 3. **Debouncing**

```typescript
// Search input
const debouncedSearch = useMemo(
  () => debounce((query: string) => performSearch(query), 300),
  []
);
```

#### 4. **Virtual Scrolling**

```typescript
// Large lists (future enhancement)
<VirtualList
  items={faqData}
  itemHeight={80}
  renderItem={(item) => <FAQItem {...item} />}
/>
```

### Performance Monitoring

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## Security Architecture

### Security Layers

```
┌──────────────────────────────────────┐
│     Content Security Policy          │  ← Headers
├──────────────────────────────────────┤
│     Input Sanitization               │  ← XSS Prevention
├──────────────────────────────────────┤
│     Type Safety                      │  ← TypeScript
├──────────────────────────────────────┤
│     Rate Limiting                    │  ← Client-side throttling
├──────────────────────────────────────┤
│     Audit Logging                    │  ← Analytics tracking
└──────────────────────────────────────┘
```

### Security Principles

#### 1. **Defense in Depth**
Multiple layers of security controls

#### 2. **Least Privilege**
Components have minimal required permissions

#### 3. **Fail Secure**
Errors don't expose sensitive information

#### 4. **Audit Everything**
All user actions tracked for compliance

### Security Implementations

#### Input Sanitization
```typescript
// Prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

#### CSP Headers
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
```

---

## Scalability

### Horizontal Scalability

**Add More Content** - No code changes required
```
/data/new-section.ts → Export → Import in navigation
```

### Vertical Scalability

**Add More Features** - Modular architecture
```
/hooks/useNewFeature.ts → Import → Use in components
```

### Scalability Patterns

#### 1. **Lazy Loading**
Load code only when needed

#### 2. **Data Pagination**
Break large datasets into chunks

#### 3. **Virtual Scrolling**
Render only visible items

#### 4. **Web Workers**
Offload heavy computations (future)

---

## Decision Records

### ADR-001: Client-Side Only Architecture

**Status**: Accepted

**Context**: Need fast, offline-capable documentation platform

**Decision**: Build entirely client-side with no backend

**Consequences**:
- ✅ Fast load times
- ✅ No server costs
- ✅ Offline capable
- ❌ Limited to static content
- ❌ No server-side search

---

### ADR-002: TypeScript Strict Mode

**Status**: Accepted

**Context**: Need type safety and developer confidence

**Decision**: Enable TypeScript strict mode throughout

**Consequences**:
- ✅ Catch errors at compile time
- ✅ Better IDE support
- ✅ Self-documenting code
- ❌ More verbose code
- ❌ Steeper learning curve

---

### ADR-003: LocalStorage for Persistence

**Status**: Accepted

**Context**: Need to persist user preferences and bookmarks

**Decision**: Use LocalStorage API for client-side persistence

**Consequences**:
- ✅ Simple implementation
- ✅ No backend required
- ✅ Instant access
- ❌ 5-10MB limit
- ❌ Not encrypted
- ❌ Cleared on logout

---

### ADR-004: Tailwind CSS

**Status**: Accepted

**Context**: Need consistent, maintainable styling system

**Decision**: Use Tailwind CSS utility-first framework

**Consequences**:
- ✅ Rapid development
- ✅ Small CSS bundle
- ✅ Consistent design
- ❌ HTML verbosity
- ❌ Learning curve

---

**Document Version**: 1.0.0  
**Last Updated**: December 11, 2025  
**Maintained By**: INT Inc Engineering Team
