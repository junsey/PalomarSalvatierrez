import Papa from "papaparse";
import { Pigeon } from "../types/pigeon";
import { createFallbackNumero, isValidUrl } from "../utils/validators";

const DEFAULT_SHEET_ID = "1JZcjjdxGi-jUV_eedQebsRWsaVVwQMmyRUPesvIfQ0E";
const DEFAULT_SHEET_NAME = "Hoja 1";

export const buildSheetUrl = () => {
  const sheetId = import.meta.env.VITE_SHEET_ID || DEFAULT_SHEET_ID;
  const sheetName = import.meta.env.VITE_SHEET_NAME || DEFAULT_SHEET_NAME;
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;
};

export const fetchCsv = async () => {
  const url = buildSheetUrl();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error al leer la sheet");
  }
  return await res.text();
};

export const parseCsv = (csvText: string) => {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true
  });
  if (parsed.errors.length) {
    throw new Error("Error al parsear CSV");
  }
  return parsed.data;
};

const extractImageUrl = (raw?: string) => {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (isValidUrl(trimmed)) return trimmed;

  const match = trimmed.match(/^=IMAGE\((.+)\)$/i);
  if (!match) return undefined;

  const inner = match[1].trim();
  const firstArg = inner.split(/[;,]/)[0]?.trim();
  if (!firstArg) return undefined;
  const unquoted = firstArg.replace(/^\"|\"$/g, "");
  return isValidUrl(unquoted) ? unquoted : undefined;
};

export const mapRowsToPigeons = (rows: Record<string, string>[]): Pigeon[] => {
  return rows.map((row, index) => {
    const nombre = row["Nombre"]?.trim() || "Sin nombre";
    const numero = row["Numero"]?.trim() || createFallbackNumero(nombre, index);
    const fotoRaw = row["Foto"]?.trim() || undefined;
    const foto = extractImageUrl(fotoRaw);
    const tipoRaw =
      row["Tipo(Local o rescatada o Comprada)"]?.trim() ||
      row["Tipo(Local o rescatada)"]?.trim();

    return {
      nombre,
      numero,
      color: row["Color"]?.trim() || undefined,
      fenotipo: row["Fenotipo"]?.trim() || undefined,
      sexo: row["Sexo"]?.trim() || undefined,
      descripcion: row["Descripcion"]?.trim() || undefined,
      padre: row["Padre"]?.trim() || undefined,
      madre: row["Madre"]?.trim() || undefined,
      fechaNacimiento: row["Fecha de nacimiento"]?.trim() || undefined,
      fechaLlegada: row["Fecha de llegada"]?.trim() || undefined,
      tipo: tipoRaw || undefined,
      estado: row["Estado(en palomar, desaparecida, fallecida)"]?.trim() || undefined,
      pareja: row["Pareja"]?.trim() || undefined,
      foto
    };
  });
};
