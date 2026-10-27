import type { DriverLocation } from "@/types";
import { db } from "@/services/firebase/config";
import { doc, collection, onSnapshot, setDoc, type DocumentData } from "firebase/firestore";
import { num, optionalNum, optionalStr, toMillis } from "@/api/normalize";

export const normalizeDriverLocation = (id: string, d: DocumentData): DriverLocation => {
  const heading = optionalNum(d.heading);
  const speed = optionalNum(d.speed);
  return {
    id,
    driverId: typeof d.driverId === "string" ? d.driverId : id,
    lat: num(d.lat, 0),
    long: num(d.long, 0),
    // GPS reports -1 when it has no heading or speed.
    heading: heading != null && heading >= 0 ? heading : null,
    speed: speed != null && speed >= 0 ? speed : null,
    directionId: optionalStr(d.directionId),
    isSharing: d.isSharing === true,
    updatedAt: toMillis(d.updatedAt),
  };
};

/** `fromCache` is true while the phone can't reach Firestore. */
export const subscribeToAllDriverLocations = (
  callback: (locations: DriverLocation[], meta: { fromCache: boolean }) => void,
) => {
  return onSnapshot(
    collection(db, "driver_locations"),
    { includeMetadataChanges: true },
    (snap) => {
      callback(
        snap.docs.map((d) => normalizeDriverLocation(d.id, d.data())),
        { fromCache: snap.metadata.fromCache },
      );
    },
  );
};

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
