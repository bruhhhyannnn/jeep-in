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

const toCentavo = (value: number) => Math.round(value * 100) / 100;

/** The discount is taken off the rounded regular fare: ₱13.00 becomes ₱10.40. */
export function quoteFare(matrix: FareMatrix, km: number): FareQuote {
  const extraKm = Math.max(0, Math.round((km - matrix.baseKm) * 10) / 10);
  const regular = roundTo(matrix.baseFare + extraKm * matrix.perKm, matrix.roundTo);
  return {
    km,
    extraKm,
    regular,
    discounted: toCentavo(regular * (1 - matrix.discountRate)),
  };
}

/** "nearest ₱1", or "nearest ₱0.25" for a matrix that rounds to centavos. */
export const roundingLabel = (matrix: FareMatrix) =>
  `nearest ₱${Number.isInteger(matrix.roundTo) ? matrix.roundTo : matrix.roundTo.toFixed(2)}`;

/** "₱13.00 base + 6.7 km × ₱1.80", the formula shown under every total. */
export function fareFormula(matrix: FareMatrix, quote: FareQuote): string {
  const base = `${formatPeso(matrix.baseFare)} base`;
  if (quote.extraKm <= 0) return `${base} · first ${matrix.baseKm} km`;
  return `${base} + ${quote.extraKm.toFixed(1)} km × ${formatPeso(matrix.perKm)}`;
}

export const isPlaceholderMatrix = (matrix: FareMatrix) => matrix.orderNo == null;

export const discountPercent = (matrix: FareMatrix) => Math.round(matrix.discountRate * 100);
