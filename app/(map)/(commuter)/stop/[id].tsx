import { useEffect } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { resolveInDirection, useArrivals, useTransit, useTrip, useTripActions } from "@/hooks";
import { quoteFare } from "@/lib/fare";
import { formatKm, formatPeso } from "@/lib/format";
import { useMap, useMapUi } from "@/store";
import { Button, Card, Icon, IconButton, Sheet, ThemedText } from "@/components/ui";

export default function StopDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const map = useMap();

  const transit = useTransit();
  const trip = useTrip(transit);
  const { pickStop } = useTripActions(transit, trip);
  const { stopById, stopsByDirection, stopKm, directions, fareMatrix } = transit;

  const stop = stopById[id] ?? null;
  const dirStops = stop ? (stopsByDirection[stop.directionId] ?? []) : [];
  const direction = directions.find((d) => d.id === stop?.directionId) ?? null;
  const { arrivals } = useArrivals(transit, stop?.directionId ?? null, stop);
  const approaching = arrivals.filter((a) => a.state === "approaching" || a.state === "arriving");
  const nearestMin = approaching[0]?.etaMin ?? null;

  // Fare from the boarding stop, when this stop comes after it on the same direction.
  const boarding = resolveInDirection(trip.boarding ?? undefined, dirStops);
  const fromBoarding =
    stop && boarding && boarding.order < stop.order
      ? quoteFare(fareMatrix, Math.abs((stopKm[stop.id] ?? 0) - (stopKm[boarding.id] ?? 0)))
      : null;

  const sheetHeight = Math.round(height * 0.7);
  const focusStop = useMapUi((s) => s.focusStop);
  useEffect(() => {
    if (!stop) return;
    focusStop(stop.id);
    map.current.flyTo([stop.long, stop.lat], { zoom: 16, bottomInset: sheetHeight });
    return () => focusStop(null);
  }, [stop, focusStop, map, sheetHeight]);

  const t = STRINGS.commuter.stop;

  const boardHere = () => {
    if (stop && pickStop(stop, "boarding")) router.back();
  };
  const getOffHere = () => {
    if (stop && pickStop(stop, "alighting")) router.navigate(ROUTES.commuter.fare);
  };

  const isBoarding = trip.boarding?.id === stop?.id && trip.boardingSource === "chosen";
  const footer = stop ? (
    fromBoarding ? (
      <View className="gap-2">
        <Button label={t.boardHereInstead} variant="outline" size="md" onPress={boardHere} />
        <Button
          label={t.getOffSeeFare(formatPeso(fromBoarding.regular))}
          iconRight="arrow-forward"
          onPress={getOffHere}
        />
      </View>
    ) : (
      <View className="gap-2">
        {!isBoarding && <Button label={t.boardHere} onPress={boardHere} />}
        <Button label={t.getOffHere} variant="outline" size="md" onPress={getOffHere} />
      </View>
    )
  ) : undefined;

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <Pressable
        onPress={() => router.back()}
        accessibilityLabel="Close"
        style={{ height: height - sheetHeight }}
        className="absolute left-0 right-0 top-0 bg-navy-950/20"
      />
      <View style={{ top: top + 8 }} className="absolute left-4">
        <IconButton iconName="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
      </View>

      <Sheet snapPoints={[sheetHeight, height - top - 64]} footer={footer}>
        {!stop ? (
          <Card dashed className="p-4">
            <ThemedText tone="muted">{t.notFound}</ThemedText>
          </Card>
        ) : (
          <View className="gap-4">
            <View className="flex-row gap-3">
              <View className="h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-tile border-[1.5px] border-line bg-sunken">
                {stop.photoUrl ? (
                  <Image
                    source={{ uri: stop.photoUrl }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    accessibilityLabel={stop.name}
                  />
                ) : (
                  <Icon name="image-outline" size={24} tone="faint" />
                )}
              </View>
              <View className="flex-1 gap-1">
                <ThemedText variant="heading" accessibilityRole="header">
                  {stop.name}
                </ThemedText>
                {(stop.address || stop.landmark) && (
                  <ThemedText variant="small" tone="muted">
                    {[stop.address, stop.landmark].filter(Boolean).join(", ")}
                  </ThemedText>
                )}
                <ThemedText variant="dataSm" tone="muted">
                  {t.position(
                    dirStops.indexOf(stop) + 1,
                    dirStops.length,
                    formatKm(stopKm[stop.id] ?? 0),
                    direction?.via[0] ?? dirStops[0]?.name ?? "",
                  )}
                </ThemedText>
              </View>
            </View>

            <View className="flex-row gap-2.5">
              <Card className="flex-1 rounded-tile p-3">
                <ThemedText variant="heading">{approaching.length}</ThemedText>
                <ThemedText variant="label" tone="muted">
                  {t.approaching}
                </ThemedText>
              </Card>
              <Card className="flex-1 rounded-tile p-3">
                <ThemedText variant="heading">
                  {nearestMin != null ? `${nearestMin} min` : "—"}
                </ThemedText>
                <ThemedText variant="label" tone="muted">
                  {t.nearestArrival}
                </ThemedText>
              </Card>
            </View>

            {stop.description && (
              <View className="gap-1.5">
                <ThemedText variant="eyebrow" tone="muted">
                  {t.about}
                </ThemedText>
                <ThemedText>{stop.description}</ThemedText>
              </View>
            )}

            {stop.amenities.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {stop.amenities.map((a) => (
                  <View
                    key={a}
                    className="rounded-full border-[1.5px] border-line-strong px-3 py-1.5"
                  >
                    <ThemedText variant="label">{a}</ThemedText>
                  </View>
                ))}
              </View>
            )}

            {fromBoarding && boarding && (
              <View className="gap-1.5">
                <ThemedText variant="eyebrow" tone="muted">
                  {t.fareFromBoarding}
                </ThemedText>
                <Card className="flex-row items-center gap-3 rounded-tile px-4 py-3">
                  <View className="flex-1">
                    <ThemedText variant="strong">{t.fromHere(boarding.name)}</ThemedText>
                    <ThemedText variant="label" tone="muted">
                      {t.regularKm(formatKm(fromBoarding.km))}
                    </ThemedText>
                  </View>
                  <ThemedText variant="dataStrong">{formatPeso(fromBoarding.regular)}</ThemedText>
                </Card>
              </View>
            )}

            {isBoarding && (
              <ThemedText variant="small" tone="muted">
                {t.isBoarding}
              </ThemedText>
            )}
          </View>
        )}
      </Sheet>
    </View>
  );
}
