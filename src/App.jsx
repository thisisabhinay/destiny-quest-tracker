import { Loader2 } from 'lucide-react';
import React from 'react';
import { Filters } from './components/Filters';
import { KanbanBoard } from './components/KanbanBoard';
import { AppProvider, useAppContext } from './store/AppContext';

const bgModules = import.meta.glob('/public/backgrounds/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const bgList = Object.keys(bgModules).map(path => path.replace('/public', ''));

const MainApp = () => {
  const { loading, data } = useAppContext();
  const [bgIndex, setBgIndex] = React.useState(() => {
    if (bgList.length === 0) return -1;
    return Math.floor(Math.random() * bgList.length);
  });

  React.useEffect(() => {
    if (bgList.length <= 1) return;
    
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % bgList.length);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#cecece]" />
        <p className="mt-4 text-xs tracking-[0.2em] uppercase text-white/50 font-bold">Initializing Database...</p>
      </div>
    );
  }

  const currentBg = bgIndex >= 0 ? bgList[bgIndex] : '';

  return (
    <div 
      className="min-h-screen text-white flex flex-col font-sans overflow-hidden bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: currentBg ? `url('${currentBg}')` : 'none', backgroundColor: '#0f0f11' }}
    >
      {/* Intense dark glassmorphism overlay */}
      <div className="absolute inset-0 bg-[#0f0f11]/80 backdrop-blur-[8px] z-0 pointer-events-none" />
      
      <header className="flex-shrink-0 z-50 relative bg-black/40 border-b border-white/10">
        <div className="px-6 py-5 pb-3 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold tracking-widest text-white uppercase drop-shadow-md">Destiny 2 <span className="text-white/40">Chronicle</span></h1>
              <p className="text-[10px] tracking-widest uppercase text-white/40 mt-1 drop-shadow-sm">Universal Timeline Progression Map</p>
            </div>
          </div>
          <Filters />
        </div>
      </header>
      <main className="flex-1 overflow-hidden relative z-10">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#0f0f11]/50 to-transparent z-20 pointer-events-none" />
        <KanbanBoard />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f0f11]/80 to-transparent z-20 pointer-events-none" />
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
