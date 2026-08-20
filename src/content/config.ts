// src/content/config.ts
// Colección de recetas. Cada receta comparte el motor de cálculo (src/lib/dough.ts)
// y solo define sus valores por defecto, descripción y pasos.
// Agregar una receta = crear un archivo en src/content/recipes/ sin tocar código.

import { defineCollection, z } from "astro:content";

const recipes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    flourGrams: z.number().default(1500),
    hydrationPercent: z.number().default(60),
    fermentationHours: z.number().default(4),
    fermentationTempC: z.number().default(20),
    steps: z.array(z.string()),
  }),
});

export const collections = { recipes };
