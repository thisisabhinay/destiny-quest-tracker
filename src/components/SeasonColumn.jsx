import React, { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { ContentCard } from './ContentCard';
import { ScrollArea } from './ui/scroll-area';

export const SeasonColumn = ({ season }) => {
  const { filters } = useAppContext();

  const items = useMemo(() => {
    let allItems = [];
    const content = season.content;

    if (!content) return [];

    if (content.campaigns) allItems.push(...content.campaigns.map(i => ({ ...i, itemCategory: 'campaign' })));
    if (content.raids) allItems.push(...content.raids.map(i => ({ ...i, itemCategory: 'raid' })));
    if (content.dungeons) allItems.push(...content.dungeons.map(i => ({ ...i, itemCategory: 'dungeon' })));
    if (content.exoticMissions) allItems.push(...content.exoticMissions.map(i => ({ ...i, itemCategory: 'exoticMission' })));
    if (content.strikes) allItems.push(...content.strikes.map(i => ({ ...i, itemCategory: 'strike' })));
    if (content.exotics?.weapons) allItems.push(...content.exotics.weapons.map(i => ({ ...i, itemCategory: 'exoticWeapon' })));
    if (content.exotics?.armor) {
      Object.keys(content.exotics.armor).forEach(cls => {
        allItems.push(...content.exotics.armor[cls].map(i => ({ ...i, itemCategory: 'exoticArmor', class: cls })));
      });
    }

    // Apply Filters
    return allItems.filter(item => {
      if (filters.type !== 'all' && item.itemCategory !== filters.type) return false;
      
      const isVaulted = item.vaulted === true || item.status === 'vaulted';
      const isKiosk = item.kioskAvailable === true;
      if (filters.availability === 'available' && isVaulted) return false;
      if (filters.availability === 'vaulted' && !isVaulted) return false;
      if (filters.availability === 'kiosk' && !isKiosk) return false;
      
      if (filters.priority !== 'all' && String(item.priority) !== String(filters.priority)) return false;

      return true;
    });

  }, [season, filters.type, filters.availability, filters.priority]);

  if (items.length === 0) return null;

  return (
    <div className="w-80 flex-shrink-0 flex flex-col gap-2 relative">
      {/* Minimal column header matching Destiny tracker style */}
      <div className="flex flex-col mb-1 ml-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-[#cecece] uppercase opacity-70">Season {season.season}</span>
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
