
import { apiFetch } from '@/packages/shared/src/lib/api';
import { useAuthStore } from "@/store/authStore"; // Assuming a zustand store for auth

// --- Stations --- //
export type Station = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
};

export const getStations = (): Promise<Station[]> => {
  return apiFetch('/stations');
};

export const createStation = (stationData: Omit<Station, 'id' | 'status'>): Promise<Station> => {
  return apiFetch('/stations', {
    method: 'POST',
    body: JSON.stringify(stationData),
  });
};

export const updateStation = (stationId: string, stationData: Partial<Omit<Station, 'id'>>): Promise<Station> => {
  return apiFetch(`/stations/${stationId}`, {
    method: 'PUT',
    body: JSON.stringify(stationData),
  });
};

export const deleteStation = (stationId: string): Promise<void> => {
  return apiFetch(`/stations/${stationId}`, {
    method: 'DELETE',
  });
};

// --- Analytics --- //
export const getTodaySummary = () => {
    return apiFetch('/analytics/summary/today');
}

// --- Raffles --- //
export type Raffle = {
  id: number;
  period: string;
  merkleRoot: string;
  status: 'OPEN' | 'CLOSED' | 'DRAWN';
  drawAt?: string; // ISO date string
  externalSeed?: string;
  winnerEntryId?: string;
};

export type RaffleWinner = {
  id: number;
  raffleId: number;
  userId: string;
  winningPointId: string;
  prize: string;
};

export const getRaffles = (): Promise<Raffle[]> => {
  return apiFetch('/raffles');
};

export const closeRafflePeriod = (period: string): Promise<Raffle> => {
  return apiFetch(`/raffles/${period}/close`, {
    method: 'POST',
  });
};

export const executeRaffleDraw = (raffleId: number): Promise<RaffleWinner> => {
  return apiFetch(`/raffles/${raffleId}/draw`, {
    method: 'POST',
  });
};
