import { Pressable, View } from "react-native";
import { STRINGS } from "@/constants";
import { formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme";
import type { StopPoint } from "@/types";
import { ThemedText } from "@/components/ui";
import { RailMarker } from "@/components/commuter/Rail";

type StopRowProps = {
  stop: StopPoint;
  km: number | undefined;
  /** e.g. "3 jeeps · 4 min" */
  activity?: string;
  role?: "boarding" | "alighting" | null;
  /** Rail marker for rows that aren't part of the trip. Defaults to a plain ring. */
  marker?: "ring" | "result";
  onPress: () => void;
  /** Opens the stop. Without it the row has no Details button. */
  onDetails?: () => void;
  /** Right side shows a fare instead of the Details button (stop picker). */
  fare?: { regular: string; discounted: string } | null;
};

/**
 * A raised card on the route timeline. Tapping the card fills the trip field
 * being filled; "Details" opens the stop. The two actions are named, not guessed.
 */
export default function StopRow({
  stop,
  km,
  activity,
  role = null,
  marker = "ring",
  onPress,
  onDetails,
  fare,
}: StopRowProps) {
  const { shadows } = useTheme();
  const selected = role != null;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={stop.name}
      style={selected ? shadows.md : shadows.sm}
      className={cn(
        "min-h-[64px] flex-row items-center gap-3 rounded-[18px] bg-card py-3 pl-3.5 pr-2.5 active:opacity-90",
        selected ? "border-[2.5px] border-action" : "border-[1.5px] border-line",
      )}
    >
      <RailMarker kind={role ?? marker} />
      <View className="flex-1 gap-0.5">
        <View className="flex-row flex-wrap items-baseline gap-x-2">
          <ThemedText variant="strong">{stop.name}</ThemedText>
          {km != null && (
            <ThemedText variant="dataSm" tone="muted">
              {formatKm(km)}
            </ThemedText>
          )}
        </View>
        {!!stop.address && (
          <ThemedText variant="small" tone="muted" numberOfLines={2}>
            {stop.address}
          </ThemedText>
        )}
        {(activity || stop.landmark) && (
          <View className="flex-row flex-wrap items-center gap-x-2">
            {activity && <ThemedText variant="dataSm">{activity}</ThemedText>}
            {activity && stop.landmark && <View className="h-1 w-1 rounded-full bg-line-strong" />}
            {stop.landmark && (
              <ThemedText variant="small" tone="muted" numberOfLines={1} className="shrink">
                {stop.landmark}
              </ThemedText>
            )}
          </View>
        )}
      </View>
      {fare ? (
        <View className="items-end">
          <ThemedText variant="dataStrong">{fare.regular}</ThemedText>
          <ThemedText variant="dataSm" tone="muted">
            {fare.discounted}
          </ThemedText>
        </View>
      ) : (
        onDetails && (
          <View className="justify-center self-stretch border-l-[1.5px] border-sunken pl-2.5">
            <Pressable
              onPress={onDetails}
              accessibilityRole="button"
              accessibilityLabel={`${STRINGS.commuter.stops.details}, ${stop.name}`}
              hitSlop={8}
              className="h-9 justify-center rounded-full border-[1.5px] border-line-strong px-3 active:opacity-80"
            >
              <ThemedText variant="label">{STRINGS.commuter.stops.details}</ThemedText>
            </Pressable>
          </View>
        )
      )}
    </Pressable>
  );
}
