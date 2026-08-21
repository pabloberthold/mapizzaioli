// src/lib/seo.ts
// Generación de JSON-LD (Schema.org Recipe) para SEO — agents/seo.md.
// Ramifica según el tipo de receta: engine "masa", engine "express" o estática.

import type { CollectionEntry } from "astro:content";
import { computeDough, formatGrams, roundTo } from "./dough";
import { computeExpress } from "./express";

const g = (n: number) => `${formatGrams(n, 1)} g`;

export function recipeJsonLd(recipe: CollectionEntry<"recipes">) {
  const d = recipe.data;

  const base = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: d.title,
    description: d.description,
    recipeInstructions: d.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };

  if (d.calculator) {
    if (d.calculator.engine === "express") {
      const r = computeExpress({
        flourGrams: d.calculator.flourGrams,
        restMinutes: d.calculator.restMinutes,
      });
      return {
        ...base,
        recipeYield: `${r.pizzas} pizza(s)`,
        recipeIngredient: [
          g(r.flourGrams) + " de harina 0000",
          `${roundTo(r.freshYeast, 1)} g de levadura fresca`,
          `${r.water} ml de agua`,
          g(r.salt) + " de sal",
          `${r.sugarPizcas} pizca(s) de azúcar`,
          `${r.pepperPizcas} pizca(s) de pimienta`,
          `${r.oil} ml de aceite de oliva`,
          `${roundTo(r.milkPowder, 1)} g de leche en polvo (opcional)`,
          `${r.mozzarella} g de muzzarella`,
          `${r.tomato} ml de tomate triturado`,
          `${r.garlicLow}-${r.garlicHigh} dientes de ajo`,
          "Orégano a gusto",
        ],
      };
    }

    const r = computeDough({
      flourGrams: d.calculator.flourGrams,
      hydrationPercent: d.calculator.hydrationPercent,
      fermentationHours: d.calculator.fermentationHours,
      fermentationTempC: d.calculator.fermentationTempC,
    });
    return {
      ...base,
      recipeYield: `${roundTo(r.total, 1)} g`,
      recipeIngredient: [
        g(r.biga.flour) + " de harina (biga)",
        g(r.biga.water) + " de agua (biga)",
        `${roundTo(r.biga.freshYeast, 2)} g de levadura fresca (biga)`,
        g(r.rest.flour) + " de harina",
        g(r.rest.water) + " de agua",
        g(r.rest.salt) + " de sal",
        g(r.rest.oil) + " de aceite",
      ],
    };
  }

  return {
    ...base,
    recipeIngredient: (d.ingredients ?? []).map((i) => `${i.name} ${i.amount}`),
  };
}
