import { useState, useEffect } from 'react';
import { getRaffles, Raffle } from '../../src/api/raffle'; // Adjust path
import { Alert } from 'react-native'; // For error alerts
import { useTranslation } from 'react-i18next'; // For translation

/**
 * Custom hook to fetch and manage the state of active raffles.
 * It handles loading, error, and data states, and displays alerts on error.
 * @returns {{ raffles: Raffle[], isLoading: boolean, error: string | null }}
 *   - `raffles`: An array of Raffle objects, or an empty array if not yet loaded or an error occurred.
 *   - `isLoading`: A boolean indicating if the raffle data is currently being loaded.
 *   - `error`: A string containing an error message if data fetching failed, or null otherwise.
 */
export const useRaffles = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRaffles();
        setRaffles(data);
      } catch (err: any) {
        setError(err.message || t('Failed to load raffles.'));
        Alert.alert(t('Error'), err.message || t('Failed to load raffles.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaffles();
  }, []); // Empty dependency array to fetch once on mount

  return { raffles, isLoading, error };
};