/**
 * Workflow Library - Browse and Manage Workflows
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Main view for browsing, creating, and managing workflows
 */

import React, { useState } from 'react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  Plus,
  Play,
  Edit,
  Copy,
  Trash2,
  GitBranch,
  Clock,
  CheckCircle,
  XCircle,
  Search,
} from 'lucide-react';

export function WorkflowLibrary() {
  const {
    workflows,
    createWorkflow,
    setActiveWorkflow,
    duplicateWorkflow,
    deleteWorkflow,
    getWorkflowExecutions,
  } = useWorkflowStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');

  // Filter workflows
  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create workflow
  const handleCreate = () => {
    if (!newWorkflowName.trim()) return;

    createWorkflow(newWorkflowName, newWorkflowDescription);
    setNewWorkflowName('');
    setNewWorkflowDescription('');
    setShowCreateDialog(false);
  };

  // Handle delete workflow
  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    deleteWorkflow(id);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontSize: '24px', fontWeight: 700 }}>
              Workflow Library
            </h1>
            <p className="text-sm text-gray-600 mt-1" style={{ fontSize: '14px' }}>
              Create and manage multi-agent workflows
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setShowCreateDialog(true)}
            style={{ fontSize: '14px', fontWeight: 600, padding: '10px 16px' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workflows..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredWorkflows.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Card className="p-12 text-center max-w-md">
              <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontSize: '20px', fontWeight: 600 }}>
                {searchQuery ? 'No workflows found' : 'No workflows yet'}
              </h2>
              <p className="text-sm text-gray-600 mb-6" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                {searchQuery
                  ? 'Try a different search query.'
                  : 'Create your first workflow to orchestrate multiple agents.'}
              </p>
              {!searchQuery && (
                <Button
                  variant="primary"
                  onClick={() => setShowCreateDialog(true)}
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              )}
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map(workflow => {
              const executions = getWorkflowExecutions(workflow.id);
              const lastExecution = executions[0];
              const successRate = executions.length > 0
                ? (executions.filter(e => e.status === 'completed').length / executions.length) * 100
                : 0;

              return (
                <Card key={workflow.id} className="p-6 hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontSize: '16px', fontWeight: 600 }}>
                        {workflow.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                        {workflow.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600" style={{ fontSize: '14px' }}>
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-4 h-4" />
                      <span>{workflow.nodes.length} nodes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      <span>{executions.length} runs</span>
                    </div>
                  </div>

                  {/* Last Execution */}
                  {lastExecution && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600" style={{ fontSize: '12px' }}>Last run:</span>
                        <div className="flex items-center gap-2">
                          {lastExecution.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : lastExecution.status === 'failed' ? (
                            <XCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-gray-900 font-medium" style={{ fontSize: '12px', fontWeight: 500 }}>
                            {lastExecution.status}
                          </span>
                        </div>
                      </div>
                      {executions.length > 1 && (
                        <div className="mt-1 text-xs text-gray-500" style={{ fontSize: '11px' }}>
                          Success rate: {successRate.toFixed(0)}%
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-gray-500 mb-4" style={{ fontSize: '11px' }}>
                    {workflow.metadata?.tags && workflow.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {workflow.metadata.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                            style={{ fontSize: '11px' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div>Version {workflow.version}</div>
                    {workflow.metadata?.updatedAt && (
                      <div className="mt-1">
                        Updated {new Date(workflow.metadata.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => setActiveWorkflow(workflow.id)}
                      className="flex-1"
                      style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => duplicateWorkflow(workflow.id)}
                      style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(workflow.id, workflow.name)}
                      style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
              Create New Workflow
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Name
                </label>
                <input
                  type="text"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="e.g., Customer Support Workflow"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontSize: '14px' }}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Description
                </label>
                <textarea
                  value={newWorkflowDescription}
                  onChange={(e) => setNewWorkflowDescription(e.target.value)}
                  placeholder="Describe what this workflow does..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontSize: '14px' }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewWorkflowName('');
                  setNewWorkflowDescription('');
                }}
                className="flex-1"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreate}
                disabled={!newWorkflowName.trim()}
                className="flex-1"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Create
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
