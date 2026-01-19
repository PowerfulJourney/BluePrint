import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { WidgetType, OpportunityWidget, DecisionWidget, TodoWidget } from '../types';
import { Lightbulb, Scale, CheckSquare, ExternalLink, Check, ChevronsRight, LineChart } from 'lucide-react';

const InsightDashboard: React.FC = () => {
  const nodes = useStore((state) => state.nodes);
  const setFocusTarget = useStore((state) => state.setFocusTarget);
  const [showResolved, setShowResolved] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Aggregation Logic
  const { opportunities, decisions, todos } = useMemo(() => {
    const opps: { nodeTitle: string; nodeId: string; data: OpportunityWidget }[] = [];
    const decs: { nodeTitle: string; nodeId: string; data: DecisionWidget }[] = [];
    const todosList: { nodeTitle: string; nodeId: string; data: TodoWidget }[] = [];

    nodes.forEach(node => {
      node.data.children.forEach(child => {
        if (child.type === WidgetType.OPPORTUNITY) {
          opps.push({ nodeTitle: node.data.title, nodeId: node.id, data: child });
        } else if (child.type === WidgetType.DECISION) {
          decs.push({ nodeTitle: node.data.title, nodeId: node.id, data: child });
        } else if (child.type === WidgetType.TODO) {
          todosList.push({ nodeTitle: node.data.title, nodeId: node.id, data: child });
        }
      });
    });

    return { opportunities: opps, decisions: decs, todos: todosList };
  }, [nodes]);

  const handleFocus = (nodeId: string) => {
    setFocusTarget(nodeId);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <>
      {/* Floating Action Button (Visible only when closed) */}
      <button
          onClick={() => setIsOpen(true)}
          className={`fixed top-5 right-5 z-50 bg-white border border-gray-200 text-gray-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all duration-300 ${isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
          title="打开记录总览"
        >
          <LineChart size={18} className="text-blue-600" />
      </button>

      {/* Main Drawer Panel - using border-box logic more carefully */}
      {/* Outer container handles the sliding width animation and clipping */}
      <div 
          className={`h-full bg-white border-l border-gray-200 shadow-xl z-20 transition-all duration-300 ease-out flex flex-col overflow-hidden ${isOpen ? 'w-80' : 'w-0'}`}
      >
        {/* Inner container with FIXED width to prevent text reflow during slide */}
        <div className="w-80 flex-shrink-0 flex flex-col h-full bg-white">
            
            {/* Header - Styled to match Sidebar header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0 flex justify-between items-start">
              <div className="flex flex-col justify-center h-full">
                <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider flex items-center gap-2 h-7">
                   标记汇总
                </h2>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {opportunities.length} 机会点 • {decisions.length} 决策点 • {todos.filter(t => t.data.status === 'open').length} 待明确
                </p>
              </div>
              
              {/* Close Button inside Header */}
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors"
                title="收起面板"
              >
                <ChevronsRight size={18} />
              </button>
            </div>

            {/* Content Scroll Area */}
            {/* Using w-full to fill the 80 container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 w-full">
              
              {/* Opportunities Section */}
              <section>
                <div className="flex items-center gap-2 mb-3 text-yellow-700 font-bold uppercase text-xs tracking-wider sticky top-0 bg-white z-10 py-1">
                  <Lightbulb size={14} />
                  <h3>机会点</h3>
                </div>
                <div className="space-y-2">
                  {opportunities.length === 0 && <p className="text-xs text-gray-400 italic">暂无机会点记录。</p>}
                  {opportunities.map((item) => (
                    <div 
                      key={item.data.id} 
                      onClick={() => handleFocus(item.nodeId)}
                      className="group p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors border border-transparent hover:border-yellow-200 relative"
                    >
                      <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2 pr-4">{item.data.problem || "未命名问题"}</p>
                          <ExternalLink size={12} className="text-yellow-400 opacity-0 group-hover:opacity-100 absolute top-3 right-3" />
                      </div>
                      {item.data.solution_idea && (
                          <p className="text-xs text-gray-600 mt-1 pl-2 border-l-2 border-yellow-300 line-clamp-2">{item.data.solution_idea}</p>
                      )}
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-yellow-100/50">
                          {/* Unified Source Style */}
                          <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-200 truncate max-w-[60%]">
                            来源: {item.nodeTitle}
                          </span>
                          <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100/50 px-1.5 py-0.5 rounded">
                            影响: {item.data.value_score}/5
                          </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Decisions Section */}
              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-600 font-bold uppercase text-xs tracking-wider sticky top-0 bg-white z-10 py-1">
                  <Scale size={14} />
                  <h3>决策点</h3>
                </div>
                <div className="space-y-2">
                  {decisions.length === 0 && <p className="text-xs text-gray-400 italic">暂无决策记录。</p>}
                  {decisions.map((item) => (
                    <div 
                      key={item.data.id} 
                      onClick={() => handleFocus(item.nodeId)}
                      className="group p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 relative"
                    >
                       <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-800 pr-4">{item.data.title || "未命名决策"}</p>
                          <ExternalLink size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 absolute top-3 right-3" />
                      </div>
                      {item.data.reasoning && (
                           <p className="text-xs text-slate-600 mt-2 italic bg-white p-1.5 rounded border border-slate-100 line-clamp-2">"{item.data.reasoning}"</p>
                      )}
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100/50">
                          <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-200 truncate max-w-[60%]">
                            来源: {item.nodeTitle}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {item.data.options.length} 个方案
                          </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Todos Section */}
              <section>
                <div className="flex items-center justify-between mb-3 sticky top-0 bg-white z-10 py-1">
                   <div className="flex items-center gap-2 text-red-600 font-bold uppercase text-xs tracking-wider">
                      <CheckSquare size={14} />
                      <h3>待明确</h3>
                   </div>
                   <label className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors group select-none">
                      <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${showResolved ? 'bg-gray-200 border-gray-200' : 'bg-white border-gray-200'}`}>
                          {showResolved && <Check size={10} className="text-gray-500" strokeWidth={3} />}
                      </div>
                      <input 
                          type="checkbox" 
                          checked={showResolved} 
                          onChange={(e) => setShowResolved(e.target.checked)}
                          className="hidden"
                      />
                      <span className="text-[10px] text-gray-400 group-hover:text-gray-600 font-medium transition-colors">显示已解决</span>
                   </label>
                </div>
                <div className="space-y-2">
                  {todos.filter(t => showResolved ? true : t.data.status === 'open').length === 0 && (
                      <p className="text-xs text-gray-400 italic">暂无待办项。</p>
                  )}
                  {todos
                      .filter(item => showResolved || item.data.status === 'open')
                      .map((item) => (
                    <div 
                      key={item.data.id} 
                      onClick={() => handleFocus(item.nodeId)}
                      className={`group p-3 rounded-lg cursor-pointer transition-all border border-transparent relative ${item.data.status === 'resolved' ? 'bg-gray-50 opacity-60 grayscale' : 'bg-red-50 hover:bg-red-100 hover:border-red-200'}`}
                    >
                       <div className="flex justify-between items-start">
                          <p className={`text-sm pr-4 line-clamp-2 ${item.data.status === 'resolved' ? 'line-through text-gray-500' : 'font-medium text-gray-800'}`}>
                              {item.data.description || "未命名事项"}
                          </p>
                          <ExternalLink size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 absolute top-3 right-3" />
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-red-100/50">
                          <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-200 truncate max-w-[60%]">
                            来源: {item.nodeTitle}
                          </span>
                          {item.data.owner && (
                            <span className="text-[10px] text-gray-500 font-medium">
                              @{item.data.owner}
                            </span>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
        </div>
      </div>
    </>
  );
};

export default InsightDashboard;