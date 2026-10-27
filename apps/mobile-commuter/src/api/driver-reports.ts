import type { DriverReport } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

export type NewDriverReport = Omit<DriverReport, "id" | "status" | "createdAt">;

/**
 * Writes a report and returns its id straight away. Firestore queues the write
 * while there is no signal and sends it by itself later.
 */
export const sendDriverReport = (report: NewDriverReport): string => {
  const ref = doc(collection(db, "driver_reports"));
  setDoc(ref, { ...report, status: "sent", createdAt: serverTimestamp() }).catch((err) =>
    console.error("Report send failed:", err),
  );
  return ref.id;
};

/** "Take it back": the manager's list hides withdrawn reports. */
export const withdrawDriverReport = (id: string) =>
  updateDoc(doc(db, "driver_reports", id), { status: "withdrawn", withdrawnAt: serverTimestamp() });
