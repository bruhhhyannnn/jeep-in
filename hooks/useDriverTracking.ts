import { useRef } from "react";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { updateDocument } from "@/services/firebase/firestore";

export const useDriverTracking = () => {
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("⚠️ Location permission not granted.");
      return;
    }

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000, // update every 3 seconds
        distanceInterval: 5, // or if moved 5 meters
      },
      async (location) => {
        const coords = location.coords;
        const driverId = await SecureStore.getItemAsync("uid");
        console.log("📍 Tracking callback fired:", location.coords);

        // if (!driverId) {
        //   console.warn("⚠️ No driver ID stored.");
        //   return;
        // }

        try {
          await updateDocument("jeepneys", "abcd", {
            latitude: coords.latitude,
            longitude: coords.longitude,
            speed: coords.speed ?? 0,
            updated_at: new Date().toISOString(),
          });

          console.log("✅ Firestore updated!");
        } catch (err) {
          console.error("❌ Firestore update failed:", err);
        }
      },
    );

    console.log("🚀 Foreground tracking started.");
  };

  const stopTracking = () => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
    console.log("🛑 Foreground tracking stopped.");
  };

  return { startTracking, stopTracking };
};
