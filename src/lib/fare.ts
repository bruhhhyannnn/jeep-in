import type { FareMatrix } from "@/types";
import { formatPeso } from "@/lib/format";

export type FareQuote = {
  km: number;
  /** Kilometres charged at the per-km rate, after the base distance. */
  extraKm: number;
  regular: number;
  discounted: number;
};

const roundTo = (value: number, step: number) =>
  step > 0 ? Math.round(value / step) * step : value;

export function quoteFare(matrix: FareMatrix, km: number): FareQuote {
  const extraKm = Math.max(0, Math.round((km - matrix.baseKm) * 10) / 10);
  const raw = matrix.baseFare + extraKm * matrix.perKm;
  return {
    km,
    extraKm,
    regular: roundTo(raw, matrix.roundTo),
    discounted: roundTo(raw * (1 - matrix.discountRate), matrix.roundTo),
  };
}

/** "₱13.00 base + 6.7 km × ₱1.80", the formula shown under every total. */
export function fareFormula(matrix: FareMatrix, quote: FareQuote): string {
  const base = `${formatPeso(matrix.baseFare)} base`;
  if (quote.extraKm <= 0) return `${base} · first ${matrix.baseKm} km`;
  return `${base} + ${quote.extraKm.toFixed(1)} km × ${formatPeso(matrix.perKm)}`;
}

export const isPlaceholderMatrix = (matrix: FareMatrix) => matrix.orderNo == null;

export const discountPercent = (matrix: FareMatrix) => Math.round(matrix.discountRate * 100);
