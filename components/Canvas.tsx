import React, { useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  NodeTypes,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import { useStore } from '../store';
import UserFlowNode from './UserFlowNode';
import { Plus } from 'lucide-react';

const nodeTypes: NodeTypes = {
  userFlow: UserFlowNode,
};

// Inner component to access useReactFlow hook
const CanvasInner = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode,
    focusTarget,
    setFocusTarget
  } = useStore();

  const { setCenter, getNodes, fitView } = useReactFlow();

  // Bi-directional anchoring logic
  useEffect(() => {
    if (focusTarget) {
      const node = getNodes().find(n => n.id === focusTarget);
      if (node) {
        // Calculate center position to focus on the node
        // Assuming node width ~320px
        const x = node.position.x + 160; 
        const y = node.position.y + 100;
        
        setCenter(x, y, { zoom: 1.2, duration: 800 });
      }
      // Reset after focusing so we can re-click
      setTimeout(() => setFocusTarget(null), 1000);
    }
  }, [focusTarget, getNodes, setCenter, setFocusTarget]);

  return (
    <div className="w-full h-full relative bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background gap={20} size={1} color="#e5e7eb" />
        <Controls className="bg-white border border-gray-200 shadow-sm rounded-lg text-gray-600" />
        <MiniMap 
            className="border border-gray-200 shadow-lg rounded-lg overflow-hidden" 
            style={{ width: 120, height: 80 }}
            nodeColor="#f1f5f9"
            maskColor="rgba(240, 242, 245, 0.6)"
        />
      </ReactFlow>

      {/* Floating Action Button - Subtle & Refined */}
      <button
        onClick={() => addNode({ x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:bg-white hover:text-gray-900 transition-all flex items-center gap-2 text-xs font-semibold hover:-translate-y-0.5"
      >
        <Plus size={14} /> <span>添加用户步骤</span>
      </button>
    </div>
  );
};

// Wrapper to provide Context
const Canvas = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};

export default Canvas;