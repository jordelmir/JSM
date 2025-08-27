// This file can export shared interfaces, DTOs, validation schemas, etc.

/**
 * @interface User
 * @description Represents a user in the system.
 */
export interface User {
  id: string;
  phone: string;
  email?: string; // Optional email
  name?: string; // Optional name
  roles: string[];
  stationId?: string; // For employees/owners
}

export interface QrPayload {
  s: string; // stationId
  d: string; // dispenserId
  n: string; // nonce
  t: number; // timestamp
  exp: number; // expiration
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface Order {
  id: string;
  userId: string;
  products: Product[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: number;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error?: {
    message: string;
    code?: string;
  };
};

/**
 * @function formatDate
 * @description Formats a timestamp or Date object into a readable date string.
 * @param {number | Date} dateInput - The date as a timestamp (number) or Date object.
 * @returns {string} The formatted date string (e.g., "YYYY-MM-DD").
 */
export function formatDate(dateInput: number | Date): string {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * @enum CouponStatus
 * @description Represents the status of a coupon.
 */
export enum CouponStatus {
  GENERATED = 'GENERATED',
  SCANNED = 'SCANNED',
  ACTIVATED = 'ACTIVATED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  USED_IN_RAFFLE = 'USED_IN_RAFFLE',
}

/**
 * @enum StationStatus
 * @description Represents the operational status of a gas station.
 */
export enum StationStatus {
  ACTIVA = 'ACTIVA',
  INACTIVA = 'INACTIVA',
  MANTENIMIENTO = 'MANTENIMIENTO',
}
