"use server";

import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { normalizeRoute, normalizeStopPoint } from "@jeep-in/core/documents";
import { inSentence } from "@jeep-in/core/format";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { WorkingHoursFormData, RouteFormData, splitList } from "@/lib";
import type { Route, RouteDirection } from "@/types";

const toRoute = (id: string, d: DocumentData): Route => ({
  ...normalizeRoute(id, d),
  description: typeof d.description === "string" && d.description.trim() ? d.description : null,
});

export async function getRoute(routeId: string): Promise<Route | null> {
  const snap = await adminDb.collection("routes").doc(routeId).get();
  return snap.exists ? toRoute(snap.id, snap.data()!) : null;
}

export async function getAllRoutes(): Promise<Route[]> {
  const snap = await adminDb.collection("routes").get();
  return snap.docs.map((d) => toRoute(d.id, d.data()));
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The directions as stored. Existing ones keep their id (stops point to it); a new one
 * is named after its first and last town, e.g. "laoag_paoay". Road paths, which the
 * form doesn't edit, are carried over. Firestore can't nest arrays, so path points are
 * stored as { lat, lng }.
 */
function toStoredDirections(form: RouteFormData["directions"], current: RouteDirection[]) {
  const used = new Set<string>();
  return form.map((d) => {
    const via = splitList(d.via);
    const base = d.id || `${slug(via[0])}_${slug(via[via.length - 1])}`;
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    const path = current.find((c) => c.id === id)?.path ?? [];
    return {
      id,
      label: d.label.trim(),
      via,
      ...(path.length ? { path: path.map(([lng, lat]) => ({ lat, lng })) } : {}),
    };
  });
}

export async function updateWorkingHours(
  routeId: string,
  data: WorkingHoursFormData,
): Promise<void> {
  await adminDb
    .collection("routes")
    .doc(routeId)
    .update({
      workingHours: { start: data.start, end: data.end },
      updatedAt: FieldValue.serverTimestamp(),
    });
}

function fields(data: RouteFormData, current: RouteDirection[]) {
  return {
    name: data.name.trim(),
    description: data.description?.trim() || null,
    vehicleClass: data.vehicleClass.trim(),
    averageSpeedKph: data.averageSpeedKph,
    directions: toStoredDirections(data.directions, current),
    isActive: data.isActive,
    workingHours: { start: data.workingHours.start, end: data.workingHours.end },
  };
}

export async function createRoute(data: RouteFormData): Promise<string> {
  const now = FieldValue.serverTimestamp();
  const ref = await adminDb
    .collection("routes")
    .add({ ...fields(data, []), createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateRoute(routeId: string, data: RouteFormData): Promise<void> {
  const current = await getRoute(routeId);
  if (!current) throw new Error("This route no longer exists.");
  const next = fields(data, current.directions);

  // A direction can't go while stops still point to it: they'd vanish from the apps.
  const kept = new Set(next.directions.map((d) => d.id));
  const removed = current.directions.filter((d) => !kept.has(d.id));
  if (removed.length) {
    const stops = await adminDb.collection("stop_points").where("routeId", "==", routeId).get();
    for (const direction of removed) {
      const count = stops.docs.filter(
        (d) => normalizeStopPoint(d.id, d.data()).directionId === direction.id,
      ).length;
      if (count) {
        throw new Error(
          `${count} ${count === 1 ? "stop is" : "stops are"} still ${inSentence(direction.label)}. Move or remove ${count === 1 ? "it" : "them"} first.`,
        );
      }
    }
  }

  await adminDb
    .collection("routes")
    .doc(routeId)
    .update({ ...next, updatedAt: FieldValue.serverTimestamp() });
}

export async function deleteRoute(routeId: string): Promise<void> {
  const batch = adminDb.batch();

  // Stop points
  const stopsSnap = await adminDb.collection("stop_points").where("routeId", "==", routeId).get();
  stopsSnap.docs.forEach((d) => batch.delete(d.ref));

  // Fare guide entries and the fare matrix
  const [fareSnap, matrixSnap] = await Promise.all([
    adminDb.collection("fare_guide").where("routeId", "==", routeId).get(),
    adminDb.collection("fare_matrices").where("routeId", "==", routeId).get(),
  ]);
  [...fareSnap.docs, ...matrixSnap.docs].forEach((d) => batch.delete(d.ref));

  // Unassign organizations that reference this route
  const orgsSnap = await adminDb.collection("organizations").where("routeId", "==", routeId).get();
  orgsSnap.docs.forEach((d) =>
    batch.update(d.ref, { routeId: null, updatedAt: FieldValue.serverTimestamp() }),
  );

  // Delete drivers on this route (no route reassignment UI exists)
  const driversSnap = await adminDb.collection("drivers").where("routeId", "==", routeId).get();
  const driverUids = driversSnap.docs.map((d) => d.id);
  driversSnap.docs.forEach((d) => {
    batch.delete(d.ref);
    batch.delete(adminDb.collection("users").doc(d.id));
    batch.delete(adminDb.collection("driver_locations").doc(d.id));
  });

  // Route itself
  batch.delete(adminDb.collection("routes").doc(routeId));

  await batch.commit();

  // Delete Firebase Auth accounts for deleted drivers
  await Promise.all(driverUids.map((uid) => adminAuth.deleteUser(uid).catch(() => null)));
}

/** Returns true if current time is within working hours for the given route */
export async function isWithinWorkingHours(routeId: string): Promise<boolean> {
  const route = await getRoute(routeId);
  if (!route) return false;

  const now = new Date();
  const [startH, startM] = route.workingHours.start.split(":").map(Number);
  const [endH, endM] = route.workingHours.end.split(":").map(Number);

  const start = startH * 60 + startM;
  const end = endH * 60 + endM;
  const current = now.getHours() * 60 + now.getMinutes();

  return current >= start && current <= end;
}
