import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Layout, Trash2, Edit2, Check, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { CanvasSession } from '../types';

const Sidebar: React.FC = () => {
  const sessions = useStore((state) => state.sessions);
  const currentSessionId = useStore((state) => state.currentSessionId);
  const createSession = useStore((state) => state.createSession);
  const switchSession = useStore((state) => state.switchSession);
  const deleteSession = useStore((state) => state.deleteSession);
  const renameSession = useStore((state) => state.renameSession);

  const [collapsed, setCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Sort by createdAt for stable order. Fallback to lastModified for old sessions.
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

  const handleDelete = (e: React.MouseEvent, id: string) => {
    // Prevent the click from bubbling to the parent div (which switches session)
    e.stopPropagation();
    e.preventDefault();
    
    // Check if it's the last session before confirming
    if (Object.keys(sessions).length <= 1) {
        alert("至少需要保留一个画布。");
        return;
    }

    // Use a small timeout to ensure UI updates or event loop clearance if needed, 
    // though usually standard window.confirm blocks.
    setTimeout(() => {
        if (window.confirm('确定要删除这个画布吗？此操作无法撤销。')) {
            deleteSession(id);
        }
    }, 10);
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
      <div className="flex-1 overflow-y-auto p-3 space-y-2 overflow-x-hidden">
        {/* Create Button */}
        <button 
          onClick={() => createSession()}
          className={`flex items-center justify-center transition-all duration-300 ${
              collapsed 
              ? 'w-full aspect-square bg-transparent hover:bg-gray-200 text-gray-500 rounded-md' 
              : 'w-full py-2 px-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-white gap-2'
          }`}
          title="新建画布"
        >
          <Plus size={collapsed ? 20 : 16} />
          <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>新建画布</span>
        </button>

        {/* Sessions */}
        {sortedSessions.map((session) => (
            // Item container
             <div 
                key={session.id}
                onClick={() => switchSession(session.id)}
                className={`group relative rounded-lg cursor-pointer border transition-all duration-200 isolate ${
                  session.id === currentSessionId 
                    ? 'bg-white border-blue-300 shadow-sm ring-1 ring-blue-100' 
                    : 'bg-transparent border-transparent hover:bg-gray-100 hover:border-gray-200'
                } ${collapsed ? 'p-2 flex justify-center' : 'p-3'}`}
              >
                 <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                    {/* Icon */}
                    <div className={`shrink-0 transition-colors ${session.id === currentSessionId ? 'text-blue-500' : 'text-gray-400'}`}>
                        <Layout size={16} />
                    </div>

                    {/* Text Content */}
                     <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100'}`}>
                        {editingId === session.id ? (
                            // Edit Mode
                            <div className="flex items-center gap-1 z-20 relative" onClick={(e) => e.stopPropagation()}>
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
                                <button onClick={(e) => handleSaveEdit(e, session.id)} className="text-green-600 p-1 hover:bg-green-50 rounded"><Check size={14}/></button>
                                <button onClick={(e) => handleCancelEdit(e)} className="text-red-500 p-1 hover:bg-red-50 rounded"><X size={14}/></button>
                            </div>
                        ) : (
                            // View Mode
                            <div>
                                <h3 className={`text-sm font-medium truncate ${session.id === currentSessionId ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {session.name}
                                </h3>
                                <p className="text-[10px] text-gray-400 mt-1 truncate">
                                    {new Date(session.lastModified).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                     </div>
                 </div>

                 {/* Hover Actions - Only show when NOT collapsed */}
                 {!collapsed && !editingId && (
                     <div className="absolute right-2 top-2 hidden group-hover:flex items-center bg-white/90 backdrop-blur rounded-md shadow-sm border border-gray-100 z-50">
                        <button 
                            onClick={(e) => handleStartEdit(e, session.id, session.name)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-l transition-colors"
                            title="重命名"
                        >
                            <Edit2 size={12} />
                        </button>
                        <div className="w-px h-3 bg-gray-200"></div>
                        <button 
                            onClick={(e) => handleDelete(e, session.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-r transition-colors"
                            title="删除"
                        >
                            <Trash2 size={12} />
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