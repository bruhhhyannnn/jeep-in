import type { Jeepney } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { normalizeJeepney } from "@jeep-in/core/documents";

export const subscribeToJeepneys = (callback: (jeepneys: Jeepney[]) => void) => {
  return onSnapshot(collection(db, "jeepneys"), (snap) => {
    callback(snap.docs.map((d) => normalizeJeepney(d.id, d.data())));
  });
};
