import type { DriverLocation } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, onSnapshot, type DocumentData } from "firebase/firestore";
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
