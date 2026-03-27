import React, { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { Swimlane } from './Swimlane';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

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
      if (filters.era !== 'all' && filters.era !== String(year)) {
        return acc;
      }
      
      acc[year].seasons.push(seasonData);
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a.year - b.year);
  }, [data, filters.era]);

  if (swimlanes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-muted-foreground">
        No content matches the selected filters.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-140px)] w-full whitespace-nowrap rounded-md border-0">
      <div className="flex w-max space-x-6 p-6">
        {swimlanes.map((lane) => (
          <Swimlane key={lane.year} lane={lane} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
