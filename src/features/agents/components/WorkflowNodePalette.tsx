/**
 * Workflow Node Palette - Agent and Node Selection
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Sidebar palette for adding nodes to the workflow
 */

import React from 'react';
import { useAgentStore } from '../hooks/useAgentStore';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { Bot, GitBranch, Layers } from 'lucide-react';

interface WorkflowNodePaletteProps {
  workflowId: string;
}

export function WorkflowNodePalette({ workflowId }: WorkflowNodePaletteProps) {
  const { agents } = useAgentStore();
  const { addNode, getWorkflow } = useWorkflowStore();

  const workflow = getWorkflow(workflowId);
  if (!workflow) return null;

  const handleAddAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    // Find a good position (offset from last node)
    const lastNode = workflow.nodes[workflow.nodes.length - 1];
    const baseY = lastNode ? lastNode.position.y + 150 : 100;

    addNode(workflowId, {
      type: 'agent',
      label: agent.name,
      agentId: agent.id,
      position: { x: 300, y: baseY },
      metadata: {
        color: '#3B82F6',
        icon: 'bot',
        description: agent.role,
      },
    });
  };

  const handleAddCondition = () => {
    const lastNode = workflow.nodes[workflow.nodes.length - 1];
    const baseY = lastNode ? lastNode.position.y + 150 : 100;

    addNode(workflowId, {
      type: 'condition',
      label: 'Condition',
      condition: 'context.success === true',
      position: { x: 300, y: baseY },
      metadata: {
        color: '#F59E0B',
        icon: 'git-branch',
        description: 'Conditional branching',
      },
    });
  };

  const handleAddParallel = () => {
    const lastNode = workflow.nodes[workflow.nodes.length - 1];
    const baseY = lastNode ? lastNode.position.y + 150 : 100;

    addNode(workflowId, {
      type: 'parallel',
      label: 'Parallel',
      position: { x: 300, y: baseY },
      metadata: {
        color: '#8B5CF6',
        icon: 'layers',
        description: 'Execute branches in parallel',
      },
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4" style={{ fontSize: '14px', fontWeight: 600 }}>
        Add Nodes
      </h3>

      {/* Control Nodes */}
      <div className="mb-6">
        <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 500 }}>
          Control Flow
        </h4>
        
        <div className="space-y-2">
          <button
            onClick={handleAddCondition}
            className="w-full flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-amber-500 transition-colors text-left"
            style={{ fontSize: '14px' }}
          >
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>
                Condition
              </div>
              <div className="text-xs text-gray-500 truncate" style={{ fontSize: '11px' }}>
                Conditional branch
              </div>
            </div>
          </button>

          <button
            onClick={handleAddParallel}
            className="w-full flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-purple-500 transition-colors text-left"
            style={{ fontSize: '14px' }}
          >
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
              <Layers className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>
                Parallel
              </div>
              <div className="text-xs text-gray-500 truncate" style={{ fontSize: '11px' }}>
                Execute in parallel
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Agent Nodes */}
      <div>
        <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 500 }}>
          Agents
        </h4>

        {agents.length === 0 ? (
          <div className="text-sm text-gray-500 italic py-4 text-center" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            No agents available. Create agents in the Agent Builder first.
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {agents.map(agent => (
              <button
                key={agent.id}
                onClick={() => handleAddAgent(agent.id)}
                className="w-full flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-500 transition-colors text-left"
                style={{ fontSize: '14px' }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate" style={{ fontSize: '14px', fontWeight: 600 }}>
                    {agent.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate" style={{ fontSize: '11px' }}>
                    {agent.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800" style={{ fontSize: '12px', lineHeight: '1.5' }}>
          <strong>Tip:</strong> Click a node to add it to the canvas, then drag to position and connect nodes using the connection handles.
        </p>
      </div>
    </div>
  );
}
