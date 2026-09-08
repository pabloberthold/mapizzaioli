// astro.config.pages.mjs
// Build dedicado para GitHub Pages: https://pabloberthold.github.io/mapizzaioli/
// Lo usa .github/workflows/deploy.yml vía `astro build --config astro.config.pages.mjs`.
// La config principal (astro.config.mjs) apunta al dominio propio.

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://pabloberthold.github.io",
  base: "/mapizzaioli/",
  trailingSlash: "always",
  compressHTML: true,
  integrations: [sitemap()],
});
