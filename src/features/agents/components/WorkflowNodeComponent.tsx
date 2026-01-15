/**
 * Workflow Node Component - Visual Node Representation
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Individual node component with drag/drop and connection handles
 */

import React, { useRef, useCallback, useState } from 'react';
import { WorkflowNode, Position, WorkflowStepStatus } from '../../../lib/agents/workflow-types';
import { useAgentStore } from '../hooks/useAgentStore';
import {
  Play,
  Flag,
  Bot,
  GitBranch,
  Layers,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Circle,
} from 'lucide-react';

interface WorkflowNodeComponentProps {
  node: WorkflowNode;
  position: Position;
  isSelected: boolean;
  isDragging: boolean;
  zoom: number;
  executionStatus?: WorkflowStepStatus;
  onSelect: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDrag: (delta: Position) => void;
  onDragEnd: () => void;
  onConnectStart: () => void;
  onConnectEnd: () => void;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function WorkflowNodeComponent({
  node,
  position,
  isSelected,
  isDragging,
  zoom,
  executionStatus,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
  onConnectStart,
  onConnectEnd,
}: WorkflowNodeComponentProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const { agents } = useAgentStore();

  // Get agent info if this is an agent node
  const agent = node.type === 'agent' && node.agentId
    ? agents.find(a => a.id === node.agentId)
    : null;

  // Handle drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    setDragStart({ x: e.clientX, y: e.clientY });
    onDragStart(e);
    onSelect();
  }, [onDragStart, onSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStart) return;
    
    const delta = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    
    setDragStart({ x: e.clientX, y: e.clientY });
    onDrag(delta);
  }, [dragStart, onDrag]);

  const handleMouseUp = useCallback(() => {
    setDragStart(null);
    onDragEnd();
  }, [onDragEnd]);

  // Get node icon
  const getNodeIcon = () => {
    switch (node.type) {
      case 'start':
        return <Play className="w-5 h-5" />;
      case 'end':
        return <Flag className="w-5 h-5" />;
      case 'agent':
        return <Bot className="w-5 h-5" />;
      case 'condition':
        return <GitBranch className="w-5 h-5" />;
      case 'parallel':
        return <Layers className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  // Get node color
  const getNodeColor = () => {
    if (node.metadata?.color) return node.metadata.color;
    
    switch (node.type) {
      case 'start':
        return '#10B981'; // Green
      case 'end':
        return '#EF4444'; // Red
      case 'agent':
        return '#3B82F6'; // Blue
      case 'condition':
        return '#F59E0B'; // Amber
      case 'parallel':
        return '#8B5CF6'; // Purple
      default:
        return '#6B7280'; // Gray
    }
  };

  // Get execution status indicator
  const getExecutionStatusIcon = () => {
    if (!executionStatus) return null;

    switch (executionStatus) {
      case 'running':
        return <Loader className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'skipped':
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const nodeColor = getNodeColor();
  const borderColor = isSelected ? '#E88A1D' : nodeColor;
  const borderWidth = isSelected ? 3 : 2;

  return (
    <div
      ref={nodeRef}
      className="absolute cursor-move select-none"
      style={{
        left: position.x,
        top: position.y,
        width: NODE_WIDTH * zoom,
        height: NODE_HEIGHT * zoom,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        zIndex: isSelected ? 1000 : isDragging ? 999 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={dragStart ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Main Node Card */}
      <div
        className="relative w-full h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        style={{
          border: `${borderWidth}px solid ${borderColor}`,
          fontSize: `${14 * zoom}px`,
        }}
      >
        {/* Node Header */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-t-lg"
          style={{
            backgroundColor: `${nodeColor}15`,
            borderBottom: `1px solid ${nodeColor}30`,
          }}
        >
          <div style={{ color: nodeColor }}>
            {getNodeIcon()}
          </div>
          <span
            className="font-semibold text-gray-900 truncate flex-1"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            {node.label}
          </span>
          {executionStatus && (
            <div className="flex-shrink-0">
              {getExecutionStatusIcon()}
            </div>
          )}
        </div>

        {/* Node Body */}
        <div className="px-3 py-2">
          {node.type === 'agent' && agent && (
            <div className="text-xs text-gray-600 truncate" style={{ fontSize: '12px' }}>
              {agent.name}
            </div>
          )}
          {node.type === 'condition' && node.condition && (
            <div className="text-xs text-gray-600 truncate" style={{ fontSize: '11px' }}>
              {node.condition}
            </div>
          )}
          {node.metadata?.description && (
            <div className="text-xs text-gray-500 truncate mt-1" style={{ fontSize: '11px' }}>
              {node.metadata.description}
            </div>
          )}
        </div>

        {/* Connection Handles */}
        {node.type !== 'end' && (
          <div
            className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 rounded-full cursor-pointer hover:scale-125 transition-transform"
            style={{
              borderColor: nodeColor,
              zIndex: 10,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onConnectStart();
            }}
            title="Drag to connect"
          />
        )}
        
        {node.type !== 'start' && (
          <div
            className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 rounded-full"
            style={{
              borderColor: nodeColor,
              zIndex: 10,
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              onConnectEnd();
            }}
          />
        )}
      </div>
    </div>
  );
}
