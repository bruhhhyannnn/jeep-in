import * as Location from "expo-location";
import { auth } from "@/services/firebase/config";
import { updateDocument } from "@/services/firebase/firestore";
import type { Jeepney } from "@/types";

let foregroundWatcher: Location.LocationSubscription | null = null;

const getCurrentDriverJeepneyId = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  // TODO: replace this with real mapping (driver_profile -> jeepney)
  // For now, assume jeepney doc id == user.uid
  console.log(user);
  return user.uid;
};

// Start tracking logic
export const startDriverTracking = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.warn("Location permission not granted.");
    return;
  }

  if (foregroundWatcher) {
    console.log("Driver tracking already running.");
    return;
  }

  const jeepneyId = await getCurrentDriverJeepneyId();
  console.log("JEEPNEY ID!: ", jeepneyId);
  if (!jeepneyId) {
    console.warn("No jeepneyId for this driver.");
    return;
  }

  foregroundWatcher = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 5000, // 5s
      distanceInterval: 5, // meters
    },
    async (location) => {
      const { latitude, longitude, speed, heading } = location.coords;

      await updateDocument<Jeepney>("jeepneys", jeepneyId, {
        latitude,
        longitude,
        // optional extras for later
        updated_at: new Date().toISOString(),
        // @ts-ignore – only if you don't have heading/speed on Jeepney yet
        speed,
        // @ts-ignore
        bearing: heading,
      });
    },
  );

  console.log("🚐 Driver foreground tracking started.");
};

// Stop tracking logic
export const stopDriverTracking = async () => {
  if (foregroundWatcher) {
    await foregroundWatcher.remove();
    foregroundWatcher = null;
    console.log("🛑 Driver foreground tracking stopped.");
  }
};
