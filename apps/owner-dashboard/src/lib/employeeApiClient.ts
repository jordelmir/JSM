import { apiFetch } from '@/packages/shared/src/lib/api';

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