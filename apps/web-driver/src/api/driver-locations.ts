import type { DriverLocation } from "@/types";
import { db } from "@/services/firebase/config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { normalizeDriverLocation } from "@jeep-in/core/documents";

/** The driver's own record, with whether this copy came back from the server. */
export const subscribeToOwnLocation = (
  driverId: string,
  callback: (
    location: DriverLocation | null,
    meta: { fromCache: boolean; hasPendingWrites: boolean },
  ) => void,
) => {
  return onSnapshot(
    doc(db, "driver_locations", driverId),
    { includeMetadataChanges: true },
    (snap) => {
      callback(snap.exists() ? normalizeDriverLocation(snap.id, snap.data()) : null, {
        fromCache: snap.metadata.fromCache,
        hasPendingWrites: snap.metadata.hasPendingWrites,
      });
    },
  );
};

/** Moves the jeep to a direction's list for commuters. Null hides it while resting. */
export const setDriverDirection = (driverId: string, directionId: string | null) =>
  setDoc(doc(db, "driver_locations", driverId), { driverId, directionId }, { merge: true });

/** Logs extra sharing time past the shift end for the manager. */
export const setDriverOvertime = (driverId: string, overtimeUntil: number | null) =>
  setDoc(
    doc(db, "driver_locations", driverId),
    { driverId, overtimeUntil: overtimeUntil ? new Date(overtimeUntil) : null },
    { merge: true },
  );
