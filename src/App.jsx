import React from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { Filters } from './components/Filters';
import { AppProvider, useAppContext } from './store/AppContext';
import { Loader2 } from 'lucide-react';

const MainApp = () => {
  const { loading, data } = useAppContext();

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#cecece]" />
        <p className="mt-4 text-xs tracking-[0.2em] uppercase text-white/50 font-bold">Initializing Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col font-sans overflow-hidden">
      <header className="flex-shrink-0 z-50 bg-[#0f0f11]">
        <div className="px-6 py-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold tracking-widest text-white uppercase">Destiny 2 <span className="text-white/40">Chronicle</span></h1>
              <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1">Universal Timeline Progression Map</p>
            </div>
          </div>
          <Filters />
        </div>
      </header>
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#0f0f11] to-transparent z-20 pointer-events-none" />
        <KanbanBoard />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f0f11] to-transparent z-20 pointer-events-none" />
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
