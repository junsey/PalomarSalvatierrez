import { Pigeon } from "../types/pigeon";

export const resolvePigeonRef = (value: string | undefined, pigeons: Pigeon[]) => {
  if (!value) return null;
  const needle = value.trim().toLowerCase();
  if (!needle) return null;

  const byNumero = pigeons.find(
    (p) => p.numero.trim().toLowerCase() === needle
  );
  if (byNumero) return byNumero;

  const byNombre = pigeons.find(
    (p) => p.nombre.trim().toLowerCase() === needle
  );
  return byNombre ?? null;
};
