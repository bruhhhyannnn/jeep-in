import { useCallback } from "react";
import { STRINGS } from "@/constants";
import { showWarning } from "@/services/ui/toasts";
import { usePreferences } from "@/store";
import type { StopPoint, TripField } from "@/types";
import type { Transit } from "@/hooks/useTransit";
import { resolveInDirection, type Trip } from "@/hooks/useTrip";

/** Writes a stop into one end of the trip, switching direction when the stop belongs to the other one. */
export function useTripActions(transit: Transit, trip: Trip) {
  const setDirection = usePreferences((s) => s.setDirection);
  const setBoardingStop = usePreferences((s) => s.setBoardingStop);
  const setAlightingStop = usePreferences((s) => s.setAlightingStop);
  const { direction, stopsByDirection } = transit;

  const pickStop = useCallback(
    (stop: StopPoint, field: TripField): boolean => {
      const stops = stopsByDirection[stop.directionId] ?? [];
      const boarding = resolveInDirection(trip.boarding ?? undefined, stops);
      const alighting = resolveInDirection(trip.alighting ?? undefined, stops);

      if (field === "alighting" && boarding && stop.order <= boarding.order) {
        showWarning(STRINGS.commuter.stops.mustBeAfter(boarding.name));
        return false;
      }

      if (stop.directionId !== direction?.id) setDirection(stop.directionId);
      if (field === "boarding") {
        if (alighting && alighting.order <= stop.order) setAlightingStop(null);
        setBoardingStop(stop.id);
      } else {
        setAlightingStop(stop.id);
      }
      return true;
    },
    [
      stopsByDirection,
      trip.boarding,
      trip.alighting,
      direction,
      setDirection,
      setBoardingStop,
      setAlightingStop,
    ],
  );

  return { pickStop };
}
