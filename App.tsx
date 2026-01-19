import React from 'react';
import Canvas from './components/Canvas';
import InsightDashboard from './components/InsightDashboard';
import { Layers } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-background text-foreground font-sans">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 relative">
            <Canvas />
        </main>
        
        <aside className="shrink-0 h-full relative">
            <InsightDashboard />
        </aside>
      </div>
    </div>
  );
};

export default App;