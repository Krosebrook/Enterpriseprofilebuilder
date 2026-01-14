# CLAUDE.md - AI Assistant Integration Guide

This document provides guidelines for AI assistants (Claude, Claude Code, etc.) working with the Enterprise Profile Builder codebase.

---

## Project Overview

**Enterprise Profile Builder** is a production-ready React/TypeScript application for managing Claude AI enterprise profiles with:

- 12 documentation sections
- 40+ Radix UI components
- 6-layer security system
- Supabase backend
- Docker deployment

---

## Quick Context

```
Stack: React 18.3 + TypeScript 5.4 + Vite 6.3 + Radix UI + Supabase
State: React Context + Zustand + localStorage
Testing: Vitest + Playwright
Security: OWASP-compliant prompt injection defense
```

---

## Codebase Structure

### Key Directories

```
src/
├── components/          # UI components (read: layout/, sections/, ui/)
├── features/            # Feature modules (dashboard, deployment, ecosystem, etc.)
├── contexts/            # React Context (NavigationContext, ToastContext)
├── hooks/               # Custom hooks (useSearch, useLocalStorage, useKeyboardShortcuts)
├── lib/                 # Utilities (errors.ts, logger.ts, monitoring.ts, constants.ts)
├── security/            # Security (prompt-injection-defense.ts)
├── types/               # TypeScript types (index.ts, domain.ts, ui.ts)
├── data/                # Static data (features, faq, deployment, etc.)
├── config/              # Configuration (app.config.ts)
└── providers/           # Provider components (AppProvider, ThemeProvider)
```

### Important Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component |
| `src/config/app.config.ts` | Centralized configuration |
| `src/types/index.ts` | Core TypeScript types |
| `src/lib/errors.ts` | Error handling classes |
| `src/security/prompt-injection-defense.ts` | Security implementation |
| `src/contexts/NavigationContext.tsx` | Navigation state |

---

## Development Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
npm test             # Run tests
npm run test:ci      # Tests with coverage
```

---

## Code Patterns

### Component Pattern

```typescript
// Functional component with TypeScript
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState<StateType>(initialValue);

  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
}
```

### Custom Hook Pattern

```typescript
export function useCustomHook(param: ParamType) {
  const [state, setState] = useState<StateType>();

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  return { state, actions };
}
```

### Error Handling Pattern

```typescript
import { AppError, ErrorCode } from '../lib/errors';

try {
  // Operation
} catch (error) {
  throw new AppError(
    'User-friendly message',
    ErrorCode.SPECIFIC_CODE,
    statusCode
  );
}
```

---

## Type Definitions

### Core Types (src/types/index.ts)

```typescript
// Sections available in the app
type Section =
  | 'overview' | 'ecosystem' | 'baseline' | 'features'
  | 'tools' | 'roles' | 'best-practices' | 'faq'
  | 'deployment' | 'governance' | 'operations'
  | 'reference' | 'integrations';

// User roles for filtering
type Role =
  | 'All' | 'Finance' | 'Sales' | 'Engineering'
  | 'Marketing' | 'Operations' | 'HR'
  | 'Product Management' | 'Legal' | 'Customer Support'
  | 'Data Science' | 'Executive / Leadership' | 'QA / Testing';
```

### Error Codes (src/lib/errors.ts)

```typescript
enum ErrorCode {
  UNKNOWN = 'UNKNOWN_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NETWORK = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_PARSE_ERROR = 'STORAGE_PARSE_ERROR',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_CONFIG = 'INVALID_CONFIG',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}
```

---

## Security Guidelines

### Prompt Injection Defense

The codebase implements 6-layer security:

1. **Rate Limiting** - 20 req/min, 100 req/hour
2. **Input Validation** - Pattern-based detection
3. **HITL Approval** - Human review for high-risk
4. **Structural Isolation** - Prompt boundaries
5. **Safe Execution** - Controlled API calls
6. **Output Validation** - PII detection/redaction

### Injection Patterns Detected

- Instruction override attempts
- Role manipulation
- System prompt extraction
- Encoded injections (base64, hex)
- Delimiter injection
- Typoglycemia attacks
- Multi-language attempts

### When Adding Security Features

```typescript
// Always use the secure pipeline
import { securePipeline } from '../security/prompt-injection-defense';

const result = await securePipeline.processRequest(
  userInput,
  systemPrompt,
  userId
);
```

---

## Testing Guidelines

### Unit Tests (Vitest)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can navigate', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Enterprise Profile Builder/);
});
```

### Test File Locations

- Component tests: `src/components/__tests__/`
- Utility tests: `src/utils/__tests__/`
- Security tests: `src/security/*.test.ts`
- E2E tests: `src/tests/e2e/`

---

## Common Tasks

### Adding a New Section

1. Add type to `src/types/index.ts`:
```typescript
export type Section = /* existing */ | 'new-section';
```

2. Add navigation item in `src/data/navigation.ts`

3. Create component in `src/components/sections/` or `src/features/`

4. Add route in `src/components/ContentViewer.tsx`:
```typescript
case 'new-section':
  return <NewSectionComponent />;
```

### Adding a New Feature Flag

1. Add to `src/config/app.config.ts`:
```typescript
export const FEATURE_FLAGS = {
  // existing flags...
  newFeature: false,
} as const;
```

2. Use in components:
```typescript
import { FEATURE_FLAGS } from '../config/app.config';

if (FEATURE_FLAGS.newFeature) {
  // Feature code
}
```

### Adding Error Handling

1. Use existing error classes:
```typescript
import { ValidationError, NotFoundError } from '../lib/errors';

throw new ValidationError('Invalid input', { field: 'email' });
```

2. Or create custom error:
```typescript
export class CustomError extends AppError {
  constructor(context?: Record<string, unknown>) {
    super('Custom message', ErrorCode.CUSTOM, 400, true, context);
  }
}
```

---

## Configuration

### Environment Variables

```env
VITE_SUPABASE_URL=          # Required: Supabase URL
VITE_SUPABASE_ANON_KEY=     # Required: Supabase anon key
VITE_ANTHROPIC_API_KEY=     # Optional: Claude API key
VITE_ENABLE_ANALYTICS=      # Optional: Enable analytics
VITE_ENABLE_DEBUG_MODE=     # Optional: Debug mode
```

### App Configuration (src/config/app.config.ts)

| Config | Purpose |
|--------|---------|
| `APP_CONFIG` | Version, metadata |
| `FEATURE_FLAGS` | Feature toggles |
| `PERFORMANCE_CONFIG` | Debounce, limits |
| `SECURITY_CONFIG` | CSP, rate limits |
| `STORAGE_CONFIG` | localStorage keys |
| `UI_CONFIG` | Breakpoints, colors |
| `NAVIGATION_CONFIG` | Default section |
| `ANALYTICS_CONFIG` | Event tracking |
| `ERROR_CONFIG` | Error handling |

---

## Do's and Don'ts

### Do

- Use TypeScript strict mode types
- Follow existing component patterns
- Use Radix UI components from `src/components/ui/`
- Handle errors with custom error classes
- Write tests for new features
- Use centralized configuration
- Follow accessibility guidelines (WCAG 2.1 AA)

### Don't

- Use `any` type
- Skip error handling
- Hardcode configuration values
- Bypass security checks
- Modify `node_modules`
- Commit `.env` files
- Use inline styles (use Tailwind)

---

## Git Workflow

```bash
# Feature branch
git checkout -b feature/feature-name

# Conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in component"
git commit -m "docs: update documentation"
git commit -m "refactor: improve code structure"

# Push and create PR
git push -u origin feature/feature-name
```

---

## Resources

| Document | Path |
|----------|------|
| Architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| API Docs | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |
| Security | [SECURITY_POLICY.md](./SECURITY_POLICY.md) |
| Audit | [CODEBASE_AUDIT.md](./CODEBASE_AUDIT.md) |
| Roadmap | [ROADMAP.md](./ROADMAP.md) |
| Agents | [AGENTS.md](./AGENTS.md) |

---

## Contact

- **Slack:** #enterprise-profile-builder
- **Email:** engineering@enterpriseprofilebuilder.com
- **Docs:** [/docs](./docs/)

---

**Last Updated:** December 30, 2025
**Version:** 1.0.0
