import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { disableNetwork, enableNetwork } from "firebase/firestore";
import type { StopPoint } from "@/types";
import type { Transit } from "@/hooks/useTransit";
import { subscribeToAllDriverLocations, subscribeToJeepneys } from "@/api";
import { buildLiveJeeps, computeArrivals } from "@/lib/fleet";
import { db } from "@/services/firebase/config";
import { useFleetStore } from "@/store";

/** How long the feed may come from cache before the app says there's no connection. */
const OFFLINE_GRACE_MS = 4000;

/** Mount once, where the map lives. Feeds the fleet store for every screen. */
export function useFleetSubscription() {
  useEffect(() => {
    let offlineTimer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribeJeepneys = subscribeToJeepneys((jeepneys) =>
      useFleetStore.setState({ jeepneys, now: Date.now() }),
    );

    const unsubscribeLocations = subscribeToAllDriverLocations((locations, { fromCache }) => {
      if (!fromCache) {
        clearTimeout(offlineTimer);
        offlineTimer = undefined;
        useFleetStore.setState({
          locations,
          offline: false,
          lastServerAt: Date.now(),
          now: Date.now(),
        });
        return;
      }
      useFleetStore.setState({ locations, now: Date.now() });
      if (!offlineTimer && !useFleetStore.getState().offline) {
        offlineTimer = setTimeout(() => {
          offlineTimer = undefined;
          useFleetStore.setState({ offline: true });
        }, OFFLINE_GRACE_MS);
      }
    });

    const tick = setInterval(() => useFleetStore.setState({ now: Date.now() }), 15000);

    return () => {
      clearTimeout(offlineTimer);
      clearInterval(tick);
      unsubscribeJeepneys();
      unsubscribeLocations();
    };
  }, []);
}

/** Drops and reopens the Firestore connection, for the "Retry" button. */
export async function reconnectFleet() {
  await disableNetwork(db);
  await enableNetwork(db);
}

/** Live jeeps on the current route, each with its direction. */
export function useFleet(transit: Pick<Transit, "route" | "directions" | "paths">) {
  const { jeepneys, locations, now, offline, lastServerAt } = useFleetStore(
    useShallow((s) => ({
      jeepneys: s.jeepneys,
      locations: s.locations,
      now: s.now,
      offline: s.offline,
      lastServerAt: s.lastServerAt,
    })),
  );
  const { route, directions, paths } = transit;

  const jeeps = useMemo(() => {
    const onRoute = route ? jeepneys.filter((j) => j.routeId === route.id) : [];
    return buildLiveJeeps(onRoute.length ? onRoute : jeepneys, locations, directions, paths, now);
  }, [jeepneys, locations, route, directions, paths, now]);

  /** Newest position among live jeeps, for "Live · 8s ago" and "Positions are from 9:32". */
  const lastPositionAt = jeeps.reduce<number | null>(
    (latest, j) =>
      j.updatedAt != null && (latest == null || j.updatedAt > latest) ? j.updatedAt : latest,
    null,
  );

  return { jeeps, offline, lastServerAt, lastPositionAt, now };
}

/** Jeeps in one direction, soonest arrival at `target` first. */
export function useArrivals(
  transit: Transit,
  directionId: string | null,
  target: StopPoint | null,
) {
  const fleet = useFleet(transit);
  const { paths, stopsByDirection, stopAlong, route } = transit;

  const arrivals = useMemo(() => {
    if (!directionId) return [];
    return computeArrivals({
      jeeps: fleet.jeeps.filter((j) => j.directionId === directionId),
      path: paths[directionId] ?? [],
      stops: stopsByDirection[directionId] ?? [],
      stopAlong,
      target,
      speedKph: route?.averageSpeedKph ?? 20,
    });
  }, [fleet.jeeps, directionId, paths, stopsByDirection, stopAlong, target, route]);

  return { ...fleet, arrivals };
}
