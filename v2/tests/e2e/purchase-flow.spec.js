import { test, expect } from "@playwright/test";

test("completa una compra de combustible", async ({ page }) => {
  await page.goto("/");
  await page.selectOption("#fuel-type", "95");
  await page.fill("#liters", "20");
  await page.click("#calculate");
  await expect(page.locator("#total")).toHaveText(/30,00 €/);
  await page.click("#pay-button");
  await expect(page.locator(".modal-success")).toBeVisible();
});