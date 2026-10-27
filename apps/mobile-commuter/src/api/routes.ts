import type { LngLat, Route, RouteDirection } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, getDocs, type DocumentData } from "firebase/firestore";
import { num, str, strList, toLngLat } from "@/api/normalize";

const toDirection = (raw: unknown, index: number): RouteDirection => {
  // Older route documents stored directions as plain labels.
  if (typeof raw === "string") return { id: raw, label: raw, via: [], path: [] };

  const d = (raw ?? {}) as Record<string, unknown>;
  const id = str(d.id ?? d.label, `direction-${index + 1}`);
  return {
    id,
    label: str(d.label ?? d.name, id),
    via: strList(d.via),
    path: Array.isArray(d.path) ? d.path.map(toLngLat).filter((p): p is LngLat => p !== null) : [],
  };
};

export const normalizeRoute = (id: string, d: DocumentData): Route => ({
  id,
  name: str(d.name, "Route"),
  vehicleClass: str(d.vehicleClass, "Traditional PUJ"),
  directions: Array.isArray(d.directions) ? d.directions.map(toDirection) : [],
  isActive: d.isActive !== false,
  workingHours: {
    start: str(d.workingHours?.start, "05:00"),
    end: str(d.workingHours?.end, "19:00"),
  },
  averageSpeedKph: num(d.averageSpeedKph, 20),
});

export const getRoutes = async (): Promise<Route[]> => {
  const snap = await getDocs(collection(db, "routes"));
  return snap.docs.map((d) => normalizeRoute(d.id, d.data()));
};
