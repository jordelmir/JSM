// tests/unit/calculator.test.js
import { describe, it, expect } from "vitest";
import { FuelCalculator } from "../../src/core/calculator";

describe("FuelCalculator", () => {
  it("calcula el total correctamente", () => {
    expect(FuelCalculator.calculateTotal(10, 1.5)).toBe(15);
  });

  it("formatea moneda en EUR", () => {
    expect(FuelCalculator.formatCurrency(15)).toBe("15,00 €");
  });

  it("lanza error con valores negativos", () => {
    expect(() => FuelCalculator.calculateTotal(-5, 1.5)).toThrow();
  });
});