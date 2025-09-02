import { useState, useEffect } from 'react';
import * as storage from '../core/storage';

/**
 * Custom hook to manage the application's dark mode state.
 * It initializes the state from localStorage, applies the 'dark' class to the root element,
 * and provides a function to toggle the state while persisting it.
 * @returns {[boolean, () => void]} A tuple containing the current dark mode state (isDarkMode)
 * and a function to toggle it (toggleDarkMode).
 */
export const useDarkMode = (): [boolean, () => void] => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Initialize state from localStorage or system preference
    const storedPreference = storage.get<boolean>('darkMode');
    if (storedPreference !== null) {
      return storedPreference;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    }
    else {
      root.classList.remove('dark');
    }
    storage.set('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return [isDarkMode, toggleDarkMode];
};
