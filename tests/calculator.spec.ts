import { test, expect } from "@playwright/test";
test("calculadora masa actualiza peso por bola", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#val-flour")).toBeVisible();
  await page.locator("#inp-flour").evaluate((el: HTMLInputElement, v) => { el.value = "500"; el.dispatchEvent(new Event("input", {bubbles:true})); }, 500);
  await expect(page.locator("#val-flour")).toContainText("500");
});
