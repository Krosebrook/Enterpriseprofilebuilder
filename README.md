# Enterprise Profile Builder

<div align="center">

[![CI](https://github.com/Krosebrook/Enterpriseprofilebuilder/workflows/CI/badge.svg)](https://github.com/Krosebrook/Enterpriseprofilebuilder/actions)
[![Security](https://github.com/Krosebrook/Enterpriseprofilebuilder/workflows/Security%20Scan/badge.svg)](https://github.com/Krosebrook/Enterpriseprofilebuilder/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-Private-red.svg)](./LICENSE)

**Enterprise-grade platform for managing Claude AI system prompts and profiles**

[Quick Start](#-quick-start) | [Documentation](#-documentation) | [Architecture](#-architecture) | [Contributing](#-contributing)

</div>

---

## Overview

Enterprise Profile Builder is a production-ready React application for managing, documenting, and deploying Claude AI enterprise profiles. It provides comprehensive system prompt documentation, role-based access, deployment tracking, and enterprise-grade security.

### Key Features

- **12 Documentation Sections** - Complete coverage from baseline prompts to deployment
- **Advanced Search** - Fuzzy matching with relevance scoring
- **Role-Based Filtering** - Content tailored to 13 organizational roles
- **6-Layer Security** - OWASP-compliant prompt injection defense
- **Real-Time Analytics** - Usage tracking and event monitoring
- **Bookmark System** - Persistent favorites across sessions
- **Deployment Tracking** - 30+ task checklist with progress
- **Docker Ready** - Production-grade containerized deployment

---

## Quick Start

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18.x or 20.x | LTS recommended |
| npm | 9.x+ | Included with Node.js |
| Docker | 20.x+ | Optional, for containerized deployment |

### Installation

```bash
# Clone repository
git clone https://github.com/Krosebrook/Enterpriseprofilebuilder.git
cd Enterpriseprofilebuilder

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access the application
# App: http://localhost:3000
# Supabase: http://localhost:54321
```

---

## Documentation

### Core Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture and patterns |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API reference and examples |
| [SECURITY_POLICY.md](./SECURITY_POLICY.md) | Security guidelines and reporting |
| [CODEBASE_AUDIT.md](./CODEBASE_AUDIT.md) | Comprehensive codebase analysis |
| [ROADMAP.md](./ROADMAP.md) | Product roadmap through 2027 |
| [CHANGELOG.md](./src/CHANGELOG.md) | Version history |

### AI Assistant Integration

| Document | Description |
|----------|-------------|
| [CLAUDE.md](./CLAUDE.md) | Claude AI integration guide |
| [AGENTS.md](./AGENTS.md) | Multi-agent orchestration |
| [GEMINI.md](./GEMINI.md) | Google Gemini integration |

### Feature Documentation

| Document | Description |
|----------|-------------|
| [docs/NEXT_5_FEATURES.md](./docs/NEXT_5_FEATURES.md) | Upcoming features overview |
| [docs/prd/](./docs/prd/) | Product requirement documents |
| [docs/features/](./docs/features/) | Feature implementation guides |

---

## Architecture

### Technology Stack

```
Frontend                    Backend                 Infrastructure
├── React 18.3              ├── Supabase            ├── Docker
├── TypeScript 5.4          ├── PostgreSQL          ├── nginx
├── Vite 6.3                ├── Edge Functions      ├── GitHub Actions
├── Radix UI                └── Claude API          └── Kubernetes*
├── Tailwind CSS
├── Zustand
└── React Hook Form
```

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (MainLayout, Sidebar, TopBar)
│   ├── sections/        # Page sections (FAQ, Deployment, etc.)
│   ├── ui/              # Radix UI components (40+)
│   └── common/          # Shared components
├── features/            # Feature modules
│   ├── dashboard/       # Main dashboard
│   ├── deployment/      # Deployment tracking
│   ├── ecosystem/       # Ecosystem explorer
│   ├── integrations/    # Integration marketplace
│   ├── library/         # Reference library
│   └── operations/      # Operations manual
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and libraries
│   ├── api/            # API clients
│   ├── agents/         # Agent framework
│   └── errors.ts       # Error handling
├── security/            # Security implementations
├── services/            # External services
├── types/               # TypeScript definitions
└── utils/               # Helper functions
```

### Component Architecture

```
App
└── AppProvider
    ├── ThemeProvider
    ├── NavigationProvider
    └── ToastProvider
        └── MainLayout
            ├── TopBar (search, role selector)
            ├── Sidebar (navigation)
            └── ContentViewer
                └── [Feature Modules]
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run unit tests in watch mode |
| `npm run test:ci` | Run tests with coverage for CI |
| `npm run test:e2e` | Run Playwright E2E tests |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Required
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - AI Integration
VITE_ANTHROPIC_API_KEY=your_anthropic_key

# Optional - Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false

# Optional - Security Notifications
VITE_SECURITY_EMAIL_RECIPIENTS=security@example.com
VITE_SLACK_SECURITY_WEBHOOK=https://hooks.slack.com/...
VITE_PAGERDUTY_API_KEY=your_pagerduty_key
```

---

## Security

### Security Features

| Feature | Status | Description |
|---------|--------|-------------|
| Prompt Injection Defense | Active | 7-pattern detection, sanitization |
| Output Validation | Active | PII detection and redaction |
| Rate Limiting | Active | 20 req/min, 100 req/hour |
| HITL Approval | Active | Human review for high-risk |
| Input Sanitization | Active | XSS prevention |
| CSP Headers | Active | Content Security Policy |

### Compliance

- OWASP Top 10 compliant
- OWASP Top 10 for LLMs compliant
- SOC 2 Type II ready
- GDPR ready
- HIPAA ready
- WCAG 2.1 AA compliant

### Reporting Vulnerabilities

Please report security vulnerabilities to security@enterpriseprofilebuilder.com. See [SECURITY_POLICY.md](./SECURITY_POLICY.md) for details.

---

## Testing

```bash
# Run all unit tests
npm test

# Run tests with coverage
npm run test:ci

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- storage.test.ts
```

### Test Coverage

| Area | Coverage | Target |
|------|----------|--------|
| Components | 70% | 80% |
| Hooks | 60% | 80% |
| Utils | 80% | 80% |
| Security | 90% | 90% |
| Overall | 70% | 80% |

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./src/CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Quality

| Tool | Purpose |
|------|---------|
| ESLint | Code quality and style |
| Prettier | Code formatting |
| TypeScript | Type checking (strict mode) |
| Husky | Pre-commit hooks |
| lint-staged | Staged file linting |

---

## Performance

### Lighthouse Scores

| Metric | Score | Target |
|--------|-------|--------|
| Performance | 98 | 95+ |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 98 | 95+ |

### Core Web Vitals

| Metric | Value | Target |
|--------|-------|--------|
| FCP | 0.8s | <1.5s |
| TTI | 2.1s | <3.0s |
| LCP | 1.2s | <2.5s |
| CLS | 0.02 | <0.1 |

---

## Roadmap

### Next 5 Features (2026)

| Feature | Timeline | Investment | ROI |
|---------|----------|------------|-----|
| Multi-Agent Orchestration | Q1 2026 | $516K | 5,108% |
| Real-time Collaboration | Q2 2026 | $324K | 30% |
| Advanced Analytics | Q2 2026 | $360K | 60% |
| Voice Interface | Q3 2026 | $450K | 46% |
| Model Fine-tuning | Q3 2026 | $828K | 388% |

See [ROADMAP.md](./ROADMAP.md) for complete roadmap.

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

---

## Support

- **Documentation:** [/docs](./docs/)
- **Issues:** [GitHub Issues](https://github.com/Krosebrook/Enterpriseprofilebuilder/issues)
- **Email:** support@enterpriseprofilebuilder.com
- **Slack:** #enterprise-profile-builder

---

## License

This project is proprietary and confidential. All rights reserved.

Copyright 2025 INT Inc.

---

## Acknowledgments

- [Anthropic](https://anthropic.com) - Claude AI
- [Radix UI](https://radix-ui.com) - Accessible components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Vite](https://vitejs.dev) - Build tooling
- [Supabase](https://supabase.com) - Backend infrastructure

---

<div align="center">

**Made with care by INT Inc Engineering Team**

[Documentation](./docs/) | [Architecture](./ARCHITECTURE.md) | [Security](./SECURITY_POLICY.md) | [Roadmap](./ROADMAP.md)

</div>
