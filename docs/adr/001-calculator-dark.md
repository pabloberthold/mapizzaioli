# ADR 001: Calculadora con panel oscuro cálido

**Fecha:** 2026-08-21 · **Estado:** Aceptado

**Contexto:** La revisión AI Workspace detectó `--calc-*` literales fuera de tokens y `data-theme` nunca activado. Se decidió un panel `calculator--dark` siempre oscuro para sliders ember/oro.

**Decisión:** Panel oscuro con tokens `--color-calc-*` en `tokens.css`, thumb 24px, track con `--fill`. Print fuerza claro.

**Consecuencias:** Cumple `standards/css.md` (tokens) y WCAG 2.5.8. Requiere `CalculatorShell.astro` para DRY total (pendiente).
