/**
 * @module core/analytics
 * @description A simple, ethical, and configurable analytics service.
 */

import eventBus from './eventBus';
import logger from './logger';

interface AnalyticsConfig {
  isEnabled: boolean;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private config: AnalyticsConfig = {
    isEnabled: true, // Default to enabled, can be configured by the user.
  };

  // Private constructor to prevent direct instantiation.
  private constructor() {}

  /**
   * Gets the single instance of the AnalyticsService.
   * @returns {AnalyticsService} The singleton instance.
   */
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initializes the analytics service, subscribing to relevant business events.
   * This method should be called once during the application's startup sequence.
   * It is idempotent and will not run if analytics are disabled.
   */
  public init(): void {
    if (!this.config.isEnabled) {
      logger.info('Analytics service is disabled. No events will be tracked.');
      return;
    }
    // Bind event listeners only if the service is enabled.
    eventBus.on('purchaseCompleted', this.trackPurchase.bind(this));
    logger.info('Analytics service initialized and listening for events.');
  }

  /**
   * Configures the analytics service, allowing for dynamic changes (e.g., user opt-out).
   * @param {Partial<AnalyticsConfig>} newConfig - A partial configuration object. Currently supports `isEnabled`.
   */
  public configure(newConfig: Partial<AnalyticsConfig>): void {
    const wasEnabled = this.config.isEnabled;
    this.config = { ...this.config, ...newConfig };
    
    // If the service was just enabled, we might need to initialize it.
    // If it was just disabled, we should ideally unsubscribe from events.
    if (this.config.isEnabled && !wasEnabled) {
        this.init();
    }
    // Note: A full implementation would handle unsubscribing from the eventBus if disabled.
  }

  private trackPurchase(data: { id: number; amount: number; date: string }): void {
    if (!this.config.isEnabled) return;
    
    logger.info('Analytics: Purchase tracked', data);
    // In a real application, you would send this data to your analytics backend.
  }

  /**
   * Tracks a generic event.
   * This can be used for custom analytics events throughout the application.
   * @param {string} eventName - The name of the event to track.
   * @param {unknown} data - The payload of data associated with the event.
   */
  public trackEvent(eventName: string, data: unknown): void {
    if (!this.config.isEnabled) return;

    logger.info(`Analytics: Event tracked: ${eventName}`, data);
    // In a real application, you would send this data to your analytics backend.
  }
}

const analyticsService = AnalyticsService.getInstance();
export default analyticsService;
