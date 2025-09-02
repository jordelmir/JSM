import { useUserStore } from '../store/userStore'; // Import the Zustand store

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080'; // Fallback for development

/**
 * Generic API fetch function for the mobile application.
 * Handles base URL, headers, authentication (using accessToken from useUserStore), and basic error handling.
 * @param {string} endpoint - The API endpoint to call (e.g., '/auth/otp/request'). This will be appended to `API_BASE_URL`.
 * @param {RequestInit} [options] - Standard RequestInit options for the fetch call, such as method, body, etc.
 * @returns {Promise<any>} A promise that resolves to the JSON response from the API. Returns `null` for 204 No Content responses.
 * @throws {Error} If the network request fails or the API returns a non-OK status (e.g., 4xx, 5xx).
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const accessToken = useUserStore.getState().accessToken; // Get token from Zustand store
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (e) {
      // El cuerpo del error no era JSON, usar el mensaje de estado
    }
    throw new Error(errorMessage);
  }

  // Si la respuesta no tiene contenido (ej. 204 No Content), devolver null
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Requests an OTP (One-Time Password) for a given phone number.
 * @param {string} phone - The phone number to request OTP for.
 * @returns {Promise<void>} A promise that resolves when the OTP request is successful.
 */
export const requestOtp = (phone: string): Promise<void> => {
  return apiFetch('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
};

/**
 * Verifies an OTP code and returns an access token.
 * @param {string} phone - The phone number associated with the OTP.
 * @param {string} code - The OTP code to verify.
 * @returns {Promise<{ accessToken: string }>} A promise that resolves with the authentication access token.
 */
export const verifyOtp = (phone: string, code: string): Promise<{ accessToken: string }> => {
  return apiFetch('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
};

/**
 * Sends a QR code to initiate the redemption process.
 * @param {string} qrCode - The QR code string to redeem.
 * @returns {Promise<{ adUrl: string; redemptionId: string }>} A promise that resolves with the ad URL and redemption ID.
 */
export const redeemQrCode = (qrCode: string): Promise<{ adUrl: string; redemptionId: string }> => {
  return apiFetch('/redemptions', {
    method: 'POST',
    body: JSON.stringify({ qrCode }),
  });
};

/**
 * Confirms that an ad has been watched for a given redemption.
 * @param {string} redemptionId - The ID of the redemption to confirm.
 * @returns {Promise<void>} A promise that resolves when the ad watch confirmation is successful.
 */
export const confirmAdWatched = (redemptionId: string): Promise<void> => {
  return apiFetch('/redemptions/confirm', {
    method: 'POST',
    body: JSON.stringify({ redemptionId }),
  });
};

// --- Raffles --- //
/**
 * Represents a raffle entity.
 */
export type Raffle = {
  id: number;
  period: string;
  merkleRoot: string;
  status: 'OPEN' | 'CLOSED' | 'DRAWN';
  drawAt?: string; // ISO date string
  externalSeed?: string;
  winnerEntryId?: string;
};

/**
 * Represents the winner of a raffle.
 */
export type RaffleWinner = {
  id: number;
  raffleId: number;
  userId: string;
  winningPointId: string;
  prize: string;
};

/**
 * Fetches a list of all raffles.
 * @returns {Promise<Raffle[]>} A promise that resolves to an array of Raffle objects.
 */
export const getRaffles = (): Promise<Raffle[]> => {
  return apiFetch('/raffles');
};

/**
 * Fetches the winner of a specific raffle.
 * @param {number} raffleId - The ID of the raffle to get the winner for.
 * @returns {Promise<RaffleWinner>} A promise that resolves to the RaffleWinner object.
 */
export const getRaffleWinner = (raffleId: number): Promise<RaffleWinner> => {
  return apiFetch(`/raffles/${raffleId}/winner`);
};