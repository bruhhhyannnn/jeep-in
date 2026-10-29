import type { StopPoint } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { normalizeStopPoint } from "@jeep-in/core/documents";

export const getStopPoints = async (): Promise<StopPoint[]> => {
  const snap = await getDocs(collection(db, "stop_points"));
  return snap.docs.map((d) => normalizeStopPoint(d.id, d.data()));
};
