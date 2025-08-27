
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DarkModeToggle: React.FC = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button onClick={toggleDarkMode} aria-pressed={isDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md">
      {isDarkMode ? t('Light Mode') : t('Dark Mode')}
    </button>
  );
};

export default DarkModeToggle;
