import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { UserFlowNodeData, WidgetType } from '../types';
import { useStore } from '../store';
import { Plus, GripVertical } from 'lucide-react';
import { OpportunityRenderer, DecisionRenderer, TodoRenderer } from './widgets/WidgetRenderers';

const UserFlowNode = ({ id, data, selected }: NodeProps<UserFlowNodeData>) => {
  const updateNodeTitle = useStore((state) => state.updateNodeTitle);
  const updateNodeDescription = useStore((state) => state.updateNodeDescription);
  const addInteractionWidget = useStore((state) => state.addInteractionWidget);
  const updateWidget = useStore((state) => state.updateWidget);
  const removeWidget = useStore((state) => state.removeWidget);
  const toggleWidgetCollapse = useStore((state) => state.toggleWidgetCollapse);

  return (
    <div className="w-[340px] relative group/node">
      <Handle type="target" position={Position.Left} className="!bg-gray-300 !w-3 !h-3 !border-2 !border-white transition-colors hover:!bg-blue-500" />
      
      <div className={`bg-white rounded-xl shadow-lg border transition-all duration-300 flex flex-col ${selected ? 'border-blue-500 ring-2 ring-blue-100 shadow-xl' : 'border-gray-200 hover:border-gray-300'}`}>
        <div className="p-5 pb-1 relative">
          <div className="absolute top-4 right-3 text-gray-300 cursor-grab active:cursor-grabbing opacity-0 group-hover/node:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
            <GripVertical size={16} />
          </div>

          <input 
            className="w-[90%] bg-transparent text-xl font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none mb-0.5 border-none transition-colors"
            placeholder="步骤名称"
            value={data.title}
            onChange={(e) => updateNodeTitle(id, e.target.value)}
          />
          <textarea 
            className="w-full bg-transparent text-sm text-gray-500 placeholder:text-gray-300 focus:outline-none resize-none h-auto min-h-[40px]"
            placeholder="描述该用户步骤..."
            value={data.description}
            onChange={(e) => updateNodeDescription(id, e.target.value)}
            rows={2}
          />
        </div>

        <div className="px-3 pb-3 space-y-3 flex-1">
          <div className="flex flex-wrap gap-2 content-start">
            {data.children.map((widget) => {
              const commonProps = {
                data: widget as any,
                onDelete: () => removeWidget(id, widget.id),
                onToggleCollapse: () => toggleWidgetCollapse(id, widget.id)
              };
              if (widget.type === WidgetType.OPPORTUNITY) return <OpportunityRenderer key={widget.id} {...commonProps} onUpdate={(d) => updateWidget(id, widget.id, d)} />;
              if (widget.type === WidgetType.DECISION) return <DecisionRenderer key={widget.id} {...commonProps} onUpdate={(d) => updateWidget(id, widget.id, d)} />;
              if (widget.type === WidgetType.TODO) return <TodoRenderer key={widget.id} {...commonProps} onUpdate={(d) => updateWidget(id, widget.id, d)} />;
              return null;
            })}
          </div>
        </div>

        <div className="px-2 py-2 bg-gray-50/50 flex justify-between items-center gap-1 rounded-b-xl">
          <button onClick={() => addInteractionWidget(id, WidgetType.OPPORTUNITY)} className="group flex-1 py-1.5 flex flex-row items-center justify-center gap-1.5 rounded-md hover:bg-yellow-50/50 transition-all" title="添加机会点">
            <div className="text-gray-400 group-hover:text-yellow-600 transition-colors"><Plus size={12} /></div>
            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-yellow-700 uppercase tracking-wider">机会点</span>
          </button>
          <div className="w-px h-3 bg-gray-200"></div>
          <button onClick={() => addInteractionWidget(id, WidgetType.DECISION)} className="group flex-1 py-1.5 flex flex-row items-center justify-center gap-1.5 rounded-md hover:bg-slate-50/50 transition-all" title="添加决策点">
            <div className="text-gray-400 group-hover:text-slate-600 transition-colors"><Plus size={12} /></div>
            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-slate-700 uppercase tracking-wider">决策点</span>
          </button>
          <div className="w-px h-3 bg-gray-200"></div>
          <button onClick={() => addInteractionWidget(id, WidgetType.TODO)} className="group flex-1 py-1.5 flex flex-row items-center justify-center gap-1.5 rounded-md hover:bg-red-50/50 transition-all" title="添加待明确">
            <div className="text-gray-400 group-hover:text-red-500 transition-colors"><Plus size={12} /></div>
            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-red-700 uppercase tracking-wider">待明确</span>
          </button>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-gray-300 !w-3 !h-3 !border-2 !border-white transition-colors hover:!bg-blue-500" />
    </div>
  );
};

export default memo(UserFlowNode);
