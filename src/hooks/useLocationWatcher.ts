import { useEffect } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import { refreshLocationPermission, useLocationStore, usePreferences } from "@/store";

/**
 * Keeps the commuter's position fresh while the app is open. Never prompts;
 * the onboarding and "Use my location" toggle ask for permission.
 */
export function useLocationWatcher() {
  const useMyLocation = usePreferences((s) => s.useMyLocation);
  const permission = useLocationStore((s) => s.permission);

  // Permission can change in the phone's settings while the app is in the background.
  useEffect(() => {
    refreshLocationPermission();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshLocationPermission();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!useMyLocation || permission !== "granted") return;

    let subscription: Location.LocationSubscription | null = null;
    let cancelled = false;

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: 15, timeInterval: 5000 },
      (pos) =>
        useLocationStore.setState({
          coords: [pos.coords.longitude, pos.coords.latitude],
          accuracyM: pos.coords.accuracy ?? null,
        }),
    )
      .then((sub) => {
        if (cancelled) sub.remove();
        else subscription = sub;
      })
      .catch((err) => console.warn("Location watch failed:", err));

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [useMyLocation, permission]);
}
