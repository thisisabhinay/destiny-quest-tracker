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
    if (filters.type !== 'all' && item.itemCategory !== filters.type) return false;
    
    // Availability
    const isVaulted = item.vaulted === true || item.status === 'vaulted' || item.availability === 'vaulted';
    const isKiosk = item.kioskAvailable === true || item.availability === 'kiosk';
    const isRotator = item.availability === 'rotator';
    const isFree = item.isFree === true || item.cost === 'free';
    const isAvailable = item.availability === 'available' || (!isVaulted && !isKiosk && !isRotator);

    if (filters.availability === 'free' && !isFree) return false;
    if (filters.availability === 'available' && !isAvailable) return false;
    if (filters.availability === 'kiosk' && !isKiosk) return false;
    if (filters.availability === 'rotator' && !isRotator) return false;
    if (filters.availability === 'vaulted' && !isVaulted) return false;
    
    // Priority
    if (filters.priority !== 'all' && String(item.priority) !== String(filters.priority)) return false;

    // Cost
    if (filters.cost === 'free' && !isFree) return false;
    if (filters.cost === 'expansion' && item.cost !== 'expansion') return false;
    if (filters.cost === 'dungeonKey' && item.cost !== 'dungeonKey') return false;
    if (filters.cost === 'kiosk' && !isKiosk && item.cost !== 'kiosk') return false;

    // Fireteam
    if (filters.solo === 'solo' && item.solo !== true) return false;
    if (filters.solo === 'team' && item.solo !== false && item.solo !== undefined) return false;

    // Damage
    if (filters.damage !== 'all' && item.damageType !== filters.damage) return false;

    return true;
  });
};
