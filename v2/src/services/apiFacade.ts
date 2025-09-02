/**
 * @module services/apiFacade
 * @description A Facade for interacting with various backend APIs.
 */
import logger from '../core/logger';

// --- Data Transfer Objects (DTOs) ---

/**
 * Represents the structure of a fuel price object.
 */
export interface FuelPrice {
  type: string;
  price: number;
}

/**
 * Represents the result of an order submission.
 */
export interface OrderResult {
  success: boolean;
  message: string;
  orderId?: string;
}

// A generic API client (could be implemented with axios or fetch)
// For now, it just simulates calls.
class ApiClient {
    // In a real implementation, this would be configured with a baseURL
    public async get<T>(endpoint: string): Promise<T> {
        logger.debug(`GET: ${endpoint}`);
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                if (endpoint === '/fuel/prices') {
                    resolve([
                        { type: '95', price: 1.50 },
                        { type: '98', price: 1.65 },
                        { type: 'diesel', price: 1.40 },
                    ] as T);
                }
            }, 500);
        });
    }

    public async post<T>(endpoint: string, body: unknown): Promise<T> {
        logger.debug(`POST: ${endpoint}`, body);
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                if (endpoint === '/orders') {
                    resolve({ success: true, message: 'Order submitted successfully!', orderId: 'xyz-123' } as T);
                }
            }, 500);
        });
    }
}


class ApiFacade {
  private static instance: ApiFacade;
  private apiClient: ApiClient;

  // Private constructor for Singleton pattern
  private constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Gets the single instance of the ApiFacade.
   * @returns {ApiFacade} The singleton instance.
   */
  public static getInstance(): ApiFacade {
    if (!ApiFacade.instance) {
      ApiFacade.instance = new ApiFacade();
    }
    return ApiFacade.instance;
  }

  /**
   * Fetches the current fuel prices from the API.
   * @returns {Promise<FuelPrice[]>} A promise that resolves to an array of fuel prices, or an empty array on failure.
   */
  public async getFuelPrices(): Promise<FuelPrice[]> {
    try {
      return await this.apiClient.get<FuelPrice[]>('/fuel/prices');
    } catch (error) {
      logger.error('Failed to fetch fuel prices', error);
      // Return an empty array or re-throw a custom error
      return [];
    }
  }

  /**
   * Submits a new fuel order to the API.
   * @param {string} fuelType - The type of fuel being ordered.
   * @param {number} liters - The amount of fuel in liters.
   * @returns {Promise<OrderResult>} A promise that resolves to an order result object.
   */
  public async submitOrder(fuelType: string, liters: number): Promise<OrderResult> {
    try {
      const payload = { fuelType, liters };
      return await this.apiClient.post<OrderResult>('/orders', payload);
    } catch (error) {
      logger.error('Failed to submit order', error);
      return { success: false, message: 'Failed to submit order.' };
    }
  }
}

const apiFacade = ApiFacade.getInstance();
export default apiFacade;
