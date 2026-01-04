import { Pigeon } from "../types/pigeon";
import { fetchCsv, mapRowsToPigeons, parseCsv } from "./sheetClient";

const CACHE_KEY = "pigeons_cache_v1";

const readCache = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Pigeon[];
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
};

const writeCache = (data: Pigeon[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

export const getPigeons = async (): Promise<Pigeon[]> => {
  try {
    const csv = await fetchCsv();
    const rows = parseCsv(csv);
    const pigeons = mapRowsToPigeons(rows);
    writeCache(pigeons);
    return pigeons;
  } catch (error) {
    const cached = readCache();
    if (cached) return cached;
    throw error;
  }
};
