// src/lib/popurri.ts
// Helpers de cliente para la sección Popurrí (búsqueda y render de recetas).
// Solo lógica de presentación sobre los JSON importados de Cocineros Argentinos.

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface PopurriRecipe {
  i: number;
  title: string;
  url: string;
  text: string;
}

// Renderiza el cuerpo de una receta (sin el título) como HTML seguro.
export function renderRecipeText(r: PopurriRecipe): string {
  const SECTIONS = /^(INGREDIENTES|PREPARACIÓN|PREPARACION|RESULTADO|MASA|RELLENO|ARMADO|DECORACIÓN|DECORACION|COCCIÓN|COCCION|UNIÓN A LA MASA|PASOS|PROCEDIMIENTO|ELABORACIÓN|ELABORACION)$/i;
  const lines = r.text.split("\n").map((l) => l.trimEnd());
  let html = "";
  let list = "";
  let stepsOpen = false;
  const flushList = () => {
    if (list) {
      html += `<ul class="popurri-ul">${list}</ul>`;
      list = "";
    }
  };
  const flushSteps = () => {
    if (stepsOpen) {
      html += "</ol>";
      stepsOpen = false;
    }
  };

  for (const raw of lines) {
    const t = raw.trim();
    if (!t) continue;
    if (/^porciones:/i.test(t)) {
      flushList();
      flushSteps();
      html += `<p class="popurri-meta">${esc(t.replace(/^porciones:\s*/i, ""))}</p>`;
      continue;
    }
    if (SECTIONS.test(t)) {
      flushList();
      flushSteps();
      html += `<h4>${esc(t)}</h4>`;
      continue;
    }
    if (/^[-•]\s*/.test(t)) {
      flushSteps();
      list += `<li>${esc(t.replace(/^[-•]\s*/, ""))}</li>`;
      continue;
    }
    if (/^\d+[.)]\s*/.test(t)) {
      flushList();
      if (!stepsOpen) {
        html += '<ol class="popurri-ol">';
        stepsOpen = true;
      }
      html += `<li>${esc(t.replace(/^\d+[.)]\s*/, ""))}</li>`;
      continue;
    }
    if (/^paso\s*\d+/i.test(t)) {
      flushList();
      if (!stepsOpen) {
        html += '<ol class="popurri-ol">';
        stepsOpen = true;
      }
      html += `<li>${esc(t.replace(/^paso\s*\d+\s*[.:]?\s*/i, ""))}</li>`;
      continue;
    }
    flushSteps();
    flushList();
    html += `<p>${esc(t)}</p>`;
  }
  flushList();
  flushSteps();
  return html;
}