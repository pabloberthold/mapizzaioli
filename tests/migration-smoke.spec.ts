// Smoke funcional de migración (Astro 5 → 7): búsqueda/modal/deep-link de
// popurri y calculadora express. El base path va completo en cada goto:
// un path absoluto "/" se resuelve contra el origin y descarta /mapizzaioli/.
import { test, expect } from "@playwright/test";

test("popurri: búsqueda global muestra resultados y abre modal", async ({ page }) => {
  await page.goto("/mapizzaioli/popurri/");
  await page.fill("#popurri-global-search", "pizza");
  const first = page.locator(".popurri-global-results__item").first();
  await expect(first).toBeVisible();
  await first.click();
  await expect(page.locator(".popurri-modal")).toBeVisible();
  await expect(page.locator("#popurri-modal-title")).not.toBeEmpty();
});

test("popurri: deep-link ?open=0 expande la receta", async ({ page }) => {
  await page.goto("/mapizzaioli/popurri/apto-celiaco/?open=0");
  const body = page.locator(".popurri-card.open .popurri-card__body");
  await expect(body).toBeVisible();
  await expect(body.locator("a.popurri-ext").first()).toBeVisible();
});

test("calculadora express: slider de harina actualiza valor", async ({ page }) => {
  await page.goto("/mapizzaioli/recetas/pizza-del-pablo-express/");
  const val = page.locator("#val-flour");
  await expect(val).toBeVisible();
  await page.locator("#inp-flour").evaluate((el: HTMLInputElement) => {
    el.value = "800";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(val).toContainText("800");
});
