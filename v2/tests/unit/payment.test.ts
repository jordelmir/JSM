
import { describe, it, expect } from 'vitest';
import { PaymentFactory } from '../../src/core/payment';

describe('PaymentFactory', () => {
  it('should create a CashPayment instance', () => {
    const payment = PaymentFactory.createPayment('cash');
    expect(payment.process()).toBe('Processing Cash Payment');
  });

  it('should create a CardPayment instance', () => {
    const payment = PaymentFactory.createPayment('card');
    expect(payment.process()).toBe('Processing Card Payment');
  });

  it('should throw an error for an unknown payment type', () => {
    expect(() => PaymentFactory.createPayment('unknown' as any)).toThrow('Unknown payment type');
  });
});
