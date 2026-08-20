// src/lib/dough.ts
// Motor de cálculo de la masa. Fórmulas transpuestas 1:1 desde
// "Calculo Levadura.xlsx" (Hoja1). Celdas originales documentadas por función.

export interface DoughInputs {
  flourGrams: number; // B5 — Gr. Harina
  hydrationPercent: number; // C5 — % Hidratación
  fermentationHours: number; // B7 — Hs. Fermentación
  fermentationTempC: number; // C7 — Temp. De Fermentación
}

export interface DoughConstants {
  yeastConstant: number; // 23 en C8
  saltPerMille: number; // 25 en C10 (gramos de sal por 1000 g de harina)
  dryYeastRatio: number; // 0.33 en C9 (levadura seca = fresca * 1/3)
  oilRatio: number; // 0.02 en C24 (aceite = 2% de la harina)
  bigaFlourRatio: number; // 0.75 en C16 (75% de la harina va a la biga)
  bigaWaterRatio: number; // 0.5 en C17 (hidratación de la biga)
  bigaYeastShare: number; // 0.5 en C18/C19 (mitad de la levadura va a la biga)
}

export const DEFAULT_CONSTANTS: DoughConstants = {
  yeastConstant: 23,
  saltPerMille: 25,
  dryYeastRatio: 0.33,
  oilRatio: 0.02,
  bigaFlourRatio: 0.75,
  bigaWaterRatio: 0.5,
  bigaYeastShare: 0.5,
};

export interface BigaPart {
  flour: number;
  water: number;
  freshYeast: number;
  dryYeast: number;
}

export interface RestPart {
  flour: number;
  water: number;
  salt: number;
  oil: number;
}

export interface DoughResult {
  freshYeast: number;
  dryYeast: number;
  salt: number;
  water: number;
  oil: number;
  biga: BigaPart;
  rest: RestPart;
  total: number;
}

export function computeDough(
  inputs: DoughInputs,
  constants: DoughConstants = DEFAULT_CONSTANTS,
): DoughResult {
  const { flourGrams, hydrationPercent, fermentationHours, fermentationTempC } =
    inputs;

  // C8 — Gr. de Levadura Fresca = (((B5*23)/C5)/B7)/C7
  const freshYeast =
    ((flourGrams * constants.yeastConstant) / hydrationPercent) /
    fermentationHours /
    fermentationTempC;
  // C9 — Levadura Seca = C8 * 0.33
  const dryYeast = freshYeast * constants.dryYeastRatio;
  // C10 — Sal = (B5 * 25) / 1000
  const salt = (flourGrams * constants.saltPerMille) / 1000;
  // C11 — Agua = (C5 * B5) / 100
  const water = (hydrationPercent * flourGrams) / 100;
  // C24 — Aceite = B5 * 0.02
  const oil = flourGrams * constants.oilRatio;

  // Biga (prefermento de 24 h)
  const bigaFlour = flourGrams * constants.bigaFlourRatio; // C16
  const bigaWater = bigaFlour * constants.bigaWaterRatio; // C17
  const bigaFreshYeast = freshYeast * constants.bigaYeastShare; // C18
  const bigaDryYeast = dryYeast * constants.bigaYeastShare; // C19

  // Resto que se incorpora después de 24 h
  const restFlour = flourGrams - bigaFlour; // C21
  const restWater = water - bigaWater; // C22
  const restSalt = salt; // C23
  const restOil = oil; // C24

  const total = flourGrams + water + salt + oil + freshYeast;

  return {
    freshYeast,
    dryYeast,
    salt,
    water,
    oil,
    biga: {
      flour: bigaFlour,
      water: bigaWater,
      freshYeast: bigaFreshYeast,
      dryYeast: bigaDryYeast,
    },
    rest: {
      flour: restFlour,
      water: restWater,
      salt: restSalt,
      oil: restOil,
    },
    total,
  };
}

export function isValidDoughInputs(inputs: DoughInputs): boolean {
  return (
    inputs.flourGrams > 0 &&
    inputs.hydrationPercent > 0 &&
    inputs.fermentationHours > 0 &&
    inputs.fermentationTempC > 0
  );
}

export function roundTo(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatGrams(value: number, decimals = 1): string {
  return roundTo(value, decimals).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}
