# GitHub Copilot Instructions for Enterprise Profile Builder

This document provides repository-wide instructions for GitHub Copilot agents working on the Enterprise Profile Builder project.

## Project Overview

The Enterprise Profile Builder is a React-based web application for managing AI agent workflows, documentation, and enterprise integrations. It uses a hybrid client-server architecture with React on the frontend and Supabase Edge Functions on the backend.

## Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type safety (strict mode enabled)
- **Vite 6.3.5** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Unstyled component primitives
- **class-variance-authority** - Component variants
- **Zustand** - State management with persistence

### Backend/Services
- **Supabase** - Backend as a service
- **Anthropic Claude API** - AI features

### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **React Testing Library** - Component testing

### Forms & Data
- **React Hook Form 7.55.0** - Form management
- **React Query (TanStack Query)** - Server state management
- **date-fns** - Date utilities

## Project Structure

```
/src
├── components/          # Shared React components
│   ├── ui/             # Radix UI components (lowercase-dash names)
│   ├── layout/         # Layout components (PascalCase)
│   └── ...
├── features/           # Feature-based modules
│   ├── agents/        # AI Agent Builder
│   ├── prd-generator/ # PRD Generator
│   ├── integrations/  # Integration Marketplace
│   └── ...
├── hooks/             # Shared custom hooks
├── lib/               # Utilities and helpers
├── types/             # TypeScript type definitions
├── contexts/          # React contexts
├── providers/         # React providers
├── services/          # API clients and services
└── tests/             # Test files
    ├── e2e/          # Playwright E2E tests
    └── ...
```

## Coding Conventions

### File Naming
- **UI Components**: `kebab-case.tsx` (e.g., `button.tsx`, `dropdown-menu.tsx`)
- **Feature Components**: `PascalCase.tsx` (e.g., `AgentBuilder.tsx`)
- **Hooks**: `use{Name}.ts` (e.g., `useAgentStore.ts`)
- **Types**: `kebab-case.ts` (e.g., `domain.ts`, `api.ts`)
- **Utils**: `kebab-case.ts` (e.g., `logger.ts`, `utils.ts`)

### Import Organization
1. React and external libraries
2. Radix UI components (with version aliases)
3. Internal UI components (from `@/components/ui/`)
4. Feature components and hooks
5. Types (use `import type`)
6. Utilities and helpers

### Path Aliases
- `@/` resolves to `./src/`
- Example: `import { Button } from '@/components/ui/button'`

### Radix UI Imports
Always use version-specific imports defined in `vite.config.ts`:
```typescript
import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';
```

### Component Patterns
- Use `React.forwardRef` for components that need ref forwarding
- Use `cn()` utility for class merging
- Support dark mode with `dark:` prefix
- Include proper ARIA attributes for accessibility
- Use semantic HTML elements

### State Management
- **Local state**: `useState` for component-local state
- **Global state**: Zustand stores with persistence
- **Server state**: React Query (TanStack Query)
- **Form state**: React Hook Form

### TypeScript
- Strict mode enabled
- No `any` types without justification
- Explicit return types for functions
- Use `type` for simple types, `interface` for objects
- Type-only imports: `import type { ... }`

### Styling
- Use Tailwind CSS utility classes
- Use semantic color variables (`bg-primary`, not `bg-blue-500`)
- Follow mobile-first responsive design
- Order classes: layout → sizing → typography → visual → states → dark mode → responsive
- Always use `cn()` for conditional classes

### Error Handling
- Use `tryCatch` utility from `@/lib/errors`
- Log errors with `logger` from `@/lib/logger`
- Show user-friendly error messages
- Handle async errors properly

### Testing
- Co-locate tests with code or in `__tests__/` directories
- Test file naming: `{filename}.test.ts` or `{filename}.test.tsx`
- Use descriptive test names
- Mock external dependencies
- Test user interactions, not implementation details

## Build & Test Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Build
npm run build            # Production build

# Type checking
npx tsc --noEmit        # Check types without emitting files

# Testing
npm test                # Run Vitest unit tests
npx playwright test     # Run E2E tests

# Code quality
npm run lint            # Run ESLint (if configured)
npx prettier --check "src/**/*.{ts,tsx,js,jsx,json,css,md}"
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to client:

```bash
VITE_APP_ENV=development
VITE_ANTHROPIC_API_KEY=your_key
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## Key Architectural Decisions

1. **Feature-Based Architecture**: Features are self-contained modules
2. **Zustand for State**: Global state uses Zustand with localStorage persistence
3. **Server-Side Security**: Sensitive operations (OAuth, AI) happen server-side
4. **Component Composition**: Prefer composition over inheritance
5. **Type Safety First**: All code must be properly typed
6. **Accessibility**: WCAG 2.1 AA compliance
7. **Performance**: Code splitting, lazy loading, memoization

## Security Guidelines

- Never commit API keys or secrets
- Store sensitive data server-side only
- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS for all API calls
- Implement proper CORS policies
- Follow OWASP best practices

## Custom Agents

This repository has 15 custom agents in `.github/agents/` for specialized tasks:

1. **radix-ui-component-builder.agent.md** - Build Radix UI components
2. **typescript-type-strengthener.agent.md** - Improve type safety
3. **code-style-enforcer.agent.md** - Enforce code conventions
4. **vitest-unit-test-writer.agent.md** - Write unit tests
5. **playwright-e2e-test-writer.agent.md** - Write E2E tests
6. **test-debugger.agent.md** - Debug test failures
7. **react-feature-builder.agent.md** - Build new features
8. **zustand-state-manager.agent.md** - Manage Zustand stores
9. **react-hook-creator.agent.md** - Create custom hooks
10. **form-builder.agent.md** - Build forms with react-hook-form
11. **ci-cd-workflow-manager.agent.md** - Manage GitHub Actions
12. **vite-config-optimizer.agent.md** - Optimize Vite config
13. **documentation-writer.agent.md** - Write documentation
14. **ai-agent-workflow-builder.agent.md** - Build AI agent workflows
15. **integration-connector.agent.md** - Create integrations
16. **pr-description-generator.agent.md** - Generate PR descriptions

Use these agents for specialized tasks by referencing their specific expertise.

## Best Practices

### Do's ✅
- Write semantic, accessible HTML
- Use TypeScript strict mode
- Test your changes
- Document complex logic
- Handle errors gracefully
- Use existing UI components
- Follow the established patterns
- Keep components small and focused
- Use meaningful variable names
- Clean up side effects in useEffect

### Don'ts ❌
- Don't use `any` type
- Don't skip error handling
- Don't ignore TypeScript errors
- Don't use inline styles (use Tailwind)
- Don't hardcode values (use constants)
- Don't mutate state directly
- Don't forget cleanup in effects
- Don't skip tests for new features
- Don't commit console.log statements
- Don't import from `dist/` or `build/`

## Getting Help

- **Architecture**: See `src/docs/ARCHITECTURE.md`
- **Testing**: See `src/docs/TESTING.md`
- **API Reference**: See `docs/API_REFERENCE_COMPLETE.md`
- **Deployment**: See `src/docs/DEPLOYMENT.md`
- **Contributing**: See `src/CONTRIBUTING.md`

## Contact

For questions or issues, refer to the project documentation or open a GitHub issue.
