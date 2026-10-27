"use server";

import { FieldValue, type Transaction } from "firebase-admin/firestore";
import { PLACEHOLDER_FARE_MATRIX, normalizeFareMatrix } from "@jeep-in/core/documents";
import { adminDb } from "@/lib/firebase-admin";
import type { FareMatrixFormData, FareRowFormData } from "@/lib";
import type { FareGuideRow, FareMatrix, FareRow } from "@/types";

// The fare guide is each route's fare matrix (fare_matrices): the posted fares as
// `table` rows, plus the order they come from and the rule for longer trips.
const COL = "fare_matrices";

async function findMatrix(routeId: string, tx?: Transaction) {
  const query = adminDb.collection(COL).where("routeId", "==", routeId).limit(1);
  const snap = tx ? await tx.get(query) : await query.get();
  return snap.docs[0] ?? null;
}

export async function getFareMatrix(routeId: string): Promise<FareMatrix | null> {
  const doc = await findMatrix(routeId);
  return doc ? normalizeFareMatrix(doc.id, doc.data()) : null;
}

/** Posted fares by distance; every route's when no route is given. */
export async function getFareGuide(routeId?: string): Promise<FareGuideRow[]> {
  const query = routeId
    ? adminDb.collection(COL).where("routeId", "==", routeId)
    : adminDb.collection(COL);
  const snap = await query.get();
  return snap.docs.flatMap((d) => {
    const matrix = normalizeFareMatrix(d.id, d.data());
    return matrix.table.map((row) => ({ ...row, routeId: matrix.routeId }));
  });
}

/**
 * Changes a route's posted table inside a transaction, creating the route's matrix
 * (with the placeholder rule) the first time.
 */
async function changeTable(routeId: string, change: (table: FareRow[]) => FareRow[]) {
  await adminDb.runTransaction(async (tx) => {
    const doc = await findMatrix(routeId, tx);
    const now = FieldValue.serverTimestamp();
    if (doc) {
      const table = change(normalizeFareMatrix(doc.id, doc.data()).table);
      tx.update(doc.ref, { table, updatedAt: now });
    } else {
      const route = await tx.get(adminDb.collection("routes").doc(routeId));
      tx.create(adminDb.collection(COL).doc(routeId), {
        ...PLACEHOLDER_FARE_MATRIX,
        vehicleClass: route.data()?.vehicleClass ?? PLACEHOLDER_FARE_MATRIX.vehicleClass,
        routeId,
        table: change([]),
        createdAt: now,
        updatedAt: now,
      });
    }
  });
}

/** Adds a posted fare, or replaces the one at `previousKm` when editing. */
export async function saveFareRow(data: FareRowFormData, previousKm?: number): Promise<void> {
  await changeTable(data.routeId, (table) => {
    const clash = table.find((r) => r.km === data.km && r.km !== previousKm);
    if (clash) {
      throw new Error(
        `There's already a fare for ${clash.km} km${clash.landmark ? ` (${clash.landmark})` : ""}. Edit that one instead.`,
      );
    }
    const row: FareRow = {
      km: data.km,
      landmark: data.landmark.trim() || null,
      regular: data.regular,
      discounted: data.discounted,
    };
    return [...table.filter((r) => r.km !== previousKm), row].sort((a, b) => a.km - b.km);
  });
}

export async function deleteFareRow(routeId: string, km: number): Promise<void> {
  await changeTable(routeId, (table) => table.filter((r) => r.km !== km));
}

/** The order the fares come from, and the rule for trips longer than the table. */
export async function updateFareMatrix(routeId: string, data: FareMatrixFormData): Promise<void> {
  const details = {
    orderNo: data.orderNo?.trim() || null,
    issuedBy: data.issuedBy?.trim() || null,
    effectiveDate: data.effectiveDate || null,
    vehicleClass: data.vehicleClass.trim(),
    baseFare: data.baseFare,
    baseKm: data.baseKm,
    perKm: data.perKm,
    discountRate: data.discountPercent / 100,
    roundTo: data.roundTo,
    discountRoundTo: data.discountRoundTo,
  };
  await adminDb.runTransaction(async (tx) => {
    const doc = await findMatrix(routeId, tx);
    const now = FieldValue.serverTimestamp();
    if (doc) tx.update(doc.ref, { ...details, updatedAt: now });
    else {
      tx.create(adminDb.collection(COL).doc(routeId), {
        ...details,
        routeId,
        table: [],
        createdAt: now,
        updatedAt: now,
      });
    }
  });
}
