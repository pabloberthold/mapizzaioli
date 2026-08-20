// src/lib/express.ts
// Motor de la receta "express": los ingredientes escalan proporcionalmente con la
// harina; el tiempo de reposo ajusta la levadura (inversa) y la hidratación (sutil).

import { roundTo } from "./dough";

const BASE_FLOUR = 250; // g — equivale a 1 pizza de muzza
const BASE_YEAST = 20; // g de levadura fresca (recetario: 20-25)
const BASE_WATER_RATIO = 0.8; // 200 ml por 250 g
const BASE_SALT = 5; // 1 cdita
const BASE_OIL = 10; // ml — 1 chorrito
const BASE_MILK = 10; // g — 1 cucharada de leche en polvo (opcional)
const BASE_MOZZARELLA = 350; // g
const BASE_TOMATO = 175; // ml — 150/200 aprox
const BASE_GARLIC_LOW = 2; // dientes
const BASE_GARLIC_HIGH = 3; // dientes

export interface ExpressInputs {
  flourGrams: number;
  restMinutes: number;
}

export interface ExpressResult {
  flourGrams: number;
  restMinutes: number;
  hydrationPercent: number;
  freshYeast: number; // g
  water: number; // ml
  salt: number; // g
  oil: number; // ml
  milkPowder: number; // g
  sugarPizcas: number;
  pepperPizcas: number;
  mozzarella: number; // g
  tomato: number; // ml
  garlicLow: number; // dientes
  garlicHigh: number; // dientes
  pizzas: number; // rendimiento
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function computeExpress(inputs: ExpressInputs): ExpressResult {
  const { flourGrams, restMinutes } = inputs;
  const factor = flourGrams / BASE_FLOUR;
  const t = Math.max(restMinutes, 5);

  // Más tiempo → menos levadura (raíz inversa; referencia 20 g a 10 min).
  const freshYeast = BASE_YEAST * Math.sqrt(10 / t) * factor;

  // Más tiempo → hidratación levemente menor (masa más manejable).
  const hydrationPercent = 80 - 4 * clamp((t - 10) / 110, 0, 1);
  const water = (hydrationPercent / 100) * flourGrams;

  return {
    flourGrams,
    restMinutes,
    hydrationPercent: roundTo(hydrationPercent, 1),
    freshYeast: roundTo(freshYeast, 1),
    water: Math.round(water),
    salt: roundTo(BASE_SALT * factor, 1),
    oil: Math.round(BASE_OIL * factor),
    milkPowder: roundTo(BASE_MILK * factor, 1),
    sugarPizcas: Math.max(1, Math.round(factor)),
    pepperPizcas: Math.max(1, Math.round(factor)),
    mozzarella: Math.round(BASE_MOZZARELLA * factor),
    tomato: Math.round(BASE_TOMATO * factor),
    garlicLow: Math.max(1, Math.round(BASE_GARLIC_LOW * factor)),
    garlicHigh: Math.max(1, Math.round(BASE_GARLIC_HIGH * factor)),
    pizzas: roundTo(factor, 1),
  };
}

export function isValidExpressInputs(inputs: ExpressInputs): boolean {
  return inputs.flourGrams > 0 && inputs.restMinutes > 0;
}

export function formatPizcas(value: number): string {
  return `${value} pizca${value === 1 ? "" : "s"}`;
}
