import type { LngLat } from "./model";

// Firestore documents are read through these helpers so older documents
// (written before the current data model) still load with sensible defaults.

export const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : value == null ? fallback : String(value);

export const optionalStr = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

export const num = (value: unknown, fallback: number): number => {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const optionalNum = (value: unknown): number | null => {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
};

export const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((v) => str(v).trim()).filter(Boolean) : [];

/** Accepts a Firestore Timestamp, epoch ms or an ISO string. */
export const toMillis = (value: unknown): number | null => {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? null : ms;
  }
  if (typeof (value as { toMillis?: unknown }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  return null;
};

/** Accepts a GeoPoint, { lat, lng } / { lat, long } map, or [lng, lat] pair. */
export const toLngLat = (value: unknown): LngLat | null => {
  if (!value) return null;
  if (Array.isArray(value) && value.length >= 2) {
    const [lng, lat] = value.map(Number);
    return Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
  }
  const v = value as Record<string, unknown>;
  const lat = Number(v.latitude ?? v.lat);
  const lng = Number(v.longitude ?? v.lng ?? v.long);
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lng, lat] : null;
};
