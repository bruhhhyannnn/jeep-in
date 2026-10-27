import type { StopPoint } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, getDocs, type DocumentData } from "firebase/firestore";
import { num, optionalNum, optionalStr, str, strList } from "@/api/normalize";

export const normalizeStopPoint = (id: string, d: DocumentData): StopPoint => ({
  id,
  name: str(d.name, "Stop"),
  address: str(d.address),
  landmark: optionalStr(d.landmark),
  description: optionalStr(d.description),
  amenities: strList(d.amenities),
  photoUrl: optionalStr(d.photoUrl),
  routeId: str(d.routeId),
  // `routeDirection` is the field name used before directions had ids.
  directionId: str(d.directionId ?? d.routeDirection),
  order: num(d.order, 0),
  distanceKm: optionalNum(d.distanceKm),
  // `latitude` / `longitude` are the field names on the current stop documents.
  lat: num(d.lat ?? d.latitude, 0),
  long: num(d.long ?? d.lng ?? d.longitude, 0),
  isActive: d.isActive !== false,
});

export const getStopPoints = async (): Promise<StopPoint[]> => {
  const snap = await getDocs(collection(db, "stop_points"));
  return snap.docs.map((d) => normalizeStopPoint(d.id, d.data()));
};
