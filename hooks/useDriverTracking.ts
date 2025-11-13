import { useRef } from "react";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { updateDocument } from "@/services/firebase/firestore";

export const useDriverTracking = () => {
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  // Compute bearing between two coordinate points
  const computeBearing = (
    prev: Location.LocationObjectCoords | null,
    curr: Location.LocationObjectCoords,
  ) => {
    if (!prev) return 0;

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRad(prev.latitude);
    const lat2 = toRad(curr.latitude);
    const dLon = toRad(curr.longitude - prev.longitude);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("⚠️ Location permission not granted.");
      return;
    }

    let prevCoords: Location.LocationObjectCoords | null = null;

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000, // update every 3 seconds
        distanceInterval: 5, // or if moved 5 meters
      },
      async (location) => {
        const coords = location.coords;
        const driverId = await SecureStore.getItemAsync("uid");

        if (!driverId) {
          console.warn("⚠️ No driver ID stored.");
          return;
        }

        const bearing = computeBearing(prevCoords, coords);
        prevCoords = coords;

        await updateDocument("jeepneys", "abcd", {
          latitude: coords.latitude,
          longitude: coords.longitude,
          speed: coords.speed ?? 0,
          bearing,
          updated_at: new Date().toISOString(),
        });
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
