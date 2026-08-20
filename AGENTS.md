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
npm run build    # build producción → dist/
npm run preview  # preview del build
```

## Gotchas clave
- **`base: "/mapizzaioli/"`** en `astro.config.mjs` (repo de proyecto, no root). Todo asset/link interno debe usar `import.meta.env.BASE_URL` o rutas relativas — NO rutas absolutas con `/` a secas (rompen en GitHub Pages). El dev server sirve bajo `/mapizzaioli/`, no `/`.
- `site` = `https://pabloberthold.github.io` (username de git config). Si cambia repo/usuario, ajustar `site`+`base` y `public/robots.txt`.
- **Fórmulas en `src/lib/dough.ts`**, transpuestas 1:1 desde `Calculo Levadura.xlsx`. La de levadura fresca (`(harina*23/hidratación)/horas/temp`) es heurística y divide por cero si hidratación/horas/temp ≤ 0 — la UI valida con `isValidDoughInputs`.
- Formato de números: `formatGrams()` usa locale `es-AR` (coma decimal).

## Estructura / convenciones
- Recetas = content collection en `src/content/recipes/` (schema en `src/content/config.ts`). **Agregar receta = crear `.md` nuevo**, aparece sola en `/recetas/` y `/recetas/<slug>/` sin tocar código.
- Dos tipos de receta en el schema (campo opcional, no exclusivo):
  - `calculator` → interactiva. `engine: "masa"` (biga, 4 inputs, usa `src/lib/dough.ts`) o `engine: "express"` (2 inputs harina/tiempo, usa `src/lib/express.ts`).
  - `ingredients` (lista `{name, amount}`) → estática (sin calculadora, ej. pan de máquina, chucrut).
- Componentes por tipo: `Calculator.astro` (masa), `ExpressCalculator.astro` (express), `StaticRecipe.astro` (estática). `[slug].astro` elige según el schema.
- Tokens de diseño en `src/styles/tokens.css` (vendoreados del AI Workspace + paleta marca IT/DE). Todo color/espaciado vía `var(--token)` — nada literal en componentes.
- Páginas kebab-case, componentes PascalCase, lib camelCase (ver standards del AI Workspace).
- Deploy automático: push a `main` → `.github/workflows/deploy.yml`.

## Publicación (pendiente)
Sin repo remoto aún y sin commit inicial. Próximos pasos: crear repo `mapizzaioli` en GitHub, `git add . && git commit`, push a `main`, habilitar Pages (Source: GitHub Actions).
