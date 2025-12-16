# Contributing Guide

**INT Inc Enterprise Claude Profile Builder**

Thank you for your interest in contributing to the Claude Profile Builder! This document provides guidelines and best practices for contributing to this project, with specific instructions for the **Agent Framework** and **Integration Marketplace**.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Contributing to Agents (New)](#contributing-to-agents)
4. [Contributing to Integrations (New)](#contributing-to-integrations)
5. [Development Workflow](#development-workflow)
6. [Coding Standards](#coding-standards)
7. [Testing Requirements](#testing-requirements)

---

## Code of Conduct
We are committed to providing a welcoming and inclusive environment. See the full policy in the `CODE_OF_CONDUCT.md` file (Internal Link).

---

## Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **Supabase CLI** >= 1.100.0 (Required for Edge Functions)
- **Deno** >= 1.30.0 (Required for Agent Runtime)

### Initial Setup
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/int-inc/claude-profile-builder.git
    ```
2.  **Install Frontend dependencies**:
    ```bash
    npm install
    ```
3.  **Start Local Development**:
    ```bash
    npm run dev        # Frontend (Vite)
    supabase start     # Backend (Docker)
    ```

---

## Contributing to Agents

**Phase 11** introduced the Agent Framework. Contributors adding new agents should follow this pattern:

### 1. Create Agent Definition
Create a new file in `/lib/agents/definitions/<agent-name>.ts`:
```typescript
import { BaseAgent } from '../framework';

export class PRReviewAgent extends BaseAgent {
  name = 'PR Reviewer';
  systemPrompt = 'You are a senior engineer...';
  tools = ['github_read_pr', 'github_comment'];
}
```

### 2. Add Evaluation Test
You **MUST** add an Eval test in `/tests/evals/<agent-name>.eval.ts` before merging:
```typescript
test('PR Reviewer - Basic Logic', async () => {
  // Test logic
});
```

---

## Contributing to Integrations

**Phase 10** introduced the Integration Marketplace.

### 1. Register Integration
Add the integration metadata to `/data/integrations.ts`:
```typescript
{
  id: 'jira',
  name: 'Jira',
  authType: 'oauth2',
  scopes: ['read:jira-work', 'write:jira-work']
}
```

### 2. Implement Server Adapter
Create the secure adapter in `/supabase/functions/server/integrations/jira.ts`:
```typescript
export async function handleJiraCallback(code: string) {
  // Exchange code for token
}
```

---

## Development Workflow

### Branch Strategy
- `main`: Production
- `develop`: Staging / Beta
- `feature/agent-<name>`: New AI Agents
- `feature/integ-<name>`: New Integrations

### Pull Request Process
1.  Ensure all **Unit Tests** pass.
2.  If modifying Agents, run **Evals** locally (Note: this incurs API costs).
3.  Update `docs/CHANGELOG.md`.

---

## Coding Standards

### TypeScript Strict Mode
We use strict typing. No `any`.
```typescript
// ✅ Good
function executeTool(params: Record<string, unknown>): Promise<string> { ... }

// ❌ Bad
function executeTool(params: any): any { ... }
```

### Agent Prompts
- Use **XML tags** for structure (`<thought>`, `<action>`).
- Keep system prompts under 2000 tokens.
- Use the `PromptTemplate` utility for variable injection.

---

## Testing Requirements

| Scope | Requirement | Tool |
| :--- | :--- | :--- |
| **Frontend Components** | >80% Coverage | Vitest |
| **Edge Functions** | >90% Coverage | Deno Test |
| **AI Agents** | Passing Eval Score > 0.8 | Custom Eval Framework |

---

**Document Version**: 2.1.0  
**Last Updated**: December 15, 2025  
**Maintained By**: INT Inc Engineering Team
