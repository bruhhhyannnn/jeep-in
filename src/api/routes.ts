import type { Route } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const getRoutes = async (): Promise<Route[]> => {
  const snap = await getDocs(collection(db, "routes"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Route);
};
