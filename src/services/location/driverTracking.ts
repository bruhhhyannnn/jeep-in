import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { setDoc, updateDoc, doc } from "firebase/firestore";
import { db, getAuthInstance } from "@/services/firebase/config";
import { showWarning, showError, showSuccess } from "@/services/ui/toasts";

export const DRIVER_LOCATION_TASK = "driver-background-location-task";

let foregroundWatcher: Location.LocationSubscription | null = null;
let isForegroundActive = false;

const getDriverId = (): string | null => getAuthInstance().currentUser?.uid ?? null;

const pushLocation = async (coords: Location.LocationObjectCoords) => {
  const driverId = getDriverId();
  if (!driverId) return;

  const { latitude, longitude, heading } = coords;

  await Promise.all([
    setDoc(
      doc(db, "driver_locations", driverId),
      { driverId, lat: latitude, long: longitude, heading: heading ?? null, isSharing: true },
      { merge: true },
    ),
    updateDoc(doc(db, "drivers", driverId), {
      lastLocationUpdate: new Date().toISOString(),
    }),
  ]);
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
  console.log("Background update sent:", location.coords.latitude, location.coords.longitude);
});

// -----------------------------
//  START BACKGROUND TRACKING
// -----------------------------
export const startBackgroundTracking = async () => {
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  if (fg !== "granted") {
    showError("Foreground location permission denied.");
    return "none";
  }

  const { status: bg } = await Location.requestBackgroundPermissionsAsync();

  if (bg !== "granted") {
    showWarning("Background permission not granted. Using fallback mode.");
    await startForegroundFallback();
    return "foreground";
  }

  const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK);

  if (!alreadyRunning) {
    await Location.startLocationUpdatesAsync(DRIVER_LOCATION_TASK, {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 10,
      timeInterval: 5000,
      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: true,
      foregroundService: {
        notificationTitle: "JEEP-IN Driver Tracking",
        notificationBody: "Your location is being shared live.",
      },
    });
  }

  showSuccess("Background tracking started.");
  return "background";
};

// -----------------------------
//  STOP BACKGROUND TRACKING
// -----------------------------
export const stopBackgroundTracking = async () => {
  const running = await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK);

  if (running) {
    await Location.stopLocationUpdatesAsync(DRIVER_LOCATION_TASK);
  }

  if (foregroundWatcher && isForegroundActive) {
    foregroundWatcher.remove();
    foregroundWatcher = null;
    isForegroundActive = false;
  }

  const driverId = getDriverId();
  if (driverId) {
    await setDoc(doc(db, "driver_locations", driverId), { isSharing: false }, { merge: true });
  }

  showWarning("Tracking stopped.");
};

// -----------------------------
//  FOREGROUND FALLBACK
// -----------------------------
export const startForegroundFallback = async () => {
  if (foregroundWatcher) return;

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    showError("Foreground permission denied.");
    return;
  }

  foregroundWatcher = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
    },
    async (location) => {
      await pushLocation(location.coords);
      console.log("Foreground update sent:", location.coords.latitude, location.coords.longitude);
    },
  );

  isForegroundActive = true;
  showSuccess("Foreground tracking active.");
};
