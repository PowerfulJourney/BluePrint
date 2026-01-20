
import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { RoleNodeData } from '../types';
import { useStore } from '../store';
import { User, GripVertical } from 'lucide-react';

const RoleNode = ({ id, data, selected }: NodeProps<RoleNodeData>) => {
  const updateNodeTitle = useStore((state) => state.updateNodeTitle);
  const updateNodeDescription = useStore((state) => state.updateNodeDescription);

  return (
    <div className="w-[280px] relative group/node">
      <Handle type="target" position={Position.Left} className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-white transition-colors hover:!bg-indigo-600" />
      
      <div className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 flex flex-col ${selected ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-2xl' : 'border-indigo-100 hover:border-indigo-200 shadow-md'}`}>
        <div className="p-4 relative">
          <div className="absolute top-4 right-3 text-indigo-200 cursor-grab active:cursor-grabbing opacity-0 group-hover/node:opacity-100 transition-opacity p-1 hover:bg-indigo-50 rounded">
            <GripVertical size={16} />
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <User size={20} />
            </div>
            <input 
              className="w-full bg-transparent text-lg font-bold text-gray-900 placeholder:text-indigo-200 focus:outline-none border-none transition-colors"
              placeholder="角色名称"
              value={data.title}
              onChange={(e) => updateNodeTitle(id, e.target.value)}
            />
          </div>

          <textarea 
            className="w-full bg-indigo-50/30 rounded-lg p-3 text-sm text-gray-600 placeholder:text-indigo-200 focus:outline-none focus:bg-indigo-50 transition-all resize-none min-h-[80px]"
            placeholder="描述角色职责、画像特征或目标..."
            value={data.description}
            onChange={(e) => updateNodeDescription(id, e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-white transition-colors hover:!bg-indigo-600" />
    </div>
  );
};

export default memo(RoleNode);
