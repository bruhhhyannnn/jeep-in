import type { Jeepney } from "@/types";
import { db, getAuthInstance } from "@/services/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";
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

export const getAssignedJeepneyId = async (): Promise<string | null> => {
  const user = getAuthInstance().currentUser;
  if (!user) return null;

  try {
    const q = query(collection(db, "jeepneys"), where("assignedDriverId", "==", user.uid));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].id;
  } catch (err) {
    console.error("Error fetching assigned jeepney:", err);
    return null;
  }
};

export const subscribeToAssignedJeepney = (
  driverId: string,
  callback: (jeepney: Jeepney | null) => void,
) => {
  if (!driverId) return () => {};

  const q = query(collection(db, "jeepneys"), where("assignedDriverId", "==", driverId));

  return onSnapshot(q, (snap) => {
    if (snap.empty) {
      callback(null);
      return;
    }
    const d = snap.docs[0];
    callback(normalizeJeepney(d.id, d.data()));
  });
};
