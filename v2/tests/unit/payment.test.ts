import { describe, it, expect } from 'vitest';
import paymentFactory, { PaymentFactory, PaymentStrategy } from '../../src/core/payment';

describe('PaymentFactory (Registry-based)', () => {
  // Note: Because paymentFactory is a singleton and its module is cached,
  // registrations in one test will carry over to others.

  it('should be a singleton instance', () => {
    const instance1 = PaymentFactory.getInstance();
    const instance2 = PaymentFactory.getInstance();
    expect(instance1).toBe(instance2);
    expect(instance1).toBe(paymentFactory);
  });

  it('should create a pre-registered CashPayment instance', () => {
    const payment = paymentFactory.createPayment('cash');
    expect(payment.process()).toBe('Processing Cash Payment');
  });

  it('should create a pre-registered CardPayment instance', () => {
    const payment = paymentFactory.createPayment('card');
    expect(payment.process()).toBe('Processing Card Payment');
  });

  it('should throw an error when creating an unknown payment type', () => {
    expect(() => paymentFactory.createPayment('unknown-type')).toThrow("Unknown payment type: 'unknown-type'");
  });

  it('should allow registering and then creating a new payment strategy', () => {
    // 1. Define a new mock strategy
    class TestPayment implements PaymentStrategy {
      public process(): string {
        return 'Processing Test Payment';
      }
    }

    // 2. Register it
    paymentFactory.register('test', TestPayment);

    // 3. Create it
    const payment = paymentFactory.createPayment('test');
    expect(payment).toBeInstanceOf(TestPayment);
    expect(payment.process()).toBe('Processing Test Payment');
  });

  it('should not be possible to create a new factory instance via constructor', () => {
    // This tests that the constructor is private. The following line would show a
    // compile-time error in a TS environment, and we test the runtime behavior.
    expect(() => new (PaymentFactory as any)()).toThrow();
  });
});