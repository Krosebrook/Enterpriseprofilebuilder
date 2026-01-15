/**
 * Workflow Types & Interfaces for Multi-Agent Orchestration
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * This module defines the core types for DAG-based workflow definitions,
 * enabling complex multi-agent orchestration with conditional logic,
 * parallel execution, and failure recovery.
 */

// ============================================================================
// WORKFLOW DEFINITION (Configuration)
// ============================================================================

/**
 * Position for visual workflow designer
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Individual node in the workflow (represents an agent or action)
 */
export interface WorkflowNode {
  /** Unique node identifier */
  id: string;
  
  /** Node type */
  type: 'agent' | 'condition' | 'start' | 'end' | 'parallel';
  
  /** Display label */
  label: string;
  
  /** Agent ID (for agent nodes) */
  agentId?: string;
  
  /** Condition expression (for condition nodes) - e.g., "result.success === true" */
  condition?: string;
  
  /** Input mapping - map workflow context to agent inputs */
  inputMapping?: Record<string, string>;
  
  /** Output mapping - map agent outputs to workflow context */
  outputMapping?: Record<string, string>;
  
  /** Position in visual designer */
  position: Position;
  
  /** Retry configuration */
  retry?: {
    maxAttempts: number;
    backoffMs: number;
  };
  
  /** Timeout in milliseconds */
  timeoutMs?: number;
  
  /** Metadata for UI rendering */
  metadata?: {
    color?: string;
    icon?: string;
    description?: string;
  };
}

/**
 * Edge connecting two nodes (defines execution flow)
 */
export interface WorkflowEdge {
  /** Unique edge identifier */
  id: string;
  
  /** Source node ID */
  source: string;
  
  /** Target node ID */
  target: string;
  
  /** Condition for traversing this edge (optional) */
  condition?: string;
  
  /** Edge label for visual display */
  label?: string;
  
  /** Edge type for visual styling */
  type?: 'success' | 'failure' | 'conditional' | 'default';
}

/**
 * Complete workflow definition
 */
export interface WorkflowDefinition {
  /** Workflow unique identifier */
  id: string;
  
  /** Workflow name */
  name: string;
  
  /** Workflow description */
  description: string;
  
  /** Version for change tracking */
  version: string;
  
  /** List of nodes */
  nodes: WorkflowNode[];
  
  /** List of edges */
  edges: WorkflowEdge[];
  
  /** Global workflow configuration */
  config?: {
    /** Maximum total execution time */
    maxExecutionTimeMs?: number;
    
    /** Whether to continue on agent failures */
    continueOnError?: boolean;
    
    /** Default retry policy */
    defaultRetry?: {
      maxAttempts: number;
      backoffMs: number;
    };
  };
  
  /** Initial context/inputs */
  initialContext?: Record<string, any>;
  
  /** Workflow metadata */
  metadata?: {
    author?: string;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
  };
}

// ============================================================================
// WORKFLOW EXECUTION (Runtime State)
// ============================================================================

/**
 * Execution status for workflow steps
 */
export type WorkflowStepStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled';

/**
 * Individual step execution state
 */
export interface WorkflowStepExecution {
  /** Node ID this step corresponds to */
  nodeId: string;
  
  /** Step execution status */
  status: WorkflowStepStatus;
  
  /** Start timestamp */
  startedAt?: number;
  
  /** Completion timestamp */
  completedAt?: number;
  
  /** Input provided to this step */
  input?: any;
  
  /** Output produced by this step */
  output?: any;
  
  /** Error if failed */
  error?: {
    message: string;
    stack?: string;
  };
  
  /** Number of retry attempts */
  attempts: number;
  
  /** Execution logs for debugging */
  logs?: Array<{
    timestamp: number;
    level: 'info' | 'warn' | 'error';
    message: string;
    metadata?: any;
  }>;
}

/**
 * Overall workflow execution status
 */
export type WorkflowExecutionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'paused';

/**
 * Complete workflow execution state
 */
export interface WorkflowExecution {
  /** Execution unique identifier */
  id: string;
  
  /** Reference to workflow definition */
  workflowId: string;
  
  /** Overall execution status */
  status: WorkflowExecutionStatus;
  
  /** Execution start timestamp */
  startedAt: number;
  
  /** Execution completion timestamp */
  completedAt?: number;
  
  /** Map of node ID to step execution */
  steps: Record<string, WorkflowStepExecution>;
  
  /** Shared context across all agents */
  context: Record<string, any>;
  
  /** Current executing node IDs (for parallel execution) */
  currentNodes: string[];
  
  /** Final result */
  result?: any;
  
  /** Error if workflow failed */
  error?: {
    message: string;
    nodeId?: string;
    stack?: string;
  };
  
  /** Execution metadata */
  metadata?: {
    triggeredBy?: string;
    triggerType?: 'manual' | 'scheduled' | 'webhook' | 'api';
  };
}

// ============================================================================
// MESSAGE QUEUE (Inter-Agent Communication)
// ============================================================================

/**
 * Message types for inter-agent communication
 */
export type MessageType =
  | 'task'        // Task assignment to an agent
  | 'result'      // Result from an agent
  | 'error'       // Error notification
  | 'status'      // Status update
  | 'cancel';     // Cancellation request

/**
 * Message for inter-agent communication
 */
export interface AgentMessage {
  /** Message unique identifier */
  id: string;
  
  /** Message type */
  type: MessageType;
  
  /** Source agent/node ID */
  from: string;
  
  /** Target agent/node ID */
  to: string;
  
  /** Execution context ID */
  executionId: string;
  
  /** Message payload */
  payload: any;
  
  /** Timestamp */
  timestamp: number;
  
  /** Whether message has been processed */
  processed: boolean;
}

// ============================================================================
// WORKFLOW VALIDATION
// ============================================================================

/**
 * Validation result for workflow definitions
 */
export interface WorkflowValidationResult {
  /** Whether workflow is valid */
  valid: boolean;
  
  /** List of errors */
  errors: Array<{
    code: string;
    message: string;
    nodeId?: string;
    edgeId?: string;
  }>;
  
  /** List of warnings */
  warnings: Array<{
    code: string;
    message: string;
    nodeId?: string;
    edgeId?: string;
  }>;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Workflow execution options
 */
export interface WorkflowExecutionOptions {
  /** Whether to run in dry-run mode */
  dryRun?: boolean;
  
  /** Initial context override */
  initialContext?: Record<string, any>;
  
  /** Whether to enable debug logging */
  debug?: boolean;
  
  /** Callback for step completion */
  onStepComplete?: (step: WorkflowStepExecution) => void;
  
  /** Callback for workflow completion */
  onComplete?: (execution: WorkflowExecution) => void;
  
  /** Callback for errors */
  onError?: (error: Error, nodeId?: string) => void;
}

/**
 * Workflow statistics
 */
export interface WorkflowStats {
  /** Total execution count */
  totalExecutions: number;
  
  /** Successful executions */
  successCount: number;
  
  /** Failed executions */
  failureCount: number;
  
  /** Average execution time (ms) */
  avgExecutionTimeMs: number;
  
  /** Last execution timestamp */
  lastExecutedAt?: number;
  
  /** Success rate percentage */
  successRate: number;
}
