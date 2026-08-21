// src/lib/slider.ts — helpers compartidos para sliders ember/oro
export function syncSlider(
  id: string,
  min: number,
  max: number,
  valId: string,
  dec: number,
  getEl: (id: string) => HTMLElement | null,
) {
  const node = getEl(id) as HTMLInputElement | null;
  if (!node) return;
  const v = Number(node.value);
  node.style.setProperty("--fill", `${((v - min) / (max - min)) * 100}%`);
  const out = getEl(valId);
  if (out) out.textContent = v.toFixed(dec).replace(".", ",");
}
