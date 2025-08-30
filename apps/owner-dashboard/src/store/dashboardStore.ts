import { create } from 'zustand';
import { DashboardData } from '@/types/dashboard';

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/dashboard-summary');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: DashboardData = await response.json();
      set({ data, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      set({ error: err.message || "Failed to load dashboard data. Please try again.", isLoading: false });
    }
  },
}));
