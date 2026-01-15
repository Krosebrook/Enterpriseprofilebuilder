/**
 * Workflow Properties Panel - Node/Edge Configuration
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Right sidebar for editing node and edge properties
 */

import React, { useState } from 'react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { useAgentStore } from '../hooks/useAgentStore';
import { Button } from '../../../components/ui/Button';
import { X, Trash2 } from 'lucide-react';

interface WorkflowPropertiesProps {
  workflowId: string;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onClose: () => void;
}

export function WorkflowProperties({
  workflowId,
  selectedNodeId,
  selectedEdgeId,
  onClose,
}: WorkflowPropertiesProps) {
  const { getWorkflow, updateNode, deleteNode, updateEdge, deleteEdge } = useWorkflowStore();
  const { agents } = useAgentStore();
  
  const workflow = getWorkflow(workflowId);
  const selectedNode = workflow?.nodes.find(n => n.id === selectedNodeId);
  const selectedEdge = workflow?.edges.find(e => e.id === selectedEdgeId);

  // Local state for editing
  const [nodeLabel, setNodeLabel] = useState(selectedNode?.label || '');
  const [nodeCondition, setNodeCondition] = useState(selectedNode?.condition || '');
  const [nodeAgentId, setNodeAgentId] = useState(selectedNode?.agentId || '');
  const [nodeTimeout, setNodeTimeout] = useState(selectedNode?.timeoutMs?.toString() || '');
  const [nodeRetryAttempts, setNodeRetryAttempts] = useState(
    selectedNode?.retry?.maxAttempts?.toString() || '3'
  );
  const [nodeRetryBackoff, setNodeRetryBackoff] = useState(
    selectedNode?.retry?.backoffMs?.toString() || '1000'
  );

  const [edgeLabel, setEdgeLabel] = useState(selectedEdge?.label || '');
  const [edgeCondition, setEdgeCondition] = useState(selectedEdge?.condition || '');
  const [edgeType, setEdgeType] = useState(selectedEdge?.type || 'default');

  // Handle save
  const handleSaveNode = () => {
    if (!selectedNodeId) return;

    updateNode(workflowId, selectedNodeId, {
      label: nodeLabel,
      condition: nodeCondition || undefined,
      agentId: nodeAgentId || undefined,
      timeoutMs: nodeTimeout ? parseInt(nodeTimeout) : undefined,
      retry: {
        maxAttempts: parseInt(nodeRetryAttempts),
        backoffMs: parseInt(nodeRetryBackoff),
      },
    });
  };

  const handleSaveEdge = () => {
    if (!selectedEdgeId) return;

    updateEdge(workflowId, selectedEdgeId, {
      label: edgeLabel || undefined,
      condition: edgeCondition || undefined,
      type: edgeType as any,
    });
  };

  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    if (!confirm('Are you sure you want to delete this node?')) return;
    
    deleteNode(workflowId, selectedNodeId);
    onClose();
  };

  const handleDeleteEdge = () => {
    if (!selectedEdgeId) return;
    if (!confirm('Are you sure you want to delete this connection?')) return;
    
    deleteEdge(workflowId, selectedEdgeId);
    onClose();
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900" style={{ fontSize: '20px', fontWeight: 600 }}>
            Properties
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 italic text-center py-12" style={{ fontSize: '14px', lineHeight: '1.5' }}>
          Select a node or connection to view its properties.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900" style={{ fontSize: '20px', fontWeight: 600 }}>
          {selectedNode ? 'Node Properties' : 'Connection Properties'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Node Properties */}
      {selectedNode && (
        <div className="space-y-6">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
              Label
            </label>
            <input
              type="text"
              value={nodeLabel}
              onChange={(e) => setNodeLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: '14px' }}
            />
          </div>

          {/* Agent Selection (for agent nodes) */}
          {selectedNode.type === 'agent' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                Agent
              </label>
              <select
                value={nodeAgentId}
                onChange={(e) => setNodeAgentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: '14px' }}
              >
                <option value="">Select an agent...</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Condition (for condition nodes) */}
          {selectedNode.type === 'condition' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                Condition Expression
              </label>
              <input
                type="text"
                value={nodeCondition}
                onChange={(e) => setNodeCondition(e.target.value)}
                placeholder="e.g., context.success === true"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                style={{ fontSize: '13px' }}
              />
              <p className="mt-1 text-xs text-gray-500" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                Use JavaScript expressions. Access context with <code className="bg-gray-100 px-1 rounded">context.*</code>
              </p>
            </div>
          )}

          {/* Timeout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
              Timeout (ms)
            </label>
            <input
              type="number"
              value={nodeTimeout}
              onChange={(e) => setNodeTimeout(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: '14px' }}
            />
          </div>

          {/* Retry Configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
              Retry Configuration
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontSize: '12px' }}>
                  Max Attempts
                </label>
                <input
                  type="number"
                  value={nodeRetryAttempts}
                  onChange={(e) => setNodeRetryAttempts(e.target.value)}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontSize: '14px' }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontSize: '12px' }}>
                  Backoff (ms)
                </label>
                <input
                  type="number"
                  value={nodeRetryBackoff}
                  onChange={(e) => setNodeRetryBackoff(e.target.value)}
                  min="0"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontSize: '14px' }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleSaveNode}
              className="flex-1"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Save Changes
            </Button>
            <Button
              variant="secondary"
              onClick={handleDeleteNode}
              disabled={selectedNode.type === 'start' || selectedNode.type === 'end'}
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edge Properties */}
      {selectedEdge && (
        <div className="space-y-6">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
              Label
            </label>
            <input
              type="text"
              value={edgeLabel}
              onChange={(e) => setEdgeLabel(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: '14px' }}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
              Type
            </label>
            <select
              value={edgeType}
              onChange={(e) => setEdgeType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: '14px' }}
            >
              <option value="default">Default</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="conditional">Conditional</option>
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
              Condition
            </label>
            <input
              type="text"
              value={edgeCondition}
              onChange={(e) => setEdgeCondition(e.target.value)}
              placeholder="Optional - e.g., context.status === 'approved'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              style={{ fontSize: '13px' }}
            />
            <p className="mt-1 text-xs text-gray-500" style={{ fontSize: '12px', lineHeight: '1.4' }}>
              Connection will only be followed if condition evaluates to true.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleSaveEdge}
              className="flex-1"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Save Changes
            </Button>
            <Button
              variant="secondary"
              onClick={handleDeleteEdge}
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
