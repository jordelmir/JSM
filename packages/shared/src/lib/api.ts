import { useAuthStore } from './store/authStore'; // Corrected path
import { TokenResponse } from '../types/auth'; // Import TokenResponse

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Flag to prevent multiple refresh token requests at once
let isRefreshing = false;
// Queue of requests that need to be retried after token refresh
let failedRequestQueue: ((token: string) => void)[] = [];

async function refreshTokenAndRetry(originalRequest: Request, options: RequestInit) {
  if (isRefreshing) {
    return new Promise((resolve) => {
      failedRequestQueue.push((token: string) => {
        originalRequest.headers.set('Authorization', `Bearer ${token}`);
        resolve(fetch(originalRequest));
      });
    });
  }

  isRefreshing = true;

  const { refreshToken, logout, setTokens } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    window.location.href = '/login'; // Redirect to login if no refresh token
    return Promise.reject(new Error('No refresh token available.'));
  }

  try {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      logout();
      window.location.href = '/login'; // Redirect to login if refresh fails
      return Promise.reject(new Error('Failed to refresh token.'));
    }

    const data: TokenResponse = await refreshResponse.json();
    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;

    setTokens(newAccessToken, newRefreshToken);

    // Retry original request with new token
    originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
    const retriedResponse = await fetch(originalRequest);

    // Process queued requests
    failedRequestQueue.forEach(callback => callback(newAccessToken));
    failedRequestQueue = [];

    return retriedResponse;
  } catch (error) {
    console.error('Token refresh error:', error);
    logout();
    window.location.href = '/login'; // Redirect to login on network error during refresh
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().accessToken;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.warn("Unauthorized: Attempting to refresh token.");
      try {
        // Clone the request to retry it later
        const originalRequest = new Request(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        response = await refreshTokenAndRetry(originalRequest, options);
      } catch (error) {
        console.error("Failed to refresh token and retry original request:", error);
        // Error already handled by refreshTokenAndRetry (logout/redirect)
        throw error; // Re-throw to propagate the error
      }
    } else {
      let errorMessage = `Error: ${response.status}`;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }
  }
  
  return response.status === 204 ? null : response.json();
}
