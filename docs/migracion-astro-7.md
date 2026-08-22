# Plan de migración: Astro 5 → 7

> Estado: propuesta · Fecha: 2026-08-21 · Origen: auditoría de seguridad
> (3 CVEs, sin parche en la rama 5.x — la única remediación es `astro@7.2.x`).

## Contexto

`npm audit` reporta vulnerabilidades en `astro <=7.0.9`, `sharp <0.35` y
`esbuild 0.27.3–0.28.0`. No existe versión parchada de Astro 5, por lo que la
remediación pasa por el salto mayor. La buena noticia: este repo usa una
superficie mínima de Astro (SSG puro, JS vanilla, sin SSR/adapters/islas), y el
build baseline es limpio (55 páginas, 1.3s).

**Estrategia**: dos etapas encadenadas (5→6, luego 6→7), un PR por etapa.
La etapa 6 concentra **todo** el cambio de código real; la etapa 7 es casi solo
el bump de versión. Validar el intermedio reduce la superficie de debugging.

## Inventario de impacto (auditado contra este repo)

| Área | Uso actual | Impacto | Etapa |
|---|---|---|---|
| Content collections legacy (`type: "content"`, `entry.slug`) | `src/content.config.ts`, `recetas/[slug].astro:13`, `recetas/index.astro:58` | 🔴 Removido en v6 — migrar a Content Layer | A |
| Node en CI | `node-version: 20` en `deploy.yml` | 🔴 v6 exige ≥ 22.12 | A |
| `z` importado de `astro:content` | `content.config.ts:2` | 🟡 Deprecado en v6 → importar de `astro/zod` | A |
| Zod 3 → 4 (incluido con Astro) | schema simple, `discriminatedUnion`, `refine` | 🟢 Compatible (no usa `.email()`/`.url()` ni `{ message }` removido) | — |
| `compressHTML` default `true` → `'jsx'` | texto español con inline elems | 🟡 Fijar `compressHTML: true` explícito para conservar espacios | B |
| Compilador Rust: tags sin cerrar ahora **error** | componentes .astro | 🟡 Lo detecta el build; corregir si aparece | B |
| Markdown processor nuevo (Sätteri) | bodies `.md` **nunca se renderizan** (steps son frontmatter) | 🟢 Sin impacto | — |
| Vitest | config propia, sin `getViteConfig()` | 🟢 Sin impacto | — |
| Vite 8 (v7) | sin plugins custom ni integraciones de Vite | 🟢 Sin impacto | — |
| `@astrojs/sitemap` | `^3.2.1` | 🟢 Bump a `3.7.x` (sin peer dep estricto) | A |
| `ViewTransitions`, `astro:db`, flags experimentales, `astro:transitions` internals, adapters, actions, i18n | no usados | 🟢 Sin impacto | — |
| `getStaticPaths` params numéricos | todos string | 🟢 Sin impacto | — |
| `@fontsource/*`, imports `?url` de JSON | assets/CSS puros | 🟢 Sin impacto | — |

Nota: local ya cumple el requisito de Node (**v22.23.1** instalado ≥ 22.12).
Solo hay que subir la versión en CI.

## Etapa 0 — Preparación (~15 min)

```bash
git checkout -b chore/astro-7-migration
npm test && npm run build && npx playwright test   # baseline verde
cp dist/sitemap-0.xml /tmp/sitemap-baseline.xml    # para comparar URLs al final
```

Smoke manual de referencia (mismas páginas se re-verifican en cada etapa):

1. `/` — featured + JSON-LD
2. `/recetas/` — listado agrupado por categoría
3. Una receta `masa` (calculadora 4 inputs + biga), una `express`, una estática
4. `/popurri/` — búsqueda global + modal
5. `/popurri/apto-celiaco/?open=0` — deep-link expande receta

## Etapa A — Astro 6 (~45 min)

**Cambios de código (los únicos de toda la migración):**

1. `.github/workflows/deploy.yml`: `node-version: 20` → `22`
2. Dependencias:

   ```bash
   npm install astro@^6 @astrojs/sitemap@latest
   ```

3. `src/content.config.ts` — colección a Content Layer:

   ```ts
   import { defineCollection } from "astro:content";
   import { glob } from "astro/loaders";
   // z se importa de "astro/zod" (deprecado como re-export en astro:content)

   const recipes = defineCollection({
     loader: glob({ pattern: "**/*.md", base: "./src/content/recipes" }),
     schema: /* ...schema existente, sin cambios... */,
   });
   ```

4. `entry.slug` → `entry.id` (2 lugares):
   - `src/pages/recetas/[slug].astro:13` — `params: { slug: entry.id }`
   - `src/pages/recetas/index.astro:58` — `href={\`${base}recetas/${entry.id}/\`}`

   Con `glob()`, `entry.id` = nombre de archivo sin extensión = mismo valor que
   tenía `slug` → **las URLs no cambian**.

**Validación:** `npm test`, `npm run build` (55 páginas), `npx playwright test`,
diff de `dist/sitemap-0.xml` contra baseline, smoke manual completo.

**Commit:** `feat!: migrate to Astro 6 (content layer)`

## Etapa B — Astro 7 (~30 min)

1. ```bash
   npm install astro@^7.2.4
   ```
2. `astro.config.mjs` — fijar compresión legado (evita perder espacios entre
   elementos inline del texto en español; revisar default `'jsx'` más adelante):

   ```js
   export default defineConfig({
     site: "https://pabloberthold.github.io",
     base: "/mapizzaioli/",
     trailingSlash: "always",
     compressHTML: true,
     integrations: [sitemap()],
   });
   ```

3. Si el build errora por tags sin cerrar o nesting inválido (compilador Rust),
   corregir los componentes señalados.
4. Misma batería de validación que la etapa A.
5. Opcional post-validación visual: probar quitar `compressHTML: true` y
   auditar espacios inline; si todo bien, adoptar el nuevo default.

**Commit:** `feat!: migrate to Astro 7.2`

## Criterios de aceptación

- [ ] `npm audit` sin vulnerabilidades (high incluidas; sharp/esbuild suben transitivamente)
- [ ] `npm test` + `npx playwright test` verdes
- [ ] Build genera las mismas 55 páginas y `sitemap-0.xml` idéntico al baseline
- [ ] Smoke manual: calculadoras (masa/express), popurri (búsqueda, modal, `?open=`) OK
- [ ] Deploy verde y sitio online verificado en producción

## Rollback

Cada etapa es un PR independiente sobre `main`; `git revert` del merge
redeploya automáticamente la versión anterior vía GitHub Actions. El sitio no
queda expuesto a rotura sostenida.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Pérdida de espacios inline por `compressHTML: 'jsx'` | Media | Fijar `compressHTML: true` en etapa B |
| Componente con tag sin cerrar → build error | Baja | Falla loud-and-clear en build; corrección trivial |
| `entry.id` difiere de `slug` → URLs rotas | Baja | Comparar sitemap contra baseline (criterio de aceptación) |
| Zod 4 endurece validación de algún campo | Baja | Schema simple; los 22 `.md` actuales ya pasan en build |
| Playwright flaky por cambios de DOM cosméticos | Baja | Baseline previo; ajustar selectores si aplica |

---

Fuentes: guías oficiales de upgrade de Astro
([v6](https://docs.astro.build/en/guides/upgrade-to/v6/),
[v7](https://docs.astro.build/en/guides/upgrade-to/v7/)) cruzadas contra el uso
real del repo.
