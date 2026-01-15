/**
 * Workflow Edge Component - Visual Connection Between Nodes
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * SVG-based edge component with bezier curves and labels
 */

import React from 'react';
import { WorkflowEdge, Position } from '../../../lib/agents/workflow-types';

interface WorkflowEdgeComponentProps {
  edge: WorkflowEdge;
  sourcePosition: Position;
  targetPosition: Position;
  isSelected: boolean;
  onClick: () => void;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function WorkflowEdgeComponent({
  edge,
  sourcePosition,
  targetPosition,
  isSelected,
  onClick,
}: WorkflowEdgeComponentProps) {
  // Calculate connection points (right side of source, left side of target)
  const sourceX = sourcePosition.x + NODE_WIDTH;
  const sourceY = sourcePosition.y + NODE_HEIGHT / 2;
  const targetX = targetPosition.x;
  const targetY = targetPosition.y + NODE_HEIGHT / 2;

  // Calculate bezier curve control points
  const controlPointOffset = Math.min(Math.abs(targetX - sourceX) / 2, 100);
  const controlPoint1X = sourceX + controlPointOffset;
  const controlPoint1Y = sourceY;
  const controlPoint2X = targetX - controlPointOffset;
  const controlPoint2Y = targetY;

  // Create SVG path
  const path = `M ${sourceX},${sourceY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${targetX},${targetY}`;

  // Get edge color based on type
  const getEdgeColor = () => {
    switch (edge.type) {
      case 'success':
        return '#10B981'; // Green
      case 'failure':
        return '#EF4444'; // Red
      case 'conditional':
        return '#F59E0B'; // Amber
      default:
        return '#6B7280'; // Gray
    }
  };

  const edgeColor = isSelected ? '#E88A1D' : getEdgeColor();
  const strokeWidth = isSelected ? 3 : 2;

  // Calculate label position (midpoint of the curve)
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  return (
    <g className="cursor-pointer" onClick={onClick}>
      {/* Invisible wider path for easier clicking */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={strokeWidth + 10}
        className="pointer-events-auto"
      />
      
      {/* Visible path */}
      <path
        d={path}
        fill="none"
        stroke={edgeColor}
        strokeWidth={strokeWidth}
        markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
        className={`transition-all ${isSelected ? 'drop-shadow-md' : ''}`}
        strokeDasharray={edge.condition ? '5,5' : 'none'}
      />

      {/* Edge Label */}
      {edge.label && (
        <g>
          <rect
            x={labelX - 30}
            y={labelY - 10}
            width={60}
            height={20}
            fill="white"
            stroke={edgeColor}
            strokeWidth={1}
            rx={4}
            className="pointer-events-none"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fill={edgeColor}
            fontSize="11"
            fontWeight="500"
            className="pointer-events-none select-none"
          >
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
}
