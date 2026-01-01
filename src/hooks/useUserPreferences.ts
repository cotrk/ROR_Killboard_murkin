import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  defaultTab: 'players',
  chartType: 'line',
  itemsPerPage: 10,
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    try {
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    try {
      localStorage.removeItem('userPreferences');
    } catch (error) {
      console.warn('Failed to clear user preferences:', error);
    }
  };

  const exportPreferences = () => {
    return JSON.stringify(preferences, null, 2);
  };

  const importPreferences = (preferencesJson: string) => {
    try {
      const imported = JSON.parse(preferencesJson);
      const validPreferences = { ...DEFAULT_PREFERENCES, ...imported };
      setPreferences(validPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(validPreferences));
      return true;
    } catch (error) {
      console.warn('Failed to import user preferences:', error);
      return false;
    }
  };

  return {
    preferences,
    updatePreference,
    resetPreferences,
    exportPreferences,
    importPreferences,
  };
};
