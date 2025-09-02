import { useState } from 'react';
import { Alert } from 'react-native';
import { createTicket } from '../src/api/employee'; // Adjust path
import { useTranslation } from 'react-i18next'; // Adjust path

/**
 * Custom hook to manage the process of generating a new ticket.
 * It handles loading states, calls the `createTicket` API, and provides user feedback via alerts.
 * @returns {{ isLoadingTicket: boolean, generateTicket: () => Promise<void> }}
 *   - `isLoadingTicket`: A boolean indicating if the ticket generation process is currently in progress.
 *   - `generateTicket`: An asynchronous function to initiate the ticket generation process.
 */
export const useTicketGeneration = () => {
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const { t } = useTranslation();

  const generateTicket = async () => {
    setIsLoadingTicket(true);
    try {
      const ticket = await createTicket({ amount: 100, type: 'fuel' }); // Example data
      console.log(t("Ticket generated:"), ticket);
      Alert.alert(t("Success"), t(`Ticket #${ticket.id} generated`));
    } catch (error: any) {
      console.error(t("Error generating ticket"), error);
      Alert.alert(t("Error"), error?.message || t("Could not generate ticket"));
    } finally {
      setIsLoadingTicket(false);
    }
  };

  return { isLoadingTicket, generateTicket };
};