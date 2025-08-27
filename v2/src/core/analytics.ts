
/**
 * @module core/analytics
 * @description A simple, ethical analytics service.
 */

import eventBus from './eventBus';
import logger from './logger';

class AnalyticsService {
  constructor() {
    eventBus.on('purchaseCompleted', this.trackPurchase.bind(this));
  }

  private trackPurchase(data: { id: number; amount: number; date: string }): void {
    logger.log('Analytics: Purchase tracked', data);
    // In a real application, you would send this data to your analytics backend.
  }

  public trackEvent(eventName: string, data: unknown): void {
    logger.log(`Analytics: Event tracked: ${eventName}`, data);
    // In a real application, you would send this data to your analytics backend.
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
