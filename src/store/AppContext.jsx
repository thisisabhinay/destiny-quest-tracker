import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAndCacheData, getUserState, saveUserState } from '../services/db';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // User states
  const [completedItems, setCompletedItems] = useState(new Set());
  const [expandedSwimlanes, setExpandedSwimlanes] = useState(new Set());
  
  // Filters
  const [filters, setFilters] = useState({
    era: [],
    type: [],
    availability: [],
    priority: [],
    cost: [],
    solo: [],
    damage: [],
    searchQuery: '',
    hideVaulted: false
  });

  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      // Load Master Data
      const masterData = await fetchAndCacheData();
      setData(masterData);

      // Load User State
      const savedCompletions = await getUserState('completions');
      if (savedCompletions) setCompletedItems(new Set(savedCompletions));

      const savedExpansions = await getUserState('expanded');
      if (savedExpansions) setExpandedSwimlanes(new Set(savedExpansions));

      const savedFilters = await getUserState('filters');
      if (savedFilters) setFilters(savedFilters);

      setLoading(false);
    };
    initApp();
  }, []);

  // Sync state to IndexedDB when it changes
  useEffect(() => {
    if (!loading) {
      saveUserState('completions', Array.from(completedItems));
    }
  }, [completedItems, loading]);

  useEffect(() => {
    if (!loading) {
      saveUserState('expanded', Array.from(expandedSwimlanes));
    }
  }, [expandedSwimlanes, loading]);

  useEffect(() => {
    if (!loading) {
      saveUserState('filters', filters);
    }
  }, [filters, loading]);

  const toggleCompletion = (id) => {
    setCompletedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSwimlane = (id) => {
    setExpandedSwimlanes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateFilter = (category, value) => {
    if (category === 'searchQuery' || category === 'hideVaulted') {
      setFilters(prev => ({ ...prev, [category]: value }));
      return;
    }

    setFilters(prev => {
      if (Array.isArray(value)) {
        return { ...prev, [category]: value };
      }
      const currentList = prev[category] || [];
      if (currentList.includes(value)) {
        return { ...prev, [category]: currentList.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...currentList, value] };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      era: [],
      type: [],
      availability: [],
      priority: [],
      cost: [],
      solo: [],
      damage: [],
      searchQuery: '',
      hideVaulted: false
    });
  };

  const value = {
    data,
    loading,
    completedItems,
    toggleCompletion,
    expandedSwimlanes,
    toggleSwimlane,
    filters,
    updateFilter,
    resetFilters
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
