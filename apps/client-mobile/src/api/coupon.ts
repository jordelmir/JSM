import { apiFetch } from '@/packages/shared/src/lib/api'; // Import shared apiFetch

// --- Coupon API Functions ---

/**
 * Activates a coupon for a given user.
 * @param {string} couponId - The ID of the coupon to activate.
 * @param {string} userId - The ID of the user activating the coupon.
 * @returns {Promise<any>} A promise that resolves to the activation result.
 */
export const activateCoupon = async (couponId: string, userId: string): Promise<any> => {
  return apiFetch('/coupons/activate', {
    method: 'POST',
    body: JSON.stringify({ couponId, userId }),
  });
};

/**
 * Scans a QR code to redeem a coupon or perform a related action.
 * @param {string} qrCode - The QR code string to scan.
 * @param {string} userId - The ID of the user scanning the QR code.
 * @returns {Promise<any>} A promise that resolves to the scan result.
 */
export const scanQRCode = async (qrCode: string, userId: string): Promise<any> => {
  return apiFetch('/coupons/scan', {
    method: 'POST',
    body: JSON.stringify({ qrCode, userId }),
  });
};

/**
 * Fetches an ad sequence for a given user and coupon.
 * @param {string} userId - The ID of the user.
 * @param {string} couponId - The ID of the coupon.
 * @returns {Promise<any>} A promise that resolves to the ad sequence data.
 */
export const getAdSequence = async (userId: string, couponId: string): Promise<any> => {
  // This endpoint might need to be adjusted based on actual API
  return apiFetch(`/ad-sequence?userId=${userId}&couponId=${couponId}`);
};
