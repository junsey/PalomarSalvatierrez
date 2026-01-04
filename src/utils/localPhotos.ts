type PhotoMap = Record<string, string[]>;

const modules = import.meta.glob(
  "../assets/palomas/**/*.{png,jpg,jpeg,webp,avif,gif,svg}",
  { eager: true, import: "default" }
) as Record<string, string>;

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const localPhotosByName = Object.entries(modules).reduce<PhotoMap>(
  (acc, [path, url]) => {
    const match = path.match(/\/palomas\/([^/]+)\//);
    if (!match) return acc;
    const key = normalizeKey(match[1]);
    if (!acc[key]) acc[key] = [];
    acc[key].push(url);
    return acc;
  },
  {}
);

Object.values(localPhotosByName).forEach((list) => list.sort());

export const getLocalFotos = (nombre?: string) => {
  if (!nombre) return [];
  return localPhotosByName[normalizeKey(nombre)] ?? [];
};
