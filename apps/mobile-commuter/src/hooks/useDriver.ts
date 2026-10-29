import { useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import { useQuery } from "@tanstack/react-query";
import {
  getDriver,
  setDriverDirection,
  subscribeToAssignedJeepney,
  subscribeToOwnLocation,
} from "@/api";
import { minutesOfDay } from "@/lib/format";
import { distanceKm } from "@/utils";
import { isSharingRunning, startSharing, stopSharing } from "@/services/location/driverTracking";
import {
  markStep,
  recordMotion,
  resetHandshake,
  useAuthStore,
  useDriverSession,
  useSharingStore,
} from "@/store";
import { useRoutes } from "@/hooks/useRoutes";
import { useStopPoints } from "@/hooks/useStopPoints";
import { useNow } from "@/hooks/useNow";
import type { Route, RouteDirection, StopPoint } from "@/types";

/** Mount once in the driver layout. Keeps assignment, sharing state and direction in sync. */
export function useDriverSessionSync() {
  const uid = useAuthStore((s) => s.user?.uid ?? null);
  const phase = useSharingStore((s) => s.phase);
  const directionId = useDriverSession((s) => s.directionId);
  const resting = useDriverSession((s) => s.resting);

  // The unit the manager assigned, live.
  useEffect(() => {
    if (!uid) return;
    return subscribeToAssignedJeepney(uid, (jeepney) =>
      useDriverSession.setState({ jeepney, jeepneyLoaded: true }),
    );
  }, [uid]);

  // Last handshake step: the driver's own record came back from the server.
  useEffect(() => {
    if (!uid) return;
    // Set once one of this session's position writes is seen in flight: the next server
    // copy is that write coming back. Firestore delivers that copy before the write's promise
    // resolves (lastAckAt), so waiting for lastAckAt alone skipped it, and a parked jeep
    // then sat on this step until its next write.
    let ownWriteSeen = false;
    return subscribeToOwnLocation(uid, (location, meta) => {
      const s = useSharingStore.getState();
      if (s.phase !== "starting" && s.phase !== "on") {
        ownWriteSeen = false;
        return;
      }
      if (meta.hasPendingWrites) {
        // A position write: its server timestamp reads as empty until the server has it.
        // (A direction change is a write too, but leaves the timestamp alone.)
        if (location?.isSharing && location.updatedAt == null) ownWriteSeen = true;
        return;
      }
      if (meta.fromCache || !location?.isSharing || location.updatedAt == null) return;
      // A copy from before sharing started (e.g. left on after a crash) isn't a read-back.
      if (!ownWriteSeen && s.lastAckAt == null) return;
      markStep("readback");
      useSharingStore.setState({ phase: "on", confirmedAt: Date.now() });
    });
  }, [uid]);

  // Updates may still be running from before the app was closed.
  useEffect(() => {
    isSharingRunning().then((running) => {
      if (running && useSharingStore.getState().phase === "off") {
        resetHandshake();
        markStep("permission");
      }
    });
  }, []);

  // Direction moves the jeep between the commuters' lists; resting hides it.
  useEffect(() => {
    if (!uid) return;
    setDriverDirection(uid, resting ? null : directionId).catch((err) =>
      console.warn("Direction update failed:", err),
    );
  }, [uid, directionId, resting]);

  // Speed for the "Stop the jeep first" lock while sharing is off.
  useEffect(() => {
    if (phase === "on" || phase === "starting") return;
    let subscription: Location.LocationSubscription | null = null;
    let cancelled = false;
    Location.getForegroundPermissionsAsync()
      .then(({ status }) =>
        status === "granted"
          ? Location.watchPositionAsync(
              { accuracy: Location.Accuracy.Balanced, timeInterval: 3000, distanceInterval: 0 },
              (loc) => recordMotion([loc.coords.longitude, loc.coords.latitude], loc.coords.speed),
            )
          : null,
      )
      .then((sub) => {
        if (cancelled) sub?.remove();
        else subscription = sub;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [phase]);
}

export type Shift = {
  route: Route | null;
  startsAt: number;
  endsAt: number;
  beforeShift: boolean;
  afterShift: boolean;
  now: number;
};

const todayAt = (hhmm: string) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime() + minutesOfDay(hhmm) * 60 * 1000;
};

/** Today's sharing window from the route's working hours. */
export function useShift(): Shift {
  const jeepney = useDriverSession((s) => s.jeepney);
  const { data: routes } = useRoutes();
  const now = useNow(30000);

  const route = routes?.find((r) => r.id === jeepney?.routeId) ?? routes?.[0] ?? null;
  const startsAt = todayAt(route?.workingHours.start ?? "05:00");
  const endsAt = todayAt(route?.workingHours.end ?? "20:00");
  return { route, startsAt, endsAt, beforeShift: now < startsAt, afterShift: now >= endsAt, now };
}

/**
 * Sharing starts by itself at the start of the shift (if the app is open) and
 * stops by itself at the end, unless the driver chose extra time.
 */
export function useShiftAutomation() {
  const shift = useShift();
  const phase = useSharingStore((s) => s.phase);
  const overtimeUntil = useSharingStore((s) => s.overtimeUntil);
  const jeepney = useDriverSession((s) => s.jeepney);

  useEffect(() => {
    if (!shift.beforeShift || phase !== "off" || !jeepney) return;
    const id = setTimeout(
      () => startSharing({ shiftEndsAt: shift.endsAt }),
      shift.startsAt - Date.now(),
    );
    return () => clearTimeout(id);
  }, [shift.beforeShift, shift.startsAt, shift.endsAt, phase, jeepney]);

  useEffect(() => {
    if (phase !== "on" && phase !== "starting") return;
    const limit = Math.max(shift.endsAt, overtimeUntil ?? 0);
    if (shift.now >= limit) stopSharing({ byShiftEnd: true });
  }, [phase, shift.now, shift.endsAt, overtimeUntil]);

  // Blocked by the phone: resume by itself once location is allowed again.
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state !== "active" || useSharingStore.getState().phase !== "blocked") return;
      const services = await Location.hasServicesEnabledAsync();
      const { status } = await Location.getForegroundPermissionsAsync();
      if (services && status === "granted") startSharing({ shiftEndsAt: shift.endsAt });
    });
    return () => sub.remove();
  }, [shift.endsAt]);
}

/** Within this distance of the last stop, the jeep is at the terminal. */
const TERMINAL_KM = 0.15;
/** Beyond this, the jeep has left the terminal. */
const LEFT_TERMINAL_KM = 0.3;

export type EndOfRoute = {
  terminal: StopPoint;
  next: RouteDirection;
  dismiss: () => void;
};

/** Directions and stops of the driver's route. */
export function useDriverRoute() {
  const { route } = useShift();
  const { data: stops } = useStopPoints();

  return useMemo(() => {
    const routeStops = (stops ?? []).filter(
      (s) => s.isActive && (!route || s.routeId === route.id),
    );
    const directions: RouteDirection[] = route?.directions.length
      ? route.directions
      : [...new Set(routeStops.map((s) => s.directionId).filter(Boolean))].map((id) => ({
          id,
          label: id,
          via: [],
          path: [],
        }));
    const stopsByDirection: Record<string, StopPoint[]> = {};
    for (const d of directions) {
      stopsByDirection[d.id] = routeStops
        .filter((s) => s.directionId === d.id)
        .sort((a, b) => a.order - b.order);
    }
    return { route, directions, stopsByDirection };
  }, [route, stops]);
}

/**
 * Asks to switch direction when the jeep reaches the last stop. If the driver
 * doesn't answer, the direction flips by itself when the jeep leaves the terminal.
 */
export function useEndOfRoute(): EndOfRoute | null {
  const { directions, stopsByDirection } = useDriverRoute();
  const directionId = useDriverSession((s) => s.directionId);
  const setDirection = useDriverSession((s) => s.setDirection);
  const position = useSharingStore((s) => s.position);
  const [dismissedAt, setDismissedAt] = useState<string | null>(null);
  const visit = useRef<string | null>(null);

  const stops = directionId ? (stopsByDirection[directionId] ?? []) : [];
  const terminal = stops[stops.length - 1] ?? null;
  const next = directions.find((d) => d.id !== directionId) ?? null;
  const km =
    terminal && position ? distanceKm(position[1], position[0], terminal.lat, terminal.long) : null;
  const atTerminal = km != null && km < TERMINAL_KM;

  useEffect(() => {
    if (!terminal || !next || km == null) return;
    if (atTerminal) {
      visit.current = terminal.id;
    } else if (visit.current === terminal.id && km > LEFT_TERMINAL_KM) {
      // Left the terminal without switching: heading back is the right answer.
      visit.current = null;
      setDismissedAt(null);
      setDirection(next.id);
    }
  }, [atTerminal, km, terminal, next, setDirection]);

  if (!atTerminal || !terminal || !next || dismissedAt === terminal.id) return null;
  return { terminal, next, dismiss: () => setDismissedAt(terminal.id) };
}

/** Driver record, cached for the session. */
export function useDriverProfile() {
  const uid = useAuthStore((s) => s.user?.uid ?? null);
  return useQuery({
    queryKey: ["driver", uid],
    queryFn: () => getDriver(uid!),
    enabled: !!uid,
  });
}
