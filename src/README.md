# Enterprise Claude Platform (ECP) - Production Refactor

## 🚀 Overview

This is a production-grade enterprise application designed to manage, deploy, and monitor Claude within an organization. It features a modern React frontend, a secure Supabase backend, and a comprehensive ecosystem explorer.

## 🏗 Architecture

### Frontend
- **Framework**: React + Vite
- **UI Library**: Shadcn UI + Tailwind CSS
- **State Management**: Context API (Navigation, Toast)
- **Features**:
  - **Dashboard**: Role-based executive views.
  - **Ecosystem Explorer**: Interactive map of Claude platforms/models.
  - **Deployment Hub**: 11-phase rollout tracker.
  - **Operations Manual**: ROI calculators and service tiers.

### Backend (Microservices)
- **Runtime**: Supabase Edge Functions (Deno)
- **Services**:
  - **Claude Service**: Secure proxy to Anthropic API with streaming support.
  - **Security Layer**: Rate limiting, Prompt Injection Defense (Regex + Structural Isolation).
  - **KV Store**: Redis-like key-value storage for state/limits.

### Machine Learning / AI
- **Integration**: Direct secure integration with Claude 3.5 Sonnet.
- **Security**:
  - **Prompt Injection Defense**: Multi-layer input filtering.
  - **PII Redaction**: Output validation to prevent data leaks.
  - **Rate Limiting**: Per-user limits enforced on the edge.

## 🔒 Security

This application implements OWASP Top 10 for LLMs defenses:
1.  **Input Validation**: Strict regex patterns to detect injection attempts.
2.  **Structural Isolation**: System prompts are isolated from user input.
3.  **Secrets Management**: API keys are stored in Supabase Secrets, never exposed to client.
4.  **Rate Limiting**: 20 requests/minute per user default.

## 🛠 Setup & Deployment

### Prerequisites
- Supabase Project
- Anthropic API Key

### Environment Variables
Set the following secrets in your Supabase project:
- `ANTHROPIC_API_KEY`: Your Claude API key.
- `SUPABASE_URL`: Auto-configured.
- `SUPABASE_SERVICE_ROLE_KEY`: Auto-configured.

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
- **API**: See `/docs/API.md`
- **Architecture**: See `/docs/ARCHITECTURE.md`
- **Security**: See `/security/prompt-injection-defense.ts`

---
*Refactored by INT Inc Engineering Team - December 2025*
