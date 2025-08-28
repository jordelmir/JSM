import { useAuthStore } from '@/lib/store/authStore'; // Assuming an auth store exists for owner-dashboard

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token; // Assuming token is stored in authStore

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Error: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    throw new Error(errorMessage);
  }
  
  return response.status === 204 ? null : response.json();
}

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