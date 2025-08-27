export class FuelCalculator {
  static calculateTotal(liters, pricePerLiter) {
    if (liters <= 0 || pricePerLiter <= 0) throw new Error("Valores inválidos");
    return Number((liters * pricePerLiter).toFixed(2));
  }

  static formatCurrency(amount, locale = "es-ES") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }
}