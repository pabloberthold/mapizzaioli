import { describe, it, expect } from "vitest";
import { computeDough, isValidDoughInputs, formatGrams } from "./dough";

describe("dough.ts — fórmulas Excel 1:1", () => {
  it("isValid rechaza ceros", () => {
    expect(isValidDoughInputs({ flourGrams: 0, hydrationPercent: 65, fermentationHours: 24, fermentationTempC: 5 })).toBe(false);
    expect(isValidDoughInputs({ flourGrams: 1000, hydrationPercent: 0, fermentationHours: 24, fermentationTempC: 5 })).toBe(false);
  });

  it("computeDough valores dorados (1000g 65% 24h 5°C)", () => {
    const r = computeDough({ flourGrams: 1000, hydrationPercent: 65, fermentationHours: 24, fermentationTempC: 5 });
    expect(r.freshYeast).toBeCloseTo(2.95, 1);
    expect(r.salt).toBe(25);
    expect(r.water).toBe(650);
    expect(r.oil).toBe(20);
    expect(r.total).toBeCloseTo(1698, 0);
    expect(r.biga.flour).toBe(750);
    expect(r.biga.water).toBe(375);
  });

  it("formatGrams es-AR usa coma", () => {
    expect(formatGrams(250)).toBe("250");
    expect(formatGrams(2.95, 2)).toBe("2,95");
  });

  it("throw si inválido", () => {
    expect(() => computeDough({ flourGrams: 0, hydrationPercent: 65, fermentationHours: 24, fermentationTempC: 5 })).toThrow(RangeError);
  });
});
