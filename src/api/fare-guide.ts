import type { FareGuide } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const getFareGuide = async (): Promise<FareGuide[]> => {
  const snap = await getDocs(collection(db, "fare_guide"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FareGuide);
};
