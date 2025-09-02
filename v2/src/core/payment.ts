/**
 * @module core/payment
 * @description A module for handling payments using a registry-based Factory pattern.
 */
import logger from './logger';

/**
 * Represents the contract for any payment strategy.
 * All payment methods must implement this interface.
 */
export interface PaymentStrategy {
  /**
   * Executes the payment process.
   * @returns {string} A message indicating the result of the process.
   */
  process(): string;
}

// --- Concrete Strategy Implementations ---

class CashPayment implements PaymentStrategy {
  public process(): string {
    return 'Processing Cash Payment';
  }
}

class CardPayment implements PaymentStrategy {
  public process(): string {
    return 'Processing Card Payment';
  }
}

// --- The Registry-Based Factory ---

type PaymentStrategyConstructor = new () => PaymentStrategy;

export class PaymentFactory {
  private static instance: PaymentFactory;
  private registry = new Map<string, PaymentStrategyConstructor>();

  private constructor() {
    // Private constructor for Singleton
  }

  /**
   * Gets the single instance of the PaymentFactory.
   * @returns {PaymentFactory} The singleton instance.
   */
  public static getInstance(): PaymentFactory {
    if (!PaymentFactory.instance) {
      PaymentFactory.instance = new PaymentFactory();
    }
    return PaymentFactory.instance;
  }

  /**
   * Registers a new payment strategy, allowing for extensibility.
   * This method allows new payment types to be added to the system without modifying the factory itself,
   * adhering to the Open/Closed Principle.
   * @param {string} type - The identifier for the payment strategy (e.g., 'cash').
   * @param {PaymentStrategyConstructor} constructor - The constructor of the strategy class.
   */
  public register(type: string, constructor: PaymentStrategyConstructor): void {
    if (this.registry.has(type)) {
      logger.warn(`Payment strategy for type '${type}' is already registered. Overwriting.`);
    }
    this.registry.set(type, constructor);
  }

  /**
   * Creates a payment strategy instance based on the registered type.
   * @param {string} type - The identifier for the payment strategy.
   * @returns {PaymentStrategy} An instance of a PaymentStrategy.
   * @throws {Error} If the payment type is not registered.
   */
  public createPayment(type: string): PaymentStrategy {
    const constructor = this.registry.get(type);
    if (!constructor) {
      logger.error(`Unknown payment type: '${type}'`);
      throw new Error(`Unknown payment type: '${type}'`);
    }
    return new constructor();
  }
}

// --- Initialization and Registration ---

// Get the singleton instance of the factory
const paymentFactory = PaymentFactory.getInstance();

// Register the initial strategies
// This part can be extended in other files to add new strategies without modifying the factory.
paymentFactory.register('cash', CashPayment);
paymentFactory.register('card', CardPayment);

// To add a new payment method, you would do:
// class CryptoPayment implements PaymentStrategy { ... }
// paymentFactory.register('crypto', CryptoPayment);

export default paymentFactory;
