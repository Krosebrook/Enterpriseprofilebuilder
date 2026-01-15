# Enterprise Profile Builder

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](src/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](tsconfig.json)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](package.json)

> A production-ready, no-code AI agent builder powered by Claude with comprehensive governance, real execution, and enterprise-grade features.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The Enterprise Profile Builder is a comprehensive platform for building, managing, and executing AI agents using Claude's advanced language models. Built with React, TypeScript, and modern web technologies, it provides a no-code interface for creating sophisticated AI workflows with full governance and observability.

### Key Highlights

- **No-Code Agent Builder** - Visual interface for creating AI agents without writing code
- **ReAct Pattern** - Reasoning and Action loops for complex workflows
- **Claude Integration** - Powered by Claude 3.5 Sonnet and other models
- **Tool Marketplace** - 50+ pre-built tools ready to use
- **Enterprise Security** - Role-based access control, audit logging, rate limiting

---

## Features

### AI Agent Framework
- Visual agent builder with drag-and-drop interface
- ReAct (Reasoning + Acting) pattern implementation
- Real-time agent execution with Claude API
- Debug logging and execution traces
- Agent library for saving and managing agents

### Governance & Security
- Tool governance framework for access control
- Role-based access control (RBAC) with 6 predefined roles
- Policy management and enforcement
- Comprehensive audit logging
- Rate limiting to prevent abuse

### Performance & Accessibility
- Code splitting with lazy loading
- Virtual scrolling for large datasets
- WCAG 2.1 AA accessibility compliance
- Web Vitals performance monitoring
- Optimized bundle size (~320KB gzipped)

### Data Management
- localStorage for offline functionality
- Supabase-ready for multi-device sync
- JSON export/import capabilities
- Version control for agents

---

## Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- Modern browser (Chrome, Firefox, Safari, Edge)
- (Optional) Anthropic API key for agent execution

### Installation

```bash
# Clone the repository
git clone https://github.com/Krosebrook/Enterpriseprofilebuilder.git
cd Enterpriseprofilebuilder

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### First Steps

1. **Explore the Dashboard** - Overview of all features
2. **Build Your First Agent** - Click "Agent Builder" in the sidebar
3. **Add Tools** - Browse the marketplace and add tools to your agent
4. **Test Execution** - Run your agent with sample inputs
5. **Manage Governance** - Set up policies and permissions

---

## Project Structure

```
/
├── src/                     # Source code
│   ├── components/          # Reusable UI components
│   │   ├── ErrorBoundary/   # Error handling components
│   │   ├── LoadingStates/   # Loading spinners and skeletons
│   │   ├── Feedback/        # User feedback widget
│   │   ├── layout/          # Layout components
│   │   ├── sections/        # Page section components
│   │   └── ui/              # Base UI components (Radix UI)
│   ├── features/            # Feature-specific modules
│   │   ├── agents/          # Agent builder and library
│   │   ├── governance/      # Policy and permissions
│   │   ├── marketplace/     # Tool marketplace
│   │   └── ...              # Other feature modules
│   ├── lib/                 # Shared utilities
│   │   ├── analytics.ts     # Analytics framework
│   │   ├── performance.ts   # Performance monitoring
│   │   ├── rateLimiter.ts   # Rate limiting
│   │   ├── accessibility.ts # Accessibility helpers
│   │   └── supabase/        # Database utilities
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React contexts
│   ├── types/               # TypeScript type definitions
│   ├── data/                # Static data and constants
│   ├── docs/                # Detailed documentation
│   └── styles/              # Global styles
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript (strict mode) |
| **State Management** | Zustand (client) + TanStack Query (server) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Radix UI primitives |
| **API Client** | Anthropic SDK |
| **Build Tool** | Vite |
| **Database** | localStorage (Supabase-ready) |

### System Architecture

```
Browser (React Client)
    |
    | HTTPS
    v
Supabase Edge Network (Optional)
    |-- Proxy Service (API key management)
    |-- Agent Runtime (ReAct execution)
    |-- Integration Hub (External services)
    |-- Auth Layer (SSO/RBAC)
```

### State Management Strategy

- **Server State**: TanStack Query for agent CRUD, tools, policies
- **Client State**: Zustand for navigation, UI preferences
- **Local State**: React hooks for form inputs, component state

---

## Documentation

Detailed documentation is available in the `src/docs/` directory:

| Document | Description |
|----------|-------------|
| [README.md](src/README.md) | Detailed application overview |
| [CHANGELOG.md](src/CHANGELOG.md) | Version history and release notes |
| [ARCHITECTURE.md](src/docs/ARCHITECTURE.md) | System architecture details |
| [PRD.md](src/docs/PRD.md) | Product requirements document |
| [CONTRIBUTING.md](src/CONTRIBUTING.md) | Contribution guidelines |
| [SECURITY.md](src/SECURITY.md) | Security policies |
| [MASTER_INDEX.md](src/MASTER_INDEX.md) | Complete documentation navigation |

### Additional Resources

- [Quick Start Guide](src/docs/QUICK_START_REFACTORED.md) - Testing new features
- [Migration Guide](src/docs/MIGRATION_GUIDE_v1_to_v2.md) - Upgrade instructions
- [Supabase Migration Plan](src/docs/SUPABASE_MIGRATION_PLAN.md) - Database setup
- [Deployment Guide](src/docs/DEPLOYMENT.md) - Production deployment

---

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Formatting**: Prettier defaults

### Adding New Features

1. Create feature folder in `src/features/`
2. Add error boundary wrapper
3. Implement lazy loading if >50KB
4. Add analytics tracking
5. Test keyboard navigation and accessibility
6. Update documentation

---

## Deployment

### Build for Production

```bash
npm run build
# Output in /dist folder
```

### Deployment Platforms

**Vercel (Recommended)**
```bash
npm i -g vercel
vercel
```

**Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment Variables

```bash
# Required for agent execution
ANTHROPIC_API_KEY=your_key_here

# Optional: Supabase integration
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key

# Optional: Analytics
GA_TRACKING_ID=your_ga_id
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](src/CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test accessibility and performance
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Follow existing code style
- Update documentation for changes

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Anthropic** - Claude API and SDK
- **React Team** - React and ecosystem
- **Tailwind Labs** - Tailwind CSS
- **Radix UI** - Accessible component primitives

---

## Support

- **Documentation**: See `src/docs/` folder
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

---

**Built with React, TypeScript, and Claude**
