import { create } from 'zustand';
import { Alert } from 'react-native'; // Import Alert for direct use
import { router } from 'expo-router'; // Import router for navigation

interface CouponState {
  scanQRCode: (qrCode: string, userId: string) => Promise<any>;
  activateCoupon: (couponId: string, userId: string) => Promise<any>;
  getAdSequence: (userId: string, couponId: string) => Promise<any>;
  completeAdStep: (sequenceId: string, userId: string) => Promise<any>;
}

export const useCouponStore = create<CouponState>((set) => ({
  scanQRCode: async (qrCode, userId) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/coupons/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al escanear QR');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error scanning QR code:', error);
      throw error;
    }
  },

  activateCoupon: async (couponId, userId) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/coupons/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al activar cupón');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error activating coupon:', error);
      throw error;
    }
  },

  getAdSequence: async (userId, couponId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/ads/sequence?userId=${userId}&couponId=${couponId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener secuencia de anuncios');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error getting ad sequence:', error);
      throw error;
    }
  },

  completeAdStep: async (sequenceId, userId) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/ads/complete-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sequenceId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al completar paso de anuncio');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error completing ad step:', error);
      throw error;
    }
  },
}));