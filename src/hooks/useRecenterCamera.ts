import { useCallback } from "react";
import { useMap } from "@/store";

/**
 * Hook for smooth flyTo camera movement.
 * Uses the global map context (recommended for your new architecture).
 */
export const useFlyToCamera = () => {
  const map = useMap();

  const flyToCamera = useCallback(
    (coords: [number, number], duration = 1200) => {
      map.current.flyTo(coords, duration);
    },
    [map],
  );

  return { flyToCamera };
};
