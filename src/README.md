# Enterprise Claude Platform (ECP) - Production Refactor

## 🚀 Overview

This is a production-grade enterprise application designed to manage, deploy, and monitor Claude within an organization. It features a modern React frontend, a secure Supabase backend, and a comprehensive ecosystem explorer.

**Current Phase**: Phase 11 (Active) - AI Agents & Autonomous Workflows

## 🏗 Architecture

### Frontend
- **Framework**: React + Vite
- **UI Library**: Shadcn UI + Tailwind CSS
- **State Management**:
  - `Context API`: For global app settings and navigation.
  - `Zustand`: For managing the Integration Marketplace (`useIntegrationsStore`) and Ecosystem (`useEcosystemStore`).
- **Features**:
  - **Dashboard**: Role-based executive views.
  - **Ecosystem Explorer**: Interactive map of Claude platforms/models, Catalog, and Stack Configurator.
  - **Integrations Marketplace**: App store for connecting Claude to Slack, GitHub, Jira, etc.
  - **Agent Builder (Beta)**: Visual interface for creating and testing autonomous agents.
  - **Deployment Hub**: 11-phase rollout tracker.
  - **Operations Manual**: ROI calculators and service tiers.

### Backend (Microservices)
- **Runtime**: Supabase Edge Functions (Deno)
- **Services**:
  - **Claude Service**: Secure proxy to Anthropic API with streaming support.
  - **Agent Runtime**: Server-side execution environment for autonomous agents using the ReAct pattern.
  - **Integration Hub**: Centralized OAuth and webhook management for third-party tools.
  - **Security Layer**: Rate limiting, Prompt Injection Defense (Regex + Structural Isolation).
  - **KV Store**: Redis-like key-value storage for state/limits.

### Machine Learning / AI
- **Integration**: Direct secure integration with Claude 3.5 Sonnet.
- **Agent Framework**: Modular `BaseAgent` class for building autonomous workflows (`lib/agents/framework.ts`).
- **Security**:
  - **Prompt Injection Defense**: Multi-layer input filtering.
  - **PII Redaction**: Output validation to prevent data leaks.
  - **Rate Limiting**: 20 requests/minute per user default.

## 🔒 Security

This application implements OWASP Top 10 for LLMs defenses:
1.  **Input Validation**: Strict regex patterns to detect injection attempts.
2.  **Structural Isolation**: System prompts are isolated from user input.
3.  **Secrets Management**: API keys are stored in Supabase Secrets, never exposed to client.
4.  **Rate Limiting**: 20 requests/minute per user default.
5.  **Agent Sandboxing**: Autonomous agents run in isolated contexts with restricted tool access scopes.

## 🛠 Setup & Deployment

### Prerequisites
- Supabase Project
- Anthropic API Key

### Environment Variables
Set the following secrets in your Supabase project:
- `ANTHROPIC_API_KEY`: Your Claude API key.
- `SUPABASE_URL`: Auto-configured.
- `SUPABASE_SERVICE_ROLE_KEY`: Auto-configured.
- `SLACK_CLIENT_ID` / `SLACK_CLIENT_SECRET`: (Optional) For Slack Integration.
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: (Optional) For GitHub Integration.

### Running Locally
1.  Install dependencies: `npm install`
2.  Start development server: `npm run dev`

### Backend Deployment
The backend logic resides in `/supabase/functions/server`.
To deploy:
```bash
supabase functions deploy server
```

## 📚 Documentation
- **Roadmap**: See `/docs/ROADMAP.md` (Updated Q1 2026)
- **API**: See `/docs/API.md`
- **Architecture**: See `/docs/ARCHITECTURE.md`
- **Testing**: See `/docs/TESTING.md`
- **Security**: See `/security/prompt-injection-defense.ts`

---
*Refactored by INT Inc Engineering Team - December 2025*
