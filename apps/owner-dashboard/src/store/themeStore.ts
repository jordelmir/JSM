import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light', // Default theme
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
        // Apply theme class immediately
        const newTheme = get().theme;
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      },
    }),
    {
      name: 'theme-preference', // Name of the key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Hydration callback to apply theme on load
      onRehydrateStorage: (state) => {
        if (state) {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(state.theme);
        }
      },
    }
  )
);
