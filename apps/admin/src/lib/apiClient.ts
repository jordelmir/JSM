import { apiFetch } from '@/packages/shared/src/lib/api';
import { useAuthStore } from "@/store/authStore"; // Assuming a zustand store for auth

// --- Stations ---
/**
 * Represents a station entity with its details.
 */
export type Station = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
};

/**
 * Fetches a list of all stations.
 * @returns {Promise<Station[]>} A promise that resolves to an array of Station objects.
 */
export const getStations = (): Promise<Station[]> => {
  return apiFetch('/stations');
};

/**
 * Creates a new station.
 * @param {Omit<Station, 'id' | 'status'>} stationData - The data for the new station, excluding id and status.
 * @returns {Promise<Station>} A promise that resolves to the created Station object.
 */
export const createStation = (stationData: Omit<Station, 'id' | 'status'>): Promise<Station> => {
  return apiFetch('/stations', {
    method: 'POST',
    body: JSON.stringify(stationData),
  });
};

/**
 * Updates an existing station.
 * @param {string} stationId - The ID of the station to update.
 * @param {Partial<Omit<Station, 'id'>>} stationData - The partial data to update the station with, excluding id.
 * @returns {Promise<Station>} A promise that resolves to the updated Station object.
 */
export const updateStation = (stationId: string, stationData: Partial<Omit<Station, 'id'>>): Promise<Station> => {
  return apiFetch(`/stations/${stationId}`, {
    method: 'PUT',
    body: JSON.stringify(stationData),
  });
};

/**
 * Deletes a station.
 * @param {string} stationId - The ID of the station to delete.
 * @returns {Promise<void>} A promise that resolves when the station is successfully deleted.
 */
export const deleteStation = (stationId: string): Promise<void> => {
  return apiFetch(`/stations/${stationId}`, {
    method: 'DELETE',
  });
};

// --- Analytics ---
/**
 * Fetches today's summary analytics data.
 * @returns {Promise<any>} A promise that resolves to the summary data.
 */
import { apiFetch } from '@/packages/shared/src/lib/api';
import { useAuthStore } from "@/store/authStore"; // Assuming a zustand store for auth

// --- Stations ---
/**
 * Represents a station entity with its details.
 */
export type Station = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
};

/**
 * Fetches a list of all stations.
 * @returns {Promise<Station[]>} A promise that resolves to an array of Station objects.
 */
export const getStations = (): Promise<Station[]> => {
  return apiFetch('/stations');
};

/**
 * Creates a new station.
 * @param {Omit<Station, 'id' | 'status'>} stationData - The data for the new station, excluding id and status.
 * @returns {Promise<Station>} A promise that resolves to the created Station object.
 */
export const createStation = (stationData: Omit<Station, 'id' | 'status'>): Promise<Station> => {
  return apiFetch('/stations', {
    method: 'POST',
    body: JSON.stringify(stationData),
  });
};

/**
 * Updates an existing station.
 * @param {string} stationId - The ID of the station to update.
 * @param {Partial<Omit<Station, 'id'>>} stationData - The partial data to update the station with, excluding id.
 * @returns {Promise<Station>} A promise that resolves to the updated Station object.
 */
export const updateStation = (stationId: string, stationData: Partial<Omit<Station, 'id'>>): Promise<Station> => {
  return apiFetch(`/stations/${stationId}`, {
    method: 'PUT',
    body: JSON.stringify(stationData),
  });
};

/**
 * Deletes a station.
 * @param {string} stationId - The ID of the station to delete.
 * @returns {Promise<void>} A promise that resolves when the station is successfully deleted.
 */
export const deleteStation = (stationId: string): Promise<void> => {
  return apiFetch(`/stations/${stationId}`, {
    method: 'DELETE',
  });
};

/**
 * Fetches a list of stations near a given location within a specified distance.
 * @param {number} latitude - The latitude of the center point.
 * @param {number} longitude - The longitude of the center point.
 * @param {number} distanceMeters - The search radius in meters.
 * @returns {Promise<Station[]>} A promise that resolves to an array of Station objects.
 */
export const getNearbyStations = (
  latitude: number,
  longitude: number,
  distanceMeters: number
): Promise<Station[]> => {
  return apiFetch(`/stations/nearby?latitude=${latitude}&longitude=${longitude}&distanceMeters=${distanceMeters}`);
};

// --- Analytics ---
/**
 * Fetches today's summary analytics data.
 * @returns {Promise<any>} A promise that resolves to the summary data.
 */
export const getTodaySummary = () => {
    return apiFetch('/analytics/summary/today');
}

// --- Raffles ---
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
 * DTO for providing all necessary data to publicly verify the fairness of a raffle draw.
 */
export type RaffleVerificationDetailsDto = {
  raffleId: string;
  serverSeedHash: string;
  clientSeed: string | null;
  publicSeed: string; // e.g., Bitcoin block hash
  finalCombinedSeed: string; // This should be calculated or stored
  winnerId: string;
  merkleRoot: string;
  entries: string[];
};

/**
 * Fetches a list of all raffles.
 * @returns {Promise<Raffle[]>} A promise that resolves to an array of Raffle objects.
 */
export const getRaffles = (): Promise<Raffle[]> => {
  return apiFetch('/raffles');
};

/**
 * Closes a raffle period.
 * @param {string} period - The period of the raffle to close.
 * @returns {Promise<Raffle>} A promise that resolves to the updated Raffle object.
 */
export const closeRafflePeriod = (period: string): Promise<Raffle> => {
  return apiFetch(`/raffles/${period}/close`, {
    method: 'POST',
  });
};

/**
 * Executes a raffle draw for a given raffle ID.
 * @param {number} raffleId - The ID of the raffle to draw.
 * @returns {Promise<RaffleWinner>} A promise that resolves to the RaffleWinner object.
 */
export const executeRaffleDraw = (raffleId: number): Promise<RaffleWinner> => {
  return apiFetch(`/raffles/${raffleId}/draw`, {
    method: 'POST',
  });
};

/**
 * Fetches details required to verify a raffle draw.
 * @param {number} raffleId - The ID of the raffle to get verification details for.
 * @returns {Promise<RaffleVerificationDetailsDto>} A promise that resolves to the verification details.
 */
export const getRaffleVerificationDetails = (raffleId: number): Promise<RaffleVerificationDetailsDto> => {
  return apiFetch(`/raffles/${raffleId}/verify`);
};


// --- Raffles ---
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
 * Closes a raffle period.
 * @param {string} period - The period of the raffle to close.
 * @returns {Promise<Raffle>} A promise that resolves to the updated Raffle object.
 */
export const closeRafflePeriod = (period: string): Promise<Raffle> => {
  return apiFetch(`/raffles/${period}/close`, {
    method: 'POST',
  });
};

/**
 * Executes a raffle draw for a given raffle ID.
 * @param {number} raffleId - The ID of the raffle to draw.
 * @returns {Promise<RaffleWinner>} A promise that resolves to the RaffleWinner object.
 */
export const executeRaffleDraw = (raffleId: number): Promise<RaffleWinner> => {
  return apiFetch(`/raffles/${raffleId}/draw`, {
    method: 'POST',
  });
};