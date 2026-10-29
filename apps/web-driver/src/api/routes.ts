import type { Route } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { normalizeRoute } from "@jeep-in/core/documents";

export const getRoutes = async (): Promise<Route[]> => {
  const snap = await getDocs(collection(db, "routes"));
  return snap.docs.map((d) => normalizeRoute(d.id, d.data()));
};
