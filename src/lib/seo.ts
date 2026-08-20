// src/lib/seo.ts
// Generación de JSON-LD (Schema.org Recipe) para SEO — agents/seo.md.

import type { CollectionEntry } from "astro:content";
import { computeDough, roundTo } from "./dough";

export function recipeJsonLd(recipe: CollectionEntry<"recipes">) {
  const d = recipe.data;
  const r = computeDough({
    flourGrams: d.flourGrams,
    hydrationPercent: d.hydrationPercent,
    fermentationHours: d.fermentationHours,
    fermentationTempC: d.fermentationTempC,
  });

  const g = (n: number) => `${roundTo(n, 1)} g`;

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: d.title,
    description: d.description,
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
    recipeInstructions: d.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };
}
