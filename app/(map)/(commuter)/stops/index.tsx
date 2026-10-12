import { useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { useFleet, useKeyboardSheet, useTransit, useTrip, useTripActions } from "@/hooks";
import { minutesFor } from "@/lib/fleet";
import { measureOnPath } from "@/lib/geo";
import { matchesStop, suggestionWords } from "@/lib/search";
import { usePreferences } from "@/store";
import type { SheetRef, StopPoint } from "@/types";
import { Button, Card, Icon, Segmented, Sheet, TextField, ThemedText } from "@/components/ui";
import { Rail, StopRow, TripStrip, useBottomChrome } from "@/components/commuter";

const SEARCH_SPACE = 72;

export default function StopsTab() {
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const bottomChrome = useBottomChrome();
  const sheetRef = useRef<SheetRef>(null);
  useKeyboardSheet(sheetRef);

  const transit = useTransit();
  const trip = useTrip(transit);
  const { pickStop } = useTripActions(transit, trip);
  const { jeeps } = useFleet(transit);
  const { stops, directions, direction, stopKm, stopAlong, paths, route } = transit;

  const fillingField = usePreferences((s) => s.fillingField);
  const setFillingField = usePreferences((s) => s.setFillingField);
  const setDirection = usePreferences((s) => s.setDirection);
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;
  const results = useMemo(() => stops.filter((s) => matchesStop(s, query)), [stops, query]);
  const suggestions = useMemo(() => suggestionWords(stops), [stops]);

  // "2 jeeps · 4 min" for each stop: live jeeps still before it on the route.
  const activity = useMemo(() => {
    const path = direction ? (paths[direction.id] ?? []) : [];
    const speed = route?.averageSpeedKph ?? 20;
    const along = jeeps
      .filter((j) => j.directionId === direction?.id && !j.stale)
      .map((j) => measureOnPath(path, j.position))
      .filter((m) => m != null && m.offsetKm < 0.35)
      .map((m) => m!.alongKm);
    return Object.fromEntries(
      stops.map((s) => {
        const gaps = along.map((a) => (stopAlong[s.id] ?? 0) - a).filter((d) => d >= -0.05);
        const nearest = gaps.length ? minutesFor(Math.max(0, Math.min(...gaps)), speed) : null;
        return [s.id, STRINGS.commuter.stops.jeepsComing(gaps.length, nearest)];
      }),
    );
  }, [jeeps, direction, paths, stops, stopAlong, route]);

  const available = height - bottomChrome - top - SEARCH_SPACE;
  const t = STRINGS.commuter.stops;

  const onPick = (stop: StopPoint) => {
    if (!pickStop(stop, fillingField)) return;
    if (searching) {
      setQuery("");
      Keyboard.dismiss();
    }
  };

  const clearSearch = () => {
    setQuery("");
    Keyboard.dismiss();
  };

  const role = (s: StopPoint) =>
    s.id === trip.boarding?.id ? "boarding" : s.id === trip.alighting?.id ? "alighting" : null;

  const list = (items: StopPoint[]) => (
    <Rail dashed={searching}>
      {items.map((s) => (
        <StopRow
          key={s.id}
          stop={s}
          km={stopKm[s.id]}
          activity={activity[s.id]}
          role={role(s)}
          onPress={() => onPick(s)}
          onDetails={() => router.push(ROUTES.commuter.stop(s.id))}
        />
      ))}
    </Rail>
  );

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <View style={{ top: top + 8 }} className="absolute left-4 right-4">
        <TextField
          iconName="search"
          placeholder={t.search}
          value={query}
          onChangeText={setQuery}
          onClear={clearSearch}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel={t.search}
        />
      </View>

      <Sheet
        ref={sheetRef}
        snapPoints={[Math.round(available * 0.6), available]}
        index={0}
        bottomInset={bottomChrome}
        surface="page"
        footer={
          !searching && (
            <Button
              label={t.seeFare}
              iconRight="arrow-forward"
              disabled={!trip.boarding || !trip.alighting}
              onPress={() => router.navigate(ROUTES.commuter.fare)}
            />
          )
        }
      >
        <View className="gap-3">
          {searching ? (
            <>
              <View className="flex-row items-baseline justify-between gap-3">
                <ThemedText variant="heading" className="flex-1">
                  {t.matches(results.length, query.trim())}
                </ThemedText>
                {direction && (
                  <ThemedText variant="label" tone="muted">
                    {direction.label.toLowerCase()}
                  </ThemedText>
                )}
              </View>
              <TripStrip
                compact
                boarding={trip.boarding}
                boardingSource={trip.boardingSource}
                walkKm={trip.walkKm}
                alighting={trip.alighting}
                filling={fillingField}
                tripKm={trip.tripKm}
                stopCount={trip.stopCount}
                emptyHint={t.tapResult}
                onPressField={setFillingField}
              />
              {results.length > 0 ? (
                <>
                  {list(results)}
                  <Card dashed className="gap-0.5 rounded-tile px-4 py-3">
                    <ThemedText variant="strong">{t.nothingMatched}</ThemedText>
                    <ThemedText variant="small" tone="muted">
                      {t.landmarksToo}
                    </ThemedText>
                  </Card>
                  <Button label={t.clearSearch} variant="outline" size="md" onPress={clearSearch} />
                </>
              ) : (
                <View className="items-center gap-3 px-2 py-6">
                  <View className="h-14 w-14 items-center justify-center rounded-full bg-sunken">
                    <Icon name="search" size={22} tone="muted" />
                  </View>
                  <ThemedText variant="heading" className="text-center">
                    {t.noMatchTitle(query.trim())}
                  </ThemedText>
                  <ThemedText variant="small" tone="muted" className="text-center">
                    {t.noMatchBody}
                  </ThemedText>
                  <View className="flex-row flex-wrap justify-center gap-2">
                    {suggestions.map((word) => (
                      <Pressable
                        key={word}
                        onPress={() => setQuery(word)}
                        accessibilityRole="button"
                        className="h-10 justify-center rounded-full border-[1.5px] border-line bg-card px-4"
                      >
                        <ThemedText variant="label">{word}</ThemedText>
                      </Pressable>
                    ))}
                  </View>
                  <Button label={t.showAll} variant="outline" size="md" onPress={clearSearch} />
                </View>
              )}
            </>
          ) : (
            <>
              <TripStrip
                boarding={trip.boarding}
                boardingSource={trip.boardingSource}
                walkKm={trip.walkKm}
                alighting={trip.alighting}
                filling={fillingField}
                tripKm={trip.tripKm}
                stopCount={trip.stopCount}
                emptyHint={t.tapStopBelow}
                onPressField={setFillingField}
              />
              <View className="flex-row items-center gap-3">
                <Segmented
                  className="flex-1"
                  options={directions.map((d) => ({ value: d.id, label: d.label }))}
                  value={direction?.id ?? null}
                  onChange={setDirection}
                />
                <ThemedText variant="label" tone="muted">
                  {t.stopCount(stops.length)}
                </ThemedText>
              </View>
              {stops.length ? (
                list(stops)
              ) : (
                <ThemedText tone="muted" className="py-6 text-center">
                  {t.empty}
                </ThemedText>
              )}
            </>
          )}
        </View>
      </Sheet>
    </View>
  );
}
