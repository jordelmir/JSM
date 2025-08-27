
/**
 * @module core/payment
 * @description A module for handling payments.
 */

interface PaymentStrategy {
  process(): string;
}

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

export class PaymentFactory {
  public static createPayment(type: 'cash' | 'card'): PaymentStrategy {
    switch (type) {
      case 'cash':
        return new CashPayment();
      case 'card':
        return new CardPayment();
      default:
        throw new Error('Unknown payment type');
    }
  }
}
