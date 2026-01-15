/**
 * Workflow Execution Panel - Real-time Execution Monitoring
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Right sidebar showing live workflow execution progress and logs
 */

import React from 'react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { Button } from '../../../components/ui/Button';
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Circle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { WorkflowStepStatus } from '../../../lib/agents/workflow-types';

interface WorkflowExecutionPanelProps {
  executionId: string;
  onClose: () => void;
}

export function WorkflowExecutionPanel({
  executionId,
  onClose,
}: WorkflowExecutionPanelProps) {
  const { getExecution, getWorkflow } = useWorkflowStore();
  
  const execution = getExecution(executionId);
  const workflow = execution ? getWorkflow(execution.workflowId) : null;

  if (!execution || !workflow) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900" style={{ fontSize: '20px', fontWeight: 600 }}>
            Execution
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 italic" style={{ fontSize: '14px' }}>
          Execution not found.
        </p>
      </div>
    );
  }

  // Get status icon and color
  const getStatusDisplay = (status: WorkflowStepStatus) => {
    switch (status) {
      case 'running':
        return {
          icon: <Loader className="w-4 h-4 animate-spin" />,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          label: 'Running',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-green-600',
          bg: 'bg-green-50',
          label: 'Completed',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'text-red-600',
          bg: 'bg-red-50',
          label: 'Failed',
        };
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-gray-400',
          bg: 'bg-gray-50',
          label: 'Pending',
        };
      case 'skipped':
        return {
          icon: <Circle className="w-4 h-4" />,
          color: 'text-gray-400',
          bg: 'bg-gray-50',
          label: 'Skipped',
        };
      case 'cancelled':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          label: 'Cancelled',
        };
      default:
        return {
          icon: <Circle className="w-4 h-4" />,
          color: 'text-gray-400',
          bg: 'bg-gray-50',
          label: 'Unknown',
        };
    }
  };

  const executionStatus = getStatusDisplay(execution.status as any);
  const duration = execution.completedAt
    ? execution.completedAt - execution.startedAt
    : Date.now() - execution.startedAt;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900" style={{ fontSize: '20px', fontWeight: 600 }}>
            Execution Monitor
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Status */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${executionStatus.bg}`}>
          <div className={executionStatus.color}>{executionStatus.icon}</div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>
              {executionStatus.label}
            </div>
            <div className="text-sm text-gray-600" style={{ fontSize: '12px' }}>
              {(duration / 1000).toFixed(1)}s elapsed
            </div>
          </div>
        </div>

        {/* Error Message */}
        {execution.error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-red-900" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Execution Failed
                </div>
                <div className="text-sm text-red-700 mt-1" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                  {execution.error.message}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step Details */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
          Step Progress
        </h3>

        <div className="space-y-3">
          {workflow.nodes.map(node => {
            const step = execution.steps[node.id];
            if (!step) return null;

            const stepStatus = getStatusDisplay(step.status);
            const stepDuration = step.completedAt && step.startedAt
              ? step.completedAt - step.startedAt
              : null;

            return (
              <div
                key={node.id}
                className={`p-4 rounded-lg border ${stepStatus.bg} ${
                  step.status === 'running' ? 'border-blue-300' : 'border-gray-200'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={stepStatus.color}>{stepStatus.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {node.label}
                    </div>
                    <div className="text-xs text-gray-600" style={{ fontSize: '11px' }}>
                      {stepStatus.label}
                      {stepDuration && ` • ${(stepDuration / 1000).toFixed(2)}s`}
                    </div>
                  </div>
                  {step.attempts > 0 && (
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded" style={{ fontSize: '11px' }}>
                      Attempt {step.attempts}
                    </div>
                  )}
                </div>

                {/* Step Input/Output */}
                {step.input && (
                  <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                      Input:
                    </div>
                    <div className="text-xs text-gray-600 font-mono break-all" style={{ fontSize: '11px' }}>
                      {typeof step.input === 'string'
                        ? step.input.length > 100
                          ? step.input.substring(0, 100) + '...'
                          : step.input
                        : JSON.stringify(step.input).substring(0, 100) + '...'}
                    </div>
                  </div>
                )}

                {step.output && (
                  <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                      Output:
                    </div>
                    <div className="text-xs text-gray-600 font-mono break-all" style={{ fontSize: '11px' }}>
                      {typeof step.output === 'string'
                        ? step.output.length > 100
                          ? step.output.substring(0, 100) + '...'
                          : step.output
                        : JSON.stringify(step.output).substring(0, 100) + '...'}
                    </div>
                  </div>
                )}

                {/* Error */}
                {step.error && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <div className="text-xs font-medium text-red-900 mb-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                      Error:
                    </div>
                    <div className="text-xs text-red-700" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                      {step.error.message}
                    </div>
                  </div>
                )}

                {/* Logs */}
                {step.logs && step.logs.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-gray-700 mb-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                      Logs:
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {step.logs.map((log, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-600 font-mono flex gap-2"
                          style={{ fontSize: '10px' }}
                        >
                          <span className="text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className={
                            log.level === 'error' ? 'text-red-600' :
                            log.level === 'warn' ? 'text-amber-600' :
                            'text-gray-600'
                          }>
                            {log.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Context */}
        {Object.keys(execution.context).length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
              Shared Context
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <pre className="text-xs text-gray-700 font-mono overflow-x-auto" style={{ fontSize: '11px' }}>
                {JSON.stringify(execution.context, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-600" style={{ fontSize: '12px' }}>
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>
            Execution ID: <code className="bg-white px-1 rounded text-xs">{execution.id}</code>
          </span>
        </div>
      </div>
    </div>
  );
}
