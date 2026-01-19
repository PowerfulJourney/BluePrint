import React from 'react';
import { OpportunityWidget, DecisionWidget, TodoWidget } from '../../types';
import { Lightbulb, Scale, CheckSquare, Trash2, Plus, X, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface WidgetProps<T> {
  data: T;
  onUpdate: (data: Partial<T>) => void;
  onDelete: () => void;
  onToggleCollapse: () => void;
}

// Reusable Collapsed State Component
const CollapsedWidgetIcon: React.FC<{
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  title: string;
  details: string;
  onClick: () => void;
}> = ({ icon, colorClass, bgClass, title, details, onClick }) => {
  return (
    <div className="relative group flex justify-center w-auto">
      <button 
        onClick={onClick}
        className={`w-8 h-8 rounded-full ${bgClass} ${colorClass} flex items-center justify-center shadow-sm hover:scale-110 transition-transform border border-transparent hover:border-current`}
      >
        {icon}
      </button>
      
      {/* Tooltip / Hover Detail */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-gray-900 text-white text-xs rounded-md p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-xl">
        <div className="font-bold mb-1 border-b border-gray-700 pb-1">{title}</div>
        <div className="line-clamp-3 text-gray-300">{details || "暂无详情"}</div>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </div>
  );
};

export const OpportunityRenderer: React.FC<WidgetProps<OpportunityWidget>> = ({ data, onUpdate, onDelete, onToggleCollapse }) => {
  if (data.isCollapsed) {
    return (
      <CollapsedWidgetIcon 
        icon={<Lightbulb size={16} />}
        colorClass="text-yellow-600"
        bgClass="bg-yellow-100"
        title="机会点"
        details={data.problem}
        onClick={onToggleCollapse}
      />
    );
  }

  return (
    <div className="w-full bg-yellow-50/50 border border-yellow-200 rounded-lg p-3 shadow-sm group hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-yellow-700 font-bold text-xs uppercase tracking-wide cursor-pointer select-none" onClick={onToggleCollapse}>
          <div className="p-1 bg-yellow-100 rounded-md"><Lightbulb size={14} /></div>
          <span>机会点</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onToggleCollapse} className="text-yellow-400 hover:text-yellow-700 p-1 rounded hover:bg-yellow-100 transition-colors">
            <ChevronUp size={14} />
          </button>
          <button onClick={onDelete} className="text-yellow-400 hover:text-red-500 p-1 rounded hover:bg-yellow-100 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <textarea
          className="w-full bg-white border border-yellow-200 rounded p-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 resize-none h-16 transition-all"
          placeholder="存在什么问题？"
          value={data.problem}
          onChange={(e) => onUpdate({ problem: e.target.value })}
        />
        <div className="relative">
             <div className="absolute top-2 left-2 text-yellow-500"><Maximize2 size={10} /></div>
             <textarea
                className="w-full bg-white border border-yellow-200 rounded p-2 pl-6 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 resize-none h-16 transition-all"
                placeholder="建议的解决方案..."
                value={data.solution_idea}
                onChange={(e) => onUpdate({ solution_idea: e.target.value })}
            />
        </div>
        
        <div className="flex items-center gap-3 text-xs text-yellow-800 bg-yellow-100/50 p-2 rounded">
            <span className="font-semibold">价值分：</span>
            <input 
                type="range" 
                min="1" 
                max="5" 
                value={data.value_score} 
                onChange={(e) => onUpdate({ value_score: parseInt(e.target.value) })}
                className="flex-1 h-1.5 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
            />
            <span className="font-bold bg-white px-2 py-0.5 rounded border border-yellow-200">{data.value_score}/5</span>
        </div>
      </div>
    </div>
  );
};

export const DecisionRenderer: React.FC<WidgetProps<DecisionWidget>> = ({ data, onUpdate, onDelete, onToggleCollapse }) => {
  if (data.isCollapsed) {
    return (
      <CollapsedWidgetIcon 
        icon={<Scale size={16} />}
        colorClass="text-slate-600"
        bgClass="bg-slate-100"
        title="决策矩阵"
        details={data.title}
        onClick={onToggleCollapse}
      />
    );
  }

  const addOption = () => {
    const newOption = { id: uuidv4(), title: '', pros: '', cons: '' };
    onUpdate({ options: [...data.options, newOption] });
  };

  const updateOption = (id: string, field: string, val: string) => {
    onUpdate({
        options: data.options.map(opt => opt.id === id ? { ...opt, [field]: val } : opt)
    });
  };

  const removeOption = (id: string) => {
      onUpdate({ options: data.options.filter(opt => opt.id !== id) });
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 shadow-sm group hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wide cursor-pointer select-none" onClick={onToggleCollapse}>
          <div className="p-1 bg-slate-200 rounded-md"><Scale size={14} /></div>
          <span>决策矩阵</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onToggleCollapse} className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 transition-colors">
            <ChevronUp size={14} />
          </button>
          <button onClick={onDelete} className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-200 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <input
        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 mb-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
        placeholder="决策主题 (如：导航布局)"
        value={data.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
      />

      <div className="space-y-2 mb-3">
        {data.options.map((opt) => (
            <div key={opt.id} className="bg-white border border-slate-200 p-2 rounded-md relative shadow-sm">
                <button 
                    onClick={() => removeOption(opt.id)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-red-400 transition-colors"
                >
                    <X size={12} />
                </button>
                <input 
                    className="w-[90%] bg-transparent text-xs font-bold mb-1.5 border-b border-transparent focus:border-slate-200 focus:outline-none text-gray-900 placeholder:text-slate-300" 
                    placeholder="方案标题"
                    value={opt.title}
                    onChange={(e) => updateOption(opt.id, 'title', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                    <input 
                        className="text-[10px] text-green-800 bg-green-50/50 border border-green-100 p-1.5 rounded focus:outline-none focus:border-green-300"
                        placeholder="优势"
                        value={opt.pros}
                        onChange={(e) => updateOption(opt.id, 'pros', e.target.value)}
                    />
                     <input 
                        className="text-[10px] text-red-800 bg-red-50/50 border border-red-100 p-1.5 rounded focus:outline-none focus:border-red-300"
                        placeholder="劣势"
                        value={opt.cons}
                        onChange={(e) => updateOption(opt.id, 'cons', e.target.value)}
                    />
                </div>
            </div>
        ))}
        <button 
            onClick={addOption}
            className="w-full py-1.5 border border-dashed border-slate-300 rounded-md text-xs text-slate-500 hover:bg-white hover:text-slate-700 hover:border-slate-400 transition-all flex items-center justify-center gap-1"
        >
            <Plus size={12} /> 添加方案
        </button>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-200">
          <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">最终决策</label>
          <textarea
             className="w-full text-xs bg-white border border-slate-200 rounded p-2 focus:outline-none focus:border-slate-400 resize-none h-16 text-gray-900"
             placeholder="选择该方案的理由..."
             value={data.reasoning}
             onChange={(e) => onUpdate({ reasoning: e.target.value })}
          />
      </div>
    </div>
  );
};

export const TodoRenderer: React.FC<WidgetProps<TodoWidget>> = ({ data, onUpdate, onDelete, onToggleCollapse }) => {
  const isResolved = data.status === 'resolved';

  if (data.isCollapsed) {
    return (
      <CollapsedWidgetIcon 
        icon={<CheckSquare size={16} />}
        colorClass={isResolved ? "text-gray-400" : "text-red-500"}
        bgClass={isResolved ? "bg-gray-100" : "bg-red-100"}
        title="待明确事项"
        details={data.description}
        onClick={onToggleCollapse}
      />
    );
  }

  return (
    <div className={`w-full border rounded-lg p-3 shadow-sm group transition-all ${isResolved ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-white border-red-200 hover:shadow-md'}`}>
      <div className="flex items-start gap-3">
        <button 
            onClick={() => onUpdate({ status: isResolved ? 'open' : 'resolved' })}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isResolved ? 'bg-gray-400 border-gray-400 text-white' : 'border-red-300 text-transparent hover:bg-red-50'}`}
        >
            <CheckSquare size={12} />
        </button>
        
        <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
                <div 
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide cursor-pointer ${isResolved ? 'text-gray-500' : 'text-red-500'}`}
                    onClick={onToggleCollapse}
                >
                    <span>待明确事项</span>
                </div>
                 <div className="flex items-center gap-1">
                    <button onClick={onToggleCollapse} className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100">
                        <ChevronUp size={14} />
                    </button>
                    <button onClick={onDelete} className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-100">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <textarea
                className={`w-full bg-transparent text-sm resize-none h-14 focus:outline-none placeholder:text-gray-300 ${isResolved ? 'line-through text-gray-400' : 'text-gray-900'}`}
                placeholder="需要明确什么？"
                value={data.description}
                disabled={isResolved}
                onChange={(e) => onUpdate({ description: e.target.value })}
            />
             {!isResolved && (
                 <div className="flex items-center gap-2 bg-gray-50 p-1 rounded border border-gray-100">
                     <span className="text-xs text-gray-400 pl-1">负责人：</span>
                     <input 
                        className="text-xs bg-transparent px-1 py-0.5 rounded border-none focus:outline-none text-gray-600 w-full font-medium"
                        placeholder="如：PM、技术负责人"
                        value={data.owner}
                        onChange={(e) => onUpdate({ owner: e.target.value })}
                     />
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};