import type { FareMatrix, FareRow } from "./model";
import { formatPeso } from "./format";

export type FareQuote = {
  km: number;
  /** Kilometres charged at the per-km rate, after the base distance. */
  extraKm: number;
  regular: number;
  discounted: number;
  /** The posted row the fares come from; null when the rule computed them. */
  row: FareRow | null;
};

const roundTo = (value: number, step: number) =>
  step > 0 ? Math.round(value / step) * step : value;

const toCentavo = (value: number) => Math.round(value * 100) / 100;

/**
 * The posted fares for the trip's distance, rounded to the nearest km. Without a
 * posted row, the rule: the discount is taken off the rounded regular fare, so
 * ₱13.00 becomes ₱10.40, or ₱10.50 for a matrix whose discounted fares round to ₱0.25.
 */
export function quoteFare(matrix: FareMatrix, km: number): FareQuote {
  const row = matrix.table.find((r) => r.km === Math.round(km));
  if (row) {
    return {
      km,
      extraKm: Math.max(0, row.km - matrix.baseKm),
      regular: row.regular,
      discounted: row.discounted,
      row,
    };
  }

  const extraKm = Math.max(0, Math.round((km - matrix.baseKm) * 10) / 10);
  const regular = roundTo(matrix.baseFare + extraKm * matrix.perKm, matrix.roundTo);
  const discounted = regular * (1 - matrix.discountRate);
  return {
    km,
    extraKm,
    regular,
    discounted: toCentavo(roundTo(discounted, matrix.discountRoundTo ?? 0)),
    row: null,
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

/** No order number and no posted fares: the rates are the app's placeholder. */
export const isPlaceholderMatrix = (matrix: FareMatrix) =>
  matrix.orderNo == null && matrix.table.length === 0;

export const discountPercent = (matrix: FareMatrix) => Math.round(matrix.discountRate * 100);
