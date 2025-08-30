import { useLoadingStore } from '../lib/stores/useLoadingStore';
import { useUserStore } from '../app/store/userStore'; // Assuming userStore is here

const API_BASE_URL = 'http://localhost:8080'; // Replace with your actual API base URL

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const { startLoading, stopLoading } = useLoadingStore.getState();
  const { token } = useUserStore.getState(); // Assuming token is in userStore

  startLoading();
  try {
    const headers: HeadersInit = {
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
  } finally {
    stopLoading();
  }
}

// --- Coupon API Functions ---

export const activateCoupon = async (couponId: string, userId: string): Promise<any> => {
  return apiCall('/coupons/activate', {
    method: 'POST',
    body: JSON.stringify({ couponId, userId }),
  });
};

export const scanQRCode = async (qrCode: string, userId: string): Promise<any> => {
  return apiCall('/coupons/scan', {
    method: 'POST',
    body: JSON.stringify({ qrCode, userId }),
  });
};

export const getAdSequence = async (userId: string, couponId: string): Promise<any> => {
  // This endpoint might need to be adjusted based on actual API
  return apiCall(`/ad-sequence?userId=${userId}&couponId=${couponId}`);
};
