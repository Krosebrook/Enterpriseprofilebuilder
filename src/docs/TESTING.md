# Testing Guide

**INT Inc Enterprise Claude Profile Builder**  
**Comprehensive Testing Documentation**

---

## Table of Contents

1. [Overview](#overview)
2. [Testing Philosophy](#testing-philosophy)
3. [Testing Stack](#testing-stack)
4. [AI Agent Evaluation (New)](#ai-agent-evaluation)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Unit Testing](#unit-testing)
8. [Continuous Integration](#continuous-integration)

---

## Overview

This document outlines our comprehensive testing strategy. With the introduction of **AI Agents** (Phase 11), our testing strategy has evolved to include **LLM Evaluations** ("Evals") alongside traditional software testing.

### Testing Pyramid 2.0

```
        /\
       /  \      Agent Evals (5%)
      /    \     - Accuracy, Safety, Hallucination checks
     /------\    
    /        \   E2E Tests (10%)
   /   E2E    \  - Critical user flows
  /------------\ 
 / Integration  \ - Integration Hub Mocks
/----------------\
/   UNIT TESTS   \ - Logic & Components
-------------------
```

---

## AI Agent Evaluation

Testing probabilistic AI systems requires a different approach than deterministic software. We use an **"LLM-as-a-Judge"** framework.

### Evaluation Metrics
1.  **Correctness**: Did the agent solve the user's goal?
2.  **Efficiency**: How many steps did it take? (Lower is better)
3.  **Safety**: Did it refuse harmful instructions?
4.  **Format Compliance**: Did the tool inputs match the schema?

### Running Evals
We use a dedicated test suite for agents located in `tests/evals`.

```typescript
// tests/evals/pr-agent.eval.ts
import { runEval } from './framework';
import { Agent } from '../../lib/agents';

test('PR Agent - Summarization', async () => {
  const agent = new Agent('pr-reviewer');
  const result = await agent.run('Summarize PR #123');
  
  // Use a stronger model (Opus) to grade the result
  const score = await runEval({
    input: 'Summarize PR #123',
    output: result,
    criteria: 'Does it include the PR title and key changes?'
  });
  
  expect(score).toBeGreaterThan(0.8);
});
```

---

## Integration Testing

### Mocking External APIs
The Integration Hub relies on third-party APIs (Slack, Jira). For testing, we mock these using **MSW (Mock Service Worker)**.

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://slack.com/api/chat.postMessage', () => {
    return HttpResponse.json({ ok: true, ts: '1234.5678' });
  }),
];
```

### Testing OAuth Flows
We test the OAuth state machine logic without hitting real providers.

```typescript
test('OAuth Flow - State Generation', () => {
  const { state, url } = generateAuthUrl('slack');
  expect(url).toContain('slack.com/oauth');
  expect(state).toHaveLength(32);
});
```

---

## End-to-End Testing (Playwright)

We use Playwright for full-stack tests.

### Agent Builder Test
```typescript
test('Create new agent via Builder', async ({ page }) => {
  await page.goto('/builder');
  await page.getByPlaceholder('Agent Name').fill('Support Bot');
  await page.getByText('Add Tool').click();
  await page.getByText('Jira Search').click();
  await page.getByText('Save Agent').click();
  
  await expect(page.getByText('Agent Saved')).toBeVisible();
});
```

---

## Continuous Integration

### GitHub Actions Pipeline
1.  **Lint & Type Check**
2.  **Unit Tests** (Vitest)
3.  **Integration Tests** (Vitest + MSW)
4.  **E2E Tests** (Playwright)
5.  **AI Evals** (Run daily or on `agent/*` file changes) - *Note: These can be expensive/slow.*

---

**Document Version**: 2.1.0  
**Last Updated**: December 15, 2025
