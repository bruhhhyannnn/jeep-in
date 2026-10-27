import { useEffect } from "react";
import { ROUTES, STRINGS } from "@/constants";
import {
  useArrivals,
  useRecenterToUser,
  useSafeAreaInsets,
  useTransit,
  useTrip,
  useWindowDimensions,
} from "@/hooks";
import { boundsOf } from "@/lib/geo";
import { formatAgo } from "@/lib/format";
import { router } from "@/lib/router";
import { useAlerts, useLocationStore, useMap, useMapInitStore, usePreferences } from "@/store";
import { layout, useTheme } from "@/theme";
import {
  Button,
  Card,
  Chip,
  Icon,
  IconButton,
  Pressable,
  Sheet,
  Spinner,
  ThemedText,
  View,
} from "@/components/ui";
import {
  FOLLOWING_CARD_SPACE,
  FollowingCard,
  JeepRow,
  LiveChip,
  NoJeepsCard,
  OfflineBanner,
  Rail,
  RailMarker,
  useTabBarInset,
} from "@/components/commuter";

const TOP_CONTROLS = 76;

export default function MapTab() {
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { colors, shadows } = useTheme();
  const map = useMap();
  const bottomChrome = useTabBarInset();
  const { recenterToUser } = useRecenterToUser();

  const transit = useTransit();
  const trip = useTrip(transit);
  const { direction, directions, route, paths } = transit;
  const { arrivals, jeeps, offline, lastPositionAt } = useArrivals(
    transit,
    direction?.id ?? null,
    trip.boarding,
  );

  const following = useAlerts((s) => s.following);
  const liveWatch = useAlerts((s) => s.liveWatch);
  const watchLive = useAlerts((s) => s.watchLive);
  const stopWatchingLive = useAlerts((s) => s.stopWatchingLive);
  const setDirection = usePreferences((s) => s.setDirection);
  const coords = useLocationStore((s) => s.coords);
  const hasCentered = useMapInitStore((s) => s.hasCentered);
  const setHasCentered = useMapInitStore((s) => s.setHasCentered);

  // The followed jeep is measured to the stop the alert was set for.
  const followTarget = following ? (transit.stopById[following.stopId] ?? null) : null;
  const { arrivals: followArrivals } = useArrivals(
    transit,
    following?.directionId ?? null,
    followTarget,
  );
  const followArrival = following
    ? (followArrivals.find((a) => a.jeep.id === following.jeepneyId) ?? null)
    : null;

  const available = height - bottomChrome - top - TOP_CONTROLS;
  const snapPoints = [
    140 + (following ? FOLLOWING_CARD_SPACE : 0),
    Math.round(available * 0.55),
    available,
  ];

  // First open: centre on the commuter, or show the whole route when location is off.
  useEffect(() => {
    if (hasCentered) return;
    if (coords) {
      map.current.flyTo(coords, { zoom: 15, bottomInset: snapPoints[1] });
      setHasCentered();
      return;
    }
    const path = direction ? paths[direction.id] : undefined;
    const bounds = path && boundsOf(path);
    if (bounds) {
      map.current.fitBounds(bounds.sw, bounds.ne, {
        top: top + TOP_CONTROLS + 24,
        right: 32,
        bottom: snapPoints[1] + bottomChrome,
        left: 32,
      });
      setHasCentered();
    }
    // Same dependencies as the native screen: it runs again only until the map has centred.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCentered, coords, direction, paths]);

  const t = STRINGS.commuter.home;
  const other = directions.find((d) => d.id !== direction?.id) ?? null;
  const otherLive = other ? jeeps.filter((j) => j.directionId === other.id && !j.stale).length : 0;
  const nearestId = arrivals.find((a) => a.etaMin != null)?.jeep.id;

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <View
        pointerEvents="box-none"
        style={{ top: top + 8 }}
        className="absolute left-4 right-4 items-center"
      >
        <View
          pointerEvents="box-none"
          style={{ maxWidth: layout.contentMaxWidth }}
          className="w-full flex-row items-start gap-2.5"
        >
          {offline ? (
            <View className="flex-1">
              <OfflineBanner since={lastPositionAt} />
            </View>
          ) : (
            <>
              <Pressable
                onPress={() => router.push(ROUTES.commuter.direction)}
                accessibilityRole="button"
                accessibilityLabel={`${STRINGS.commuter.map.direction}: ${direction?.label ?? STRINGS.commuter.map.chooseDirection}`}
                style={shadows.md}
                className="h-[52px] flex-1 flex-row items-center gap-3 rounded-full border-[1.5px] border-line bg-card px-4 active:opacity-90"
              >
                <Icon name="navigate" size={18} tone="action" />
                <View className="flex-1">
                  <ThemedText variant="label" tone="muted">
                    {STRINGS.commuter.map.direction}
                  </ThemedText>
                  <ThemedText variant="strong" numberOfLines={1}>
                    {direction?.label ?? STRINGS.commuter.map.chooseDirection}
                  </ThemedText>
                </View>
                <Icon name="chevron-down" size={18} tone="muted" />
              </Pressable>
              <View className="gap-2.5">
                <IconButton
                  iconName="settings-outline"
                  size={52}
                  accessibilityLabel={STRINGS.commuter.map.settings}
                  onPress={() => router.push(ROUTES.settings.home)}
                />
                <IconButton
                  iconName="location-outline"
                  size={52}
                  accessibilityLabel={STRINGS.commuter.map.recenter}
                  onPress={() => recenterToUser(snapPoints[1])}
                />
              </View>
            </>
          )}
        </View>
      </View>

      <Sheet
        snapPoints={snapPoints}
        index={1}
        bottomInset={bottomChrome}
        surface="page"
        footerDivider={false}
        footer={following ? <FollowingCard arrival={followArrival} /> : undefined}
      >
        {!direction ? (
          <View className="items-center gap-3 py-8">
            {transit.loading ? (
              <Spinner color={colors.action} />
            ) : (
              <ThemedText tone="muted" className="text-center">
                {STRINGS.commuter.direction.noDirections}
              </ThemedText>
            )}
          </View>
        ) : (
          <View className="gap-3">
            <View className="flex-row items-end justify-between gap-3">
              <View className="flex-1">
                <ThemedText variant="heading">
                  {offline
                    ? t.lastSeenToward(direction.label)
                    : t.jeepsToward(arrivals.length, direction.label)}
                </ThemedText>
                <ThemedText variant="small" tone="muted">
                  {offline ? t.notUpdating : trip.boarding ? t.soonestFirst : t.pickStopForTimes}
                </ThemedText>
              </View>
              {offline
                ? lastPositionAt != null && (
                    <Chip tone="stale" data label={formatAgo(lastPositionAt)} />
                  )
                : arrivals.length > 0 && <LiveChip updatedAt={lastPositionAt} />}
            </View>

            {offline ? (
              <View className="gap-2">
                {arrivals.map((a) => (
                  <JeepRow
                    key={a.jeep.id}
                    arrival={a}
                    frozen
                    onRail={false}
                    onPress={() => router.push(ROUTES.commuter.jeepney(a.jeep.id))}
                  />
                ))}
              </View>
            ) : arrivals.length === 0 ? (
              <NoJeepsCard
                direction={direction}
                route={route}
                watching={liveWatch?.directionId === direction.id}
                onWatch={() => watchLive(direction.id)}
                onStopWatching={stopWatchingLive}
                other={other ? { direction: other, live: otherLive } : null}
                onSwitch={() => other && setDirection(other.id)}
              />
            ) : (
              <Rail>
                {trip.boarding ? (
                  <View className="min-h-[28px] flex-row items-center gap-2">
                    <RailMarker kind="boarding" />
                    <ThemedText variant="eyebrow" tone="muted">
                      {STRINGS.commuter.map.yourStop}
                    </ThemedText>
                    <ThemedText variant="label" numberOfLines={1} className="flex-1">
                      {trip.boarding.name}
                    </ThemedText>
                  </View>
                ) : (
                  <Card className="gap-2 p-3">
                    <ThemedText variant="small" tone="muted">
                      {t.pickStopForTimes}
                    </ThemedText>
                    <Button
                      label={t.pickStop}
                      variant="outline"
                      size="md"
                      onPress={() => router.navigate(ROUTES.commuter.stops)}
                    />
                  </Card>
                )}
                {arrivals.map((a) => (
                  <JeepRow
                    key={a.jeep.id}
                    arrival={a}
                    nearest={a.jeep.id === nearestId}
                    onPress={() => router.push(ROUTES.commuter.jeepney(a.jeep.id))}
                  />
                ))}
              </Rail>
            )}

            {offline && (
              <Pressable
                onPress={() => router.navigate(ROUTES.commuter.fare)}
                accessibilityRole="button"
                style={shadows.sm}
                className="min-h-[56px] flex-row items-center gap-3 rounded-tile border-[1.5px] border-line bg-card px-4 py-3"
              >
                <View className="flex-1">
                  <ThemedText variant="strong">{t.offlineWorks}</ThemedText>
                  <ThemedText variant="small" tone="muted">
                    {t.offlineWorksHint}
                  </ThemedText>
                </View>
                <Icon name="chevron-forward" size={18} tone="faint" />
              </Pressable>
            )}
          </View>
        )}
      </Sheet>
    </View>
  );
}
