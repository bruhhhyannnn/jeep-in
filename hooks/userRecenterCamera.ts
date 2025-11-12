import { useCallback } from "react";
import type { MapRef } from "@/types";

/**
 * Generic hook that lets you move the map camera to any coordinate.
 * Uses the recenter() function defined inside your MapboxMapRef.
 */
export const useRecenterCamera = (mapRef: MapRef) => {
  const recenterCamera = useCallback(
    (coords: [number, number]) => {
      mapRef.current?.recenter(coords);
    },
    [mapRef],
  );

  return { recenterCamera };
};
