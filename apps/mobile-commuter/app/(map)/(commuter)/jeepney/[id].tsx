import { useEffect, useMemo, useRef } from "react";
import { View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { resolveInDirection, useArrivals, useFleet, useTransit, useTrip } from "@/hooks";
import { minutesFor } from "@/lib/fleet";
import { boundsOf, measureOnPath } from "@/lib/geo";
import { formatAgo, formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "@/services/notifications/local";
import { ALERT_MINUTES, useAlerts, useMap, useMapUi } from "@/store";
import type { LngLat, StopPoint } from "@/types";
import { Button, Card, IconButton, Sheet, ThemedText } from "@/components/ui";
import { LiveChip, Rail, RailMarker } from "@/components/commuter";

/** Further than this from the route, the jeep isn't placed on the stops list. */
const OFF_ROUTE_KM = 0.35;

type AheadRow = {
  key: string;
  name: string;
  note: string | null;
  /** Distance from the start of the route, as on the stop list. */
  km: string | null;
  eta: string;
  kind: "here" | "yours" | "stop";
};

function StatusPill({ label }: { label: string }) {
  return (
    <View className="self-start rounded-full border-[1.5px] border-action bg-card px-2.5 py-1">
      <ThemedText variant="label">{label}</ThemedText>
    </View>
  );
}

export default function JeepneyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const map = useMap();

  const transit = useTransit();
  const trip = useTrip(transit);
  const { directions, stopsByDirection, stopAlong, stopKm, paths, route } = transit;

  // Arrival is measured along the jeep's own direction, at your stop on that direction.
  const { jeeps, offline } = useFleet(transit);
  const jeep = jeeps.find((j) => j.id === id) ?? null;
  const directionId = jeep?.directionId ?? null;
  const dirStops = directionId ? (stopsByDirection[directionId] ?? []) : [];
  const target = directionId ? resolveInDirection(trip.boarding ?? undefined, dirStops) : null;
  const { arrivals } = useArrivals(transit, directionId, target);
  const direction = directions.find((d) => d.id === directionId) ?? null;
  const arrival = arrivals.find((a) => a.jeep.id === id) ?? null;

  const following = useAlerts((s) => s.following);
  const follow = useAlerts((s) => s.follow);
  const unfollow = useAlerts((s) => s.unfollow);
  const isFollowing = following?.jeepneyId === id;

  const live = !!jeep && !jeep.stale && !offline;
  const etaMin =
    live && (arrival?.state === "approaching" || arrival?.state === "arriving")
      ? arrival.etaMin
      : null;
  const remainingKm = etaMin != null ? (arrival?.remainingKm ?? null) : null;
  const badge =
    etaMin != null && remainingKm != null ? `${formatKm(remainingKm)} · ${etaMin} min` : null;

  const selectJeep = useMapUi((s) => s.selectJeep);
  useEffect(() => {
    selectJeep(id, badge);
  }, [id, badge, selectJeep]);
  useEffect(() => () => selectJeep(null), [selectJeep]);

  // A strip of map stays above the sheet: about a fifth of a phone, a third of a tablet.
  const tablet = width >= 600;
  const sheetHeight = Math.round(height * (tablet ? 0.64 : 0.74));

  // Frame the jeep and your stop once, in the strip above the sheet.
  const framed = useRef(false);
  useEffect(() => {
    if (framed.current || !jeep) return;
    framed.current = true;
    const points: LngLat[] = [jeep.position];
    if (target) points.push([target.long, target.lat]);
    const bounds = boundsOf(points);
    if (!bounds) return;
    if (points.length === 1) {
      map.current.flyTo(jeep.position, { zoom: 15, bottomInset: sheetHeight });
    } else {
      map.current.fitBounds(bounds.sw, bounds.ne, {
        top: top + 56,
        right: 72,
        bottom: sheetHeight + 24,
        left: 72,
      });
    }
  }, [jeep, target, map, sheetHeight, top]);

  // Where the jeep is now, then every stop it still has to reach on this direction.
  const ahead = useMemo((): AheadRow[] => {
    if (!jeep || !directionId) return [];
    const m = measureOnPath(paths[directionId] ?? [], jeep.position);
    if (!m || m.offsetKm > OFF_ROUTE_KM) return [];

    const speed = route?.averageSpeedKph ?? 20;
    const along = (s: StopPoint) => stopAlong[s.id] ?? 0;
    const passed = dirStops.filter((s) => along(s) <= m.alongKm + 0.05);
    const coming = dirStops.filter((s) => along(s) > m.alongKm + 0.05);
    const previous = passed[passed.length - 1];
    const next = coming[0];
    const last = dirStops[dirStops.length - 1];
    const t = STRINGS.commuter.jeepney;

    const here: AheadRow = {
      key: "here",
      name: t.hereNow(jeep.unit),
      note:
        previous && next ? t.between(previous.name, next.name) : next ? t.before(next.name) : null,
      km: null,
      eta: live ? t.live : "—",
      kind: "here",
    };
    return [
      here,
      ...coming.map(
        (s): AheadRow => ({
          key: s.id,
          name: s.name,
          note: s.id === target?.id ? t.yourStop : s.id === last?.id ? t.endOfRoute : null,
          km: stopKm[s.id] != null ? formatKm(stopKm[s.id]) : null,
          eta: live ? `${minutesFor(along(s) - m.alongKm, speed)} min` : "—",
          kind: s.id === target?.id ? "yours" : "stop",
        }),
      ),
    ];
  }, [jeep, directionId, paths, dirStops, stopAlong, stopKm, route, target, live]);

  const t = STRINGS.commuter.jeepney;

  const status = !jeep
    ? t.notFound
    : !directionId
      ? t.unknownDirection
      : !target
        ? t.noStop
        : arrival?.state === "passed"
          ? t.passed
          : arrival?.state === "offroute"
            ? t.offRoute
            : !live && jeep.updatedAt != null
              ? t.stale(formatAgo(jeep.updatedAt))
              : null;

  const pill = !jeep ? null : !live ? (
    <LiveChip updatedAt={jeep.updatedAt} stale />
  ) : (
    <StatusPill
      label={
        arrival?.state === "arriving"
          ? t.arriving
          : arrival?.state === "passed"
            ? t.passedPill
            : arrival?.state === "offroute" || ahead.length === 0
              ? t.offRoutePill
              : t.onRoute
      }
    />
  );

  const onNotify = async () => {
    if (!jeep || !target || !directionId) return;
    if ((await getNotificationPermission()) === "undetermined")
      await requestNotificationPermission();
    follow({
      jeepneyId: jeep.id,
      unit: jeep.unit,
      plate: jeep.plate,
      stopId: target.id,
      stopName: target.name,
      directionId,
    });
  };

  const footer = jeep ? (
    <View className="gap-2">
      <View className="flex-row gap-2.5">
        <View className="flex-1">
          {isFollowing ? (
            <Button
              label={t.following(ALERT_MINUTES)}
              variant="outline"
              size="md"
              iconName="checkmark"
              onPress={unfollow}
            />
          ) : (
            <Button
              label={t.notify(ALERT_MINUTES)}
              size="md"
              onPress={onNotify}
              disabled={etaMin == null}
            />
          )}
        </View>
        <IconButton
          iconName="notifications-outline"
          size={48}
          accessibilityLabel={t.alerts}
          onPress={() => router.navigate(ROUTES.commuter.alerts)}
        />
      </View>
      <ThemedText variant="label" tone="muted" className="text-center">
        {isFollowing && following
          ? STRINGS.commuter.following.alertAt(ALERT_MINUTES, following.stopName)
          : t.notifyNote}
      </ThemedText>
    </View>
  ) : (
    <Button label={t.backToMap} onPress={() => router.navigate(ROUTES.commuter.home)} />
  );

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <View style={{ top: top + 8 }} className="absolute left-4">
        <IconButton iconName="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
      </View>

      <Sheet snapPoints={[sheetHeight, height - top - 64]} footer={footer}>
        {jeep ? (
          <View className="gap-3.5">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <ThemedText variant="title">{jeep.plate}</ThemedText>
                <ThemedText variant="small" tone="muted">
                  {direction ? t.unitToward(jeep.unit, direction.label) : jeep.unit}
                </ThemedText>
              </View>
              {pill}
            </View>

            {etaMin != null && remainingKm != null ? (
              <View className="flex-row gap-2.5">
                <View className="flex-1 rounded-[18px] bg-inverse p-3">
                  <ThemedText variant="momentMd" tone="onInverse">
                    {etaMin}
                    <ThemedText variant="strong" tone="onInverse">
                      {" "}
                      min
                    </ThemedText>
                  </ThemedText>
                  <ThemedText variant="eyebrow" tone="onInverseMuted" className="mt-1">
                    {t.arrivesIn}
                  </ThemedText>
                </View>
                <Card className="flex-1 rounded-[18px] p-3">
                  <ThemedText variant="title">
                    {remainingKm.toFixed(1)}
                    <ThemedText variant="strong"> km</ThemedText>
                  </ThemedText>
                  <ThemedText variant="eyebrow" tone="muted" className="mt-1">
                    {t.distance}
                  </ThemedText>
                </Card>
              </View>
            ) : (
              status && (
                <Card dashed className="p-4">
                  <ThemedText tone="muted">{status}</ThemedText>
                </Card>
              )
            )}

            {ahead.length > 1 && (
              <Card className="gap-1 px-4 pb-2 pt-3">
                <View className="flex-row items-baseline justify-between">
                  <ThemedText variant="eyebrow" tone="muted">
                    {t.stopsAhead}
                  </ThemedText>
                  <ThemedText variant="dataSm" tone="muted">
                    {t.toGo(ahead.length - 1)}
                  </ThemedText>
                </View>
                <Rail subtle>
                  {ahead.map((row) => {
                    const strong = row.kind !== "stop";
                    return (
                      <View key={row.key} className="min-h-[44px] flex-row items-center gap-2.5">
                        <RailMarker
                          kind={
                            row.kind === "here"
                              ? "here"
                              : row.kind === "yours"
                                ? "boarding"
                                : "ring"
                          }
                        />
                        <View className="flex-1">
                          <ThemedText
                            variant={strong ? "strong" : "body"}
                            tone={strong ? "action" : "ink"}
                            numberOfLines={1}
                          >
                            {row.name}
                          </ThemedText>
                          {row.note && (
                            <ThemedText variant="label" tone="muted" numberOfLines={1}>
                              {row.note}
                            </ThemedText>
                          )}
                        </View>
                        {row.km && (
                          <ThemedText variant="dataSm" tone="faint">
                            {row.km}
                          </ThemedText>
                        )}
                        <View
                          className={cn(
                            "rounded-full border-[1.5px] px-2.5 py-1",
                            strong ? "border-action" : "border-line",
                          )}
                        >
                          <ThemedText variant="dataSm" tone={strong ? "action" : "muted"}>
                            {row.eta}
                          </ThemedText>
                        </View>
                      </View>
                    );
                  })}
                </Rail>
              </Card>
            )}
          </View>
        ) : (
          <Card dashed className="p-4">
            <ThemedText tone="muted">{t.notFound}</ThemedText>
          </Card>
        )}
      </Sheet>
    </View>
  );
}
