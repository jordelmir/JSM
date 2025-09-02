import { apiFetch } from '@/packages/shared/src/lib/api'; // Import shared apiFetch

// This file now primarily serves as a re-export or a place for employee-specific API functions
// The generic apiCall logic has been moved to @/packages/shared/src/lib/api.ts

// You can add employee-specific API functions here that use apiFetch
// Example:
// export const getEmployeeProfile = async (employeeId: string) => {
//   return apiFetch(`/employees/${employeeId}/profile`);
// };
