"use server";

import { FieldValue, type WriteBatch } from "firebase-admin/firestore";
import { normalizeStopPoint } from "@jeep-in/core/documents";
import { adminDb } from "@/lib/firebase-admin";
import { splitList, type StopPointFormData } from "@/lib";
import type { StopPoint } from "@/types";

const COL = "stop_points";

/** Field names stops had before the shared model; saving a stop removes them. */
const OLD_FIELDS = {
  latitude: FieldValue.delete(),
  longitude: FieldValue.delete(),
  routeDirection: FieldValue.delete(),
};

const byPosition = (a: StopPoint, b: StopPoint) =>
  a.directionId.localeCompare(b.directionId) || a.order - b.order || a.name.localeCompare(b.name);

/** A route's stops, each direction in travel order. */
export async function getStopPoints(routeId: string): Promise<StopPoint[]> {
  const snap = await adminDb.collection(COL).where("routeId", "==", routeId).get();
  return snap.docs.map((d) => normalizeStopPoint(d.id, d.data())).sort(byPosition);
}

export async function getStopPoint(id: string): Promise<StopPoint | null> {
  const snap = await adminDb.collection(COL).doc(id).get();
  return snap.exists ? normalizeStopPoint(snap.id, snap.data()!) : null;
}

/**
 * Numbers a direction's stops 1, 2, 3… in their current order, leaving out `stopId`
 * or, with a `position`, putting it there. Returns the order `stopId` ends up with.
 */
async function renumber(
  batch: WriteBatch,
  routeId: string,
  directionId: string,
  stopId: string,
  position?: number,
): Promise<number> {
  const stops = (await getStopPoints(routeId)).filter(
    (s) => s.directionId === directionId && s.id !== stopId,
  );
  const ids = stops.map((s) => s.id);
  const index = position == null ? -1 : Math.min(Math.max(position - 1, 0), ids.length);
  if (index >= 0) ids.splice(index, 0, stopId);

  const now = FieldValue.serverTimestamp();
  stops.forEach((s) => {
    const order = ids.indexOf(s.id) + 1;
    if (s.order !== order)
      batch.update(adminDb.collection(COL).doc(s.id), { order, updatedAt: now });
  });
  return index + 1;
}

function fields(data: StopPointFormData) {
  return {
    name: data.name.trim(),
    address: data.address?.trim() ?? "",
    landmark: data.landmark?.trim() || null,
    description: data.description?.trim() || null,
    amenities: splitList(data.amenities),
    directionId: data.directionId,
    lat: data.lat,
    long: data.long,
    isActive: data.isActive,
  };
}

export async function createStopPoint(data: StopPointFormData, routeId: string): Promise<string> {
  const ref = adminDb.collection(COL).doc();
  const batch = adminDb.batch();
  const order = await renumber(batch, routeId, data.directionId, ref.id, data.order);
  const now = FieldValue.serverTimestamp();
  batch.set(ref, { ...fields(data), routeId, order, createdAt: now, updatedAt: now });
  await batch.commit();
  return ref.id;
}

export async function updateStopPoint(id: string, data: StopPointFormData): Promise<void> {
  const before = await getStopPoint(id);
  if (!before) throw new Error("This stop no longer exists.");

  const batch = adminDb.batch();
  if (before.directionId !== data.directionId) {
    await renumber(batch, before.routeId, before.directionId, id);
  }
  const order = await renumber(batch, before.routeId, data.directionId, id, data.order);
  batch.update(adminDb.collection(COL).doc(id), {
    ...fields(data),
    order,
    ...OLD_FIELDS,
    updatedAt: FieldValue.serverTimestamp(),
  });
  await batch.commit();
}

export async function deleteStopPoint(id: string): Promise<void> {
  const stop = await getStopPoint(id);
  if (!stop) return;
  const batch = adminDb.batch();
  await renumber(batch, stop.routeId, stop.directionId, id);
  batch.delete(adminDb.collection(COL).doc(id));
  await batch.commit();
}
