
/**
 * @module services/apiFacade
 * @description A Facade for interacting with various APIs.
 */

import logger from '../core/logger';

interface FuelPrice {
  type: string;
  price: number;
}

interface OrderResult {
  success: boolean;
  message: string;
}

class FuelApi {
  public async getPrices(): Promise<FuelPrice[]> {
    logger.log('Fetching fuel prices...');
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { type: '95', price: 1.50 },
          { type: '98', price: 1.65 },
          { type: 'diesel', price: 1.40 },
        ]);
      }, 500);
    });
  }
}

class OrderApi {
  public async submit(fuelType: string, liters: number): Promise<OrderResult> {
    logger.log(`Submitting order for ${liters}L of ${fuelType}...`);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Order submitted successfully!' });
      }, 500);
    });
  }
}

class ApiFacade {
  private fuelApi: FuelApi;
  private orderApi: OrderApi;

  constructor() {
    this.fuelApi = new FuelApi();
    this.orderApi = new OrderApi();
  }

  public async getFuelPrices(): Promise<FuelPrice[]> {
    return this.fuelApi.getPrices();
  }

  public async submitOrder(fuelType: string, liters: number): Promise<OrderResult> {
    return this.orderApi.submit(fuelType, liters);
  }
}

export const apiFacade = new ApiFacade();
