import { useEffect, useRef } from "react";
import { OUT_OF_SERVICE } from "@jeep-in/core/fleet";
import { STRINGS } from "@/constants";
import { notifyNow } from "@/services/notifications/local";
import { ALERT_MINUTES, useAlerts, useFleetStore, usePreferences } from "@/store";
import { useTransit } from "@/hooks/useTransit";
import { useArrivals, useFleet } from "@/hooks/useFleet";

/** A followed jeep missing or stale for this long is dropped with a "stopped sharing" alert. */
const LOST_AFTER_MS = 3 * 60 * 1000;

/**
 * Turns the followed jeep and the "alert me when one goes live" request into
 * alerts. Runs while the app is open; there is no server to push when it's closed.
 */
export function useCommuterWatchers() {
  const transit = useTransit();
  const following = useAlerts((s) => s.following);
  const liveWatch = useAlerts((s) => s.liveWatch);
  const target = following ? (transit.stopById[following.stopId] ?? null) : null;
  const { arrivals, offline, lastServerAt } = useArrivals(
    transit,
    following?.directionId ?? null,
    target,
  );
  const { jeeps } = useFleet(transit);
  const missingSince = useRef<number | null>(null);
  // The operator took the followed jeep off the road from the dashboard.
  const followedOut = useFleetStore((s) =>
    following
      ? s.jeepneys.some((j) => j.id === following.jeepneyId && j.status === OUT_OF_SERVICE)
      : false,
  );

  const t = STRINGS.commuter.alerts;

  useEffect(() => {
    if (!following) {
      missingSince.current = null;
      return;
    }
    const { push, unfollow } = useAlerts.getState();
    const notify = (title: string, body: string) => {
      push({ kind: "arrival", title, body, jeepneyId: following.jeepneyId });
      if (usePreferences.getState().arrivalAlerts) notifyNow(title, body).catch(() => {});
    };

    // Say why straight away, rather than waiting for it to count as lost.
    if (followedOut) {
      const title = t.outTitle(following.unit);
      push({ kind: "lost", title, body: t.outBody, jeepneyId: following.jeepneyId });
      if (usePreferences.getState().arrivalAlerts) notifyNow(title, t.outBody).catch(() => {});
      unfollow();
      return;
    }

    const arrival = arrivals.find((a) => a.jeep.id === following.jeepneyId);
    const usable = arrival && arrival.state !== "stale" && arrival.state !== "offroute";

    // Only judge a missing jeep once the feed has reached the server.
    if (!usable && lastServerAt != null && !offline) {
      missingSince.current ??= Date.now();
      if (Date.now() - missingSince.current > LOST_AFTER_MS) {
        push({
          kind: "lost",
          title: t.lostTitle(following.unit),
          body: t.lostBody,
          jeepneyId: following.jeepneyId,
        });
        unfollow();
      }
      return;
    }
    missingSince.current = null;
    if (!arrival) return;

    if (arrival.state === "passed") {
      push({
        kind: "passed",
        title: t.passedTitle(following.unit),
        body: t.passedBody(following.stopName),
        jeepneyId: following.jeepneyId,
      });
      unfollow();
    } else if (arrival.etaMin != null && arrival.etaMin <= ALERT_MINUTES) {
      notify(
        t.arrivalTitle(following.unit, Math.max(arrival.etaMin, 1)),
        t.arrivalBody(following.stopName, following.plate),
      );
      unfollow();
    }
  }, [arrivals, following, followedOut, offline, lastServerAt, t]);

  useEffect(() => {
    if (!liveWatch) return;
    const jeep = jeeps.find((j) => j.directionId === liveWatch.directionId && !j.stale);
    if (!jeep) return;

    const label =
      transit.directions.find((d) => d.id === liveWatch.directionId)?.label ??
      STRINGS.commuter.routeFallback;
    const title = t.liveTitle(label);
    const body = t.liveBody(jeep.unit);
    useAlerts.getState().push({ kind: "live", title, body, jeepneyId: jeep.id });
    useAlerts.getState().stopWatchingLive();
    if (usePreferences.getState().arrivalAlerts) notifyNow(title, body).catch(() => {});
  }, [jeeps, liveWatch, transit.directions, t]);
}
