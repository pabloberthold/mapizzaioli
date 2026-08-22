// astro.config.mjs
// Publicado como proyecto en GitHub Pages:
//   https://pabloberthold.github.io/mapizzaioli/
// Ver standards/astro.md del AI Workspace (site/base según tipo de repo).

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://pabloberthold.github.io",
  base: "/mapizzaioli/",
  trailingSlash: "always",
  // Default de Astro 7 es "jsx" (puede colapsar espacios entre inline elems);
  // se fija el comportamiento legado hasta auditar espacios visualmente.
  compressHTML: true,
  integrations: [sitemap()],
});
