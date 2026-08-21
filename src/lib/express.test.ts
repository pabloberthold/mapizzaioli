import { describe, it, expect } from "vitest";
import { computeExpress, isValidExpressInputs, formatPizcas } from "./express";

describe("express.ts", () => {
  it("isValid", () => {
    expect(isValidExpressInputs({ flourGrams: 250, restMinutes: 10 })).toBe(true);
    expect(isValidExpressInputs({ flourGrams: 0, restMinutes: 10 })).toBe(false);
  });
  it("escala con harina", () => {
    const r250 = computeExpress({ flourGrams: 250, restMinutes: 10 });
    const r500 = computeExpress({ flourGrams: 500, restMinutes: 10 });
    expect(r500.flourGrams).toBe(500);
    expect(r500.pizzas).toBeCloseTo(2, 1);
    expect(r500.water).toBe(r250.water * 2);
  });
  it("más tiempo → menos levadura", () => {
    const r10 = computeExpress({ flourGrams: 250, restMinutes: 10 });
    const r60 = computeExpress({ flourGrams: 250, restMinutes: 60 });
    expect(r60.freshYeast).toBeLessThan(r10.freshYeast);
  });
  it("formatPizcas", () => {
    expect(formatPizcas(1)).toBe("1 pizca");
    expect(formatPizcas(2)).toBe("2 pizcas");
  });
});
