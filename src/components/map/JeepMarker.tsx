import { cn } from "@/lib/utils";
import { fonts, useTheme } from "@/theme";
import { Pressable, View } from "@/components/ui";

type JeepMarkerProps = {
  unit: string;
  /** live: yellow · stale: dashed and hollow · unknown: no direction shared yet */
  state: "live" | "stale" | "unknown";
  selected?: boolean;
  onPress?: () => void;
};

/** Yellow rounded square with the unit number — the only thing on the map that moves. */
export default function JeepMarker({ unit, state, selected = false, onPress }: JeepMarkerProps) {
  const { shadows } = useTheme();
  const size = selected ? 42 : 36;
  const label = unit.replace(/[^A-Za-z0-9]/g, "").slice(0, 4);

  return (
    <Pressable
      onPress={(e) => {
        // Keep the tap from also reaching the stops underneath.
        e.stopPropagation();
        onPress?.();
      }}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`Jeep ${unit}`}
      hitSlop={6}
      className={cn("rounded-[14px] p-[3px]", selected && "bg-action")}
    >
      <View
        style={{ width: size, height: size, ...(state === "live" ? shadows.md : undefined) }}
        className={cn(
          "items-center justify-center rounded-[10px]",
          state === "live" && "border-[3px] border-white bg-accent",
          state === "stale" && "border-2 border-dashed border-muted bg-card",
          state === "unknown" && "border-2 border-muted bg-card",
        )}
      >
        <span
          style={{ fontFamily: fonts.monoBold, fontSize: selected ? 11 : 10, lineHeight: 1.2 }}
          className={state === "live" ? "text-accent-ink" : "text-muted"}
        >
          {label}
        </span>
      </View>
    </Pressable>
  );
}
