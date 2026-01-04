export const isValidUrl = (value?: string) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return Boolean(url.protocol === "http:" || url.protocol === "https:");
  } catch {
    return false;
  }
};

export const createFallbackNumero = (nombre: string, index: number) => {
  const base = nombre
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "paloma"}-${index + 1}`;
};
