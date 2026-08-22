# AGENTS.md

Project intent: *mapizzaioli* — calculadora de masa para pizza (Astro, alojada en GitHub Pages).

## Stack
- Astro 5 (SSG estático) + `@astrojs/sitemap`. Interactividad con **JS vanilla** en `<script>` (sin framework de UI).
- Impresión/PDF vía `window.print()` + `@media print` (cero dependencias de PDF).
- Creado con el AI Workspace (`/home/pablo/GIT/ai-workspace/AGENTS.md`) como orquestador — workflow `new-project`.

## Comandos
```bash
npm install      # instalar
npm run dev      # dev server (localhost:4321/mapizzaioli/)
npm run build          # build producción → dist/
npm run preview        # preview del build
npm run import:popurri # reimportar recetas de Cocineros Argentinos desde ~/GITLAB/chata (CHATA_ROOT=/otra/ruta para otra fuente)
```

## Gotchas clave
- **`base: "/mapizzaioli/"`** en `astro.config.mjs` (repo de proyecto, no root). Todo asset/link interno debe usar `import.meta.env.BASE_URL` o rutas relativas — NO rutas absolutas con `/` a secas (rompen en GitHub Pages). El dev server sirve bajo `/mapizzaioli/`, no `/`.
- `site` = `https://pabloberthold.github.io` (username de git config). Si cambia repo/usuario, ajustar `site`+`base` y `public/robots.txt`.
- **Fórmulas en `src/lib/dough.ts`**, transpuestas 1:1 desde `Calculo Levadura.xlsx`. La de levadura fresca (`(harina*23/hidratación)/horas/temp`) es heurística y divide por cero si hidratación/horas/temp ≤ 0 — la UI valida con `isValidDoughInputs`.
- Formato de números: `formatGrams()` usa locale `es-AR` (coma decimal).
- **Astro 7.2+ daemoniza `astro preview`/`dev` cuando detecta un agente de IA** (env `CLAUDECODE` etc.): agrega `--background`/`--json` y el proceso npm muere al instante — rompe el `webServer` de Playwright y confunde con un crash. En terminal/CI normal corre foreground. Para probarlo desde un agente: `env -u CLAUDECODE npm run preview`.

## Estructura / convenciones
- Recetas = content collection en `src/content/recipes/` (schema en `src/content/config.ts`). **Agregar receta = crear `.md` nuevo**, aparece sola en `/recetas/` y `/recetas/<slug>/` sin tocar código.
- Dos tipos de receta en el schema (campo opcional, no exclusivo):
  - `calculator` → interactiva. `engine: "masa"` (biga, 4 inputs, usa `src/lib/dough.ts`) o `engine: "express"` (2 inputs harina/tiempo, usa `src/lib/express.ts`).
  - `ingredients` (lista `{name, amount}`) → estática (sin calculadora, ej. pan de máquina, chucrut).
- Campo `category` (`italiana` | `alemana` | `argentina` | `otras`, default `otras`): agrupa el listado `/recetas/` en capítulos.
- **Popurrí** (`/popurri/`): 11.765 recetas scrapeadas de Cocineros Argentinos, datos en `src/data/popurri/` (`recipes/<cat>.json` + `index.json` + `manifest.ts` autogenerados por `scripts/import-popurri.mjs`). Páginas `/popurri/` (grilla + búsqueda global) y `/popurri/<categoria>/` (búsqueda local + recetas expandibles). El JSON se sirve como asset (`?url`) y el DOM de recetas se inyecta desde JS, por eso los estilos van en `src/styles/popurri.css` **global** (no scope).
- Componentes por tipo: `Calculator.astro` (masa), `ExpressCalculator.astro` (express), `StaticRecipe.astro` (estática). `[slug].astro` elige según el schema; `/recetas/` agrupa por categoría.
- Tokens de diseño en `src/styles/tokens.css` (vendoreados del AI Workspace + paleta marca IT/DE). Todo color/espaciado vía `var(--token)` — nada literal en componentes.
- Páginas kebab-case, componentes PascalCase, lib camelCase (ver standards del AI Workspace).
- Deploy automático: push a `main` → `.github/workflows/deploy.yml`.

## Publicación
Repo `pabloberthold/mapizzaioli`, deploy automático a GitHub Pages desde `main`.
