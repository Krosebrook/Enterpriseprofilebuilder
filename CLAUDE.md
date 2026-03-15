# CLAUDE.md
# Context file for Copilot Agent / Claude Code | Repo: Enterprise Profile Builder
# Update this file whenever the stack, conventions, or commands change.

## Project Overview

Enterprise Profile Builder is a React-based web application for managing AI agent workflows, role-based access controls, and enterprise documentation for Claude AI deployments. It provides interactive guides, PRD generation, demo dashboards, governance tooling, and deployment tracking for organisations adopting Claude AI at scale. The project is currently in early development (v0.1.0) and not yet production-ready.

## Stack

- **Language**: TypeScript (strict mode)
- **Framework**: React 18.3.1
- **Runtime**: Browser (Vite dev server, port 3000)
- **Build Tool**: Vite 6.3.5
- **Database**: Supabase (PostgreSQL via `@supabase/supabase-js` and `@jsr/supabase__supabase-js`)
- **Auth**: None implemented (Supabase Auth referenced but not active)
- **State Management**: Zustand (with localStorage persistence) + TanStack React Query
- **Styling**: Tailwind CSS + Radix UI primitives
- **Testing**: Vitest (unit) + Playwright (E2E)
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml` + `cd.yml`)

## Architecture

Browser client → React SPA (Vite) → Supabase Edge Functions (server-side AI calls) → Anthropic Claude API + Supabase DB. The app is entirely client-rendered with no SSR. Sensitive operations (AI calls via `@anthropic-ai/sdk`) are proxied through Supabase Edge Functions in `src/supabase/functions/server/`. Feature modules are self-contained under `src/features/`. Global state is managed by Zustand stores; server state by TanStack Query.

## Key Directories

```
src/
├── App.tsx                     # Root component, providers wired here
├── main.tsx                    # Vite entry point
├── components/
│   ├── ui/                     # Radix UI / shadcn-style primitives (kebab-case files)
│   ├── layout/                 # MainLayout, Sidebar, TopBar
│   ├── demo-dashboard/         # Demo Readiness Dashboard components
│   ├── ErrorBoundary/          # Feature-level error boundaries
│   ├── LoadingStates/          # Suspense wrappers, spinners
│   └── Feedback/               # FeedbackWidget
├── features/
│   ├── agents/                 # AI Agent Builder
│   ├── prd-generator/          # PRD Generator feature
│   ├── integrations/           # Integration Marketplace
│   ├── deployment/             # Deployment phase tracker
│   ├── compliance/             # Compliance tooling
│   ├── analytics/              # Analytics dashboard
│   ├── collaboration/          # Collaboration features
│   ├── comparison/             # Tool comparison
│   ├── dashboard/              # Executive dashboard
│   ├── best-practices/         # Best-practices guides
│   ├── roles/                  # Role-based profiles
│   └── settings/               # User settings
├── hooks/                      # Shared custom hooks (useSearch, useLocalStorage, etc.)
├── lib/
│   ├── errors.ts               # AppError hierarchy + tryCatch utility
│   ├── logger.ts               # Structured logger (dev verbose, prod silent)
│   ├── constants.ts            # App-wide enums and constants
│   ├── analytics.ts            # Analytics event tracking
│   ├── performance.ts          # Performance monitoring
│   ├── rateLimiter.ts          # Client-side rate limiting
│   ├── accessibility.ts        # A11y utilities
│   ├── prd/                    # PRD template + generator
│   ├── agents/                 # Agent query helpers
│   ├── supabase/               # Supabase client helpers
│   └── api/                    # API client (chat, etc.)
├── config/
│   ├── app.config.ts           # Application-wide config + feature flags
│   ├── demo-dashboard-config.ts # Demo tool URLs (gitignored template available)
│   └── demo-dashboard-config.template.ts
├── data/                       # Static data files (features, navigation, roles, FAQ, etc.)
├── types/
│   ├── index.ts                # Core domain types (Section, Role, NavigationItem, etc.)
│   ├── domain.ts               # Secondary domain types
│   ├── ui.ts                   # UI-specific types
│   └── demo-dashboard.ts       # Demo Dashboard types
├── contexts/                   # React contexts (ToastContext, NavigationContext)
├── providers/                  # AppProvider combining all providers
├── services/                   # Service-layer abstractions
├── security/
│   └── prompt-injection-defense.ts  # OWASP-aligned injection filter + tests
├── supabase/functions/server/  # Supabase Edge Functions (Claude proxy, server API)
├── tests/
│   ├── prd/                    # Vitest tests for PRD template
│   └── e2e/                    # Playwright E2E tests
└── styles/
    └── globals.css             # Global CSS
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the browser. Copy `.env.example` to `.env.local` and fill in values. **Never commit `.env.local`.**

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_APP_ENV` | Yes | `development` \| `staging` \| `production` |
| `VITE_APP_URL` | Yes | Application base URL |
| `VITE_ANTHROPIC_API_KEY` | Yes | Anthropic Claude API key |
| `VITE_ANTHROPIC_MODEL` | No | Claude model ID (default: `claude-3-5-sonnet-20241022`) |
| `VITE_SUPABASE_URL` | No | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anonymous (public) key |
| `VITE_ANALYTICS_ENABLED` | No | Enable analytics (`true`/`false`) |
| `VITE_ANALYTICS_DEBUG` | No | Analytics debug mode |
| `VITE_GA4_MEASUREMENT_ID` | No | Google Analytics 4 Measurement ID |
| `VITE_FEATURE_DARK_MODE` | No | Feature flag: dark mode |
| `VITE_FEATURE_ADVANCED_SEARCH` | No | Feature flag: advanced search |
| `VITE_FEATURE_AGENT_BUILDER` | No | Feature flag: agent builder |
| `VITE_FEATURE_INTEGRATIONS` | No | Feature flag: integrations marketplace |
| `VITE_SENTRY_DSN` | No | Sentry error reporting DSN |
| `VITE_SENTRY_ENVIRONMENT` | No | Sentry environment label |
| `VITE_ENABLE_SOURCE_MAPS` | No | Enable source maps in build |
| `VITE_MINIFY` | No | Enable build minification |

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:3000)
npm run dev

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# TypeScript type check (no emit)
npm run type-check

# Lint source files
npm run lint

# Production build (outputs to ./build/)
npm run build
```

## Conventions

- **File naming**: UI components use `kebab-case.tsx`; feature/layout components use `PascalCase.tsx`; hooks use `use{Name}.ts`; utils/types use `kebab-case.ts`
- **Component structure**: Functional components with `React.forwardRef` where ref forwarding is needed; `cn()` from `src/components/ui/utils.ts` for class merging
- **Path alias**: `@/` maps to `./src/` — always use this for internal imports
- **Radix UI imports**: Use versioned aliases defined in `vite.config.ts` (e.g., `@radix-ui/react-dialog@1.1.6`)
- **API patterns**: No REST/GraphQL routes — all data is static or fetched via Supabase client / Edge Functions
- **Error handling**: Use `tryCatch` from `@/lib/errors` for async operations; log with `logger` from `@/lib/logger`; surface user-friendly messages via `ErrorHandler.getUserMessage()`
- **Async pattern**: `async/await` throughout — no callbacks or `.then()` chains
- **State**: Component-local → `useState`; global → Zustand stores; server → TanStack Query
- **Forms**: `react-hook-form` for all form state

## Security Notes

- **Auth model**: No authentication currently implemented; Supabase Auth is planned
- **Secrets**: All via `VITE_` env vars — never commit credentials or API keys
- **Prompt injection defense**: `src/security/prompt-injection-defense.ts` implements OWASP-aligned injection filtering, output validation, HITL controls, and rate limiting for LLM interactions
- **Existing AppSec patterns**: Client-side rate limiting (`src/lib/rateLimiter.ts`), input sanitisation in prompt injection filter, `ErrorBoundary` components to prevent crash propagation
- **JSR registry**: `.npmrc` points `@jsr:` packages to `https://npm.jsr.io` — ensure this registry is reachable in CI

## Known Issues / TODOs

1. `src/components/ErrorBoundary/FeatureErrorBoundary.tsx:50` — TODO: Send errors to tracking service (Sentry)
2. `src/lib/performance.ts:38` — TODO: Send performance metrics to analytics service
3. `src/lib/rateLimiter.ts:113` — TODO: Implement distributed rate limiting with Supabase KV / Redis
4. `src/security/prompt-injection-defense.ts:348,358,571,582` — TODO: Connect security alerts to real notification/approval workflow and Claude API
5. `src/hooks/useAgentQueries.ts:23,40,71,79,107` — TODO: Replace mock data with actual Supabase queries

## Agent Instructions (for Copilot / Claude Code)

- Always run `npm run type-check` before marking a task complete
- Always run `npm test` before marking a task complete
- Run `npm run lint` and address warnings before committing
- Do NOT modify: `src/security/prompt-injection-defense.ts` without a security review
- Do NOT modify: `.github/workflows/` without verifying CI still passes
- Match patterns from: `src/components/ui/button.tsx` (shadcn-style UI), `src/lib/errors.ts` (error handling), `src/hooks/useLocalStorage.ts` (hook patterns)
- New dependencies require explicit user approval
- All secrets via `VITE_` env vars only — never hardcoded
- The build output directory is `build/` (not `dist/`) — configured in `vite.config.ts`
- No lock file (`package-lock.json`) is committed; CI uses `npm install` not `npm ci`
