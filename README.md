
  # Enterprise Profile Builder

A React-based web application for managing AI agent workflows, role-based guides, governance tooling, and enterprise documentation for Claude AI deployments. Helps organisations onboard, govern, and scale their use of Claude AI across teams.

> **Version**: 0.1.0 | **Status**: Early Development | **Stack**: React 18 + TypeScript + Vite + Supabase

## What It Does

Enterprise Profile Builder provides interactive guides, PRD generation, a Demo Readiness Dashboard, deployment phase tracking, role-based profiles, governance playbooks, and an Agent Builder — all in a single-page React application backed by Supabase and the Anthropic Claude API.

## Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18.3.1 + TypeScript |
| Build Tool | Vite 6.3.5 |
| Styling | Tailwind CSS + Radix UI |
| State | Zustand + TanStack React Query |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| AI | Anthropic Claude API (`claude-3-5-sonnet-20241022`) |
| Testing | Vitest (unit) + Playwright (E2E) |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Anthropic API key (for AI features)
- Supabase account (optional, for backend features)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Krosebrook/Enterpriseprofilebuilder.git
   cd Enterpriseprofilebuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   # Opens at http://localhost:3000
   ```

5. **Build for production**
   ```bash
   npm run build
   # Output: ./build/
   ```

## Environment Variables

Copy `.env.example` to `.env.local`. Never commit `.env.local`.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_APP_ENV` | Yes | `development` \| `staging` \| `production` |
| `VITE_APP_URL` | Yes | Application base URL |
| `VITE_ANTHROPIC_API_KEY` | Yes | Anthropic Claude API key |
| `VITE_ANTHROPIC_MODEL` | No | Claude model (default: `claude-3-5-sonnet-20241022`) |
| `VITE_SUPABASE_URL` | No | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `VITE_ANALYTICS_ENABLED` | No | Enable analytics (`true`/`false`) |
| `VITE_GA4_MEASUREMENT_ID` | No | Google Analytics 4 Measurement ID |
| `VITE_FEATURE_DARK_MODE` | No | Feature flag: dark mode |
| `VITE_FEATURE_AGENT_BUILDER` | No | Feature flag: agent builder |
| `VITE_FEATURE_INTEGRATIONS` | No | Feature flag: integrations |
| `VITE_SENTRY_DSN` | No | Sentry error reporting DSN |

## Project Structure

```
src/
├── App.tsx                 # Root component
├── main.tsx                # Entry point
├── components/             # Shared UI components
│   ├── ui/                 # Radix UI primitives (shadcn-style)
│   ├── layout/             # MainLayout, Sidebar, TopBar
│   ├── demo-dashboard/     # Demo Readiness Dashboard
│   └── ErrorBoundary/      # Error boundary components
├── features/               # Self-contained feature modules
│   ├── agents/             # AI Agent Builder
│   ├── prd-generator/      # PRD Generator
│   ├── deployment/         # Deployment phase tracker
│   ├── compliance/         # Compliance tooling
│   ├── analytics/          # Analytics dashboard
│   └── ...                 # (12+ feature modules)
├── hooks/                  # Shared custom React hooks
├── lib/                    # Utilities: errors, logger, analytics, prd, api
├── config/                 # App config, feature flags, demo config
├── data/                   # Static data: features, navigation, roles, FAQ
├── types/                  # TypeScript type definitions
├── contexts/               # React contexts
├── providers/              # AppProvider
├── security/               # Prompt injection defense
├── supabase/functions/     # Supabase Edge Functions (AI proxy)
└── tests/                  # Unit & E2E tests
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Production build → `./build/` |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run type-check` | TypeScript type check (no emit) |
| `npm run lint` | Run ESLint on `src/` |

## Testing

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report (./coverage/)
npm run test:coverage

# Run E2E tests (requires Playwright browsers)
npx playwright test
```

## CI/CD

- **CI Pipeline**: `.github/workflows/ci.yml` — Lint, type-check, test, build, security scan on every push/PR
- **CD Pipeline**: `.github/workflows/cd.yml` — Deploy to staging (develop branch) or production (main branch) via Vercel

**Required GitHub Secrets** for deployment: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SLACK_WEBHOOK_URL` (optional). See [`docs/CI_CD_PIPELINE.md`](docs/CI_CD_PIPELINE.md) for full setup.

## 📊 Demo Dashboard

A **Demo Readiness Auditor** for monitoring tool status during presentations.

- **Quick Start**: [DEMO_DASHBOARD_README.md](DEMO_DASHBOARD_README.md)
- **Pre-Demo Checklist**: [DEMO_DASHBOARD_CHECKLIST.md](DEMO_DASHBOARD_CHECKLIST.md)
- **Complete Guide**: [DEMO_DASHBOARD_GUIDE.md](DEMO_DASHBOARD_GUIDE.md)
- **Configuration Q&A**: [DEMO_DASHBOARD_QA.md](DEMO_DASHBOARD_QA.md)

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [CLAUDE.md](CLAUDE.md) | Agent context file (Copilot / Claude Code) |
| [docs/README.md](docs/README.md) | Documentation index |
| [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) | Detailed setup guide |
| [docs/CI_CD_PIPELINE.md](docs/CI_CD_PIPELINE.md) | CI/CD pipeline documentation |
| [docs/API_REFERENCE_COMPLETE.md](docs/API_REFERENCE_COMPLETE.md) | API reference |
| [ONBOARDING.md](ONBOARDING.md) | New developer onboarding |

## Contributing

1. Branch naming: `feature/<description>`, `fix/<description>`, `docs/<description>`
2. Run `npm run type-check` and `npm test` before pushing
3. Run `npm run lint` and resolve any warnings
4. Open a PR against `develop`; `main` is protected

## License

TBD

  