import type {
  DriverLocation,
  Jeepney,
  JeepneyStatus,
  LngLat,
  RouteDirection,
  StopPoint,
} from "./model";
import { angleBetween, measureOnPath, segmentBearing } from "./geo";

/** A position older than this is shown as "last seen" and gets no arrival time. */
export const STALE_AFTER_MS = 2 * 60 * 1000;
/** Further than this from the route, a jeep is treated as off route. */
const OFF_ROUTE_KM = 0.35;
/** Within this distance of the stop, the jeep is arriving. */
const ARRIVING_KM = 0.15;
/** Heading is trusted only while moving faster than this (m/s). */
const MIN_HEADING_SPEED = 1.5;

export type LiveJeep = {
  id: string;
  plate: string;
  /** Unit code, e.g. "J-14". */
  unit: string;
  routeId: string;
  status: JeepneyStatus | null;
  position: LngLat;
  updatedAt: number | null;
  stale: boolean;
  directionId: string | null;
};

// Last inferred direction per jeep, so a jeep that stops at a light keeps it.
const directionMemory = new Map<string, string>();

function inferDirection(
  jeepId: string,
  location: DriverLocation,
  directions: RouteDirection[],
  paths: Record<string, LngLat[]>,
): string | null {
  if (location.directionId && directions.some((d) => d.id === location.directionId)) {
    directionMemory.set(jeepId, location.directionId);
    return location.directionId;
  }

  const moving = location.speed == null || location.speed >= MIN_HEADING_SPEED;
  if (location.heading != null && moving) {
    let best: { id: string; diff: number } | null = null;
    for (const direction of directions) {
      const path = paths[direction.id] ?? [];
      const m = measureOnPath(path, [location.long, location.lat]);
      if (!m || m.offsetKm > OFF_ROUTE_KM) continue;
      const diff = angleBetween(location.heading, segmentBearing(path, m.segmentIndex));
      if (diff < 70 && (!best || diff < best.diff)) best = { id: direction.id, diff };
    }
    if (best) {
      directionMemory.set(jeepId, best.id);
      return best.id;
    }
  }

  // With a single direction there is nothing to choose between.
  if (directions.length === 1) return directions[0].id;
  return directionMemory.get(jeepId) ?? null;
}

/** Joins jeepneys with their drivers' shared positions. Only jeeps that are sharing appear. */
export function buildLiveJeeps(
  jeepneys: Jeepney[],
  locations: DriverLocation[],
  directions: RouteDirection[],
  paths: Record<string, LngLat[]>,
  now: number,
): LiveJeep[] {
  const byDriver = new Map(locations.map((l) => [l.driverId, l]));

  return jeepneys.flatMap((j) => {
    const location = j.assignedDriverId ? byDriver.get(j.assignedDriverId) : undefined;
    if (!location?.isSharing || (location.lat === 0 && location.long === 0)) return [];

    return [
      {
        id: j.id,
        plate: j.plateNumber,
        unit: j.jeepneyNumber || j.plateNumber.slice(-4),
        routeId: j.routeId,
        status: j.status ?? null,
        position: [location.long, location.lat] as LngLat,
        updatedAt: location.updatedAt,
        stale: location.updatedAt != null && now - location.updatedAt > STALE_AFTER_MS,
        directionId: inferDirection(j.id, location, directions, paths),
      },
    ];
  });
}

export type ArrivalState = "arriving" | "approaching" | "passed" | "stale" | "offroute";

export type Arrival = {
  jeep: LiveJeep;
  state: ArrivalState;
  /** Minutes until the jeep reaches your stop. Null when it can't be known. */
  etaMin: number | null;
  /** Kilometres along the route to your stop. */
  remainingKm: number | null;
  nextStop: StopPoint | null;
  /** From the jeep's next stop through your stop. */
  stopsAhead: StopPoint[];
};

const STATE_ORDER: Record<ArrivalState, number> = {
  arriving: 0,
  approaching: 1,
  stale: 2,
  offroute: 3,
  passed: 4,
};

/** Arrivals for one direction, soonest first. `target` is your stop, if known. */
export function computeArrivals(params: {
  jeeps: LiveJeep[];
  path: LngLat[];
  stops: StopPoint[];
  /** Stop positions measured along `path`. */
  stopAlong: Record<string, number>;
  target: StopPoint | null;
  speedKph: number;
}): Arrival[] {
  const { jeeps, path, stops, stopAlong, target, speedKph } = params;
  const targetKm = target ? stopAlong[target.id] : undefined;

  const arrivals = jeeps.map((jeep): Arrival => {
    const m = measureOnPath(path, jeep.position);
    if (!m || m.offsetKm > OFF_ROUTE_KM) {
      return {
        jeep,
        state: jeep.stale ? "stale" : "offroute",
        etaMin: null,
        remainingKm: null,
        nextStop: null,
        stopsAhead: [],
      };
    }

    const ahead = stops.filter((s) => (stopAlong[s.id] ?? 0) > m.alongKm + 0.05);
    const nextStop = ahead[0] ?? null;

    if (targetKm == null || !target) {
      return {
        jeep,
        state: jeep.stale ? "stale" : "approaching",
        etaMin: null,
        remainingKm: null,
        nextStop,
        stopsAhead: ahead,
      };
    }

    const remainingKm = targetKm - m.alongKm;
    const stopsAhead = ahead.filter((s) => (stopAlong[s.id] ?? 0) <= targetKm);
    if (remainingKm < -0.05) {
      return {
        jeep,
        state: "passed",
        etaMin: null,
        remainingKm,
        nextStop,
        stopsAhead: [],
      };
    }
    if (jeep.stale) {
      return {
        jeep,
        state: "stale",
        etaMin: null,
        remainingKm,
        nextStop,
        stopsAhead,
      };
    }
    if (remainingKm < ARRIVING_KM) {
      return {
        jeep,
        state: "arriving",
        etaMin: 0,
        remainingKm: 0,
        nextStop: target,
        stopsAhead,
      };
    }
    return {
      jeep,
      state: "approaching",
      etaMin: Math.max(1, Math.round((remainingKm / speedKph) * 60)),
      remainingKm,
      nextStop,
      stopsAhead,
    };
  });

  return arrivals.sort(
    (a, b) =>
      STATE_ORDER[a.state] - STATE_ORDER[b.state] ||
      (a.etaMin ?? Number.POSITIVE_INFINITY) - (b.etaMin ?? Number.POSITIVE_INFINITY),
  );
}

/** Minutes for a jeep to cover `km` at the route's average speed. */
export const minutesFor = (km: number, speedKph: number) =>
  Math.max(1, Math.round((km / speedKph) * 60));
