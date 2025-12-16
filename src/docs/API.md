# API Documentation

**INT Inc Enterprise Claude Profile Builder**

---

## Overview

This API documentation covers the backend services provided by the Supabase Edge Functions. These endpoints support the Integration Marketplace and the AI Agent Runtime.

**Base URL**: `https://<project-ref>.supabase.co/functions/v1`

**Authentication**: All requests require a `Authorization: Bearer <token>` header (Supabase Anon Key or Service Role Key).

---

## 🤖 Agent API

### Run Agent
Executes an AI agent with a specific goal. Supports streaming response for real-time feedback.

- **Endpoint**: `POST /agents/run`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "agentId": "string",
  "goal": "string",
  "context": {
    "sessionId": "string",
    "history": []
  }
}
```

**Response (Streamed)**:
```json
// Event: "thought"
{ "type": "thought", "content": "I need to search for the user..." }

// Event: "tool_start"
{ "type": "tool_start", "tool": "jira_search", "input": "{...}" }

// Event: "tool_end"
{ "type": "tool_end", "output": "Found 3 issues." }

// Event: "final_answer"
{ "type": "final_answer", "content": "Here are the Jira issues..." }
```

### Create Agent
Defines a new custom agent.

- **Endpoint**: `POST /agents/create`
- **Body**:
```json
{
  "name": "PR Reviewer",
  "systemPrompt": "You are a senior engineer...",
  "tools": ["github_read", "github_comment"]
}
```

---

## 🔌 Integrations API

### List Integrations
Returns the catalog of available integrations.

- **Endpoint**: `GET /integrations`

**Response**:
```json
[
  {
    "id": "slack",
    "name": "Slack",
    "status": "active",
    "capabilities": ["messaging", "files"]
  },
  {
    "id": "jira",
    "name": "Jira",
    "status": "beta"
  }
]
```

### Connect Integration (OAuth Start)
Initiates the OAuth flow for a provider.

- **Endpoint**: `POST /integrations/{id}/connect`
- **Body**: `{ "redirectUrl": "..." }`

**Response**:
```json
{
  "authUrl": "https://slack.com/oauth/...",
  "state": "xyz123"
}
```

### List Active Connections
Returns the authenticated connections for the current user.

- **Endpoint**: `GET /integrations/connections`

**Response**:
```json
[
  {
    "id": "conn_123",
    "provider": "slack",
    "connectedAt": "2025-12-01T10:00:00Z",
    "scopes": ["chat:write"]
  }
]
```

---

## 🛡️ Security API

### Analyze Prompt (Guardrails)
Checks a prompt for injection attacks or policy violations.

- **Endpoint**: `POST /security/analyze`
- **Body**: `{ "prompt": "..." }`

**Response**:
```json
{
  "safe": boolean,
  "flags": ["pii_detected", "injection_attempt"],
  "sanitized": "string"
}
```

---

## Error Handling

All endpoints follow standard HTTP status codes:

- `200`: Success
- `400`: Bad Request (Validation Error)
- `401`: Unauthorized (Invalid Token)
- `403`: Forbidden (Insufficient Permissions/Scope)
- `429`: Too Many Requests (Rate Limit Exceeded)
- `500`: Internal Server Error

**Error Body Format**:
```json
{
  "error": "code_string",
  "message": "Human readable message",
  "details": {}
}
```
