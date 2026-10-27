import type { DriverLocation } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { normalizeDriverLocation } from "@jeep-in/core/documents";

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
