import { useShallow } from "zustand/react/shallow";
import type { StopPoint } from "@/types";
import type { Transit } from "@/hooks/useTransit";
import { quoteFare, type FareQuote } from "@/lib/fare";
import { nearestStop } from "@jeep-in/core/geo";
import { distanceKm } from "@/utils";
import { useLocationStore, usePreferences } from "@/store";

export type BoardingSource = "chosen" | "nearest";

/**
 * Stops are stored per direction, so a stop saved while travelling one way is
 * matched to the same place in the other direction by name, then by distance.
 */
export function resolveInDirection(
  stop: StopPoint | undefined,
  directionStops: StopPoint[],
): StopPoint | null {
  if (!stop) return null;
  if (directionStops.some((s) => s.id === stop.id)) return stop;

  const name = stop.name.trim().toLowerCase();
  const sameName = directionStops.find((s) => s.name.trim().toLowerCase() === name);
  if (sameName) return sameName;

  let best: { stop: StopPoint; km: number } | null = null;
  for (const s of directionStops) {
    const km = distanceKm(stop.lat, stop.long, s.lat, s.long);
    if (km < 0.15 && (!best || km < best.km)) best = { stop: s, km };
  }
  return best?.stop ?? null;
}

// Shared with the driver apps (packages/core).
export { nearestStop };

export type Trip = {
  boarding: StopPoint | null;
  /** "nearest" when the app suggested the stop from your location. */
  boardingSource: BoardingSource | null;
  /** Straight-line distance from you to the boarding stop, when location is on. */
  walkKm: number | null;
  alighting: StopPoint | null;
  tripKm: number | null;
  /** Stops from boarding to getting off, both included. */
  stopCount: number | null;
  quote: FareQuote | null;
  discount: boolean;
};

export function useTrip(transit: Transit): Trip {
  const { boardingStopId, alightingStopId, useMyLocation, discount } = usePreferences(
    useShallow((s) => ({
      boardingStopId: s.boardingStopId,
      alightingStopId: s.alightingStopId,
      useMyLocation: s.useMyLocation,
      discount: s.discount,
    })),
  );
  const coords = useLocationStore((s) => s.coords);
  const permission = useLocationStore((s) => s.permission);

  const { stops, stopById, stopKm, fareMatrix } = transit;
  const locationOn = useMyLocation && permission === "granted" && coords != null;
  const nearest = locationOn ? nearestStop(stops, coords) : null;

  const chosen = boardingStopId ? resolveInDirection(stopById[boardingStopId], stops) : null;
  const boarding = chosen ?? nearest?.stop ?? null;
  const boardingSource: BoardingSource | null = chosen ? "chosen" : nearest ? "nearest" : null;
  const walkKm =
    boarding && locationOn ? distanceKm(coords[1], coords[0], boarding.lat, boarding.long) : null;

  const alightingCandidate = alightingStopId
    ? resolveInDirection(stopById[alightingStopId], stops)
    : null;
  // Getting off only makes sense after boarding in this direction.
  const alighting =
    alightingCandidate && (!boarding || alightingCandidate.order > boarding.order)
      ? alightingCandidate
      : null;

  const tripKm =
    boarding && alighting
      ? Math.abs((stopKm[alighting.id] ?? 0) - (stopKm[boarding.id] ?? 0))
      : null;
  const stopCount =
    boarding && alighting ? stops.indexOf(alighting) - stops.indexOf(boarding) + 1 : null;

  return {
    boarding,
    boardingSource,
    walkKm,
    alighting,
    tripKm,
    stopCount,
    quote: tripKm != null ? quoteFare(fareMatrix, tripKm) : null,
    discount,
  };
}
