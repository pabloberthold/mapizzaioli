# ADR 002: Assets y Brotli

**Fecha:** 2026-08-21 · **Estado:** Aceptado (parcial)

**Contexto:** `fondo1.jpeg` 670→63kB, `og-default.png` 22kB. Migración a `astro:assets` requiere `image()` en content collections (breaking). Se preparan `src/assets/` y `scripts/compress-popurri.mjs` para ciclo 4.

**Decisión:** Mantener `public/` como fallback + `src/assets/` como fuente optimizada. Brotli se ejecuta postbuild en CI (ver `deploy.yml`).

**Consecuencias:** LCP <1.5s, `dist/_astro/*.json.gz` en deploy, sin breaking en recetas.
