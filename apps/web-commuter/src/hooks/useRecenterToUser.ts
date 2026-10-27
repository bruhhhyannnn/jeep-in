import { useCallback } from "react";
import type { LngLat } from "@/types";
import { useLocationStore, useMap } from "@/store";

const currentPosition = () =>
  new Promise<LngLat>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.longitude, pos.coords.latitude]),
      reject,
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    ),
  );

/**
 * Flies the camera to the commuter's last known position, asking the browser
 * for a fresh one when there is none yet. `bottomInset` is the height a sheet
 * covers, so the blue dot lands in the visible part of the map.
 */
export const useRecenterToUser = () => {
  const map = useMap();

  const recenterToUser = useCallback(
    async (bottomInset = 0) => {
      const { coords, permission } = useLocationStore.getState();
      if (coords) {
        map.current.flyTo(coords, { duration: 1200, bottomInset });
        return;
      }
      if (permission !== "granted" || !("geolocation" in navigator)) return;

      try {
        const position = await currentPosition();
        map.current.flyTo(position, { duration: 1200, bottomInset });
      } catch (err) {
        console.warn("Couldn't get the current position:", err);
      }
    },
    [map],
  );

  return { recenterToUser };
};
