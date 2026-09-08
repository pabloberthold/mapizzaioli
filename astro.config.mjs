// astro.config.mjs
// Producción: https://mapizzaioli.shcdigital.net.ar/ (Worker con static assets + Workers Builds).
// GitHub Pages se mantiene con astro.config.pages.mjs (base /mapizzaioli/).
// Ver standards/astro.md del AI Workspace (site/base según tipo de repo).

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://mapizzaioli.shcdigital.net.ar",
  base: "/",
  trailingSlash: "always",
  // Default de Astro 7 es "jsx" (puede colapsar espacios entre inline elems);
  // se fija el comportamiento legado hasta auditar espacios visualmente.
  compressHTML: true,
  integrations: [sitemap()],
});
