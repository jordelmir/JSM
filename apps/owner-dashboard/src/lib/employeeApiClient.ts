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

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeCode: string;
  stationId: string;
  stationName: string;
  isActive: boolean;
  todayTickets: number;
  weeklyTickets: number;
  conversionRate: number;
  joinDate: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  phone: string;
  stationId: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  phone?: string;
  stationId?: string;
  isActive?: boolean;
}

export const getEmployees = (): Promise<Employee[]> => {
  return apiFetch('/employees');
};

export const createEmployee = (employeeData: CreateEmployeeDto): Promise<Employee> => {
  return apiFetch('/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  });
};

export const updateEmployee = (employeeId: string, employeeData: UpdateEmployeeDto): Promise<Employee> => {
  return apiFetch(`/employees/${employeeId}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData),
  });
};

export const deleteEmployee = (employeeId: string): Promise<void> => {
  return apiFetch(`/employees/${employeeId}`, {
    method: 'DELETE',
  });
};

// Assuming a separate endpoint for fetching stations for dropdowns
export interface StationOption {
  id: string;
  name: string;
}

export const getStationOptions = (): Promise<StationOption[]> => {
  return apiFetch('/stations/options'); // Example endpoint for station options
};