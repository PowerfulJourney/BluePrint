// Import React to provide access to the React namespace for types like MouseEvent.
import React, { useEffect, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  NodeTypes,
  useReactFlow,
  ReactFlowProvider,
  XYPosition
} from 'reactflow';
import { useStore } from '../store';
import UserFlowNode from './UserFlowNode';
import RoleNode from './RoleNode';
import { Plus, UserPlus } from 'lucide-react';

const nodeTypes: NodeTypes = {
  userFlow: UserFlowNode,
  role: RoleNode,
};

const CanvasInner = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode,
    addRoleNode,
    focusTarget,
    setFocusTarget
  } = useStore();

  const { setCenter, getNodes, getZoom } = useReactFlow();

  useEffect(() => {
    if (focusTarget) {
      const node = getNodes().find(n => n.id === focusTarget);
      if (node) {
        const x = node.position.x + 160; 
        const y = node.position.y + 100;
        setCenter(x, y, { zoom: 1.2, duration: 800 });
      }
      setTimeout(() => setFocusTarget(null), 1000);
    }
  }, [focusTarget, getNodes, setCenter, setFocusTarget]);

  const onMiniMapClick = useCallback((_: React.MouseEvent, position: XYPosition) => {
    const currentZoom = getZoom();
    setCenter(position.x, position.y, { zoom: currentZoom, duration: 600 });
  }, [setCenter, getZoom]);

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
            className="border border-gray-200 shadow-lg rounded-lg overflow-hidden cursor-pointer" 
            style={{ width: 120, height: 80 }}
            nodeColor={(node) => node.type === 'role' ? '#e0e7ff' : '#f1f5f9'}
            maskColor="rgba(240, 242, 245, 0.6)"
            onClick={onMiniMapClick}
        />
      </ReactFlow>

      {/* Floating Action Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        <button
          onClick={() => addRoleNode({ x: Math.random() * 200 + 50, y: Math.random() * 400 + 100 })}
          className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-semibold hover:-translate-y-0.5"
        >
          <UserPlus size={16} /> <span>添加角色</span>
        </button>

        <button
          onClick={() => addNode({ x: Math.random() * 400 + 300, y: Math.random() * 400 + 100 })}
          className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-semibold hover:-translate-y-0.5"
        >
          <Plus size={16} /> <span>添加用户步骤</span>
        </button>
      </div>
    </div>
  );
};

const Canvas = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};

export default Canvas;