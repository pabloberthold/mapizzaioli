# Changelog

Todas las notas relevantes de este proyecto. Formato basado en
[Keep a Changelog](https://keepachangelog.com/) y versionado SemVer.

## [0.2.0] - 2026-08-21

### Agregado

- Calculadora con **sliders** (harina, hidratación, fermentación, temperatura) y
  panel oscuro cálido (ember/oro) — estilo landing de referencia — manteniendo
  `dough.ts` 1:1 con el Excel.
- **Tamaño de bola**: cantidad de bolas + peso por bola como `masa total ÷ bolas`
  (suma de ingredientes), con opción de harina directa (ej. 500 g).
- `ExpressCalculator` con mismo estilo slider para `pizza-del-pablo-express`
  (usa `express.ts` intacto).
- Sección **Popurrí**: 11.765 recetas de Cocineros Argentinos, 30 categorías,
  búsqueda global/local, paginación, modal, import `scripts/import-popurri.mjs`
  (`CHATA_ROOT`), `src/data/popurri/manifest.ts`.
- **Capítulos** por `category` (`italiana`, `alemana`, `argentina`, `otras`) con
  `CategoryFlag` y 22 recetas (12 alemanas, 5 italianas, etc.).
- **Diseño**: textura harina, Fraunces itálica, tabular-nums, sello de forno,
  fondo `fondo1.jpeg` optimizado (670→63kB, scroll en móvil), `src/styles/tokens.css`
  con `--color-calc-*`.
- **Contenido**: procedimiento de `masa-para-pizza` estilo pizzaiolo con biga
  opcional, imagen CC BY 2.0 de pizza napolitana, wordmark `ma'pizzaioli`.

### Corregido

- `og:image` ahora incluye `base` y `public/og-default.png` (1200×630) — previews sociales.
- `data-print-meta` con `id="print-meta"` para que la impresión refleje sliders.
- Thumb de sliders 22→24px, `margin-top -8px`, sin borde/padding fantasma.
- `alt` fallback a `title`, `h1` duplicado → `.print-title`, `aria-valuetext` en sliders.
- `Skip-link`, `nav` con `flex-wrap`, `fetch` con `try/catch` en Popurrí, validación `open`.
- `astro.config.mjs` `trailingSlash: "always"`, `tsconfig.json` `include src`, `content.config.ts`
  con `discriminatedUnion` y `refine` exclusivo, `dough.ts`/`express.ts` con `throw` si inválido.
- `seo.ts` usa `formatGrams` (coma `es-AR`) y `og:locale`/`og:image` metas.

## [0.1.0] - 2026-08-20

### Agregado

- Calculadora de masa para pizza con fórmula transpuesta desde
  `Calculo Levadura.xlsx` (levadura fresca/seca, sal, agua, aceite y biga).
- Entradas: harina, % hidratación, horas y temperatura de fermentación.
- Resultados en vivo (JS vanilla) + impresión/guardado en PDF (`window.print`).
- Content collection de recetas + ruta dinámica `/recetas/[slug]`.
- Primera receta: "Masa para pizza".
- Diseño con tokens de marca (fusión de colores IT/DE), SEO (JSON-LD Recipe,
  sitemap, robots.txt) y pipeline de deploy a GitHub Pages.
