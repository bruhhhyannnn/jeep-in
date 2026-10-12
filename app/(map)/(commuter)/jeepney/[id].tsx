import { useEffect, useMemo, useRef } from "react";
import { Share, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { resolveInDirection, useArrivals, useFleet, useTransit, useTrip } from "@/hooks";
import { minutesFor } from "@/lib/fleet";
import { boundsOf } from "@/lib/geo";
import { formatAgo, formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "@/services/notifications/local";
import { ALERT_MINUTES, useAlerts, useMap, useMapUi } from "@/store";
import type { LngLat } from "@/types";
import { Button, Card, IconButton, Sheet, ThemedText } from "@/components/ui";
import { LiveChip, Rail, RailMarker } from "@/components/commuter";

export default function JeepneyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const map = useMap();

  const transit = useTransit();
  const trip = useTrip(transit);
  const { directions, stopsByDirection, stopAlong, route } = transit;

  // Arrival is measured along the jeep's own direction, at your stop on that direction.
  const { jeeps } = useFleet(transit);
  const jeep = jeeps.find((j) => j.id === id) ?? null;
  const directionId = jeep?.directionId ?? null;
  const direction = directions.find((d) => d.id === directionId) ?? null;
  const target = directionId
    ? resolveInDirection(trip.boarding ?? undefined, stopsByDirection[directionId] ?? [])
    : null;
  const { arrivals } = useArrivals(transit, directionId, target);
  const arrival = arrivals.find((a) => a.jeep.id === id) ?? null;

  const following = useAlerts((s) => s.following);
  const follow = useAlerts((s) => s.follow);
  const unfollow = useAlerts((s) => s.unfollow);
  const isFollowing = following?.jeepneyId === id;

  const etaMin =
    arrival?.state === "approaching" || arrival?.state === "arriving" ? arrival.etaMin : null;
  const remainingKm = etaMin != null ? (arrival?.remainingKm ?? null) : null;
  const badge =
    etaMin != null && remainingKm != null ? `${formatKm(remainingKm)} · ${etaMin} min` : null;

  const selectJeep = useMapUi((s) => s.selectJeep);
  useEffect(() => {
    selectJeep(id, badge);
  }, [id, badge, selectJeep]);
  useEffect(() => () => selectJeep(null), [selectJeep]);

  const sheetHeight = Math.round(height * 0.64);

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
        top: top + 72,
        right: 56,
        bottom: sheetHeight + 32,
        left: 56,
      });
    }
  }, [jeep, target, map, sheetHeight, top]);

  // Stops between the jeep and your stop, with distance and minutes from the jeep.
  const ahead = useMemo(() => {
    if (!arrival || !target || remainingKm == null) return [];
    const jeepAlong = (stopAlong[target.id] ?? 0) - remainingKm;
    const speed = route?.averageSpeedKph ?? 20;
    return arrival.stopsAhead.map((s, i) => {
      const km = Math.max(0, (stopAlong[s.id] ?? 0) - jeepAlong);
      return { stop: s, km, min: minutesFor(km, speed), next: i === 0, yours: s.id === target.id };
    });
  }, [arrival, target, remainingKm, stopAlong, route]);

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
            : jeep.stale && jeep.updatedAt != null
              ? t.stale(formatAgo(jeep.updatedAt))
              : null;

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
              iconName="checkmark"
              onPress={unfollow}
            />
          ) : (
            <Button
              label={t.notify(ALERT_MINUTES)}
              iconName="notifications-outline"
              onPress={onNotify}
              disabled={etaMin == null}
            />
          )}
        </View>
        <IconButton
          iconName="share-social-outline"
          size={52}
          accessibilityLabel="Share arrival time"
          disabled={etaMin == null || !target}
          onPress={() =>
            target &&
            etaMin != null &&
            Share.share({ message: t.share(jeep.unit, etaMin, target.name) })
          }
        />
      </View>
      <ThemedText variant="small" tone="muted" className="text-center">
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
          <View className="gap-4">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <ThemedText variant="title">{jeep.plate}</ThemedText>
                <ThemedText variant="small" tone="muted">
                  {direction ? t.unitToward(jeep.unit, direction.label) : jeep.unit}
                </ThemedText>
              </View>
              <LiveChip updatedAt={jeep.updatedAt} stale={jeep.stale} />
            </View>

            {etaMin != null && remainingKm != null ? (
              <View className="flex-row gap-2.5">
                <View className="flex-1 rounded-tile bg-inverse p-3.5">
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
                <Card className="flex-1 rounded-tile p-3.5">
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

            {ahead.length > 0 && (
              <Card className="gap-2 px-4 pb-2 pt-3">
                <View className="flex-row items-baseline justify-between">
                  <ThemedText variant="eyebrow" tone="muted">
                    {t.stopsAhead}
                  </ThemedText>
                  <ThemedText variant="dataSm" tone="muted">
                    {t.toGo(ahead.length)}
                  </ThemedText>
                </View>
                <Rail>
                  {ahead.map(({ stop, km, min, next, yours }) => (
                    <View key={stop.id} className="min-h-[48px] flex-row items-center gap-2.5 py-1">
                      <RailMarker kind={yours ? "boarding" : next ? "next" : "ring"} />
                      <View className="flex-1">
                        <ThemedText variant={yours ? "strong" : "body"} numberOfLines={1}>
                          {stop.name}
                        </ThemedText>
                        {(next || yours) && (
                          <ThemedText variant="label" tone="muted">
                            {yours ? t.yourStop : t.nextStop}
                          </ThemedText>
                        )}
                      </View>
                      <ThemedText variant="dataSm" tone="faint">
                        {formatKm(km)}
                      </ThemedText>
                      <View
                        className={cn(
                          "rounded-full px-2.5 py-1",
                          yours ? "border-2 border-action" : "border-[1.5px] border-line",
                        )}
                      >
                        <ThemedText variant="dataSm" tone={yours ? "action" : "muted"}>
                          {`${min} min`}
                        </ThemedText>
                      </View>
                    </View>
                  ))}
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
