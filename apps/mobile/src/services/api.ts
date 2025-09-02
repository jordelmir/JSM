import apiClient from '../api/apiClient'; // Import the configured apiClient

// --- Types ---
export type Station = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
};

export type RaffleVerificationDetailsDto = {
  raffleId: string;
  serverSeedHash: string;
  clientSeed: string | null;
  publicSeed: string;
  finalCombinedSeed: string;
  winnerId: string;
  merkleRoot: string;
  entries: string[];
};

// --- Redemption Service ---
export const redeemQrCode = async (qr_token: string, gps: string) => {
  const response = await apiClient.post('/redemption-service/redeem', { qr_token, gps });
  return response.data;
};

export const confirmAdWatched = async (session_id: string) => {
  const response = await apiClient.post('/redemption-service/redeem/confirm-ad', { session_id });
  return response.data;
};

// --- Station Service ---
export const getNearbyStations = async (latitude: number, longitude: number, distanceMeters: number): Promise<Station[]> => {
  const response = await apiClient.get(`/stations/nearby?latitude=${latitude}&longitude=${longitude}&distanceMeters=${distanceMeters}`);
  return response.data;
};

// --- Raffle Service ---
export const getRaffleVerificationDetails = async (raffleId: number): Promise<RaffleVerificationDetailsDto> => {
  const response = await apiClient.get(`/raffles/${raffleId}/verify`);
  return response.data;
};
