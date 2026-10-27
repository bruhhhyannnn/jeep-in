import { View } from "react-native";
import { STRINGS } from "@/constants";
import { fareFormula, quoteFare, discountPercent } from "@/lib/fare";
import { formatKm, formatPeso } from "@/lib/format";
import type { FareMatrix } from "@/types";
import { useTheme } from "@/theme";
import { Card, ThemedText } from "@/components/ui";
import JeepMarker from "@/components/map/JeepMarker";
import StopCallout from "@/components/map/StopCallout";

const sample = STRINGS.commuter.onboarding.sample;

/** A crop of the live map: route, nearest stop, one jeep and its minutes away. */
export function LiveMapArt() {
  const { shadows } = useTheme();
  return (
    <View className="flex-1 bg-sunken">
      {/* Streets */}
      <View className="absolute left-[-20%] top-[22%] h-3 w-[140%] -rotate-12 bg-card" />
      <View className="absolute left-[-20%] top-[64%] h-2.5 w-[140%] rotate-6 bg-card" />
      <View className="absolute left-[58%] top-[-10%] h-[120%] w-2.5 rotate-12 bg-card" />
      {/* Route */}
      <View className="absolute left-[-10%] top-[48%] h-1.5 w-[75%] -rotate-[20deg] rounded-full bg-navy-800" />
      <View className="absolute left-[56%] top-[30%] h-1.5 w-[60%] rotate-[8deg] rounded-full bg-navy-800" />
      {/* Nearest stop */}
      <View className="absolute left-[56%] top-[33%] h-4 w-4 rounded-full border-[3.5px] border-action bg-card" />
      <View className="absolute left-[30%] top-[6%]">
        <StopCallout variant="suggested" eyebrow={sample.nearest} name={sample.stop} />
      </View>
      {/* Jeep */}
      <View className="absolute left-[16%] top-[50%]">
        <JeepMarker unit={sample.unit} state="live" />
      </View>
      <View
        style={shadows.md}
        className="absolute bottom-4 right-4 flex-row items-center gap-2 rounded-full bg-card px-3.5 py-2.5"
      >
        <View className="h-2 w-2 rounded-full bg-live" />
        <ThemedText variant="label">{sample.eta}</ThemedText>
      </View>
    </View>
  );
}

/** The fare card the Fare tab opens with, for a sample trip. */
export function FareArt({ matrix }: { matrix: FareMatrix }) {
  const quote = quoteFare(matrix, sample.tripKm);
  const t = STRINGS.commuter.fare;

  return (
    <View className="flex-1 justify-center gap-3 bg-page p-4">
      <View className="gap-2.5 rounded-card bg-navy-900 p-4">
        <View className="flex-row items-center justify-between">
          <ThemedText variant="eyebrow" tone="onInverseMuted">
            {t.yourFare}
          </ThemedText>
          <View className="rounded-full bg-inverse-raised px-2.5 py-1">
            <ThemedText variant="label" tone="onInverse">
              {t.regular}
            </ThemedText>
          </View>
        </View>
        <View className="flex-row items-end gap-2">
          <ThemedText variant="momentMd" tone="onInverse">
            {formatPeso(quote.regular)}
          </ThemedText>
          <ThemedText variant="small" tone="onInverseMuted" className="pb-1">
            {`for ${formatKm(quote.km)}`}
          </ThemedText>
        </View>
        <ThemedText variant="dataSm" tone="onInverseMuted">
          {fareFormula(matrix, quote)}
        </ThemedText>
        <View className="h-px bg-navy-600" />
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <ThemedText variant="label" tone="onInverse">
              {t.discountLabel(discountPercent(matrix))}
            </ThemedText>
            <ThemedText variant="small" tone="onInverseMuted">
              {t.youdPay(formatPeso(quote.discounted))}
            </ThemedText>
          </View>
          {/* Switched off, as on the Fare tab before the commuter turns it on. */}
          <View className="h-6 w-10 justify-center rounded-full border-[1.5px] border-navy-400 px-[2px]">
            <View className="h-4 w-4 rounded-full bg-navy-400" />
          </View>
        </View>
      </View>
      <Card className="gap-1.5 rounded-[20px] p-2">
        {[
          { label: STRINGS.commuter.stops.boardingAt, value: sample.boarding, ring: true },
          { label: STRINGS.commuter.stops.gettingOffAt, value: sample.stop, ring: false },
        ].map((f) => (
          <View
            key={f.label}
            className="flex-row items-center gap-3 rounded-xl bg-sunken px-3 py-2"
          >
            <View
              className={
                f.ring
                  ? "h-3.5 w-3.5 rounded-full border-[3px] border-action"
                  : "h-3.5 w-3.5 rounded-[3px] border-[2.5px] border-action"
              }
            />
            <View>
              <ThemedText variant="label" tone="muted">
                {f.label}
              </ThemedText>
              <ThemedText variant="strong">{f.value}</ThemedText>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}
