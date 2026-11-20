import { toMillis } from "@jeep-in/core/normalize";
import type { DriverReport } from "@/types";
import { db } from "@/services/firebase/config";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export type NewDriverReport = Omit<DriverReport, "id" | "status" | "createdAt" | "seenAt">;

/**
 * Writes a report and returns its id straight away. Firestore queues the write
 * while there is no signal and sends it by itself later; `delivered` resolves
 * once the server has it.
 */
export const sendDriverReport = (report: NewDriverReport) => {
  const ref = doc(collection(db, "driver_reports"));
  const delivered = setDoc(ref, { ...report, status: "sent", createdAt: serverTimestamp() });
  delivered.catch((err) => console.error("Report send failed:", err));
  return { id: ref.id, delivered };
};

/** "Take it back": the manager's list hides withdrawn reports. */
export const withdrawDriverReport = (id: string) =>
  updateDoc(doc(db, "driver_reports", id), { status: "withdrawn", withdrawnAt: serverTimestamp() });

/**
 * When a manager opened the report on the dashboard's Alerts page (`seenAt`).
 * Start it only once the report is delivered: the rules let a driver read their
 * own report, and before the server has it there is nothing to read, which
 * would end the listener.
 */
export const subscribeToReportSeen = (id: string, callback: (seenAt: number | null) => void) =>
  onSnapshot(
    doc(db, "driver_reports", id),
    (snap) => callback(toMillis(snap.data()?.seenAt)),
    // Refused (rules not deployed yet) or offline: it stays "not yet".
    () => {},
  );
