import { useEffect, useRef } from "react";
import type { LngLat } from "@/types";
import { distanceKm } from "@/utils";
import { refreshLocationPermission, useLocationStore, usePreferences } from "@/store";

/** Same as the native watch: updates only after moving this far (expo-location distanceInterval). */
const DISTANCE_INTERVAL_M = 15;

/**
 * Keeps the commuter's position fresh while the app is open. Never prompts;
 * the onboarding and "Use my location" toggle ask for permission.
 */
export function useLocationWatcher() {
  const useMyLocation = usePreferences((s) => s.useMyLocation);
  const permission = useLocationStore((s) => s.permission);
  const last = useRef<{ coords: LngLat; accuracy: number } | null>(null);

  // Permission can change in the browser's site settings while the app is in the background.
  useEffect(() => {
    refreshLocationPermission();
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshLocationPermission();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    if (!useMyLocation || permission !== "granted" || !("geolocation" in navigator)) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: LngLat = [pos.coords.longitude, pos.coords.latitude];
        const accuracy = pos.coords.accuracy ?? Number.POSITIVE_INFINITY;
        const prev = last.current;
        const movedM = prev
          ? distanceKm(prev.coords[1], prev.coords[0], coords[1], coords[0]) * 1000
          : Number.POSITIVE_INFINITY;
        // Skip small moves, but take a much sharper fix of the same place.
        if (movedM < DISTANCE_INTERVAL_M && prev && accuracy > prev.accuracy / 2) return;
        last.current = { coords, accuracy };

        const heading = pos.coords.heading;
        useLocationStore.setState({
          coords,
          accuracyM: pos.coords.accuracy ?? null,
          heading: heading != null && Number.isFinite(heading) ? heading : null,
        });
      },
      (err) => {
        console.warn("Location watch failed:", err.message);
        if (err.code === err.PERMISSION_DENIED) refreshLocationPermission();
      },
      { enableHighAccuracy: false, maximumAge: 5000, timeout: 30000 },
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [useMyLocation, permission]);
}
