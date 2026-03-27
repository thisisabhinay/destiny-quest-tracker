import React from 'react';
import { useAppContext } from '../store/AppContext';
import { X } from 'lucide-react';
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

const FilterChip = ({ active, onClick, children, color }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-3 py-1 text-[11px] font-bold tracking-widest uppercase transition-all whitespace-nowrap",
      "border-b-2",
      active ? "text-white bg-white/10" : "text-white/40 border-transparent hover:text-white/80 hover:bg-white/5"
    )}
    style={active ? { borderColor: color || '#fff' } : {}}
  >
    {children}
  </button>
);

export const Filters = () => {
  const { filters, updateFilter, resetFilters } = useAppContext();
  const activeCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className="w-full bg-[#111111]/80 backdrop-blur-md border border-white/5 p-4 rounded-sm shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
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
          <span className="text-[10px] text-white/30 uppercase tracking-widest w-16 flex-shrink-0">Year</span>
          <div className="flex gap-1 flex-nowrap">
            <FilterChip active={filters.era === 'all'} onClick={() => updateFilter('era', 'all')}>All</FilterChip>
            {ERAS.map(e => (
              <FilterChip key={e.id} active={filters.era === e.id} color={e.color} onClick={() => updateFilter('era', e.id)}>
                {e.name}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Type Filter Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] text-white/30 uppercase tracking-widest w-16 flex-shrink-0">Type</span>
          <div className="flex gap-1 flex-nowrap">
            <FilterChip active={filters.type === 'all'} onClick={() => updateFilter('type', 'all')}>All</FilterChip>
            {TYPES.map(t => (
              <FilterChip key={t.id} active={filters.type === t.id} onClick={() => updateFilter('type', t.id)}>
                {t.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
