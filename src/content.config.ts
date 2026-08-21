// src/content.config.ts — Astro 5 (reemplaza src/content/config.ts deprecado)
import { defineCollection, z } from "astro:content";

const recipes = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.enum(["italiana", "alemana", "argentina", "otras"]).default("otras"),
      order: z.number().default(0),
      steps: z.array(z.string().min(1)).min(1),

      calculator: z
        .discriminatedUnion("engine", [
          z.object({
            engine: z.literal("masa"),
            flourGrams: z.number().min(1).default(1000),
            hydrationPercent: z.number().min(1).max(100).default(60),
            fermentationHours: z.number().min(0.1).default(4),
            fermentationTempC: z.number().min(1).default(20),
          }),
          z.object({
            engine: z.literal("express"),
            flourGrams: z.number().min(1).default(250),
            restMinutes: z.number().min(1).default(10),
          }),
        ])
        .optional(),

      ingredients: z
        .array(
          z.object({
            name: z.string().min(1),
            amount: z.string().min(1),
          }),
        )
        .optional(),

      note: z.string().optional(),

      image: z
        .object({
          src: z.string().min(1).regex(/^[a-z0-9_\-./]+\.(jpg|jpeg|png|webp|svg)$/i, "Ruta de imagen inválida"),
          credit: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
    })
    .refine((data) => !!data.calculator !== !!data.ingredients, {
      message: "Debe tener exactamente uno de: calculator o ingredients",
      path: ["calculator"],
    }),
});

export const collections = { recipes };
