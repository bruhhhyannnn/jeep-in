import type { StopPoint } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const getStopPoints = async (): Promise<StopPoint[]> => {
  const snap = await getDocs(collection(db, "stop_points"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StopPoint);
};
