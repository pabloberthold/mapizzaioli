import { test, expect } from "@playwright/test";
test("calculadora masa actualiza peso por bola", async ({ page }) => {
  // baseURL incluye el base path (/mapizzaioli/); un path absoluto "/" lo
  // descarta al resolverse, por eso va la ruta completa.
  await page.goto("/mapizzaioli/");
  await expect(page.locator("#val-flour")).toBeVisible();
  await page.locator("#inp-flour").evaluate((el: HTMLInputElement, v) => { el.value = "500"; el.dispatchEvent(new Event("input", {bubbles:true})); }, 500);
  await expect(page.locator("#val-flour")).toContainText("500");
});

test("el procedimiento acompaña el check de biga", async ({ page }) => {
  await page.goto("/mapizzaioli/");
  const direct = page.locator("#steps-direct");
  const biga = page.locator("#steps-biga");

  // Por defecto la biga está activa: se ve su procedimiento.
  await expect(biga).toBeVisible();
  await expect(direct).toBeHidden();
  await expect(page.locator("#process-mode")).toHaveText("con biga");

  await page.locator("#inp-biga").uncheck();
  await expect(direct).toBeVisible();
  await expect(biga).toBeHidden();
  await expect(page.locator("#process-mode")).toHaveText("sin biga");
  await expect(page.locator("#results-biga-wrap")).toBeHidden();
  // Sin biga, el resultado directo igual lista harina y aceite.
  await expect(page.locator("#res-oil")).toBeVisible();
  await expect(page.locator("#res-flour")).toHaveText("1.000");

  await page.locator("#inp-biga").check();
  await expect(biga).toBeVisible();
  await expect(direct).toBeHidden();
});
