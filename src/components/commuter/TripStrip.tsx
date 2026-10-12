import { Pressable, View } from "react-native";
import { STRINGS } from "@/constants";
import type { BoardingSource } from "@/hooks";
import { formatDistance, formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { StopPoint, TripField } from "@/types";
import { Card, ThemedText } from "@/components/ui";

type TripStripProps = {
  boarding: StopPoint | null;
  boardingSource: BoardingSource | null;
  walkKm: number | null;
  alighting: StopPoint | null;
  /** The field the next tapped stop fills, drawn with a heavy blue border. */
  filling: TripField | null;
  fillingLabel?: string;
  tripKm: number | null;
  stopCount: number | null;
  /** Placeholder for an empty field, e.g. "Tap a stop below". */
  emptyHint: string;
  onPressField: (field: TripField) => void;
  /** Collapses to just the field being filled, for search results. */
  compact?: boolean;
};

function Field({
  field,
  label,
  value,
  hint,
  active,
  activeLabel,
  trailing,
  onPress,
}: {
  field: TripField;
  label: string;
  value: string | null;
  hint: string;
  active: boolean;
  activeLabel: string;
  trailing?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value ?? hint}`}
      accessibilityState={{ selected: active }}
      className={cn(
        "min-h-[56px] flex-row items-center gap-3 rounded-xl px-3 py-2",
        active ? "border-2 border-action bg-card" : "border-[1.5px] border-sunken bg-sunken",
      )}
    >
      <View
        className={cn(
          "h-4 w-4 border-action",
          field === "boarding" ? "rounded-full border-[3.5px]" : "rounded-[4px] border-[3px]",
        )}
      />
      <View className="flex-1">
        <ThemedText variant="label" tone="muted">
          {label}
        </ThemedText>
        <ThemedText variant="strong" tone={value ? "ink" : "muted"} numberOfLines={1}>
          {value ?? hint}
        </ThemedText>
      </View>
      {active ? (
        <View className="rounded-full bg-action px-2.5 py-1">
          <ThemedText variant="label" tone="actionInk">
            {activeLabel}
          </ThemedText>
        </View>
      ) : (
        <ThemedText variant="label" tone="muted">
          {trailing ?? STRINGS.commuter.stops.change}
        </ThemedText>
      )}
    </Pressable>
  );
}

/** "Your trip": where you board (ring) and where you get off (square). */
export default function TripStrip({
  boarding,
  boardingSource,
  walkKm,
  alighting,
  filling,
  fillingLabel = STRINGS.commuter.stops.filling,
  tripKm,
  stopCount,
  emptyHint,
  onPressField,
  compact = false,
}: TripStripProps) {
  const t = STRINGS.commuter.stops;
  const summary =
    tripKm != null && stopCount != null
      ? t.tripSummary(stopCount, formatKm(tripKm))
      : t.step(filling === "boarding" || !boarding ? 1 : 2);

  const boardingField = (
    <Field
      field="boarding"
      label={
        boardingSource === "nearest" && walkKm != null
          ? `${t.boardingAt} · ${t.nearest(formatDistance(walkKm)).toLowerCase()}`
          : t.boardingAt
      }
      value={boarding?.name ?? null}
      hint={emptyHint}
      active={filling === "boarding"}
      activeLabel={fillingLabel}
      onPress={() => onPressField("boarding")}
    />
  );
  const alightingField = (
    <Field
      field="alighting"
      label={t.gettingOffAt}
      value={alighting?.name ?? null}
      hint={emptyHint}
      active={filling === "alighting"}
      activeLabel={fillingLabel}
      onPress={() => onPressField("alighting")}
    />
  );

  if (compact) return filling === "boarding" ? boardingField : alightingField;

  return (
    <Card elevation="md" className="gap-2 p-3">
      <View className="flex-row items-baseline justify-between px-1">
        <ThemedText variant="eyebrow" tone="muted">
          {t.yourTrip}
        </ThemedText>
        <ThemedText variant="label" tone="muted">
          {summary}
        </ThemedText>
      </View>
      {boardingField}
      {alightingField}
    </Card>
  );
}
