import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { updateDocument } from "@/services/firebase/firestore";
import type { Jeepney } from "@/types";
import { fetchAssignedJeepneyId } from "@/services/assignments/fetchAssignedJeepneyId";
import { showWarning, showError, showSuccess } from "@/services/ui/toasts";

export const DRIVER_LOCATION_TASK = "driver-background-location-task";

// Singleton for foreground tracking
let foregroundWatcher: Location.LocationSubscription | null = null;
let isForegroundActive = false;

// -----------------------------
//  BACKGROUND TASK DEFINITION
// -----------------------------
TaskManager.defineTask(DRIVER_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }

  const { locations } = data as any;
  const location = locations?.[0];
  if (!location) return;

  const jeepneyId = await fetchAssignedJeepneyId();
  if (!jeepneyId) return;

  const { latitude, longitude, speed, heading } = location.coords;

  await updateDocument<Jeepney>("jeepneys", jeepneyId, {
    latitude,
    longitude,
    speed: speed ?? null,
    bearing: heading ?? null,
    updated_at: new Date().toISOString(),
  });

  console.log("📡 Background update sent:", latitude, longitude);
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
  const hasBg = bg === "granted";

  // If user didn't allow "Always"
  if (!hasBg) {
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
  console.log("🚀 Background tracking active");
  return "background";
};

// -----------------------------
//  STOP BACKGROUND TRACKING
// -----------------------------
export const stopBackgroundTracking = async () => {
  const running = await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK);

  if (running) {
    await Location.stopLocationUpdatesAsync(DRIVER_LOCATION_TASK);
    console.log("🛑 Background tracking stopped.");
  }

  if (foregroundWatcher && isForegroundActive) {
    await foregroundWatcher.remove();
    foregroundWatcher = null;
    isForegroundActive = false;
    console.log("🛑 Foreground fallback stopped.");
  }

  showWarning("Tracking stopped.");
};

// -----------------------------
//  FOREGROUND FALLBACK
// -----------------------------
export const startForegroundFallback = async () => {
  if (foregroundWatcher) {
    console.log("Foreground watcher already running.");
    return;
  }

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
      const jeepneyId = await fetchAssignedJeepneyId();
      if (!jeepneyId) return;

      const { latitude, longitude, speed, heading } = location.coords;

      await updateDocument<Jeepney>("jeepneys", jeepneyId, {
        latitude,
        longitude,
        speed: speed ?? undefined,
        bearing: heading ?? undefined,
        updated_at: new Date().toISOString(),
      });

      console.log("📍 Foreground update sent:", latitude, longitude);
    },
  );

  isForegroundActive = true;
  showSuccess("Foreground tracking active.");
};
