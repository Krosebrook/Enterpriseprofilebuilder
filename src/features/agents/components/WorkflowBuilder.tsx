/**
 * Workflow Builder - Visual Workflow Designer
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Main component for creating and editing multi-agent workflows
 */

import React, { useState, useCallback } from 'react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { useAgentStore } from '../hooks/useAgentStore';
import { WorkflowCanvas } from './WorkflowCanvas';
import { WorkflowToolbar } from './WorkflowToolbar';
import { WorkflowNodePalette } from './WorkflowNodePalette';
import { WorkflowProperties } from './WorkflowProperties';
import { WorkflowExecutionPanel } from './WorkflowExecutionPanel';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { 
  Play, 
  Save, 
  Settings, 
  FileJson, 
  Download, 
  Upload,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { WorkflowEngine } from '../../../lib/agents/workflow-engine';
import { AgentExecutor } from '../../../lib/agents/executor';

export function WorkflowBuilder() {
  const {
    workflows,
    activeWorkflowId,
    setActiveWorkflow,
    validateWorkflow,
    executeWorkflow,
    getExecution,
    exportWorkflow,
    importWorkflow,
  } = useWorkflowStore();

  const { agents } = useAgentStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [showExecutionPanel, setShowExecutionPanel] = useState(false);
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId);

  // Handle workflow execution
  const handleExecute = useCallback(async () => {
    if (!activeWorkflow) return;

    // Validate first
    const validation = validateWorkflow(activeWorkflow.id);
    if (!validation.valid) {
      alert(
        `Cannot execute workflow:\n${validation.errors.map(e => `• ${e.message}`).join('\n')}`
      );
      return;
    }

    setIsExecuting(true);
    setShowExecutionPanel(true);

    try {
      // Create workflow engine and register agents
      const engine = new WorkflowEngine();
      
      // Register all agents that are used in the workflow
      const agentNodes = activeWorkflow.nodes.filter(n => n.type === 'agent');
      agentNodes.forEach(node => {
        if (node.agentId) {
          const agent = agents.find(a => a.id === node.agentId);
          if (agent) {
            const executor = new AgentExecutor({
              agentName: agent.name,
              agentRole: agent.role,
              agentGoal: agent.goal,
              toolIds: agent.tools,
              model: agent.modelConfig.model,
              temperature: agent.modelConfig.temperature,
              maxTokens: agent.modelConfig.maxTokens,
            });
            engine.registerAgent(node.agentId, executor);
          }
        }
      });

      // Execute workflow
      const execution = await executeWorkflow(activeWorkflow.id, engine);
      setActiveExecutionId(execution.id);
    } catch (error) {
      console.error('Workflow execution failed:', error);
      alert(`Execution failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExecuting(false);
    }
  }, [activeWorkflow, validateWorkflow, executeWorkflow, agents]);

  // Handle workflow export
  const handleExport = useCallback(() => {
    if (!activeWorkflow) return;
    
    const workflow = exportWorkflow(activeWorkflow.id);
    if (!workflow) return;

    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${workflow.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [activeWorkflow, exportWorkflow]);

  // Handle workflow import
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const workflow = JSON.parse(event.target?.result as string);
          importWorkflow(workflow);
          setActiveWorkflow(workflow.id);
        } catch (error) {
          alert('Failed to import workflow. Invalid JSON format.');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }, [importWorkflow, setActiveWorkflow]);

  // Get validation status
  const validation = activeWorkflow ? validateWorkflow(activeWorkflow.id) : null;

  if (!activeWorkflow) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-12 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
            No Workflow Selected
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            Select a workflow from the library or create a new one to get started.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontSize: '24px', fontWeight: 700 }}>
              {activeWorkflow.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1" style={{ fontSize: '14px' }}>
              {activeWorkflow.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Validation Status */}
            {validation && (
              <div className="flex items-center gap-2">
                {validation.valid ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium" style={{ fontSize: '14px', fontWeight: 500 }}>
                      Valid
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium" style={{ fontSize: '14px', fontWeight: 500 }}>
                      {validation.errors.length} Error{validation.errors.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <Button
              variant="secondary"
              onClick={() => setShowProperties(!showProperties)}
              style={{ fontSize: '14px', fontWeight: 600, padding: '10px 16px' }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Properties
            </Button>

            <Button
              variant="secondary"
              onClick={handleImport}
              style={{ fontSize: '14px', fontWeight: 600, padding: '10px 16px' }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>

            <Button
              variant="secondary"
              onClick={handleExport}
              style={{ fontSize: '14px', fontWeight: 600, padding: '10px 16px' }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button
              variant="primary"
              onClick={handleExecute}
              disabled={isExecuting || !validation?.valid}
              style={{ fontSize: '14px', fontWeight: 600, padding: '10px 16px' }}
            >
              <Play className="w-4 h-4 mr-2" />
              {isExecuting ? 'Executing...' : 'Execute'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <WorkflowNodePalette workflowId={activeWorkflow.id} />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas
            workflow={activeWorkflow}
            selectedNodeId={selectedNodeId}
            selectedEdgeId={selectedEdgeId}
            onNodeSelect={setSelectedNodeId}
            onEdgeSelect={setSelectedEdgeId}
            executionId={activeExecutionId}
          />
        </div>

        {/* Right Sidebar - Properties or Execution Panel */}
        {(showProperties || showExecutionPanel) && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            {showExecutionPanel && activeExecutionId ? (
              <WorkflowExecutionPanel
                executionId={activeExecutionId}
                onClose={() => {
                  setShowExecutionPanel(false);
                  setActiveExecutionId(null);
                }}
              />
            ) : showProperties ? (
              <WorkflowProperties
                workflowId={activeWorkflow.id}
                selectedNodeId={selectedNodeId}
                selectedEdgeId={selectedEdgeId}
                onClose={() => setShowProperties(false)}
              />
            ) : null}
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <WorkflowToolbar
        workflow={activeWorkflow}
        validation={validation}
      />
    </div>
  );
}
