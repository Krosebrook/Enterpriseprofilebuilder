/**
 * Workflow Toolbar - Bottom Status Bar
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Bottom toolbar showing workflow stats and validation status
 */

import React from 'react';
import { WorkflowDefinition, WorkflowValidationResult } from '../../../lib/agents/workflow-types';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface WorkflowToolbarProps {
  workflow: WorkflowDefinition;
  validation: WorkflowValidationResult | null;
}

export function WorkflowToolbar({ workflow, validation }: WorkflowToolbarProps) {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Side - Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-600" style={{ fontSize: '14px' }}>
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{ fontWeight: 500 }}>Nodes:</span>
            <span className="text-gray-900 font-semibold" style={{ fontWeight: 600 }}>
              {workflow.nodes.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{ fontWeight: 500 }}>Connections:</span>
            <span className="text-gray-900 font-semibold" style={{ fontWeight: 600 }}>
              {workflow.edges.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{ fontWeight: 500 }}>Version:</span>
            <span className="text-gray-900 font-semibold" style={{ fontWeight: 600 }}>
              {workflow.version}
            </span>
          </div>
        </div>

        {/* Right Side - Validation Status */}
        {validation && (
          <div className="flex items-center gap-4">
            {/* Errors */}
            {validation.errors.length > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {validation.errors.length} Error{validation.errors.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {validation.warnings.length} Warning{validation.warnings.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Valid */}
            {validation.valid && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Valid
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Messages */}
      {validation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {/* Errors */}
          {validation.errors.length > 0 && (
            <div className="mb-2">
              <div className="text-sm font-medium text-red-900 mb-1" style={{ fontSize: '14px', fontWeight: 600 }}>
                Errors:
              </div>
              <ul className="space-y-1">
                {validation.errors.slice(0, 3).map((error, index) => (
                  <li
                    key={index}
                    className="text-sm text-red-700 flex items-start gap-2"
                    style={{ fontSize: '13px', lineHeight: '1.5' }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error.message}</span>
                  </li>
                ))}
                {validation.errors.length > 3 && (
                  <li className="text-sm text-red-600 italic" style={{ fontSize: '13px' }}>
                    ... and {validation.errors.length - 3} more error{validation.errors.length - 3 !== 1 ? 's' : ''}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {validation.warnings.length > 0 && (
            <div>
              <div className="text-sm font-medium text-amber-900 mb-1" style={{ fontSize: '14px', fontWeight: 600 }}>
                Warnings:
              </div>
              <ul className="space-y-1">
                {validation.warnings.slice(0, 2).map((warning, index) => (
                  <li
                    key={index}
                    className="text-sm text-amber-700 flex items-start gap-2"
                    style={{ fontSize: '13px', lineHeight: '1.5' }}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{warning.message}</span>
                  </li>
                ))}
                {validation.warnings.length > 2 && (
                  <li className="text-sm text-amber-600 italic" style={{ fontSize: '13px' }}>
                    ... and {validation.warnings.length - 2} more warning{validation.warnings.length - 2 !== 1 ? 's' : ''}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
