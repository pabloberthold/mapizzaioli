# Changelog

Todas las notas relevantes de este proyecto. Formato basado en
[Keep a Changelog](https://keepachangelog.com/) y versionado SemVer.

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
