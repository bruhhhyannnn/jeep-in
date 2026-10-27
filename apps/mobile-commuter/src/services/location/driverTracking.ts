import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, getAuthInstance } from "@/services/firebase/config";
import { markStep, recordMotion, resetHandshake, useSharingStore } from "@/store/sharing";

export const DRIVER_LOCATION_TASK = "driver-background-location-task";
const SHIFT_END_KEY = "jeepin-shift-ends-at";

let foregroundWatcher: Location.LocationSubscription | null = null;
let shiftEndsAt: number | null = null;

const getDriverId = (): string | null => getAuthInstance().currentUser?.uid ?? null;

/** Sharing stops by itself at the end of the shift unless the driver chose extra time. */
async function pastShiftEnd() {
  if (shiftEndsAt == null) {
    // The background task can run after the app was closed, without this module's state.
    const saved = await AsyncStorage.getItem(SHIFT_END_KEY);
    shiftEndsAt = saved ? Number(saved) : null;
  }
  const { overtimeUntil } = useSharingStore.getState();
  const limit = Math.max(shiftEndsAt ?? Number.POSITIVE_INFINITY, overtimeUntil ?? 0);
  return Date.now() > limit;
}

const pushLocation = async (coords: Location.LocationObjectCoords) => {
  const driverId = getDriverId();
  if (!driverId) return;

  const { latitude, longitude, heading, speed } = coords;
  recordMotion([longitude, latitude], speed);
  markStep("fix");

  if (await pastShiftEnd()) {
    await stopSharing({ byShiftEnd: true });
    return;
  }

  // Resolves once the server has the write; offline it waits and sends by itself.
  await Promise.all([
    setDoc(
      doc(db, "driver_locations", driverId),
      {
        driverId,
        lat: latitude,
        long: longitude,
        heading: heading ?? null,
        speed: speed ?? null,
        isSharing: true,
        // Lets commuters tell a live position from one that stopped updating.
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
    updateDoc(doc(db, "drivers", driverId), {
      lastLocationUpdate: new Date().toISOString(),
    }).catch(() => {}),
  ]);
  useSharingStore.setState({ lastAckAt: Date.now(), lastAckPosition: [longitude, latitude] });
  markStep("write");
};

// -----------------------------
//  BACKGROUND TASK DEFINITION
// -----------------------------
TaskManager.defineTask(DRIVER_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }

  const { locations } = data as { locations: Location.LocationObject[] };
  const location = locations?.[0];
  if (!location) return;

  await pushLocation(location.coords);
});

/**
 * Starts sharing and runs the handshake. Returns false when the phone blocks
 * location; the store then says why.
 */
export async function startSharing(options: { shiftEndsAt: number | null }) {
  resetHandshake();
  shiftEndsAt = options.shiftEndsAt;
  if (shiftEndsAt != null) await AsyncStorage.setItem(SHIFT_END_KEY, String(shiftEndsAt));
  else await AsyncStorage.removeItem(SHIFT_END_KEY);
  useSharingStore.setState({ stoppedByShiftEndAt: null });

  if (!(await Location.hasServicesEnabledAsync())) {
    useSharingStore.setState({ phase: "blocked", blockedReason: "services" });
    return false;
  }

  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  if (fg !== "granted") {
    useSharingStore.setState({ phase: "blocked", blockedReason: "permission" });
    return false;
  }

  let background = false;
  try {
    background = (await Location.requestBackgroundPermissionsAsync()).status === "granted";
  } catch {
    background = false;
  }
  markStep("permission");
  useSharingStore.setState({ foregroundOnly: !background });

  if (background) {
    if (!(await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK))) {
      await Location.startLocationUpdatesAsync(DRIVER_LOCATION_TASK, {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 10,
        timeInterval: 5000,
        showsBackgroundLocationIndicator: true,
        pausesUpdatesAutomatically: false,
        foregroundService: {
          notificationTitle: "JEEP-IN · sharing location",
          notificationBody: "Commuters can see your jeep on the map.",
        },
      });
    }
  } else if (!foregroundWatcher) {
    foregroundWatcher = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (location) => {
        pushLocation(location.coords).catch((err) => console.warn("Location send failed:", err));
      },
    );
  }

  // A first fix right away so the handshake doesn't wait for the jeep to move.
  Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
    .then((loc) => pushLocation(loc.coords))
    .catch((err) => console.warn("First fix failed:", err));

  return true;
}

export async function stopSharing({ byShiftEnd = false }: { byShiftEnd?: boolean } = {}) {
  if (await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK)) {
    await Location.stopLocationUpdatesAsync(DRIVER_LOCATION_TASK);
  }
  foregroundWatcher?.remove();
  foregroundWatcher = null;

  useSharingStore.setState({
    phase: "off",
    confirmedAt: null,
    stoppedByShiftEndAt: byShiftEnd ? Date.now() : null,
    overtimeUntil: byShiftEnd ? null : useSharingStore.getState().overtimeUntil,
  });

  const driverId = getDriverId();
  if (driverId) {
    await setDoc(doc(db, "driver_locations", driverId), { isSharing: false }, { merge: true });
  }
}

/** Whether location updates are still running, e.g. after the app was reopened. */
export async function isSharingRunning() {
  if (foregroundWatcher) return true;
  return Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK);
}
