import { STRINGS } from "@/constants";
import { useDriverRoute } from "@/hooks";
import { cn } from "@/lib/utils";
import { useDriverSession, useSharingStore } from "@/store";
import { ThemedText, View } from "@/components/ui";

/** Sharing state at the top of every tab except GPS, so it is always visible. */
export default function StatusStrip() {
  const phase = useSharingStore((s) => s.phase);
  const jeepney = useDriverSession((s) => s.jeepney);
  const directionId = useDriverSession((s) => s.directionId);
  const resting = useDriverSession((s) => s.resting);
  const { directions } = useDriverRoute();
  const direction = directions.find((d) => d.id === directionId);
  const t = STRINGS.driver.strip;

  const sharing = phase === "on";
  const starting = phase === "starting";
  const label = sharing
    ? resting
      ? t.resting
      : t.sharing(direction?.label ?? t.noDirection)
    : starting
      ? t.starting
      : t.off;

  return (
    <View
      accessibilityLiveRegion="polite"
      className={cn(
        "min-h-[48px] flex-row items-center gap-3 rounded-full px-4",
        sharing && "border-[1.5px] border-live/25 bg-live-tint",
        starting && "bg-warn-tint",
        !sharing && !starting && "border-[1.5px] border-dashed border-line-strong",
      )}
    >
      <View
        className={cn(
          "h-2.5 w-2.5 rounded-full",
          sharing ? "bg-live" : starting ? "bg-accent" : "bg-faint",
        )}
      />
      <ThemedText
        variant="strong"
        tone={sharing ? "live" : starting ? "warn" : "muted"}
        numberOfLines={1}
        className="flex-1"
      >
        {label}
      </ThemedText>
      {jeepney && (
        <ThemedText variant="dataStrong" tone={sharing ? "live" : "muted"}>
          {jeepney.jeepneyNumber || jeepney.plateNumber}
        </ThemedText>
      )}
    </View>
  );
}
