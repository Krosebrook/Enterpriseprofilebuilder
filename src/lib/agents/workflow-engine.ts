/**
 * Workflow Engine - Multi-Agent Orchestration
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * This module implements the DAG-based workflow execution engine,
 * handling multi-agent orchestration, parallel execution, error recovery,
 * and inter-agent communication.
 */

import {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowStepExecution,
  WorkflowNode,
  WorkflowEdge,
  WorkflowValidationResult,
  WorkflowExecutionOptions,
  WorkflowExecutionStatus,
  WorkflowStepStatus,
  AgentMessage,
} from './workflow-types';
import { agentDebugger } from './debug';
import { AgentExecutor } from './executor';

// ============================================================================
// WORKFLOW VALIDATOR
// ============================================================================

/**
 * Validates workflow definitions for correctness
 */
export class WorkflowValidator {
  /**
   * Validate a workflow definition
   */
  static validate(workflow: WorkflowDefinition): WorkflowValidationResult {
    const errors: WorkflowValidationResult['errors'] = [];
    const warnings: WorkflowValidationResult['warnings'] = [];

    // Check for at least one start node
    const startNodes = workflow.nodes.filter(n => n.type === 'start');
    if (startNodes.length === 0) {
      errors.push({
        code: 'NO_START_NODE',
        message: 'Workflow must have at least one start node',
      });
    }
    if (startNodes.length > 1) {
      warnings.push({
        code: 'MULTIPLE_START_NODES',
        message: 'Workflow has multiple start nodes, only first will be used',
      });
    }

    // Check for at least one end node
    const endNodes = workflow.nodes.filter(n => n.type === 'end');
    if (endNodes.length === 0) {
      warnings.push({
        code: 'NO_END_NODE',
        message: 'Workflow has no end node, may run indefinitely',
      });
    }

    // Validate edges reference valid nodes
    const nodeIds = new Set(workflow.nodes.map(n => n.id));
    workflow.edges.forEach(edge => {
      if (!nodeIds.has(edge.source)) {
        errors.push({
          code: 'INVALID_EDGE_SOURCE',
          message: `Edge "${edge.id}" references non-existent source node "${edge.source}"`,
          edgeId: edge.id,
        });
      }
      if (!nodeIds.has(edge.target)) {
        errors.push({
          code: 'INVALID_EDGE_TARGET',
          message: `Edge "${edge.id}" references non-existent target node "${edge.target}"`,
          edgeId: edge.id,
        });
      }
    });

    // Check for cycles (DAG validation)
    const hasCycle = this.detectCycle(workflow);
    if (hasCycle) {
      errors.push({
        code: 'CYCLE_DETECTED',
        message: 'Workflow contains a cycle, must be a directed acyclic graph (DAG)',
      });
    }

    // Validate agent nodes have agentId
    workflow.nodes.forEach(node => {
      if (node.type === 'agent' && !node.agentId) {
        errors.push({
          code: 'MISSING_AGENT_ID',
          message: `Agent node "${node.id}" must have an agentId`,
          nodeId: node.id,
        });
      }
      if (node.type === 'condition' && !node.condition) {
        errors.push({
          code: 'MISSING_CONDITION',
          message: `Condition node "${node.id}" must have a condition expression`,
          nodeId: node.id,
        });
      }
    });

    // Check for unreachable nodes
    const reachableNodes = this.getReachableNodes(workflow);
    workflow.nodes.forEach(node => {
      if (!reachableNodes.has(node.id) && node.type !== 'start') {
        warnings.push({
          code: 'UNREACHABLE_NODE',
          message: `Node "${node.id}" is unreachable from start`,
          nodeId: node.id,
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Detect cycles in workflow graph using DFS
   */
  private static detectCycle(workflow: WorkflowDefinition): boolean {
    const adjacencyList = new Map<string, string[]>();
    
    // Build adjacency list
    workflow.nodes.forEach(node => {
      adjacencyList.set(node.id, []);
    });
    workflow.edges.forEach(edge => {
      const neighbors = adjacencyList.get(edge.source) || [];
      neighbors.push(edge.target);
      adjacencyList.set(edge.source, neighbors);
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycleDFS = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = adjacencyList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycleDFS(neighbor)) {
            return true;
          }
        } else if (recStack.has(neighbor)) {
          return true; // Back edge found, cycle detected
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    // Check each node
    for (const nodeId of adjacencyList.keys()) {
      if (!visited.has(nodeId)) {
        if (hasCycleDFS(nodeId)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get all reachable nodes from start
   */
  private static getReachableNodes(workflow: WorkflowDefinition): Set<string> {
    const startNodes = workflow.nodes.filter(n => n.type === 'start');
    if (startNodes.length === 0) return new Set();

    const adjacencyList = new Map<string, string[]>();
    workflow.nodes.forEach(node => {
      adjacencyList.set(node.id, []);
    });
    workflow.edges.forEach(edge => {
      const neighbors = adjacencyList.get(edge.source) || [];
      neighbors.push(edge.target);
      adjacencyList.set(edge.source, neighbors);
    });

    const reachable = new Set<string>();
    const queue = [startNodes[0].id];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (reachable.has(current)) continue;

      reachable.add(current);
      const neighbors = adjacencyList.get(current) || [];
      queue.push(...neighbors);
    }

    return reachable;
  }
}

// ============================================================================
// MESSAGE QUEUE
// ============================================================================

/**
 * Simple in-memory message queue for inter-agent communication
 */
export class MessageQueue {
  private messages: AgentMessage[] = [];
  private listeners: Map<string, ((message: AgentMessage) => void)[]> = new Map();

  /**
   * Send a message
   */
  send(message: AgentMessage): void {
    this.messages.push(message);
    
    // Notify listeners for this recipient
    const recipientListeners = this.listeners.get(message.to) || [];
    recipientListeners.forEach(listener => listener(message));
    
    agentDebugger.debug('MessageQueue', `Message sent: ${message.type} from ${message.from} to ${message.to}`, {
      messageId: message.id,
    });
  }

  /**
   * Get messages for a specific agent
   */
  getMessages(agentId: string, unprocessedOnly = true): AgentMessage[] {
    return this.messages.filter(
      m => m.to === agentId && (!unprocessedOnly || !m.processed)
    );
  }

  /**
   * Mark message as processed
   */
  markProcessed(messageId: string): void {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.processed = true;
    }
  }

  /**
   * Subscribe to messages for an agent
   */
  subscribe(agentId: string, callback: (message: AgentMessage) => void): () => void {
    const listeners = this.listeners.get(agentId) || [];
    listeners.push(callback);
    this.listeners.set(agentId, listeners);

    // Return unsubscribe function
    return () => {
      const currentListeners = this.listeners.get(agentId) || [];
      const index = currentListeners.indexOf(callback);
      if (index > -1) {
        currentListeners.splice(index, 1);
      }
    };
  }

  /**
   * Clear all messages for an execution
   */
  clear(executionId: string): void {
    this.messages = this.messages.filter(m => m.executionId !== executionId);
  }
}

// ============================================================================
// WORKFLOW ENGINE
// ============================================================================

/**
 * Main workflow execution engine
 */
export class WorkflowEngine {
  private messageQueue: MessageQueue;
  private agentExecutors: Map<string, AgentExecutor> = new Map();

  constructor() {
    this.messageQueue = new MessageQueue();
  }

  /**
   * Register an agent executor for use in workflows
   */
  registerAgent(agentId: string, executor: AgentExecutor): void {
    this.agentExecutors.set(agentId, executor);
    agentDebugger.info('WorkflowEngine', `Agent registered: ${agentId}`);
  }

  /**
   * Execute a workflow
   */
  async execute(
    workflow: WorkflowDefinition,
    options: WorkflowExecutionOptions = {}
  ): Promise<WorkflowExecution> {
    agentDebugger.info('WorkflowEngine', `Starting workflow execution: ${workflow.name}`, {
      workflowId: workflow.id,
      dryRun: options.dryRun || false,
    });

    // Validate workflow
    const validation = WorkflowValidator.validate(workflow);
    if (!validation.valid) {
      const error = new Error(
        `Workflow validation failed: ${validation.errors.map(e => e.message).join(', ')}`
      );
      agentDebugger.error('WorkflowEngine', 'Workflow validation failed', {
        errors: validation.errors,
      });
      throw error;
    }

    // Log warnings
    if (validation.warnings.length > 0) {
      agentDebugger.warn('WorkflowEngine', 'Workflow has warnings', {
        warnings: validation.warnings,
      });
    }

    // Create execution state
    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId: workflow.id,
      status: 'running',
      startedAt: Date.now(),
      steps: {},
      context: options.initialContext || workflow.initialContext || {},
      currentNodes: [],
      metadata: {
        triggerType: 'manual',
      },
    };

    // Initialize step states
    workflow.nodes.forEach(node => {
      execution.steps[node.id] = {
        nodeId: node.id,
        status: 'pending',
        attempts: 0,
        logs: [],
      };
    });

    try {
      // Find start node
      const startNode = workflow.nodes.find(n => n.type === 'start');
      if (!startNode) {
        throw new Error('No start node found');
      }

      // Execute workflow from start node
      await this.executeNode(startNode, workflow, execution, options);

      // Mark as completed if no errors
      execution.status = 'completed';
      execution.completedAt = Date.now();

      agentDebugger.info('WorkflowEngine', 'Workflow execution completed', {
        executionId: execution.id,
        duration: execution.completedAt - execution.startedAt,
      });

      if (options.onComplete) {
        options.onComplete(execution);
      }
    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = Date.now();
      execution.error = {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      };

      agentDebugger.error('WorkflowEngine', 'Workflow execution failed', {
        executionId: execution.id,
        error: execution.error,
      });

      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error(String(error)));
      }
    } finally {
      // Clean up message queue
      this.messageQueue.clear(execution.id);
    }

    return execution;
  }

  /**
   * Execute a single node in the workflow
   */
  private async executeNode(
    node: WorkflowNode,
    workflow: WorkflowDefinition,
    execution: WorkflowExecution,
    options: WorkflowExecutionOptions
  ): Promise<void> {
    const step = execution.steps[node.id];
    
    agentDebugger.info('WorkflowEngine', `Executing node: ${node.label}`, {
      nodeId: node.id,
      type: node.type,
    });

    step.status = 'running';
    step.startedAt = Date.now();
    execution.currentNodes.push(node.id);

    try {
      // Execute based on node type
      switch (node.type) {
        case 'start':
          // Start nodes just pass through
          break;

        case 'end':
          // End nodes mark completion
          execution.result = execution.context;
          break;

        case 'agent':
          await this.executeAgentNode(node, execution, options);
          break;

        case 'condition':
          await this.executeConditionNode(node, execution);
          break;

        case 'parallel':
          await this.executeParallelNode(node, workflow, execution, options);
          break;

        default:
          throw new Error(`Unknown node type: ${(node as any).type}`);
      }

      step.status = 'completed';
      step.completedAt = Date.now();

      if (options.onStepComplete) {
        options.onStepComplete(step);
      }

      // Find and execute next nodes
      const nextNodes = this.getNextNodes(node, workflow, execution);
      
      // Execute next nodes sequentially (parallel execution handled by parallel node type)
      for (const nextNode of nextNodes) {
        const nextStep = execution.steps[nextNode.id];
        if (nextStep.status === 'pending') {
          await this.executeNode(nextNode, workflow, execution, options);
        }
      }
    } catch (error) {
      step.status = 'failed';
      step.completedAt = Date.now();
      step.error = {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      };

      agentDebugger.error('WorkflowEngine', `Node execution failed: ${node.label}`, {
        nodeId: node.id,
        error: step.error,
      });

      // Check if we should retry
      const shouldRetry = this.shouldRetry(node, step);
      if (shouldRetry) {
        step.attempts++;
        step.status = 'pending';
        const backoffMs = node.retry?.backoffMs || 1000;
        await new Promise(resolve => setTimeout(resolve, backoffMs * step.attempts));
        return this.executeNode(node, workflow, execution, options);
      }

      // If continueOnError, mark as failed but don't throw
      if (!workflow.config?.continueOnError) {
        throw error;
      }
    } finally {
      execution.currentNodes = execution.currentNodes.filter(id => id !== node.id);
    }
  }

  /**
   * Execute an agent node
   */
  private async executeAgentNode(
    node: WorkflowNode,
    execution: WorkflowExecution,
    options: WorkflowExecutionOptions
  ): Promise<void> {
    if (!node.agentId) {
      throw new Error(`Agent node ${node.id} has no agentId`);
    }

    const executor = this.agentExecutors.get(node.agentId);
    if (!executor) {
      throw new Error(`Agent executor not found for agentId: ${node.agentId}`);
    }

    // Map inputs from context
    const input = this.mapInputs(node.inputMapping || {}, execution.context);
    
    const step = execution.steps[node.id];
    step.input = input;

    // Execute agent (convert input to string for executor)
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    const result = await executor.execute(inputStr);

    step.output = result;

    // Map outputs to context
    if (node.outputMapping) {
      Object.entries(node.outputMapping).forEach(([key, path]) => {
        this.setContextValue(execution.context, path, result[key] || result);
      });
    } else {
      // Default: store entire result under node ID
      execution.context[node.id] = result;
    }
  }

  /**
   * Execute a condition node
   */
  private async executeConditionNode(
    node: WorkflowNode,
    execution: WorkflowExecution
  ): Promise<void> {
    if (!node.condition) {
      throw new Error(`Condition node ${node.id} has no condition`);
    }

    // Evaluate condition in context
    const result = this.evaluateCondition(node.condition, execution.context);
    
    const step = execution.steps[node.id];
    step.output = { conditionResult: result };
    
    execution.context[`${node.id}_result`] = result;
  }

  /**
   * Execute a parallel node (executes multiple branches simultaneously)
   */
  private async executeParallelNode(
    node: WorkflowNode,
    workflow: WorkflowDefinition,
    execution: WorkflowExecution,
    options: WorkflowExecutionOptions
  ): Promise<void> {
    // Get all immediate child nodes
    const childNodes = this.getNextNodes(node, workflow, execution);
    
    // Execute all children in parallel
    await Promise.all(
      childNodes.map(childNode =>
        this.executeNode(childNode, workflow, execution, options)
      )
    );
  }

  /**
   * Get next nodes to execute based on edges
   */
  private getNextNodes(
    currentNode: WorkflowNode,
    workflow: WorkflowDefinition,
    execution: WorkflowExecution
  ): WorkflowNode[] {
    const outgoingEdges = workflow.edges.filter(e => e.source === currentNode.id);
    
    const nextNodeIds = outgoingEdges
      .filter(edge => {
        // If edge has condition, evaluate it
        if (edge.condition) {
          return this.evaluateCondition(edge.condition, execution.context);
        }
        return true;
      })
      .map(edge => edge.target);

    return workflow.nodes.filter(node => nextNodeIds.includes(node.id));
  }

  /**
   * Map inputs using input mapping
   */
  private mapInputs(mapping: Record<string, string>, context: Record<string, any>): any {
    const result: Record<string, any> = {};
    
    Object.entries(mapping).forEach(([key, path]) => {
      result[key] = this.getContextValue(context, path);
    });

    return Object.keys(result).length === 1 ? Object.values(result)[0] : result;
  }

  /**
   * Get value from context using dot notation path
   */
  private getContextValue(context: Record<string, any>, path: string): any {
    const parts = path.split('.');
    let value: any = context;
    
    for (const part of parts) {
      if (value === undefined || value === null) return undefined;
      value = value[part];
    }
    
    return value;
  }

  /**
   * Set value in context using dot notation path
   */
  private setContextValue(context: Record<string, any>, path: string, value: any): void {
    const parts = path.split('.');
    let current = context;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }

  /**
   * Evaluate condition expression
   */
  private evaluateCondition(condition: string, context: Record<string, any>): boolean {
    try {
      // Simple and safe condition evaluation
      // Replace context references with actual values
      let expression = condition;
      
      // Support simple comparisons like "context.success === true"
      Object.keys(context).forEach(key => {
        const regex = new RegExp(`context\\.${key}`, 'g');
        expression = expression.replace(regex, JSON.stringify(context[key]));
      });

      // Evaluate using Function constructor (safer than eval)
      const func = new Function('context', `return ${expression}`);
      return func(context);
    } catch (error) {
      agentDebugger.error('WorkflowEngine', 'Failed to evaluate condition', {
        condition,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Determine if a failed step should be retried
   */
  private shouldRetry(node: WorkflowNode, step: WorkflowStepExecution): boolean {
    const maxAttempts = node.retry?.maxAttempts || 0;
    return step.attempts < maxAttempts;
  }
}
