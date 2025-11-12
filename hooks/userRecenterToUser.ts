import * as Location from "expo-location";
import { useCallback } from "react";
import type { MapRef } from "@/types";
import { useRecenterCamera } from "@/hooks/userRecenterCamera";

/**
 * Gets user's current location, then calls recenterCamera().
 */
export const useRecenterToUser = (mapRef: MapRef) => {
  const { recenterCamera } = useRecenterCamera(mapRef);

  const recenterToUser = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    recenterCamera([loc.coords.longitude, loc.coords.latitude]);
  }, [recenterCamera]);

  return { recenterToUser };
};
