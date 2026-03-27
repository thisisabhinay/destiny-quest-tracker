export const getFilteredSeasonItems = (season, filters) => {
  let allItems = [];
  const content = season.content;

  if (!content) return [];

  if (content.campaigns) allItems.push(...content.campaigns.map(i => ({ ...i, itemCategory: 'campaign' })));
  if (content.raids) allItems.push(...content.raids.map(i => ({ ...i, itemCategory: 'raid' })));
  if (content.dungeons) allItems.push(...content.dungeons.map(i => ({ ...i, itemCategory: 'dungeon' })));
  if (content.exoticMissions) allItems.push(...content.exoticMissions.map(i => ({ ...i, itemCategory: 'exoticMission' })));
  if (content.strikes) allItems.push(...content.strikes.map(i => ({ ...i, itemCategory: 'strike' })));
  if (content.seals) allItems.push(...content.seals.map(i => ({ ...i, itemCategory: 'seal' })));
  if (content.exotics?.weapons) allItems.push(...content.exotics.weapons.map(i => ({ ...i, itemCategory: 'exoticWeapon' })));
  if (content.exotics?.armor) {
    Object.keys(content.exotics.armor).forEach(cls => {
      allItems.push(...content.exotics.armor[cls].map(i => ({ ...i, itemCategory: 'exoticArmor', class: cls })));
    });
  }

  // Apply Filters
  return allItems.filter(item => {
    // Free Text Search
    if (filters.searchQuery && !item.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;

    // Type
    if (filters.type.length > 0 && !filters.type.includes(item.itemCategory)) return false;
    
    // Availability
    const isVaulted = item.vaulted === true || item.status === 'vaulted' || item.availability === 'vaulted';

    if (filters.hideVaulted && isVaulted) return false;

    const isKiosk = item.kioskAvailable === true || item.availability === 'kiosk';
    const isRotator = item.availability === 'rotator';
    const isFree = item.isFree === true || item.cost === 'free';
    const isAvailable = item.availability === 'available' || (!isVaulted && !isKiosk && !isRotator);

    if (filters.availability.length > 0) {
      let match = false;
      if (filters.availability.includes('free') && isFree) match = true;
      if (filters.availability.includes('available') && isAvailable) match = true;
      if (filters.availability.includes('kiosk') && isKiosk) match = true;
      if (filters.availability.includes('rotator') && isRotator) match = true;
      if (filters.availability.includes('vaulted') && isVaulted) match = true;
      if (!match) return false;
    }
    
    // Priority
    if (filters.priority.length > 0 && !filters.priority.includes(String(item.priority))) return false;

    // Cost
    if (filters.cost.length > 0) {
      let match = false;
      if (filters.cost.includes('free') && isFree) match = true;
      if (filters.cost.includes('expansion') && item.cost === 'expansion') match = true;
      if (filters.cost.includes('dungeonKey') && item.cost === 'dungeonKey') match = true;
      if (filters.cost.includes('kiosk') && (isKiosk || item.cost === 'kiosk')) match = true;
      if (!match) return false;
    }

    // Fireteam
    if (filters.solo.length > 0) {
      let match = false;
      if (filters.solo.includes('solo') && item.solo === true) match = true;
      if (filters.solo.includes('team') && (item.solo === false || item.solo === undefined)) match = true;
      if (!match) return false;
    }

    // Damage
    if (filters.damage.length > 0 && !filters.damage.includes(item.damageType?.toLowerCase())) return false;

    return true;
  });
};
