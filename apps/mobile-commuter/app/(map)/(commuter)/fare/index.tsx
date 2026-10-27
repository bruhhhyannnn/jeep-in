import { useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { useTransit, useTrip, useTripActions } from "@/hooks";
import { discountPercent, fareFormula, isPlaceholderMatrix, quoteFare } from "@/lib/fare";
import { formatKm, formatPeso } from "@/lib/format";
import { usePreferences } from "@/store";
import { layout, useTheme } from "@/theme";
import type { BottomSheetModalBaseRef, StopPoint, TripField } from "@/types";
import {
  BottomSheetModalBase,
  Icon,
  Segmented,
  ThemedText,
  ThemedView,
  Toggle,
} from "@/components/ui";
import { Rail, ScreenHeader, StopRow, TripStrip, useTabBarInset } from "@/components/commuter";

export default function FareTab() {
  const { top } = useSafeAreaInsets();
  const bottomChrome = useTabBarInset();
  const { shadows } = useTheme();
  const pickerRef = useRef<BottomSheetModalBaseRef>(null);
  const [picking, setPicking] = useState<TripField>("alighting");

  const transit = useTransit();
  const trip = useTrip(transit);
  const { pickStop } = useTripActions(transit, trip);
  const { route, directions, direction, stops, stopKm, fareMatrix } = transit;
  const discount = usePreferences((s) => s.discount);
  const setDiscount = usePreferences((s) => s.setDiscount);
  const setDirection = usePreferences((s) => s.setDirection);

  const t = STRINGS.commuter.fare;
  const quote = trip.quote;
  const amount = quote ? (discount ? quote.discounted : quote.regular) : null;

  const openPicker = (field: TripField) => {
    setPicking(field);
    pickerRef.current?.open();
  };

  const onPick = (stop: StopPoint) => {
    if (pickStop(stop, picking)) pickerRef.current?.close();
  };

  // While picking where to get off, each row shows its fare from the boarding stop.
  const fareFrom = (stop: StopPoint) => {
    if (picking !== "alighting" || !trip.boarding || stop.order <= trip.boarding.order) return null;
    const q = quoteFare(
      fareMatrix,
      Math.abs((stopKm[stop.id] ?? 0) - (stopKm[trip.boarding.id] ?? 0)),
    );
    return { regular: formatPeso(q.regular), discounted: formatPeso(q.discounted) };
  };

  return (
    <ThemedView className="absolute inset-0">
      <ScrollView
        contentContainerStyle={{
          paddingTop: top + 12,
          paddingBottom: bottomChrome + 16,
          maxWidth: layout.contentMaxWidth,
        }}
        contentContainerClassName="w-full gap-4 self-center px-5"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title={t.title} subtitle={route?.name} />

        {directions.length > 1 && (
          <Segmented
            options={directions.map((d) => ({ value: d.id, label: d.label }))}
            value={direction?.id ?? null}
            onChange={setDirection}
          />
        )}

        <View className="gap-3 rounded-card bg-inverse p-4">
          <View className="flex-row items-center justify-between">
            <ThemedText variant="eyebrow" tone="onInverseMuted">
              {t.yourFare}
            </ThemedText>
            <View className="rounded-full bg-inverse-raised px-2.5 py-1">
              <ThemedText variant="label" tone="onInverse">
                {discount ? t.discounted : t.regular}
              </ThemedText>
            </View>
          </View>

          {quote && amount != null ? (
            <View className="gap-1.5">
              <View className="flex-row flex-wrap items-end gap-x-2">
                <ThemedText
                  variant="moment"
                  tone="onInverse"
                  accessibilityLabel={`${amount} pesos`}
                >
                  {formatPeso(amount)}
                </ThemedText>
                <ThemedText variant="small" tone="onInverseMuted" className="pb-1.5">
                  {t.forTrip(formatKm(quote.km))}
                </ThemedText>
              </View>
              <ThemedText variant="dataSm" tone="onInverseMuted">
                {fareFormula(fareMatrix, quote)}
                {discount ? ` − ${discountPercent(fareMatrix)}%` : ""}
              </ThemedText>
            </View>
          ) : (
            <View className="gap-1">
              <ThemedText variant="moment" tone="onInverseMuted">
                ₱—
              </ThemedText>
              <ThemedText variant="small" tone="onInverseMuted">
                {t.pickStops}
              </ThemedText>
            </View>
          )}

          <View className="h-px bg-navy-600" />

          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <ThemedText variant="strong" tone="onInverse">
                {t.discountLabel(discountPercent(fareMatrix))}
              </ThemedText>
              {quote && (
                <ThemedText variant="small" tone="onInverseMuted">
                  {discount
                    ? t.regularIs(formatPeso(quote.regular))
                    : t.youdPay(formatPeso(quote.discounted))}
                </ThemedText>
              )}
            </View>
            <Toggle
              value={discount}
              onValueChange={setDiscount}
              onInverse
              accessibilityLabel={t.discountLabel(discountPercent(fareMatrix))}
            />
          </View>
        </View>

        <TripStrip
          boarding={trip.boarding}
          boardingSource={trip.boardingSource}
          walkKm={trip.walkKm}
          alighting={trip.alighting}
          filling={null}
          tripKm={trip.tripKm}
          stopCount={trip.stopCount}
          emptyHint={STRINGS.commuter.chooseStop.pickOne}
          onPressField={openPicker}
        />

        <Pressable
          onPress={() => router.push(ROUTES.commuter.fareMatrix)}
          accessibilityRole="button"
          style={shadows.sm}
          className="min-h-[60px] flex-row items-center gap-3 rounded-[20px] border-[1.5px] border-line bg-card px-4 py-3 active:opacity-90"
        >
          <View className="flex-1">
            <ThemedText variant="strong">{t.everyStop}</ThemedText>
            <ThemedText variant="small" tone="muted">
              {isPlaceholderMatrix(fareMatrix) ? t.everyStopPlaceholder : t.everyStopHint}
            </ThemedText>
          </View>
          <Icon name="chevron-forward" size={18} tone="faint" />
        </Pressable>
      </ScrollView>

      <BottomSheetModalBase
        ref={pickerRef}
        title={picking === "boarding" ? t.pickerBoarding : t.pickerAlighting}
      >
        <View className="gap-3">
          {picking === "alighting" && trip.boarding && (
            <ThemedText variant="label" tone="muted">
              {t.fromStop(trip.boarding.name)}
            </ThemedText>
          )}
          <Rail>
            {stops.map((s) => (
              <StopRow
                key={s.id}
                stop={s}
                km={stopKm[s.id]}
                role={
                  s.id === trip.boarding?.id
                    ? "boarding"
                    : s.id === trip.alighting?.id
                      ? "alighting"
                      : null
                }
                fare={fareFrom(s)}
                onPress={() => onPick(s)}
              />
            ))}
          </Rail>
        </View>
      </BottomSheetModalBase>
    </ThemedView>
  );
}
