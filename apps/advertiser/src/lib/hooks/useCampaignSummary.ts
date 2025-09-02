import { useEffect, useState } from "react";
import { getCampaignPerformanceSummary } from "@/lib/apiClient"; // To be implemented
import { toast } from 'react-toastify';

interface CampaignSummary {
  totalImpressions: number;
  totalBudgetSpent: number;
  // impressionsByDay: { date: string; impressions: number }[]; // For a simple graph
}

/**
 * Custom hook to fetch and manage the state of campaign performance summary data for the dashboard.
 * It handles loading, error, and data states, and displays toast notifications on error.
 * @returns {{ summary: CampaignSummary | null, isLoading: boolean, error: string | null }}
 *   - `summary`: The fetched campaign summary data, or null if not yet loaded or an error occurred.
 *   - `isLoading`: A boolean indicating if the data is currently being loaded.
 *   - `error`: A string containing an error message if data fetching failed, or null otherwise.
 */
export const useCampaignSummary = () => {
  const [summary, setSummary] = useState<CampaignSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        setError(null); // Clear previous errors
        // Mock data for now, replace with actual API call
        const data = await getCampaignPerformanceSummary();
        setSummary(data);
      } catch (err: any) {
        setError(err.message);
        toast.error(`Error loading campaign summary: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []); // Empty dependency array means this effect runs once on mount

  return { summary, isLoading, error };
};