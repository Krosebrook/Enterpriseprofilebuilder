# Enterprise Profile Builder

[![CI](https://github.com/Krosebrook/Enterpriseprofilebuilder/workflows/CI/badge.svg)](https://github.com/Krosebrook/Enterpriseprofilebuilder/actions)
[![Security](https://github.com/Krosebrook/Enterpriseprofilebuilder/workflows/Security%20Scan/badge.svg)](https://github.com/Krosebrook/Enterpriseprofilebuilder/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Private-red.svg)](./LICENSE)

A production-grade React application for managing and deploying Claude AI enterprise profiles. Built with TypeScript, React 18, and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or higher
- (Optional) Docker for containerized deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/Krosebrook/Enterpriseprofilebuilder.git
cd Enterpriseprofilebuilder

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your environment variables in .env
```

### Development

```bash
# Start development server (with hot reload)
npm run dev

# Access the app at http://localhost:3000
```

### Building for Production

```bash
# Type check
npm run type-check

# Run linter
npm run lint

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run unit tests in watch mode |
| `npm run test:ci` | Run tests with coverage for CI |
| `npm run test:e2e` | Run end-to-end tests with Playwright |

## 🔧 Environment Variables

Create a `.env` file in the project root. See `.env.example` for all available options:

```env
# Required
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
VITE_ANTHROPIC_API_KEY=your_anthropic_key
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

## 🏗️ Architecture

This application follows modern React best practices with:

- **TypeScript** for type safety
- **Vite** for fast builds and HMR
- **React 18** with concurrent features
- **Radix UI** for accessible components
- **Supabase** for backend/database
- **Zustand** for state management
- **Vitest** for unit testing
- **Playwright** for E2E testing

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 📚 Project Structure

```
├── .github/              # GitHub Actions workflows
├── src/
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature-specific code
│   ├── contexts/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and libraries
│   ├── security/        # Security implementations
│   ├── services/        # API integrations
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── tests/               # Test files
├── docs/                # Documentation
└── scripts/             # Build and utility scripts
```

## 🔒 Security

We take security seriously. This project implements:

- ✅ OWASP Top 10 protection
- ✅ OWASP Top 10 for LLMs
- ✅ Prompt injection defense
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ Dependency scanning
- ✅ Secrets scanning
- ✅ CodeQL analysis

See [SECURITY_POLICY.md](./SECURITY_POLICY.md) for our security policy and how to report vulnerabilities.

## 🧪 Testing

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

Current test coverage: **70%+** (targeting 80%)

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t enterprise-profile-builder .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Access the Application

- App: http://localhost:3000
- Supabase: http://localhost:54321

## 📖 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for comprehensive API documentation.

## 🤝 Contributing

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

This project uses:
- **ESLint** for code quality
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **TypeScript** in strict mode

Code is automatically formatted and linted on commit.

## 📊 Performance

Target metrics (Lighthouse scores):

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 95+

Current FCP: <1.0s | TTI: <1.5s

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 📝 License

This project is proprietary and confidential.

## 🆘 Support

- **Documentation**: [/docs](./docs/)
- **Issues**: [GitHub Issues](https://github.com/Krosebrook/Enterpriseprofilebuilder/issues)
- **Email**: support@enterpriseprofilebuilder.com

## 💡 Original Design

Based on the original Figma design: [Enterprise Profile Builder](https://www.figma.com/design/BxL9KerTYKvxWcSTvaoXPn/Enterprise-Profile-Builder)

## 🔧 WSL Development

If you're on WSL and experiencing AI CLI path issues:

```bash
# Diagnose
bash scripts/doctor-ai-clis.sh

# Fix PATH
. scripts/fix-ai-cli-paths.sh

# Install WSL-local CLIs
bash scripts/install-ai-clis-wsl.sh
```

---

**Made with ❤️ by INT Inc Engineering Team**
