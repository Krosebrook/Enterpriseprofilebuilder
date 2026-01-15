/**
 * Workflow Canvas - Visual Workflow Editor
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Interactive canvas for building workflows with drag-and-drop nodes and connections
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { WorkflowDefinition, WorkflowNode, WorkflowEdge, Position } from '../../../lib/agents/workflow-types';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { WorkflowNodeComponent } from './WorkflowNodeComponent';
import { WorkflowEdgeComponent } from './WorkflowEdgeComponent';

interface WorkflowCanvasProps {
  workflow: WorkflowDefinition;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  onEdgeSelect: (edgeId: string | null) => void;
  executionId?: string | null;
}

export function WorkflowCanvas({
  workflow,
  selectedNodeId,
  selectedEdgeId,
  onNodeSelect,
  onEdgeSelect,
  executionId,
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });
  const [viewOffset, setViewOffset] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const { updateNode, addEdge, getExecution } = useWorkflowStore();

  const execution = executionId ? getExecution(executionId) : undefined;

  // Handle canvas panning
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
      onNodeSelect(null);
      onEdgeSelect(null);
    }
  }, [viewOffset, onNodeSelect, onEdgeSelect]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setViewOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  }, [isPanning, panStart]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Handle node dragging
  const handleNodeDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    onNodeSelect(nodeId);
  }, [onNodeSelect]);

  const handleNodeDrag = useCallback((nodeId: string, delta: Position) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    updateNode(workflow.id, nodeId, {
      position: {
        x: node.position.x + delta.x / zoom,
        y: node.position.y + delta.y / zoom,
      },
    });
  }, [workflow, updateNode, zoom]);

  const handleNodeDragEnd = useCallback(() => {
    setDraggedNodeId(null);
  }, []);

  // Handle node connection
  const handleConnectStart = useCallback((nodeId: string) => {
    setConnectingFrom(nodeId);
  }, []);

  const handleConnectEnd = useCallback((targetNodeId: string) => {
    if (connectingFrom && connectingFrom !== targetNodeId) {
      // Don't allow connecting to self
      addEdge(workflow.id, {
        source: connectingFrom,
        target: targetNodeId,
        type: 'default',
      });
    }
    setConnectingFrom(null);
  }, [connectingFrom, workflow.id, addEdge]);

  // Handle zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY / 1000;
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  }, []);

  // Get node position in canvas coordinates
  const getNodeCanvasPosition = useCallback((position: Position): Position => {
    return {
      x: position.x * zoom + viewOffset.x,
      y: position.y * zoom + viewOffset.y,
    };
  }, [zoom, viewOffset]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-gray-50 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onWheel={handleWheel}
      style={{
        backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${viewOffset.x}px ${viewOffset.y}px`,
      }}
    >
      {/* SVG Layer for Edges */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#6B7280" />
          </marker>
          <marker
            id="arrowhead-selected"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#E88A1D" />
          </marker>
        </defs>

        {workflow.edges.map(edge => {
          const sourceNode = workflow.nodes.find(n => n.id === edge.source);
          const targetNode = workflow.nodes.find(n => n.id === edge.target);
          
          if (!sourceNode || !targetNode) return null;

          const sourcePos = getNodeCanvasPosition(sourceNode.position);
          const targetPos = getNodeCanvasPosition(targetNode.position);

          return (
            <WorkflowEdgeComponent
              key={edge.id}
              edge={edge}
              sourcePosition={sourcePos}
              targetPosition={targetPos}
              isSelected={edge.id === selectedEdgeId}
              onClick={() => {
                onEdgeSelect(edge.id);
                onNodeSelect(null);
              }}
            />
          );
        })}

        {/* Connection line when dragging */}
        {connectingFrom && (
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={0}
            stroke="#E88A1D"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="pointer-events-none"
          />
        )}
      </svg>

      {/* Nodes Layer */}
      {workflow.nodes.map(node => {
        const canvasPosition = getNodeCanvasPosition(node.position);
        const nodeExecution = execution?.steps[node.id];

        return (
          <WorkflowNodeComponent
            key={node.id}
            node={node}
            position={canvasPosition}
            isSelected={node.id === selectedNodeId}
            isDragging={node.id === draggedNodeId}
            zoom={zoom}
            executionStatus={nodeExecution?.status}
            onSelect={() => {
              onNodeSelect(node.id);
              onEdgeSelect(null);
            }}
            onDragStart={(e) => handleNodeDragStart(node.id, e)}
            onDrag={(delta) => handleNodeDrag(node.id, delta)}
            onDragEnd={handleNodeDragEnd}
            onConnectStart={() => handleConnectStart(node.id)}
            onConnectEnd={() => handleConnectEnd(node.id)}
          />
        );
      })}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md border border-gray-200 p-2 flex flex-col gap-2">
        <button
          onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
          className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          +
        </button>
        <div className="text-center text-sm text-gray-600" style={{ fontSize: '12px' }}>
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
          className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          −
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setViewOffset({ x: 0, y: 0 });
          }}
          className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded border-t border-gray-200 pt-2"
          style={{ fontSize: '12px', fontWeight: 600 }}
        >
          Reset
        </button>
      </div>

      {/* Instructions */}
      {workflow.nodes.length === 2 && workflow.edges.length === 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md border border-gray-200 px-4 py-3 max-w-md">
          <p className="text-sm text-gray-600 text-center" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            Add agents from the left panel and connect them to create your workflow.
            Drag nodes to reposition, click to select, and use connection handles to link nodes.
          </p>
        </div>
      )}
    </div>
  );
}
