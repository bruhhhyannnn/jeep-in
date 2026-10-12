import type { FareMatrix } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, getDocs, type DocumentData } from "firebase/firestore";
import { num, optionalStr, str } from "@/api/normalize";

/**
 * Used when a route has no fare matrix document yet. Rates follow the current
 * traditional PUJ rule, but with no order number the app shows them as placeholders.
 */
export const PLACEHOLDER_FARE_MATRIX: Omit<FareMatrix, "id" | "routeId"> = {
  vehicleClass: "Traditional PUJ",
  orderNo: null,
  issuedBy: null,
  effectiveDate: null,
  baseFare: 13,
  baseKm: 4,
  perKm: 1.8,
  discountRate: 0.2,
  roundTo: 0.25,
};

export const normalizeFareMatrix = (id: string, d: DocumentData): FareMatrix => ({
  id,
  routeId: str(d.routeId),
  vehicleClass: str(d.vehicleClass, PLACEHOLDER_FARE_MATRIX.vehicleClass),
  orderNo: optionalStr(d.orderNo),
  issuedBy: optionalStr(d.issuedBy),
  effectiveDate: optionalStr(d.effectiveDate),
  baseFare: num(d.baseFare, PLACEHOLDER_FARE_MATRIX.baseFare),
  baseKm: num(d.baseKm, PLACEHOLDER_FARE_MATRIX.baseKm),
  perKm: num(d.perKm, PLACEHOLDER_FARE_MATRIX.perKm),
  discountRate: num(d.discountRate, PLACEHOLDER_FARE_MATRIX.discountRate),
  roundTo: num(d.roundTo, PLACEHOLDER_FARE_MATRIX.roundTo),
});

export const getFareMatrices = async (): Promise<FareMatrix[]> => {
  const snap = await getDocs(collection(db, "fare_matrices"));
  return snap.docs.map((d) => normalizeFareMatrix(d.id, d.data()));
};
