import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Filter, X, Zap, Target, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const ERAS = [
  { id: '1', name: 'Y1: Red War', color: '#c41230' },
  { id: '2', name: 'Y2: Forsaken', color: '#503078' },
  { id: '3', name: 'Y3: Shadowkeep', color: '#8b0000' },
  { id: '4', name: 'Y4: Beyond Light', color: '#1a3a5c' },
  { id: '5', name: 'Y5: Witch Queen', color: '#228b22' },
  { id: '6', name: 'Y6: Lightfall', color: '#32cd32' },
  { id: '7', name: 'Y7: Final Shape', color: '#ecc50b' },
  { id: '8', name: 'Y8: Beyond', color: '#4b0082' }
];

const TYPES = [
  { id: 'campaign', label: 'Campaign' },
  { id: 'raid', label: 'Raid' },
  { id: 'dungeon', label: 'Dungeon' },
  { id: 'exoticMission', label: 'Exotic Mission' },
  { id: 'exoticWeapon', label: 'Exotic Weapon' },
  { id: 'exoticArmor', label: 'Exotic Armor' },
  { id: 'strike', label: 'Strike' }
];

const AVAILABILITY = [
  { id: 'free', label: 'Free', color: '#00BCD4' },
  { id: 'available', label: 'Available', color: '#4CAF50' },
  { id: 'kiosk', label: 'Kiosk', color: '#FF9800' },
  { id: 'rotator', label: 'Rotator', color: '#9C27B0' },
  { id: 'vaulted', label: 'Vaulted', color: '#666666' }
];

const PRIORITY = [
  { id: '3', label: 'Must Have', color: '#FFD700' },
  { id: '2', label: 'Recommended', color: '#4CAF50' },
  { id: '1', label: 'Nice', color: '#607D8B' }
];

const COST = [
  { id: 'free', label: 'Free', color: '#00BCD4' },
  { id: 'expansion', label: 'Expansion', color: '#FFD700' },
  { id: 'dungeonKey', label: 'Dungeon Key', color: '#9C27B0' },
  { id: 'kiosk', label: 'Kiosk', color: '#FF9800' }
];

const FIRETEAM = [
  { id: 'solo', label: 'Solo', color: '#4CAF50' },
  { id: 'team', label: 'Team', color: '#2196F3' }
];

const DAMAGE = [
  { id: 'kinetic', label: '⚪ Kinetic' },
  { id: 'arc', label: '⚡ Arc' },
  { id: 'solar', label: '☀️ Solar' },
  { id: 'void', label: '🟣 Void' },
  { id: 'stasis', label: '❄️ Stasis' },
  { id: 'strand', label: '🟢 Strand' }
];

const FilterChip = ({ active, onClick, children, color }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-3 py-1 text-[11px] font-bold tracking-widest uppercase transition-all whitespace-nowrap",
      "border-b-2",
      active ? "text-white bg-white/10 shadow-sm" : "text-white/40 border-transparent hover:text-white/80 hover:bg-white/5"
    )}
    style={active ? { borderColor: color || '#fff' } : {}}
  >
    {children}
  </button>
);

export const Filters = () => {
  const { filters, updateFilter, resetFilters } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);
  
  // Calculate active filters (excluding 'all' or empty arrays)
  const activeCount = Object.entries(filters).reduce((acc, [key, val]) => {
    if (key === 'era') return acc + (val.length > 0 ? 1 : 0);
    return acc + (val !== 'all' ? 1 : 0);
  }, 0);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-4 border-b border-white/10 pb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "h-8 border-white/20 hover:bg-white/10 hover:text-white transition-all bg-[#111111]/80 backdrop-blur-sm rounded-sm text-xs",
            (showFilters || activeCount > 0) && "border-[#cecece]/50 text-white"
          )}
        >
          <Filter className="h-4 w-4 mr-2" />
          FILTERS
          {activeCount > 0 && (
            <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-sm bg-white/20 text-[10px] text-white font-bold">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="w-full bg-[#111111]/90 backdrop-blur-md border border-white/5 p-4 rounded-sm shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-[10px] tracking-[0.2em] font-bold text-white/50 uppercase">Filter View</h3>
            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 text-[10px] tracking-widest uppercase px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm">
                <X className="h-3 w-3 mr-1" /> Clear all
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {/* Era Filter Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[9px] text-white/40 uppercase tracking-widest w-16 flex-shrink-0 font-bold">Year</span>
              <div className="flex gap-1 flex-nowrap">
                <FilterChip active={filters.era.length === 0} onClick={() => updateFilter('era', [])}>All</FilterChip>
                {ERAS.map(e => {
                  const isActive = filters.era.includes(e.id);
                  const toggleEra = () => {
                    const newEras = isActive 
                      ? filters.era.filter(id => id !== e.id)
                      : [...filters.era, e.id];
                    updateFilter('era', newEras);
                  };
                  return (
                    <FilterChip key={e.id} active={isActive} color={e.color} onClick={toggleEra}>
                      {e.name}
                    </FilterChip>
                  );
                })}
              </div>
            </div>

            {/* Type Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[9px] text-white/40 uppercase tracking-widest w-16 flex-shrink-0 font-bold">Type</span>
              <div className="flex gap-1 flex-nowrap">
                <FilterChip active={filters.type === 'all'} onClick={() => updateFilter('type', 'all')}>All</FilterChip>
                {TYPES.map(t => (
                  <FilterChip key={t.id} active={filters.type === t.id} onClick={() => updateFilter('type', t.id)}>
                    {t.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Availability Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[9px] text-white/40 uppercase tracking-widest w-16 flex-shrink-0 font-bold">Avail</span>
              <div className="flex gap-1 flex-nowrap">
                <FilterChip active={filters.availability === 'all'} onClick={() => updateFilter('availability', 'all')}>All</FilterChip>
                {AVAILABILITY.map(a => (
                  <FilterChip key={a.id} active={filters.availability === a.id} color={a.color} onClick={() => updateFilter('availability', a.id)}>
                    {a.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Priority Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[9px] text-white/40 uppercase tracking-widest w-16 flex-shrink-0 font-bold">Priority</span>
              <div className="flex gap-1 flex-nowrap">
                <FilterChip active={filters.priority === 'all'} onClick={() => updateFilter('priority', 'all')}>All</FilterChip>
                {PRIORITY.map(p => (
                  <FilterChip key={p.id} active={filters.priority === p.id} color={p.color} onClick={() => updateFilter('priority', p.id)}>
                    {p.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Cost Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[9px] text-white/40 uppercase tracking-widest w-16 flex-shrink-0 font-bold">Cost</span>
              <div className="flex gap-1 flex-nowrap">
                <FilterChip active={filters.cost === 'all'} onClick={() => updateFilter('cost', 'all')}>All</FilterChip>
                {COST.map(c => (
                  <FilterChip key={c.id} active={filters.cost === c.id} color={c.color} onClick={() => updateFilter('cost', c.id)}>
                    {c.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Fireteam Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[9px] text-white/40 uppercase tracking-widest w-16 flex-shrink-0 font-bold">Fireteam</span>
              <div className="flex gap-1 flex-nowrap">
                <FilterChip active={filters.solo === 'all'} onClick={() => updateFilter('solo', 'all')}>All</FilterChip>
                {FIRETEAM.map(f => (
                  <FilterChip key={f.id} active={filters.solo === f.id} color={f.color} onClick={() => updateFilter('solo', f.id)}>
                    {f.label}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Damage Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[9px] text-white/40 uppercase tracking-widest w-16 flex-shrink-0 font-bold">Damage</span>
              <div className="flex gap-1 flex-nowrap">
                <FilterChip active={filters.damage === 'all'} onClick={() => updateFilter('damage', 'all')}>All</FilterChip>
                {DAMAGE.map(d => (
                  <FilterChip key={d.id} active={filters.damage === d.id} onClick={() => updateFilter('damage', d.id)}>
                    {d.label}
                  </FilterChip>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};
