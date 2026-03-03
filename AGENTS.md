# AGENTS.md - Multi-Agent Orchestration Guide

This document provides comprehensive documentation for the multi-agent system in the Enterprise Profile Builder.

---

## Overview

The Enterprise Profile Builder supports multi-agent orchestration for complex AI workflows, enabling coordination of multiple specialized AI agents to complete sophisticated tasks.

---

## Agent Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    Agent Orchestrator                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Planner   │  │  Executor   │  │  Validator  │              │
│  │   Agent     │  │   Agent     │  │   Agent     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                    Agent Communication Bus                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Specialist │  │  Specialist │  │  Specialist │              │
│  │  Agent #1   │  │  Agent #2   │  │  Agent #N   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Core Components

| Component | Purpose | Location |
|-----------|---------|----------|
| Orchestrator | Coordinates agent execution | `src/lib/agents/orchestrator.ts` |
| Agent Registry | Manages available agents | `src/lib/agents/registry.ts` |
| Message Bus | Inter-agent communication | `src/lib/agents/messaging.ts` |
| Workflow Engine | DAG-based execution | `src/lib/agents/workflow.ts` |
| State Manager | Agent state persistence | `src/lib/agents/state.ts` |

---

## Agent Types

### 1. Planner Agent

**Purpose:** Breaks down complex tasks into subtasks

```typescript
interface PlannerAgent {
  id: 'planner';
  capabilities: ['task-decomposition', 'dependency-analysis', 'resource-estimation'];
  input: TaskDescription;
  output: ExecutionPlan;
}
```

**Example:**
```typescript
const plan = await plannerAgent.plan({
  task: 'Generate quarterly report with analytics',
  context: { department: 'Sales', quarter: 'Q4 2025' }
});

// Output:
// {
//   steps: [
//     { id: 'gather-data', agent: 'data-collector', dependencies: [] },
//     { id: 'analyze', agent: 'analytics', dependencies: ['gather-data'] },
//     { id: 'generate', agent: 'report-writer', dependencies: ['analyze'] },
//     { id: 'review', agent: 'validator', dependencies: ['generate'] }
//   ],
//   estimatedTime: '5 minutes',
//   requiredResources: ['database', 'ai-model']
// }
```

### 2. Executor Agent

**Purpose:** Executes individual task steps

```typescript
interface ExecutorAgent {
  id: 'executor';
  capabilities: ['task-execution', 'error-recovery', 'progress-reporting'];
  input: TaskStep;
  output: TaskResult;
}
```

### 3. Validator Agent

**Purpose:** Validates outputs and ensures quality

```typescript
interface ValidatorAgent {
  id: 'validator';
  capabilities: ['output-validation', 'quality-assessment', 'compliance-check'];
  input: TaskResult;
  output: ValidationResult;
}
```

### 4. Specialist Agents

Domain-specific agents for particular tasks:

| Agent | Domain | Capabilities |
|-------|--------|--------------|
| `code-review` | Engineering | Code analysis, best practices |
| `data-analysis` | Analytics | Statistics, visualization |
| `document-writer` | Content | Report generation, formatting |
| `security-audit` | Security | Vulnerability scanning |
| `compliance-check` | Legal | Policy verification |

---

## Agent Framework

### Agent Base Class

```typescript
// src/lib/agents/framework.ts

export abstract class BaseAgent {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly capabilities: string[];

  abstract process(input: AgentInput): Promise<AgentOutput>;

  protected async communicate(
    targetAgent: string,
    message: AgentMessage
  ): Promise<AgentResponse> {
    return this.messageBus.send(targetAgent, message);
  }

  protected async getState<T>(key: string): Promise<T | null> {
    return this.stateManager.get<T>(this.id, key);
  }

  protected async setState<T>(key: string, value: T): Promise<void> {
    return this.stateManager.set(this.id, key, value);
  }
}
```

### Creating a Custom Agent

```typescript
import { BaseAgent, AgentInput, AgentOutput } from './framework';

export class CustomAgent extends BaseAgent {
  readonly id = 'custom-agent';
  readonly name = 'Custom Agent';
  readonly capabilities = ['custom-capability'];

  async process(input: AgentInput): Promise<AgentOutput> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Process task
    const result = await this.executeTask(input);

    // 3. Communicate with other agents if needed
    const validation = await this.communicate('validator', {
      type: 'validate',
      payload: result
    });

    // 4. Return output
    return {
      success: true,
      data: result,
      metadata: { executionTime: Date.now() - startTime }
    };
  }

  private validateInput(input: AgentInput): void {
    if (!input.task) {
      throw new AgentError('Task is required');
    }
  }

  private async executeTask(input: AgentInput): Promise<any> {
    // Implementation
  }
}
```

### Registering an Agent

```typescript
import { AgentRegistry } from './registry';
import { CustomAgent } from './custom-agent';

// Register globally
AgentRegistry.register(new CustomAgent());

// Or register with dependencies
AgentRegistry.register(new CustomAgent(), {
  dependencies: ['validator', 'state-manager'],
  priority: 10,
  maxConcurrent: 5
});
```

---

## Workflow Definition

### DAG-Based Workflows

```typescript
interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  config: WorkflowConfig;
}

interface WorkflowStep {
  id: string;
  agent: string;
  dependencies: string[];
  input: Record<string, any>;
  retryPolicy?: RetryPolicy;
  timeout?: number;
}
```

### Example Workflow

```typescript
const reportWorkflow: Workflow = {
  id: 'quarterly-report',
  name: 'Generate Quarterly Report',
  steps: [
    {
      id: 'collect-data',
      agent: 'data-collector',
      dependencies: [],
      input: { sources: ['database', 'api'] },
      timeout: 60000
    },
    {
      id: 'analyze-trends',
      agent: 'analytics',
      dependencies: ['collect-data'],
      input: { metrics: ['revenue', 'growth', 'churn'] }
    },
    {
      id: 'generate-charts',
      agent: 'visualization',
      dependencies: ['analyze-trends'],
      input: { format: 'svg' }
    },
    {
      id: 'write-report',
      agent: 'document-writer',
      dependencies: ['analyze-trends', 'generate-charts'],
      input: { template: 'quarterly-report' }
    },
    {
      id: 'validate-output',
      agent: 'validator',
      dependencies: ['write-report'],
      input: { rules: ['completeness', 'accuracy'] }
    }
  ],
  config: {
    maxParallel: 3,
    failurePolicy: 'stop-on-failure',
    notifyOnComplete: true
  }
};
```

### Executing a Workflow

```typescript
import { WorkflowEngine } from './workflow';

const engine = new WorkflowEngine();

// Execute workflow
const execution = await engine.execute(reportWorkflow, {
  quarter: 'Q4',
  year: 2025,
  department: 'Sales'
});

// Monitor progress
execution.on('step:complete', (step, result) => {
  console.log(`Step ${step.id} completed:`, result);
});

execution.on('workflow:complete', (result) => {
  console.log('Workflow completed:', result);
});

execution.on('workflow:error', (error) => {
  console.error('Workflow failed:', error);
});

// Wait for completion
const result = await execution.waitForCompletion();
```

---

## Inter-Agent Communication

### Message Types

```typescript
type MessageType =
  | 'request'      // Request action from another agent
  | 'response'     // Response to a request
  | 'broadcast'    // Broadcast to all agents
  | 'event'        // Event notification
  | 'handoff';     // Task handoff

interface AgentMessage {
  id: string;
  type: MessageType;
  from: string;
  to: string | 'broadcast';
  payload: any;
  timestamp: number;
  correlationId?: string;
}
```

### Communication Patterns

#### Request-Response

```typescript
// Agent A sends request to Agent B
const response = await agentA.communicate('agent-b', {
  type: 'request',
  payload: { action: 'analyze', data: inputData }
});
```

#### Broadcast

```typescript
// Broadcast to all agents
await messageBus.broadcast({
  type: 'event',
  payload: { event: 'data-updated', timestamp: Date.now() }
});
```

#### Task Handoff

```typescript
// Hand off task to specialist agent
await currentAgent.handoff('specialist-agent', {
  task: currentTask,
  context: executionContext,
  priority: 'high'
});
```

---

## State Management

### Agent State

```typescript
interface AgentState {
  id: string;
  status: 'idle' | 'busy' | 'error' | 'suspended';
  currentTask?: string;
  memory: Map<string, any>;
  history: HistoryEntry[];
}
```

### Persistent State

```typescript
// Save state
await stateManager.save('agent-id', {
  lastExecution: Date.now(),
  cache: processedData,
  preferences: userPreferences
});

// Restore state
const state = await stateManager.restore('agent-id');
```

### Shared State

```typescript
// Access shared state between agents
const sharedState = await stateManager.getShared('workflow-123');

// Update shared state atomically
await stateManager.updateShared('workflow-123', (current) => ({
  ...current,
  completedSteps: [...current.completedSteps, stepId]
}));
```

---

## Error Handling

### Error Types

```typescript
class AgentError extends Error {
  constructor(
    message: string,
    public code: AgentErrorCode,
    public recoverable: boolean = true
  ) {
    super(message);
  }
}

enum AgentErrorCode {
  TASK_FAILED = 'TASK_FAILED',
  TIMEOUT = 'TIMEOUT',
  DEPENDENCY_FAILED = 'DEPENDENCY_FAILED',
  RESOURCE_UNAVAILABLE = 'RESOURCE_UNAVAILABLE',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  COMMUNICATION_ERROR = 'COMMUNICATION_ERROR'
}
```

### Retry Policies

```typescript
interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
  maxBackoffMs: number;
  retryableErrors: AgentErrorCode[];
}

const defaultRetryPolicy: RetryPolicy = {
  maxRetries: 3,
  backoffMs: 1000,
  maxBackoffMs: 30000,
  retryableErrors: [
    AgentErrorCode.TIMEOUT,
    AgentErrorCode.RESOURCE_UNAVAILABLE
  ]
};
```

### Error Recovery

```typescript
try {
  await agent.process(input);
} catch (error) {
  if (error instanceof AgentError && error.recoverable) {
    // Attempt recovery
    await agent.recover(error);
    // Retry
    await agent.process(input);
  } else {
    // Escalate to orchestrator
    await orchestrator.handleFailure(agent.id, error);
  }
}
```

---

## Monitoring & Observability

### Metrics

```typescript
interface AgentMetrics {
  executionCount: number;
  successRate: number;
  averageExecutionTime: number;
  errorRate: number;
  queueDepth: number;
}

// Collect metrics
const metrics = await agent.getMetrics();
```

### Tracing

```typescript
// Distributed tracing with OpenTelemetry
const span = tracer.startSpan('agent.execute', {
  attributes: {
    'agent.id': agent.id,
    'agent.task': task.id
  }
});

try {
  const result = await agent.process(input);
  span.setStatus({ code: SpanStatusCode.OK });
  return result;
} catch (error) {
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
  throw error;
} finally {
  span.end();
}
```

### Logging

```typescript
// Structured logging
logger.info('Agent execution started', {
  agentId: agent.id,
  taskId: task.id,
  input: sanitize(input)
});

logger.debug('Agent step completed', {
  agentId: agent.id,
  step: stepName,
  duration: executionTime
});
```

---

## Security

### Agent Permissions

```typescript
interface AgentPermissions {
  canAccessDatabase: boolean;
  canAccessExternalAPIs: boolean;
  canModifyState: boolean;
  canSpawnAgents: boolean;
  resourceQuotas: ResourceQuotas;
}

// Check permission before action
if (!agent.permissions.canAccessDatabase) {
  throw new AgentError('Database access denied', AgentErrorCode.PERMISSION_DENIED);
}
```

### Input Validation

```typescript
// All agent inputs go through security pipeline
const sanitizedInput = await securityPipeline.validate(input);
```

### Audit Trail

```typescript
// All agent actions are logged
await auditLog.record({
  agent: agent.id,
  action: 'execute',
  input: sanitize(input),
  output: sanitize(output),
  timestamp: Date.now(),
  userId: context.userId
});
```

---

## Configuration

### Agent Configuration

```typescript
// config/agents.config.ts
export const AGENT_CONFIG = {
  maxConcurrentAgents: 10,
  defaultTimeout: 60000,
  messageQueueSize: 1000,
  stateRetentionDays: 30,
  metricsInterval: 60000,

  agents: {
    planner: {
      enabled: true,
      priority: 100,
      timeout: 30000
    },
    executor: {
      enabled: true,
      priority: 50,
      maxConcurrent: 5
    },
    validator: {
      enabled: true,
      priority: 75
    }
  }
};
```

### Environment Variables

```env
AGENT_MAX_CONCURRENT=10
AGENT_DEFAULT_TIMEOUT=60000
AGENT_QUEUE_SIZE=1000
AGENT_REDIS_URL=redis://localhost:6379
AGENT_METRICS_ENABLED=true
```

---

## API Reference

### Orchestrator API

```typescript
class AgentOrchestrator {
  // Execute workflow
  execute(workflow: Workflow, context: Context): Promise<ExecutionResult>;

  // Get workflow status
  getStatus(executionId: string): Promise<ExecutionStatus>;

  // Cancel workflow
  cancel(executionId: string): Promise<void>;

  // Pause/Resume
  pause(executionId: string): Promise<void>;
  resume(executionId: string): Promise<void>;

  // List active executions
  listActive(): Promise<Execution[]>;
}
```

### Registry API

```typescript
class AgentRegistry {
  // Register agent
  register(agent: BaseAgent, options?: AgentOptions): void;

  // Get agent
  get(agentId: string): BaseAgent | null;

  // List agents
  list(): AgentInfo[];

  // Check availability
  isAvailable(agentId: string): boolean;
}
```

---

## Examples

### Complete Workflow Example

```typescript
import { WorkflowEngine, Workflow } from './lib/agents';

async function generateMonthlyReport(department: string, month: string) {
  const engine = new WorkflowEngine();

  const workflow: Workflow = {
    id: `monthly-report-${department}-${month}`,
    name: 'Monthly Department Report',
    steps: [
      {
        id: 'fetch-metrics',
        agent: 'data-collector',
        dependencies: [],
        input: { department, month, metrics: ['revenue', 'costs', 'headcount'] }
      },
      {
        id: 'calculate-kpis',
        agent: 'analytics',
        dependencies: ['fetch-metrics'],
        input: { kpis: ['growth-rate', 'efficiency', 'roi'] }
      },
      {
        id: 'generate-summary',
        agent: 'document-writer',
        dependencies: ['calculate-kpis'],
        input: { format: 'executive-summary' }
      },
      {
        id: 'create-presentation',
        agent: 'presentation-builder',
        dependencies: ['calculate-kpis'],
        input: { template: 'monthly-review', charts: true }
      },
      {
        id: 'review',
        agent: 'validator',
        dependencies: ['generate-summary', 'create-presentation'],
        input: { checkAccuracy: true, checkFormatting: true }
      }
    ],
    config: {
      maxParallel: 2,
      failurePolicy: 'continue-on-failure',
      notifyOnComplete: true
    }
  };

  const result = await engine.execute(workflow, { department, month });

  return {
    summary: result.outputs['generate-summary'],
    presentation: result.outputs['create-presentation'],
    validation: result.outputs['review']
  };
}
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Agent timeout | Long-running task | Increase timeout or split task |
| Memory leak | State not cleaned | Use stateManager.cleanup() |
| Queue overflow | Too many messages | Increase queue size or add backpressure |
| Circular dependency | Workflow design | Validate DAG before execution |

### Debugging

```bash
# Enable agent debug logging
DEBUG=agents:* npm run dev

# View agent state
curl localhost:3000/api/agents/status

# View workflow execution
curl localhost:3000/api/workflows/{executionId}
```

---

## Roadmap

### Current (v1.0)
- Basic agent framework
- DAG workflow execution
- Simple state management

### Q1 2026 (v2.0)
- Full multi-agent orchestration
- Visual workflow designer
- Agent marketplace

### Q2 2026 (v3.0)
- Learning agents
- Auto-scaling
- Cross-organization agents

---

**Last Updated:** December 30, 2025
**Version:** 1.0.0
