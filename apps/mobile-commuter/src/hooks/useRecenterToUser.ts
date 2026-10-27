import * as Location from "expo-location";
import { useCallback } from "react";
import { useLocationStore, useMap } from "@/store";

/**
 * Flies the camera to the commuter's last known position, asking the phone
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
      if (permission !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      map.current.flyTo([loc.coords.longitude, loc.coords.latitude], {
        duration: 1200,
        bottomInset,
      });
    },
    [map],
  );

  return { recenterToUser };
};
