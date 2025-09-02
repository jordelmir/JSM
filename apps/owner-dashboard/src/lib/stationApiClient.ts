import { apiFetch } from '@/packages/shared/src/lib/api';

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string; // Assuming string representation of StationStatus
}

export interface CreateStationDto {
  name: string;
  latitude: number;
  longitude: number;
  status?: string; // Optional, default in backend
}

export interface UpdateStationDto {
  name?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
}

export const getStations = (): Promise<Station[]> => {
  return apiFetch('/stations');
};

export const createStation = (stationData: CreateStationDto): Promise<Station> => {
  return apiFetch('/stations', {
    method: 'POST',
    body: JSON.stringify(stationData),
  });
};

export const updateStation = (stationId: string, stationData: UpdateStationDto): Promise<Station> => {
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
