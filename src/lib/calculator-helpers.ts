// src/lib/calculator-helpers.ts — helpers compartidos (DRY) para Calculator/Express
export const el = (id: string) => document.getElementById(id) as HTMLElement | null;
export const num = (id: string) => {
  const node = el(id) as HTMLInputElement | null;
  return node ? Number(node.value) : 0;
};
export const set = (id: string, text: string) => {
  const node = el(id);
  if (node) node.textContent = text;
};
