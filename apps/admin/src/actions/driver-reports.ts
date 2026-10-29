"use server";

import { normalizeDriverReport } from "@jeep-in/core/documents";
import type { DriverReport } from "@jeep-in/core/model";
import { assertOrg, requireCaller } from "@/lib/caller";
import { adminDb } from "@/lib/firebase-admin";

const COL = "driver_reports";
/** The most values Firestore accepts in one `in` filter. */
const IN_LIMIT = 30;

/**
 * Reports sent from an organization's units, newest first. A report doesn't store
 * the organization, so it's found through the unit it was sent from. Reports the
 * driver took back are left out, as the driver app tells them.
 */
export async function getDriverReports(organizationId: string): Promise<DriverReport[]> {
  assertOrg(await requireCaller(), organizationId);
  const units = await adminDb
    .collection("jeepneys")
    .where("organizationId", "==", organizationId)
    .select()
    .get();
  const ids = units.docs.map((d) => d.id);

  const batches: string[][] = [];
  for (let i = 0; i < ids.length; i += IN_LIMIT) batches.push(ids.slice(i, i + IN_LIMIT));
  const snaps = await Promise.all(
    batches.map((batch) => adminDb.collection(COL).where("jeepneyId", "in", batch).get()),
  );

  return snaps
    .flatMap((snap) => snap.docs.map((d) => normalizeDriverReport(d.id, d.data())))
    .filter((r) => r.status === "sent")
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}
