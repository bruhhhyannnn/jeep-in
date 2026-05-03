import type { Jeepney } from "@/types";
import { db, getAuthInstance } from "@/services/firebase/config";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";

export const subscribeToJeepneys = (callback: (jeepneys: Jeepney[]) => void) => {
  return onSnapshot(collection(db, "jeepneys"), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Jeepney));
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
    callback({ id: d.id, ...d.data() } as Jeepney);
  });
};
