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