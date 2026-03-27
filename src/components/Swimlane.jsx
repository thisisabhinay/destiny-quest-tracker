import React from 'react';
import { SeasonColumn } from './SeasonColumn';

export const Swimlane = ({ lane }) => {
  return (
    <div className="flex flex-col flex-shrink-0 animate-in fade-in duration-500">
      {/* Sticky flat header matching Destiny 2 geometric, minimal style */}
      <div 
        className="px-4 py-2 flex items-baseline justify-between sticky top-0 bg-background/95 backdrop-blur-md z-10 border-b border-white/10"
        style={{ borderTop: `3px solid ${lane.themeColor || '#fff'}` }}
      >
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-lg tracking-wider text-white uppercase">{lane.title}</h2>
        </div>
        <span className="text-xs text-white/50 tracking-widest uppercase">{lane.seasons.length} Seasons</span>
      </div>
      
      {/* Container for Columns - No heavy background or borders */}
      <div className="flex p-4 gap-6 h-full items-start">
        {lane.seasons.map((season) => (
          <SeasonColumn key={season.season || season.metadata.name} season={season} />
        ))}
      </div>
    </div>
  );
};
