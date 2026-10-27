import { Pressable, View } from "react-native";
import { STRINGS } from "@/constants";
import type { Arrival } from "@/lib/fleet";
import { formatClock, formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme";
import { Icon, ThemedText } from "@/components/ui";
import { RailMarker } from "@/components/commuter/Rail";

type JeepRowProps = {
  arrival: Arrival;
  /** The soonest arrival gets the navy tile. */
  nearest?: boolean;
  /** Hides arrival times, e.g. while offline. */
  frozen?: boolean;
  /** Sits on a Rail with a yellow marker. Off for the offline "last seen" list. */
  onRail?: boolean;
  onPress: () => void;
};

function metaLine(arrival: Arrival, frozen: boolean) {
  const { state, nextStop, jeep } = arrival;
  const t = STRINGS.commuter.home;
  if ((frozen || state === "stale") && jeep.updatedAt != null) {
    const at = formatClock(jeep.updatedAt);
    return nextStop ? t.nearAt(nextStop.name, at) : t.seenAt(at);
  }
  if (state === "passed") return t.passed;
  if (state === "offroute") return t.offRoute;
  if (state === "arriving") return t.arriving;
  return nextStop ? t.nextStop(nextStop.name) : t.atEnd;
}

/** ETA tile, plate, unit and distance, next stop. Stale rows lose the minutes. */
export default function JeepRow({
  arrival,
  nearest = false,
  frozen = false,
  onRail = true,
  onPress,
}: JeepRowProps) {
  const { shadows } = useTheme();
  const { jeep, etaMin, remainingKm } = arrival;
  const muted = frozen || arrival.state === "stale" || arrival.state === "passed";
  const showEta = !muted && etaMin != null;
  const navy = nearest && showEta;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${jeep.plate}, unit ${jeep.unit}${showEta ? `, ${etaMin} minutes` : ""}`}
      style={muted ? undefined : nearest ? shadows.md : shadows.sm}
      className={cn(
        "flex-row items-stretch gap-3 rounded-[18px] p-2 pr-3 active:opacity-90",
        muted
          ? "border-[1.5px] border-dashed border-line-strong bg-sunken/50"
          : nearest
            ? "border-[2.5px] border-action bg-card"
            : "border-[1.5px] border-line bg-card",
      )}
    >
      {onRail && <RailMarker kind="jeep" />}
      <View
        className={cn(
          "w-[52px] items-center justify-center rounded-[14px] py-2",
          navy
            ? "bg-inverse"
            : muted
              ? "border-[1.5px] border-dashed border-line-strong bg-sunken"
              : "bg-sunken",
        )}
      >
        <ThemedText
          variant={showEta ? "momentSm" : "heading"}
          tone={navy ? "onInverse" : muted ? "faint" : "ink"}
        >
          {showEta ? String(etaMin) : "—"}
        </ThemedText>
        <ThemedText variant="eyebrow" tone={navy ? "onInverseMuted" : muted ? "faint" : "muted"}>
          min
        </ThemedText>
      </View>
      <View className="flex-1 justify-center gap-0.5">
        <View className="flex-row flex-wrap items-baseline gap-x-2">
          <ThemedText variant="strong" tone={muted ? "muted" : "ink"}>
            {jeep.plate}
          </ThemedText>
          <ThemedText variant="dataSm" tone={muted ? "faint" : "muted"}>
            {remainingKm != null && remainingKm >= 0 && !muted
              ? `${jeep.unit} · ${formatKm(remainingKm)}`
              : jeep.unit}
          </ThemedText>
        </View>
        <ThemedText variant="small" tone="muted" numberOfLines={1}>
          {metaLine(arrival, frozen)}
        </ThemedText>
      </View>
      {!muted && (
        <View className="justify-center">
          <Icon name="chevron-forward" size={18} tone="faint" />
        </View>
      )}
    </Pressable>
  );
}
