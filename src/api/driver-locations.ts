import type { DriverLocation } from "@/types";
import { db } from "@/services/firebase/config";
import { doc, collection, onSnapshot } from "firebase/firestore";

export const subscribeToDriverLocation = (
  driverId: string,
  callback: (location: DriverLocation | null) => void,
) => {
  return onSnapshot(doc(db, "driver_locations", driverId), (snap) => {
    callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as DriverLocation) : null);
  });
};

export const subscribeToAllDriverLocations = (callback: (locations: DriverLocation[]) => void) => {
  return onSnapshot(collection(db, "driver_locations"), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DriverLocation));
  });
};
