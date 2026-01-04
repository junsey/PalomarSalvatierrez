const COLOR_CLASSES: Record<string, string> = {
  rojo: "color-rojo",
  azul: "color-azul",
  amarillo: "color-amarillo",
  naranja: "color-naranja",
  violeta: "color-violeta",
  negro: "color-negro",
  verde: "color-verde",
  celeste: "color-celeste"
};

const normalizeColor = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const getColorClass = (value?: string) => {
  if (!value) return "color-neutral";
  const normalized = normalizeColor(value);
  const match = Object.keys(COLOR_CLASSES).find((key) =>
    normalized.includes(key)
  );
  return match ? COLOR_CLASSES[match] : "color-neutral";
};
