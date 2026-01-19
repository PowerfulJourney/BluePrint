import React from 'react';
import Canvas from './components/Canvas';
import InsightDashboard from './components/InsightDashboard';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-gray-50 text-foreground font-sans">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Canvas/Session Management */}
        <aside className="shrink-0 h-full relative z-30">
          <Sidebar />
        </aside>

        {/* Center: Infinite Canvas */}
        <main className="flex-1 relative z-10">
            <Canvas />
        </main>
        
        {/* Right Drawer: Insight Dashboard */}
        <aside className="shrink-0 h-full relative z-20">
            <InsightDashboard />
        </aside>
      </div>
    </div>
  );
};

export default App;