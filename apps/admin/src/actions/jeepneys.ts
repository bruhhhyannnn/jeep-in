"use server";

import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { OUT_OF_SERVICE } from "@jeep-in/core/fleet";
import { assertOrg, assertOrgOf, assertRoute, requireCaller } from "@/lib/caller";
import { adminDb } from "@/lib/firebase-admin";
import { JeepneyFormData, serializeDoc } from "@/lib";
import type { Jeepney } from "@/types";

const COL = "jeepneys";

export async function getJeepneys(organizationId: string): Promise<Jeepney[]> {
  assertOrg(await requireCaller(), organizationId);
  const snap = await adminDb
    .collection(COL)
    .where("organizationId", "==", organizationId)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => serializeDoc({ ...(d.data() as Jeepney), id: d.id }));
}

export async function getJeepney(id: string): Promise<Jeepney | null> {
  const caller = await requireCaller();
  const snap = await adminDb.collection(COL).doc(id).get();
  if (!snap.exists) return null;
  assertOrg(caller, snap.data()?.organizationId);
  return serializeDoc({ ...(snap.data() as Jeepney), id: snap.id });
}

export async function getUnassignedJeepneys(organizationId: string): Promise<Jeepney[]> {
  assertOrg(await requireCaller(), organizationId);
  const snap = await adminDb
    .collection(COL)
    .where("organizationId", "==", organizationId)
    .where("assignedDriverId", "==", null)
    .where("isActive", "==", true)
    .get();
  return snap.docs.map((d) => serializeDoc({ ...(d.data() as Jeepney), id: d.id }));
}

export async function createJeepney(
  data: JeepneyFormData,
  organizationId: string,
  routeId: string,
): Promise<string> {
  const caller = await requireCaller();
  assertOrg(caller, organizationId);
  await assertRoute(caller, routeId);
  const now = Timestamp.now();
  const ref = await adminDb.collection(COL).add({
    plateNumber: data.plateNumber,
    jeepneyNumber: data.jeepneyNumber,
    seats: data.seats ?? null,
    organizationId,
    routeId,
    assignedDriverId: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateJeepney(id: string, data: JeepneyFormData): Promise<void> {
  await assertOrgOf(await requireCaller(), COL, id);
  await adminDb
    .collection(COL)
    .doc(id)
    .update({
      plateNumber: data.plateNumber,
      jeepneyNumber: data.jeepneyNumber,
      seats: data.seats ?? null,
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function deleteJeepney(id: string): Promise<void> {
  await assertOrgOf(await requireCaller(), COL, id);
  // If a driver is assigned, clear the assignment first
  const snap = await adminDb.collection(COL).doc(id).get();
  if (snap.exists) {
    const jeepney = snap.data() as Jeepney;
    if (jeepney.assignedDriverId) {
      await adminDb.collection("drivers").doc(jeepney.assignedDriverId).update({
        assignedJeepneyId: null,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }
  await adminDb.collection(COL).doc(id).delete();
}

/**
 * "Tell commuters this jeep is out": the commuter apps stop showing the unit, and
 * anyone following it is told, until it's put back in service.
 */
export async function setJeepneyOutOfService(id: string, out: boolean): Promise<void> {
  await assertOrgOf(await requireCaller(), COL, id);
  await adminDb
    .collection(COL)
    .doc(id)
    .update({ status: out ? OUT_OF_SERVICE : null, updatedAt: FieldValue.serverTimestamp() });
}
