import { apiFetch } from '@/packages/shared/src/lib/api'; // Import shared apiFetch
import { useAuthStore } from "@gasolinera-jsm/shared/store/authStore";
import { TokenResponse } from '@/packages/shared/src/types/auth'; // Import TokenResponse

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'; // This might be redundant if apiFetch handles base URL

// --- Auth --- //
/**
 * Authenticates an advertiser with email and password.
 * @param {string} email - The advertiser's email.
 * @param {string} pass - The advertiser's password.
 * @returns {Promise<TokenResponse>} A promise that resolves with the authentication tokens.
 */
export const loginAdvertiser = async (email: string, pass: string): Promise<TokenResponse> => {
  const response = await apiFetch('/auth/login/advertiser', {
    method: 'POST',
    body: JSON.stringify({ email, pass }),
  });
  const data: TokenResponse = await response.json();
  useAuthStore.getState().login({} as any, data.accessToken, data.refreshToken); // Assuming user data is not returned here
  return data;
};

// --- Campaigns --- //
/**
 * Represents a campaign entity.
 */
export interface Campaign {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  adUrl: string;
}

/**
 * Fetches a list of all campaigns for the authenticated advertiser.
 * @returns {Promise<Campaign[]>} A promise that resolves to an array of Campaign objects.
 */
export const getMyCampaigns = (): Promise<Campaign[]> => apiFetch('/campaigns');

/**
 * Creates a new campaign.
 * @param {Omit<Campaign, 'id'>} campaignData - The data for the new campaign, excluding the ID.
 * @returns {Promise<Campaign>} A promise that resolves to the created Campaign object.
 */
export const createCampaign = (campaignData: Omit<Campaign, 'id'>): Promise<Campaign> => {
  return apiFetch('/campaigns', {
    method: 'POST',
    body: JSON.stringify(campaignData),
  });
};

/**
 * Updates an existing campaign.
 * @param {number} id - The ID of the campaign to update.
 * @param {Partial<Omit<Campaign, 'id'>} campaignData - The partial data to update the campaign with, excluding the ID.
 * @returns {Promise<Campaign>} A promise that resolves to the updated Campaign object.
 */
export const updateCampaign = (id: number, campaignData: Partial<Omit<Campaign, 'id'>>): Promise<Campaign> => {
  return apiFetch(`/campaigns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(campaignData),
  });
};

/**
 * Deletes a campaign.
 * @param {number} id - The ID of the campaign to delete.
 * @returns {Promise<void>} A promise that resolves when the campaign is successfully deleted.
 */
export const deleteCampaign = (id: number): Promise<void> => {
  return apiFetch(`/campaigns/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Fetches the performance summary for all campaigns of the authenticated advertiser.
 * @returns {Promise<{ totalImpressions: number; totalBudgetSpent: number }>} A promise that resolves to the campaign performance summary data.
 */
export const getCampaignPerformanceSummary = (): Promise<{ totalImpressions: number; totalBudgetSpent: number }> => {
  return apiFetch('/campaigns/summary');
};