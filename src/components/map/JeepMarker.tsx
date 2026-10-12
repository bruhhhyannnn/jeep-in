import { Pressable, Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { fonts, useTheme } from "@/theme";

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
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`Jeep ${unit}`}
      hitSlop={6}
      className={cn("rounded-[14px] p-[3px]", selected && "bg-action")}
    >
      <View
        style={[{ width: size, height: size }, state === "live" && shadows.md]}
        className={cn(
          "items-center justify-center rounded-[10px]",
          state === "live" && "border-[3px] border-white bg-accent",
          state === "stale" && "border-2 border-dashed border-muted bg-card",
          state === "unknown" && "border-2 border-muted bg-card",
        )}
      >
        <Text
          allowFontScaling={false}
          style={{ fontFamily: fonts.monoBold, fontSize: selected ? 11 : 10 }}
          className={state === "live" ? "text-accent-ink" : "text-muted"}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
