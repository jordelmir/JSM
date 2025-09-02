import { useEffect, useState } from "react";
import { getTodaySummary } from "@/lib/apiClient";
import { toast } from 'react-toastify';

interface SummaryData {
  totalRevenue: number;
  pointsRedeemed: number;
  adImpressions: number;
}

/**
 * Custom hook to fetch and manage the state of today's summary data for the dashboard.
 * It handles loading, error, and data states, and displays toast notifications on error.
 * @returns {{ summary: SummaryData | null, isLoading: boolean, error: string | null }}
 *   - `summary`: The fetched summary data, or null if not yet loaded or an error occurred.
 *   - `isLoading`: A boolean indicating if the data is currently being loaded.
 *   - `error`: A string containing an error message if data fetching failed, or null otherwise.
 */
export const useTodaySummary = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        setError(null); // Clear previous errors
        const data = await getTodaySummary();
        setSummary(data);
      } catch (err: any) {
        setError(err.message);
        toast.error(`Error loading dashboard summary: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []); // Empty dependency array means this effect runs once on mount

  return { summary, isLoading, error };
};