import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Layout, Edit2, Check, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { CanvasSession } from '../types';

const Sidebar: React.FC = () => {
  const sessions = useStore((state) => state.sessions);
  const currentSessionId = useStore((state) => state.currentSessionId);
  const createSession = useStore((state) => state.createSession);
  const switchSession = useStore((state) => state.switchSession);
  const renameSession = useStore((state) => state.renameSession);

  const [collapsed, setCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Sort by createdAt for stable order
  const sortedSessions = (Object.values(sessions) as CanvasSession[]).sort((a, b) => {
    const timeA = a.createdAt || a.lastModified || 0;
    const timeB = b.createdAt || b.lastModified || 0;
    return timeB - timeA; // Newest first
  });

  const handleStartEdit = (e: React.MouseEvent, id: string, currentName: string) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (editName.trim()) {
      renameSession(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingId(null);
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} h-full bg-gray-50 border-r border-gray-200 flex flex-col z-30 transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} shrink-0 transition-all duration-300`}>
        <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
             <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">我的画布</h2>
        </div>
        <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
            title={collapsed ? "展开列表" : "收起列表"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* List */}
      <div className={`flex-1 overflow-y-auto space-y-2 overflow-x-hidden transition-all ${collapsed ? 'p-2' : 'p-3'}`}>
        {/* Create Button */}
        <button 
          onClick={() => createSession()}
          className={`group flex items-center justify-center transition-all duration-300 h-10 w-full border border-dashed rounded-lg text-sm hover:border-blue-400 hover:text-blue-600 hover:bg-white overflow-hidden
            ${collapsed 
              ? 'bg-transparent text-gray-500 border-transparent px-0' 
              : 'px-3 border-gray-300 text-gray-500'
            }`}
          title="新建画布"
        >
            <div className="flex items-center justify-center shrink-0">
                 <Plus size={20} className="transition-transform group-hover:scale-110" />
            </div>
            
            <span 
                className={`whitespace-nowrap transition-all duration-300 ease-in-out origin-left
                ${collapsed ? 'w-0 opacity-0 ml-0 scale-x-0 hidden' : 'w-auto opacity-100 ml-2 scale-x-100 block'}`}
            >
                新建画布
            </span>
        </button>

        {/* Sessions */}
        {sortedSessions.map((session) => (
            // Item container
             <div 
                key={session.id}
                onClick={() => switchSession(session.id)}
                className={`group relative rounded-lg cursor-pointer border transition-all duration-200 isolate h-14
                  ${session.id === currentSessionId 
                    ? 'bg-white border-blue-300 shadow-sm ring-1 ring-blue-100' 
                    : 'bg-transparent border-transparent hover:bg-gray-100 hover:border-gray-200'
                  } 
                  ${collapsed ? 'px-0 py-0 flex justify-center items-center' : 'px-3 py-2'}`}
              >
                 <div className={`flex items-center h-full ${collapsed ? 'justify-center w-full' : 'gap-3'}`}>
                    {/* Icon */}
                    <div className={`shrink-0 transition-colors z-10 flex items-center justify-center ${session.id === currentSessionId ? 'text-blue-500' : 'text-gray-400'}`}>
                        <Layout size={18} />
                    </div>

                    {/* Text Content - Completely hidden when collapsed to prevent layout interference */}
                     <div className={`min-w-0 overflow-hidden transition-all duration-300 flex flex-col justify-center 
                        ${collapsed ? 'hidden' : 'flex-1 w-auto opacity-100 relative'}`}>
                        {editingId === session.id ? (
                            // Edit Mode
                            <div className="flex items-center gap-1 z-20 relative w-full" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  autoFocus
                                  className="w-full text-sm border border-blue-300 rounded px-1 py-0.5 focus:outline-none bg-white text-gray-900"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onKeyDown={(e) => {
                                      if(e.key === 'Enter') handleSaveEdit(e as any, session.id);
                                      if(e.key === 'Escape') handleCancelEdit(e as any);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <button type="button" onClick={(e) => handleSaveEdit(e, session.id)} className="text-green-600 p-1 hover:bg-green-50 rounded shrink-0"><Check size={14}/></button>
                                <button type="button" onClick={(e) => handleCancelEdit(e)} className="text-red-500 p-1 hover:bg-red-50 rounded shrink-0"><X size={14}/></button>
                            </div>
                        ) : (
                            // View Mode
                            <div className="w-full">
                                <h3 className={`text-sm font-medium truncate w-full ${session.id === currentSessionId ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {session.name}
                                </h3>
                                <p className="text-[10px] text-gray-400 mt-0.5 truncate w-full">
                                    {new Date(session.lastModified).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                     </div>
                 </div>

                 {/* Hover Actions - Only show when NOT collapsed and NOT editing */}
                 {!collapsed && !editingId && (
                     <div 
                        className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center bg-white/95 backdrop-blur rounded-md shadow-sm border border-gray-200 z-50"
                        onClick={(e) => e.stopPropagation()} /* Extra safety for the container */
                     >
                        <button 
                            type="button"
                            onClick={(e) => handleStartEdit(e, session.id, session.name)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="重命名"
                        >
                            <Edit2 size={12} />
                        </button>
                     </div>
                 )}
              </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;