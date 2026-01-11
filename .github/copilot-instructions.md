# GitHub Copilot Instructions - Enterprise Profile Builder

## Project Overview

**Enterprise Profile Builder** is a React 18 + Vite + TypeScript application for building and managing enterprise Claude profiles. The application uses a feature-based architecture with comprehensive documentation, security policies, and testing infrastructure.

### Tech Stack
- **Frontend**: React 18.3.1 with TypeScript (strict mode)
- **Build Tool**: Vite 6.3.5 with SWC plugin for fast refresh
- **Styling**: Tailwind CSS v4.1.3 (custom utilities in index.css)
- **UI Components**: Radix UI primitives for accessible components
- **State Management**: Zustand for global state
- **Testing**: Playwright for E2E testing
- **Backend**: Supabase Edge Functions (Hono/Express)
- **External Services**: Anthropic Claude API, Supabase

### Package Manager
- **npm** (v10.8.2) - Use npm for all dependency management

---

## Development Workflow

### Initial Setup
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev
```

### Common Commands
```bash
# Development
npm run dev              # Start dev server with hot reload (port 3000)
npm run build            # Type-check + production build (output: build/)
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint (fail on warnings)
npm run lint:fix         # Auto-fix ESLint issues
npm run typecheck        # Run TypeScript compiler checks (no emit)
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting without changes

# Testing
npm run test             # Run Playwright E2E tests
npm run test:ui          # Run tests with Playwright UI
npm run test:headed      # Run tests in headed browser mode

# Validation (run before committing)
npm run validate         # Run typecheck + lint + format:check
```

### Build Output
- Development: Hot-reloaded via Vite dev server
- Production: Static files in `build/` directory (configured in vite.config.ts)
- Build target: ESNext (modern browsers)

---

## Project Structure

```
/src
  /components         # Reusable UI components
    /ui              # Base UI primitives (buttons, inputs, dialogs)
    /layout          # Layout components (MainLayout, Navigation)
    /controls        # Interactive controls (RoleSelector)
  /features          # Feature-based modules
    /dashboard       # Dashboard feature
    /library         # Library management
    /deployment      # Deployment workflows
    /integrations    # Third-party integrations
    /agents          # Agent management and execution
    /operations      # Operations and monitoring
    /ecosystem       # Ecosystem management
  /lib               # Core utilities and shared logic
    /agents          # Agent framework utilities
    /api             # API client wrappers
    constants.ts     # App-wide constants
    logger.ts        # Centralized logging utility
    errors.ts        # Custom error classes
    utils.ts         # General utility functions
  /config            # Configuration files
    app.config.ts    # Application configuration and feature flags
  /contexts          # React contexts (Toast, etc.)
  /providers         # Context providers (AppProvider)
  /hooks             # Custom React hooks
  /services          # Business logic and API services
    storage.ts       # LocalStorage abstraction
  /types             # TypeScript type definitions
    domain.ts        # Domain models
    ui.ts            # UI-specific types
    index.ts         # Type exports
  /utils             # Utility functions
    analytics.ts     # Analytics tracking
    storage.ts       # Storage helpers
    search.ts        # Search functionality
  /security          # Security utilities
    prompt-injection-defense.ts  # Input sanitization
  /compliance        # Compliance tracking
  /data              # Static data files
  /docs              # In-app documentation
  /tests             # Test files
    /e2e             # Playwright E2E tests
  /supabase          # Supabase integration
    /functions       # Edge Functions (server-side)
      /server        # Server components
  /styles            # Global styles
  main.tsx           # Application entry point
  App.tsx            # Root application component
  index.css          # Global CSS with Tailwind directives
```

### Adding New Features

#### New Route/Page
1. Create feature directory: `/src/features/[feature-name]/`
2. Add components in `/src/features/[feature-name]/components/`
3. Add hooks in `/src/features/[feature-name]/hooks/`
4. Update routing in main navigation component
5. Add feature flag in `src/config/app.config.ts` (FEATURE_FLAGS)

#### New UI Component
1. Base primitives: `/src/components/ui/[component].tsx`
2. Complex components: `/src/components/[component].tsx`
3. Follow Radix UI patterns for accessibility
4. Include TypeScript interfaces for props
5. Add data-testid attributes for testing

#### New Backend Function
1. Create in `/src/supabase/functions/server/[function].ts`
2. Use Hono or Express for routing
3. Implement proper error handling
4. Add input validation and sanitization
5. Document API endpoints in `/src/docs/API.md`

#### Database Changes (Supabase)
- Schema migrations handled via Supabase CLI (not in this repo)
- Update TypeScript types in `/src/types/domain.ts`
- Update relevant service files in `/src/services/`

---

## Coding Standards

### TypeScript Strictness
- **Strict mode enabled**: All strict compiler options are on
- **No implicit any**: Always provide explicit types
- **No unused variables**: Clean up unused imports and variables
- **Null safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)
- **Type exports**: Export types from `/src/types/index.ts`

**Examples:**
```typescript
// ✅ Good: Explicit types
interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

function getUser(id: string): UserProfile | null {
  // Implementation
}

// ❌ Bad: Implicit any
function getUser(id) {
  return data;
}

// ✅ Good: Null-safe access
const userName = user?.profile?.name ?? 'Anonymous';

// ❌ Bad: Unsafe access
const userName = user.profile.name;
```

### Error Handling
- Use custom error classes from `/src/lib/errors.ts`
- Always catch and handle errors appropriately
- Log errors using `/src/lib/logger.ts`
- Return user-friendly error messages in production

**Examples:**
```typescript
import { logger } from '@/lib/logger';
import { ValidationError, NetworkError } from '@/lib/errors';

// ✅ Good: Structured error handling
async function fetchData(id: string): Promise<Data> {
  try {
    const response = await api.get(`/data/${id}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch data', error as Error, { id });
    throw new NetworkError('Unable to load data');
  }
}

// ✅ Good: Input validation
function processUser(user: unknown): void {
  if (typeof user !== 'object' || !user || !('id' in user)) {
    throw new ValidationError('Invalid user object');
  }
  // Safe to proceed
}
```

### Logging Conventions
- Use centralized logger from `/src/lib/logger.ts`
- Log levels: debug, info, warn, error
- Include context metadata in logs
- Never log sensitive data (passwords, tokens, PII)

**Examples:**
```typescript
import { logger } from '@/lib/logger';

// ✅ Good: Structured logging
logger.info('User action completed', { 
  action: 'bookmark_added', 
  userId: hashedId 
});

logger.error('API request failed', error, { 
  endpoint: '/api/data',
  statusCode: response.status 
});

// ❌ Bad: Console.log in production code
console.log('Debug info', sensitiveData);

// ✅ Good: Performance tracking
logger.time('data-fetch');
await fetchData();
logger.timeEnd('data-fetch');
```

### React Patterns
- Functional components only (no class components)
- Use hooks for state and side effects
- Prefer composition over prop drilling
- Extract custom hooks for reusable logic
- Use React.memo() for expensive components

**Examples:**
```typescript
// ✅ Good: Functional component with hooks
export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  if (!user) return <LoadingSpinner />;
  return <ProfileDisplay user={user} />;
}

// ✅ Good: Custom hook
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading };
}
```

### Component Organization
```typescript
// 1. Imports (React, then external, then internal)
import React, { useState, useEffect } from 'react';
import { Button } from '@radix-ui/react-button';
import { logger } from '@/lib/logger';

// 2. Type definitions
interface Props {
  userId: string;
  onUpdate: (user: User) => void;
}

// 3. Component
export function ComponentName({ userId, onUpdate }: Props) {
  // a. Hooks
  const [state, setState] = useState();
  
  // b. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // c. Event handlers
  const handleClick = () => {
    // ...
  };
  
  // d. Render helpers
  const renderSection = () => {
    // ...
  };
  
  // e. Return JSX
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

---

## Definition of Done (PR Checklist)

Before marking a PR as ready for review, ensure:

### Code Quality
- [ ] Code follows TypeScript strict mode (no any, proper types)
- [ ] All functions have appropriate error handling
- [ ] Logging added for important operations
- [ ] No console.log statements (use logger instead)
- [ ] Code is formatted (`npm run format`)
- [ ] ESLint passes with no warnings (`npm run lint`)
- [ ] TypeScript compiles with no errors (`npm run typecheck`)

### Testing
- [ ] Unit tests added for new business logic (if applicable)
- [ ] E2E tests added/updated for new user flows
- [ ] All tests pass locally (`npm run test`)
- [ ] Manual testing completed for new features
- [ ] Edge cases considered and tested

### Security
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs are validated and sanitized
- [ ] No sensitive data in logs or error messages
- [ ] External API calls use proper authentication
- [ ] Input validation on both client and server (if applicable)

### Performance
- [ ] No unnecessary re-renders (checked with React DevTools)
- [ ] Images optimized and lazy-loaded where appropriate
- [ ] No N+1 queries or expensive operations in loops
- [ ] Bundle size impact checked (if adding dependencies)
- [ ] Async operations properly handled (loading states, errors)

### Documentation
- [ ] JSDoc comments added for public APIs and complex functions
- [ ] README updated if setup/workflow changed
- [ ] API documentation updated (if backend changes)
- [ ] Inline comments for non-obvious logic

### Git Hygiene
- [ ] Minimal diff (only necessary changes)
- [ ] Commits are atomic and well-described
- [ ] No unrelated changes included
- [ ] Branch is up to date with main
- [ ] Build artifacts and node_modules not committed

### Smoke Tests
After deployment, verify:
- [ ] Application starts without errors
- [ ] Navigation works correctly
- [ ] Key user flows functional (search, bookmark, etc.)
- [ ] No console errors in browser
- [ ] Responsive on mobile and desktop

---

## Security Rules

### Never Commit Secrets
```bash
# ❌ NEVER do this
const API_KEY = 'sk_live_abc123...';
const PASSWORD = 'mypassword123';

# ✅ Always use environment variables
const API_KEY = import.meta.env.VITE_API_KEY;
```

### Environment Variables
- Prefix with `VITE_` for client-side variables
- Never commit `.env.local` or `.env.production`
- Use `.env.example` to document required variables
- Validate env vars at startup

**Example .env.example:**
```bash
VITE_API_ENDPOINT=https://api.example.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Input Validation
Always validate and sanitize user inputs:
```typescript
import { sanitizeInput } from '@/security/prompt-injection-defense';

// ✅ Good: Sanitize before use
const safeQuery = sanitizeInput(userInput);
element.textContent = safeQuery; // Not innerHTML!

// ❌ Bad: Direct use of user input
element.innerHTML = userInput; // XSS vulnerability!
```

### Authentication Boundaries
- Client-side: Read-only operations, UI rendering
- Server-side: Write operations, sensitive data access
- All Supabase Edge Functions must validate auth tokens
- Use Row Level Security (RLS) in Supabase

### Least Privilege Principle
- Request minimum necessary permissions
- Use Supabase's anon key for client-side (read-only)
- Use service role key only in Edge Functions (server-side)
- Never expose service role key to client

### Security Headers
Already configured in hosting (if using Supabase/Vercel):
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security

---

## Performance Rules

### Avoid N+1 Queries
```typescript
// ❌ Bad: N+1 query pattern
const users = await getUsers();
for (const user of users) {
  const profile = await getProfile(user.id); // N queries!
}

// ✅ Good: Batch fetch
const users = await getUsers();
const userIds = users.map(u => u.id);
const profiles = await getProfilesBatch(userIds); // 1 query
```

### Caching Strategy
- Use React Query or SWR for API caching (not yet implemented)
- LocalStorage for user preferences and bookmarks
- Cache static content in service worker (future: PWA)
- Respect Cache-Control headers from API

**Current caching:**
```typescript
// Bookmarks cached in localStorage
import { loadFromStorage, saveToStorage } from '@/services/storage';

const bookmarks = loadFromStorage('bookmarks', []);
```

### Keep Bundles Lean
- Lazy load routes: `React.lazy(() => import('./Feature'))`
- Tree-shake unused code (automatic with Vite)
- Avoid large dependencies when small alternatives exist
- Use dynamic imports for heavy libraries

**Example:**
```typescript
// ✅ Good: Lazy load heavy component
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyChart data={data} />
    </Suspense>
  );
}
```

### Avoid Expensive Renders
```typescript
// ✅ Good: Memoize expensive computations
const sortedData = useMemo(
  () => data.sort((a, b) => a.value - b.value),
  [data]
);

// ✅ Good: Memoize callbacks
const handleClick = useCallback(() => {
  performAction(id);
}, [id]);

// ✅ Good: React.memo for pure components
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  // Complex rendering logic
});
```

### Image Optimization
- Use WebP format with fallbacks
- Lazy load images below the fold
- Provide width/height to prevent layout shift
- Use CDN for image hosting when possible

---

## Base44-Specific Conventions

Based on repository analysis, the following patterns are established:

### Feature-Based Architecture
- Each major feature lives in `/src/features/[feature-name]/`
- Features contain their own components, hooks, and logic
- Shared utilities go in `/src/lib/` or `/src/utils/`

### Component Patterns
- UI primitives from Radix UI (accessible, composable)
- Custom components wrap Radix primitives with app styling
- All interactive elements have `data-testid` for Playwright
- Error boundaries wrap feature sections

### State Management
- Zustand stores for global state (e.g., `useEcosystemStore`)
- React Context for app-wide providers (Toast, Theme)
- Local state with useState for component-specific state
- No Redux (Zustand preferred for simplicity)

### Styling Approach
- Tailwind CSS v4 with custom utilities
- CSS-in-JS via Tailwind classes, no styled-components
- Theme colors defined in `/src/config/app.config.ts`
- Custom color palette: Primary #E88A1D

### Error Handling Pattern
```typescript
// Established pattern in codebase
import { ErrorHandler, logger } from '@/lib';

try {
  await riskyOperation();
} catch (error) {
  ErrorHandler.log(error as Error);
  const userMessage = ErrorHandler.getUserMessage(error as Error);
  toast.error(userMessage);
}
```

### Logging Pattern
```typescript
// Logging levels used consistently
logger.debug('Detailed debug info', { context });
logger.info('User action', { action, userId });
logger.warn('Potential issue', { details });
logger.error('Operation failed', error, { context });
```

### Storage Pattern
```typescript
// LocalStorage abstraction used throughout
import { loadFromStorage, saveToStorage } from '@/services/storage';

// Type-safe storage
interface BookmarkData {
  id: string;
  timestamp: number;
}

const bookmarks = loadFromStorage<BookmarkData[]>('bookmarks', []);
saveToStorage('bookmarks', updatedBookmarks);
```

### Testing Pattern (Playwright)
```typescript
// E2E testing approach established
test('feature works correctly', async ({ page }) => {
  await page.goto('/');
  
  // Use data-testid selectors
  const element = page.locator('[data-testid="my-element"]');
  await expect(element).toBeVisible();
  
  // User interactions
  await element.click();
  await page.waitForTimeout(300); // Allow for transitions
  
  // Assertions
  await expect(page.locator('[data-testid="result"]')).toContainText('success');
});
```

### Security Implementation
- Input sanitization via `prompt-injection-defense.ts`
- All user inputs sanitized before display or storage
- Comprehensive security policy in `/src/SECURITY.md`
- No PII stored in LocalStorage (user IDs are hashed)

### Documentation Standards
- Extensive JSDoc comments for all exported functions
- Architecture docs in `/src/docs/ARCHITECTURE.md`
- API docs in `/src/docs/API.md`
- Security policy in `/src/SECURITY.md`

---

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Playwright Documentation](https://playwright.dev)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated**: January 11, 2026
**Maintained By**: Engineering Team
