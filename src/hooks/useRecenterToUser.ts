import * as Location from "expo-location";
import { useCallback } from "react";
import { useMap } from "@/store";

/**
 * Gets user's current location then animates camera using flyTo().
 */
export const useRecenterToUser = () => {
  const map = useMap();

  const recenterToUser = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    map.current.flyTo(
      [loc.coords.longitude, loc.coords.latitude],
      1200, // smooth duration
    );
  }, [map]);

  return { recenterToUser };
};
