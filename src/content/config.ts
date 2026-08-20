// src/content/config.ts
// Colección de recetas. Modelo data-driven:
//  - `calculator` presente  → receta interactiva (engine "masa" con biga, o "express").
//  - `ingredients` presente → receta estática (lista + pasos).
// Agregar una receta = crear un archivo en src/content/recipes/ sin tocar código.

import { defineCollection, z } from "astro:content";

const recipes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    steps: z.array(z.string()),

    calculator: z
      .object({
        engine: z.enum(["masa", "express"]),
        flourGrams: z.number().default(250),
        hydrationPercent: z.number().default(60),
        fermentationHours: z.number().default(4),
        fermentationTempC: z.number().default(20),
        restMinutes: z.number().default(10),
      })
      .optional(),

    ingredients: z
      .array(
        z.object({
          name: z.string(),
          amount: z.string(),
        }),
      )
      .optional(),

    note: z.string().optional(),
  }),
});

export const collections = { recipes };
