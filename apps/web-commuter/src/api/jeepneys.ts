import type { Jeepney } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, onSnapshot, type DocumentData } from "firebase/firestore";
import { optionalNum, str } from "@/api/normalize";

export const normalizeJeepney = (id: string, d: DocumentData): Jeepney => ({
  id,
  plateNumber: str(d.plateNumber),
  jeepneyNumber: str(d.jeepneyNumber),
  organizationId: str(d.organizationId),
  routeId: str(d.routeId),
  assignedDriverId: typeof d.assignedDriverId === "string" ? d.assignedDriverId : null,
  status: d.status ?? undefined,
  seats: optionalNum(d.seats),
});

export const subscribeToJeepneys = (callback: (jeepneys: Jeepney[]) => void) => {
  return onSnapshot(collection(db, "jeepneys"), (snap) => {
    callback(snap.docs.map((d) => normalizeJeepney(d.id, d.data())));
  });
};
