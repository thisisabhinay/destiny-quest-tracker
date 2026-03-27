import React, { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { Swimlane } from './Swimlane';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { getFilteredSeasonItems } from '../lib/filterLogic';

export const KanbanBoard = () => {
  const { data, filters } = useAppContext();

  // Group backbone items by year
  const swimlanes = useMemo(() => {
    if (!data?.backbone) return [];

    const grouped = data.backbone.reduce((acc, seasonData) => {
      const year = seasonData.metadata.year || 0;
      if (!acc[year]) {
        acc[year] = {
          year,
          themeColor: seasonData.metadata.themeColor,
          title: `Year ${year}`,
          seasons: []
        };
      }
      
      // Filter logic applied to content inside the season
      // We will pass the full season to Swimlane, and Swimlane/Column will filter items
      // But we can skip year if filter era doesn't match
      // era filter now an array of strings
      if (filters.era.length > 0 && !filters.era.includes(String(year))) {
        return acc;
      }
      
      acc[year].seasons.push(seasonData);
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => a.year - b.year)
      .filter(lane => lane.seasons && lane.seasons.length > 0);
  }, [data, filters.era]);

  const visibleSwimlanes = useMemo(() => {
    return swimlanes.filter(lane => 
      lane.seasons.some(season => getFilteredSeasonItems(season, filters).length > 0)
    );
  }, [swimlanes, filters]);

  if (visibleSwimlanes.length === 0) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center p-8 text-white/50 space-y-4">
        <p className="text-xl font-bold tracking-widest uppercase">No Records Found</p>
        <p className="text-sm">Try adjusting your active filters or clear your search query.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-140px)] w-full whitespace-nowrap rounded-md border-0">
      <div className="flex w-max space-x-6 p-6">
        {visibleSwimlanes.map((lane) => (
          <Swimlane key={lane.year} lane={lane} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
