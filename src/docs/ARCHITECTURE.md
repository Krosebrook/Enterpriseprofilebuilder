# Architecture Documentation

**INT Inc Enterprise Claude Profile Builder**

---

## Table of Contents

1. [Overview](#overview)
2. [Architectural Principles](#architectural-principles)
3. [System Architecture](#system-architecture)
4. [Agent Framework Architecture](#agent-framework-architecture)
5. [Integration Hub Architecture](#integration-hub-architecture)
6. [Component Architecture](#component-architecture)
7. [Data Flow](#data-flow)
8. [Performance Architecture](#performance-architecture)
9. [Security Architecture](#security-architecture)
10. [Decision Records](#decision-records)

---

## Overview

The INT Inc Claude Profile Builder is architected as a **hybrid client-server platform**. While the documentation and dashboard UI remain client-heavy for performance, the **Agent Runtime** and **Integrations** are powered by secure server-side Edge Functions. This ensures that sensitive operations (like OAuth handshakes and LLM chain execution) happen in a secure, controlled environment.

### Design Goals

1. **Maintainability** - Easy to update content without touching code
2. **Scalability** - Can grow to 100+ pages without performance degradation
3. **Type Safety** - Zero runtime type errors through TypeScript strict mode
4. **Performance** - Sub-second load times, instant interactions
5. **Security** - Zero-trust architecture for Agents and Integrations

---

## Architectural Principles

### 1. **Data-Driven Design**

```
Content (Data)  →  Transform (Logic)  →  Render (Components)
```

**Benefits:**
- Content updates don't require code changes
- Easy to version control documentation
- Enables automated testing of content

### 2. **Hybrid Execution Model**

- **Read-Heavy** operations (Docs, Dashboards) run **Client-Side** (React).
- **Write-Heavy / Sensitive** operations (Agents, API Integrations) run **Server-Side** (Supabase Edge Functions).

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Client)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐  │
│  │ Documentation│   │ Agent Builder│   │ Marketplace │  │
│  └──────────────┘   └──────────────┘   └─────────────┘  │
│                                                         │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS / WSS
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Edge Network (Server)             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────┐   ┌──────────────────────────────┐  │
│  │  Proxy Service │   │      Agent Runtime (ReAct)   │  │
│  └────────────────┘   │  ┌────────┐  ┌────────────┐  │  │
│          │            │  │ Memory │  │ Tool Exec  │  │  │
│          ▼            │  └────────┘  └────────────┘  │  │
│  ┌────────────────┐   └──────────────────────────────┘  │
│  │   Auth Layer   │                  │                  │
│  └────────────────┘                  │                  │
│                                      ▼                  │
│                       ┌──────────────────────────────┐  │
│                       │       Integration Hub        │  │
│                       └──────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### Presentation Layer (Client)
- **Responsibility**: Render UI, handle user interactions, manage local state (Zustand).
- **Technologies**: React 18, Tailwind CSS, Lucide Icons.
- **Key Stores**: `useEcosystemStore`, `useIntegrationsStore`.

#### Service Layer (Server)
- **Responsibility**: Execute AI agents, manage secrets, proxy API calls.
- **Technologies**: Deno, LangChain (adapted), Supabase Functions.
- **Key Modules**: `AgentRuntime`, `ToolRegistry`.

#### Data Layer (Database)
- **Responsibility**: Persist long-term agent memory, user preferences, and audit logs.
- **Technologies**: Supabase Postgres (pgvector), Redis (KV).

---

## Agent Framework Architecture

The Agent Framework (Phase 11) is built on the **ReAct (Reasoning + Acting)** pattern.

### The Execution Loop
1.  **Observation**: The Agent receives a user goal.
2.  **Reasoning**: The LLM generates a "Thought" on what to do next.
3.  **Action**: The Agent selects a `Tool` from the registry (e.g., `JiraTool`, `SearchTool`).
4.  **Execution**: The Server executes the tool securely.
5.  **Result**: The output is fed back into the Agent's context.
6.  **Loop**: Steps 2-5 repeat until the goal is met or max steps reached.

### Component Diagram

```typescript
interface Agent {
  id: string;
  systemPrompt: string;
  tools: Tool[];
  memory: VectorMemory;
  
  async run(goal: string): Promise<AgentResult>;
}

interface Tool {
  name: string;
  description: string;
  schema: ZodSchema;
  execute(params: any): Promise<string>;
}
```

---

## Integration Hub Architecture

The Integration Hub (Phase 10) acts as the secure gateway between Agents and external SaaS tools.

### Security Model
1.  **Credential Isolation**: OAuth tokens are encrypted at rest in the database and never sent to the client.
2.  **Scope Validation**: Integrations request minimum viable scopes (e.g., `channels:read` for Slack).
3.  **Audit Logging**: Every outgoing API call is logged with `timestamp`, `agent_id`, and `endpoint`.

### Connection Flow
1.  Client requests connection (e.g., "Connect Slack").
2.  Server generates OAuth URL with state parameter.
3.  User authenticates with Provider.
4.  Provider calls back to Server.
5.  Server exchanges code for tokens and encrypts them.
6.  Server returns `connection_id` to Client.

---

## Component Architecture

### Component Hierarchy

```
App (Root)
├── Navigation (Sidebar)
├── Main (Content Area)
│   ├── ContentViewer (Docs)
│   ├── EcosystemExplorer (Map)
│   ├── IntegrationMarketplace
│   │   ├── CatalogGrid
│   │   ├── ConnectionManager
│   │   └── SetupWizard
│   └── AgentBuilder (New)
│       ├── Canvas
│       ├── ToolPalette
│       └── TestChat
└── UI Components
```

---

## Performance Architecture

### Performance Budget

| Metric | Budget | Strategy |
|--------|--------|----------|
| **Bundle Size** | <150KB | Code splitting, tree shaking |
| **Agent Response** | <2s | Streaming responses (Tokens) |
| **Tool Execution** | <500ms | Edge proximity to APIs |

---

## Security Architecture

### Security Layers

```
┌──────────────────────────────────────┐
│     Content Security Policy          │  ← Headers
├──────────────────────────────────────┤
│     Agent Sandboxing                 │  ← Deno Isolate
├──────────────────────────────────────┤
│     Tool Permission Scope            │  ← RBAC
├──────────────────────────────────────┤
│     Input Sanitization               │  ← Regex / LLM Guard
├──────────────────────────────────────┤
│     Audit Logging                    │  ← Database
└──────────────────────────────────────┘
```

### Agent Specific Security
1.  **Human-in-the-Loop**: High-risk tools (e.g., `delete_database`) require explicit user confirmation via UI before execution.
2.  **Hallucination Check**: Output validation parsers ensure tool arguments match the schema.

---

## Decision Records

### ADR-005: Hybrid Client-Server for Agents
**Status**: Accepted
**Context**: Agents need to keep secrets (API keys) safe but UI needs to be responsive.
**Decision**: Use Supabase Edge Functions for the "Brain" and React for the "Face".
**Consequences**:
- ✅ Secure secret handling
- ✅ Scalable execution
- ❌ Higher complexity than client-only

### ADR-006: ReAct Pattern for Agents
**Status**: Accepted
**Context**: Need agents that can handle multi-step workflows, not just chat.
**Decision**: Implement ReAct (Reason+Act) loop.
**Consequences**:
- ✅ Solves complex tasks
- ✅ traceable reasoning
- ❌ Higher token cost/latency

---

**Document Version**: 2.1.0  
**Last Updated**: December 15, 2025  
**Maintained By**: INT Inc Engineering Team
