import React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@ui-components'; // Assuming Button is available from ui-components

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
