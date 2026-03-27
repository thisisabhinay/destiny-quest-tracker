import React, { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { ContentCard } from './ContentCard';
import { ScrollArea } from './ui/scroll-area';
import { getFilteredSeasonItems } from '../lib/filterLogic';

export const SeasonColumn = ({ season }) => {
  const { filters } = useAppContext();

  const items = useMemo(() => {
    return getFilteredSeasonItems(season, filters);
  }, [season, filters]);

  if (items.length === 0) return null;

  return (
    <div className="w-80 flex-shrink-0 flex flex-col gap-2 relative">
      {/* Minimal column header matching Destiny tracker style */}
      <div className="flex flex-col mb-1 ml-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-[#cecece] uppercase opacity-70">Season {season.season}</span>
          <span className="text-[9px] font-bold text-white/30 bg-white/5 border border-white/10 px-1 py-px rounded-sm">{items.length} ITEMS</span>
        </div>
        <h3 className="font-medium text-[15px] tracking-wide text-white/90 truncate">{season.metadata.name || season.metadata.seasonName}</h3>
      </div>
      
      <ScrollArea className="h-full pr-3 pb-2 -mr-3">
        <div className="flex flex-col gap-3 pb-4">
          {items.map((item, idx) => (
            <ContentCard key={item.id || item.name || idx} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
