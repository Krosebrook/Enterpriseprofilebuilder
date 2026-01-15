/**
 * Workflow Store - State Management for Multi-Agent Orchestration
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Zustand store for managing workflow definitions, executions, and history
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowNode,
  WorkflowEdge,
  Position,
} from '../../../lib/agents/workflow-types';
import { WorkflowEngine, WorkflowValidator } from '../../../lib/agents/workflow-engine';

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface WorkflowStore {
  // State
  workflows: WorkflowDefinition[];
  activeWorkflowId: string | null;
  executions: Record<string, WorkflowExecution>; // executionId -> execution
  executionHistory: string[]; // List of execution IDs (newest first)
  
  // Workflow CRUD
  createWorkflow: (name: string, description: string) => WorkflowDefinition;
  updateWorkflow: (id: string, updates: Partial<WorkflowDefinition>) => void;
  deleteWorkflow: (id: string) => void;
  getWorkflow: (id: string) => WorkflowDefinition | undefined;
  setActiveWorkflow: (id: string | null) => void;
  duplicateWorkflow: (id: string) => WorkflowDefinition | null;
  
  // Node operations
  addNode: (workflowId: string, node: Omit<WorkflowNode, 'id'>) => WorkflowNode;
  updateNode: (workflowId: string, nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (workflowId: string, nodeId: string) => void;
  
  // Edge operations
  addEdge: (workflowId: string, edge: Omit<WorkflowEdge, 'id'>) => WorkflowEdge;
  updateEdge: (workflowId: string, edgeId: string, updates: Partial<WorkflowEdge>) => void;
  deleteEdge: (workflowId: string, edgeId: string) => void;
  
  // Execution
  executeWorkflow: (
    workflowId: string,
    engine: WorkflowEngine,
    initialContext?: Record<string, any>
  ) => Promise<WorkflowExecution>;
  getExecution: (executionId: string) => WorkflowExecution | undefined;
  getWorkflowExecutions: (workflowId: string) => WorkflowExecution[];
  clearExecutionHistory: () => void;
  
  // Validation
  validateWorkflow: (workflowId: string) => ReturnType<typeof WorkflowValidator.validate>;
  
  // Utility
  importWorkflow: (workflow: WorkflowDefinition) => void;
  exportWorkflow: (id: string) => WorkflowDefinition | null;
  clearAll: () => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate unique ID
 */
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a default workflow
 */
const createDefaultWorkflow = (name: string, description: string): WorkflowDefinition => {
  const startNode: WorkflowNode = {
    id: generateId('node'),
    type: 'start',
    label: 'Start',
    position: { x: 100, y: 100 },
    metadata: {
      color: '#10B981',
      icon: 'play',
    },
  };

  const endNode: WorkflowNode = {
    id: generateId('node'),
    type: 'end',
    label: 'End',
    position: { x: 500, y: 100 },
    metadata: {
      color: '#EF4444',
      icon: 'flag',
    },
  };

  return {
    id: generateId('workflow'),
    name,
    description,
    version: '1.0.0',
    nodes: [startNode, endNode],
    edges: [],
    config: {
      maxExecutionTimeMs: 300000, // 5 minutes
      continueOnError: false,
      defaultRetry: {
        maxAttempts: 3,
        backoffMs: 1000,
      },
    },
    initialContext: {},
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    },
  };
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      // Initial State
      workflows: [],
      activeWorkflowId: null,
      executions: {},
      executionHistory: [],

      // ========================================================================
      // WORKFLOW CRUD
      // ========================================================================

      createWorkflow: (name: string, description: string) => {
        const workflow = createDefaultWorkflow(name, description);
        
        set(state => ({
          workflows: [...state.workflows, workflow],
          activeWorkflowId: workflow.id,
        }));

        return workflow;
      },

      updateWorkflow: (id: string, updates: Partial<WorkflowDefinition>) => {
        set(state => ({
          workflows: state.workflows.map(w =>
            w.id === id
              ? {
                  ...w,
                  ...updates,
                  metadata: {
                    ...w.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : w
          ),
        }));
      },

      deleteWorkflow: (id: string) => {
        set(state => ({
          workflows: state.workflows.filter(w => w.id !== id),
          activeWorkflowId: state.activeWorkflowId === id ? null : state.activeWorkflowId,
        }));
      },

      getWorkflow: (id: string) => {
        return get().workflows.find(w => w.id === id);
      },

      setActiveWorkflow: (id: string | null) => {
        set({ activeWorkflowId: id });
      },

      duplicateWorkflow: (id: string) => {
        const original = get().workflows.find(w => w.id === id);
        if (!original) return null;

        const duplicate: WorkflowDefinition = {
          ...original,
          id: generateId('workflow'),
          name: `${original.name} (Copy)`,
          nodes: original.nodes.map(n => ({ ...n, id: generateId('node') })),
          edges: original.edges.map(e => ({ ...e, id: generateId('edge') })),
          metadata: {
            ...original.metadata,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };

        set(state => ({
          workflows: [...state.workflows, duplicate],
        }));

        return duplicate;
      },

      // ========================================================================
      // NODE OPERATIONS
      // ========================================================================

      addNode: (workflowId: string, nodeData: Omit<WorkflowNode, 'id'>) => {
        const node: WorkflowNode = {
          ...nodeData,
          id: generateId('node'),
        };

        set(state => ({
          workflows: state.workflows.map(w =>
            w.id === workflowId
              ? {
                  ...w,
                  nodes: [...w.nodes, node],
                  metadata: {
                    ...w.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : w
          ),
        }));

        return node;
      },

      updateNode: (workflowId: string, nodeId: string, updates: Partial<WorkflowNode>) => {
        set(state => ({
          workflows: state.workflows.map(w =>
            w.id === workflowId
              ? {
                  ...w,
                  nodes: w.nodes.map(n => (n.id === nodeId ? { ...n, ...updates } : n)),
                  metadata: {
                    ...w.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : w
          ),
        }));
      },

      deleteNode: (workflowId: string, nodeId: string) => {
        set(state => ({
          workflows: state.workflows.map(w =>
            w.id === workflowId
              ? {
                  ...w,
                  nodes: w.nodes.filter(n => n.id !== nodeId),
                  edges: w.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
                  metadata: {
                    ...w.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : w
          ),
        }));
      },

      // ========================================================================
      // EDGE OPERATIONS
      // ========================================================================

      addEdge: (workflowId: string, edgeData: Omit<WorkflowEdge, 'id'>) => {
        const edge: WorkflowEdge = {
          ...edgeData,
          id: generateId('edge'),
        };

        set(state => ({
          workflows: state.workflows.map(w =>
            w.id === workflowId
              ? {
                  ...w,
                  edges: [...w.edges, edge],
                  metadata: {
                    ...w.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : w
          ),
        }));

        return edge;
      },

      updateEdge: (workflowId: string, edgeId: string, updates: Partial<WorkflowEdge>) => {
        set(state => ({
          workflows: state.workflows.map(w =>
            w.id === workflowId
              ? {
                  ...w,
                  edges: w.edges.map(e => (e.id === edgeId ? { ...e, ...updates } : e)),
                  metadata: {
                    ...w.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : w
          ),
        }));
      },

      deleteEdge: (workflowId: string, edgeId: string) => {
        set(state => ({
          workflows: state.workflows.map(w =>
            w.id === workflowId
              ? {
                  ...w,
                  edges: w.edges.filter(e => e.id !== edgeId),
                  metadata: {
                    ...w.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : w
          ),
        }));
      },

      // ========================================================================
      // EXECUTION
      // ========================================================================

      executeWorkflow: async (
        workflowId: string,
        engine: WorkflowEngine,
        initialContext?: Record<string, any>
      ) => {
        const workflow = get().workflows.find(w => w.id === workflowId);
        if (!workflow) {
          throw new Error(`Workflow not found: ${workflowId}`);
        }

        const execution = await engine.execute(workflow, {
          initialContext,
          onStepComplete: step => {
            // Update execution in real-time
            set(state => ({
              executions: {
                ...state.executions,
                [execution.id]: {
                  ...state.executions[execution.id],
                  steps: {
                    ...state.executions[execution.id]?.steps,
                    [step.nodeId]: step,
                  },
                },
              },
            }));
          },
          onComplete: completedExecution => {
            set(state => ({
              executions: {
                ...state.executions,
                [completedExecution.id]: completedExecution,
              },
            }));
          },
        });

        // Store execution
        set(state => ({
          executions: {
            ...state.executions,
            [execution.id]: execution,
          },
          executionHistory: [execution.id, ...state.executionHistory].slice(0, 100), // Keep last 100
        }));

        return execution;
      },

      getExecution: (executionId: string) => {
        return get().executions[executionId];
      },

      getWorkflowExecutions: (workflowId: string) => {
        const { executions, executionHistory } = get();
        return executionHistory
          .map(id => executions[id])
          .filter(exec => exec && exec.workflowId === workflowId);
      },

      clearExecutionHistory: () => {
        set({
          executions: {},
          executionHistory: [],
        });
      },

      // ========================================================================
      // VALIDATION
      // ========================================================================

      validateWorkflow: (workflowId: string) => {
        const workflow = get().workflows.find(w => w.id === workflowId);
        if (!workflow) {
          return {
            valid: false,
            errors: [{ code: 'NOT_FOUND', message: 'Workflow not found' }],
            warnings: [],
          };
        }

        return WorkflowValidator.validate(workflow);
      },

      // ========================================================================
      // UTILITY
      // ========================================================================

      importWorkflow: (workflow: WorkflowDefinition) => {
        set(state => ({
          workflows: [...state.workflows, workflow],
        }));
      },

      exportWorkflow: (id: string) => {
        return get().workflows.find(w => w.id === id) || null;
      },

      clearAll: () => {
        set({
          workflows: [],
          activeWorkflowId: null,
          executions: {},
          executionHistory: [],
        });
      },
    }),
    {
      name: 'workflow-storage',
      partialize: state => ({
        workflows: state.workflows,
        // Don't persist executions and history (too large)
      }),
    }
  )
);
