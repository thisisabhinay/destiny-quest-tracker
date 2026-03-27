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
    type: 'all',
    availability: 'all',
    priority: 'all',
    cost: 'all',
    solo: 'all',
    damage: 'all',
    searchQuery: ''
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

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      era: [],
      type: 'all',
      availability: 'all',
      priority: 'all',
      cost: 'all',
      solo: 'all',
      damage: 'all',
      searchQuery: ''
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
