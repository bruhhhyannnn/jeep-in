import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { FareMatrix, LngLat, Route, RouteDirection, StopPoint } from "@/types";
import { getRoadPath, PLACEHOLDER_FARE_MATRIX } from "@/api";
import { measureOnPath } from "@/lib/geo";
import { usePreferences } from "@/store";
import { useRoutes } from "@/hooks/useRoutes";
import { useStopPoints } from "@/hooks/useStopPoints";
import { useFareMatrices } from "@/hooks/useFareMatrices";

export type Transit = {
  loading: boolean;
  route: Route | null;
  directions: RouteDirection[];
  /** The direction the commuter picked, or the first one until they pick. */
  direction: RouteDirection | null;
  stopsByDirection: Record<string, StopPoint[]>;
  /** Stops of the current direction in route order. */
  stops: StopPoint[];
  stopById: Record<string, StopPoint>;
  paths: Record<string, LngLat[]>;
  /** Kilometres from the first stop of its direction, per stop id. Used for fares and labels. */
  stopKm: Record<string, number>;
  /** Kilometres from the start of the direction's path, per stop id. Used to compare with jeep positions. */
  stopAlong: Record<string, number>;
  fareMatrix: FareMatrix;
};

const straightPath = (stops: StopPoint[]): LngLat[] => stops.map((s) => [s.long, s.lat]);

/** Development only: localStorage "jeepin-dev-route" picks a route by id, e.g. while a test route is active. */
function devRouteId(): string | null {
  if (!import.meta.env.DEV) return null;
  try {
    return localStorage.getItem("jeepin-dev-route");
  } catch {
    return null;
  }
}

/** Route, directions, stops and fares, joined and ordered. */
export function useTransit(): Transit {
  const routesQuery = useRoutes();
  const stopsQuery = useStopPoints();
  const faresQuery = useFareMatrices();
  const preferredDirectionId = usePreferences((s) => s.directionId);

  const base = useMemo(() => {
    const routes = routesQuery.data ?? [];
    const allStops = (stopsQuery.data ?? []).filter((s) => s.isActive);
    const devRoute = routes.find((r) => r.id === devRouteId());
    const route = devRoute ?? routes.find((r) => r.isActive) ?? routes[0] ?? null;

    // Older stop documents may not carry the route id; fall back to every stop.
    const routeStops = route ? allStops.filter((s) => s.routeId === route.id) : [];
    const stops = routeStops.length ? routeStops : allStops;

    // Routes without direction objects get them from the stops' direction ids.
    const directions: RouteDirection[] = route?.directions.length
      ? route.directions
      : [...new Set(stops.map((s) => s.directionId).filter(Boolean))].map((id) => ({
          id,
          label: id,
          via: [],
          path: [],
        }));

    const stopsByDirection: Record<string, StopPoint[]> = {};
    for (const d of directions) {
      stopsByDirection[d.id] = stops
        .filter((s) => s.directionId === d.id)
        .sort((a, b) => a.order - b.order);
    }

    return { route, directions, stopsByDirection, allStops };
  }, [routesQuery.data, stopsQuery.data]);

  // Directions without stored geometry are traced along the road through their stops.
  const missingPaths = base.directions.filter(
    (d) => d.path.length < 2 && (base.stopsByDirection[d.id]?.length ?? 0) >= 2,
  );
  const roadPaths = useQueries({
    queries: missingPaths.map((d) => {
      const points = straightPath(base.stopsByDirection[d.id]);
      return {
        queryKey: ["road-path", d.id, points.flat().join(",")],
        queryFn: () => getRoadPath(points),
        staleTime: Number.POSITIVE_INFINITY,
        retry: 1,
      };
    }),
  });
  const roadPathKey = roadPaths.map((q) => q.dataUpdatedAt).join(",");

  return useMemo(() => {
    const { route, directions, stopsByDirection, allStops } = base;

    const paths: Record<string, LngLat[]> = {};
    directions.forEach((d) => {
      const traced = roadPaths[missingPaths.indexOf(d)]?.data;
      paths[d.id] =
        d.path.length >= 2 ? d.path : (traced ?? straightPath(stopsByDirection[d.id] ?? []));
    });

    const stopKm: Record<string, number> = {};
    const stopAlong: Record<string, number> = {};
    for (const d of directions) {
      const stops = stopsByDirection[d.id] ?? [];
      for (const s of stops) {
        stopAlong[s.id] = measureOnPath(paths[d.id], [s.long, s.lat])?.alongKm ?? 0;
      }
      const firstAlong = stops[0] ? stopAlong[stops[0].id] : 0;
      for (const s of stops) {
        stopKm[s.id] = s.distanceKm ?? Math.max(0, stopAlong[s.id] - firstAlong);
      }
    }

    const direction =
      directions.find((d) => d.id === preferredDirectionId) ?? directions[0] ?? null;
    const matrices = faresQuery.data ?? [];
    const fareMatrix: FareMatrix = (route && matrices.find((m) => m.routeId === route.id)) ??
      matrices[0] ?? { id: "placeholder", routeId: route?.id ?? "", ...PLACEHOLDER_FARE_MATRIX };

    return {
      loading: routesQuery.isPending || stopsQuery.isPending,
      route,
      directions,
      direction,
      stopsByDirection,
      stops: direction ? (stopsByDirection[direction.id] ?? []) : [],
      stopById: Object.fromEntries(allStops.map((s) => [s.id, s])),
      paths,
      stopKm,
      stopAlong,
      fareMatrix,
    };
    // roadPathKey stands in for the roadPaths array, which is a new object every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    base,
    roadPathKey,
    preferredDirectionId,
    faresQuery.data,
    routesQuery.isPending,
    stopsQuery.isPending,
  ]);
}
