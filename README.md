# mapizzaioli

Calculadora de masa para pizza, alojada en GitHub Pages.

Ingresás **harina**, **% de hidratación**, **horas de fermentación** y
**temperatura**, y el sitio calcula la receta completa (levadura fresca/seca,
sal, agua, aceite) con su **biga de 24 horas**, lista para **imprimir o guardar
como PDF** desde el navegador.

## Fórmula

Transpuesta 1:1 desde `Calculo Levadura.xlsx` (Hoja1), en
[`src/lib/dough.ts`](src/lib/dough.ts):

- Levadura fresca = `(harina × 23 ÷ hidratación) ÷ horas ÷ temperatura`
- Levadura seca = fresca × 0.33
- Sal = harina × 25 / 1000
- Agua = hidratación × harina / 100
- Aceite = harina × 0.02
- Biga (24 h): 75% de la harina, hidratación 50%, mitad de la levadura

## Comandos

```bash
npm install      # instala dependencias
npm run dev      # servidor local de desarrollo
npm run build    # build de producción (salida en dist/)
npm run preview  # preview del build
```

## Despliegue

Publicado en **https://pabloberthold.github.io/mapizzaioli/** mediante GitHub
Actions (`.github/workflows/deploy.yml`). Push a `main` → build + deploy
automático.

> Config de `site`/`base` en `astro.config.mjs`. Si el repo cambia de nombre o
> se publica como repo raíz de usuario, ajustar `base` (ver `standards/astro.md`
> del AI Workspace).

## Estructura

```
src/
├── content/recipes/     ← 22 recetas (schema en src/content.config.ts, discriminatedUnion masa/express)
├── content.config.ts    ← schema Zod (Astro 5) con validación exclusiva calculator|ingredients
├── lib/dough.ts         ← motor masa (Excel 1:1) con guard throw si inválido
├── lib/express.ts       ← motor express
├── lib/seo.ts           ← JSON-LD Recipe (usa formatGrams es-AR)
├── lib/slider.ts        ← helpers sliders
├── components/          ← Calculator, ExpressCalculator, StaticRecipe (sliders ember/oro, panel oscuro)
├── layouts/             ← Layout base (header, skip-link, SEO og:image con base)
├── pages/
│   ├── index.astro      ← featured con branch masa/express + image
│   ├── recetas/         ← listado agrupado + [slug] por engine
│   └── popurri/         ← 11.765 recetas (index + [categoria] con búsqueda y modal)
├── data/popurri/        ← recipes/*.json + index.json + manifest.ts (generado por import:popurri)
├── styles/              ← tokens.css (--color-calc-*), global.css, popurri.css, calculator-shared
└── public/              ← fondo1.jpeg (63kB), pizza-napolitana-horno.jpg, favicon.svg, og-default.png (1200×630)
```

### Agregar una receta

Crear un archivo en `src/content/recipes/` con el frontmatter del schema
(`src/content.config.ts`). La nueva receta aparece automáticamente en
`/recetas/` y en `/recetas/<slug>/`, sin tocar código.

```bash
npm run import:popurri # reimportar desde ~/GITLAB/chata (CHATA_ROOT=/otra/ruta)
```

## Stack

Astro 5 (SSG), `@astrojs/sitemap`, JS vanilla para la interactividad (sin
framework de UI), impresión vía `window.print()` + `@media print`.

Proyecto creado con el [AI Workspace](https://github.com/) como orquestador
(workflow `new-project`).
