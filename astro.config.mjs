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
  integrations: [sitemap()],
});
