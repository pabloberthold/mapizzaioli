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
├── content/recipes/     ← recetas (una por archivo .md, schema en content/config.ts)
├── lib/dough.ts         ← motor de cálculo (fórmulas del Excel)
├── lib/seo.ts           ← JSON-LD de receta
├── components/          ← Calculator, RecipeCard
├── layouts/             ← Layout base (header/footer/SEO)
├── pages/
│   ├── index.astro      ← calculadora destacada
│   └── recetas/         ← listado + detalle dinámico por slug
└── styles/              ← tokens + global.css
```

### Agregar una receta

Crear un archivo en `src/content/recipes/` con el frontmatter del schema
(`src/content/config.ts`). La nueva receta aparece automáticamente en
`/recetas/` y en `/recetas/<slug>/`, sin tocar código.

## Stack

Astro 5 (SSG), `@astrojs/sitemap`, JS vanilla para la interactividad (sin
framework de UI), impresión vía `window.print()` + `@media print`.

Proyecto creado con el [AI Workspace](https://github.com/) como orquestador
(workflow `new-project`).
