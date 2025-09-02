import { apiFetch } from '@/packages/shared/src/lib/api'; // Import shared apiFetch
import { RaffleVerificationDetailsDto } from '@/packages/shared/src/types/auth'; // Import DTO

export interface Raffle {
  id: string;
  title: string;
  endsIn: string; // This should ideally be a Date or timestamp
  // Add other raffle properties as needed
}

/**
 * Fetches a list of active raffles.
 * @returns {Promise<Raffle[]>} A promise that resolves to an array of Raffle objects.
 */
export const getRaffles = async (): Promise<Raffle[]> => {
  // In a real application, this would call a specific raffle endpoint
  // For now, simulate a call
  return apiFetch('/raffles/active'); // Assuming an endpoint for active raffles
};

/**
 * Fetches details required to verify a raffle draw.
 * @param {number} raffleId - The ID of the raffle to get verification details for.
 * @returns {Promise<RaffleVerificationDetailsDto>} A promise that resolves to the verification details.
 */
export const getRaffleVerificationDetails = (
  raffleId: number
): Promise<RaffleVerificationDetailsDto> => {
  return apiFetch(`/raffles/${raffleId}/verify`);
};
