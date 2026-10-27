import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { STRINGS } from "@/constants";
import { useDriverRoute } from "@/hooks";
import { cn } from "@/lib/utils";
import { useDriverSession, useSharingStore } from "@/store";
import { useTheme } from "@/theme";
import { ThemedText } from "@/components/ui";
import { LockedCard, StatusStrip } from "@/components/driver";

/** Two half-screen targets. Locked while the jeep moves. */
export default function DirectionTab() {
  const { top } = useSafeAreaInsets();
  const { shadows } = useTheme();
  const { directions } = useDriverRoute();
  const directionId = useDriverSession((s) => s.directionId);
  const setDirection = useDriverSession((s) => s.setDirection);
  const moving = useSharingStore((s) => s.moving);
  const t = STRINGS.driver.direction;

  return (
    <View style={{ paddingTop: top + 12 }} className="flex-1 gap-4 px-5 pb-3">
      <StatusStrip />
      <View>
        <ThemedText variant="title" accessibilityRole="header">
          {t.title}
        </ThemedText>
        <ThemedText tone="muted">{t.subtitle}</ThemedText>
      </View>

      <View className="flex-1 gap-3.5">
        {directions.length === 0 ? (
          <ThemedText tone="muted">{t.noDirections}</ThemedText>
        ) : (
          directions.slice(0, 2).map((d) => {
            const current = d.id === directionId;
            return (
              <Pressable
                key={d.id}
                onPress={() => !current && setDirection(d.id)}
                disabled={moving || current}
                accessibilityRole="radio"
                accessibilityState={{ checked: current, disabled: moving }}
                style={current ? undefined : shadows.sm}
                className={cn(
                  "flex-1 items-center justify-center gap-2.5 rounded-[30px] p-4 active:opacity-90",
                  current
                    ? "border-[3px] border-action bg-action-tint"
                    : "border-[1.5px] border-line-strong bg-card",
                  moving && "opacity-40",
                )}
              >
                <View
                  className={cn(
                    "rounded-full px-3 py-1",
                    current ? "bg-action" : "border-[1.5px] border-line-strong",
                  )}
                >
                  <ThemedText variant="label" tone={current ? "actionInk" : "muted"}>
                    {current ? t.current : t.tapToSwitch}
                  </ThemedText>
                </View>
                <ThemedText variant="momentMd" className="text-center">
                  {d.label}
                </ThemedText>
                {d.via.length > 0 && (
                  <ThemedText variant="small" tone="muted">
                    {d.via.join(" → ")}
                  </ThemedText>
                )}
              </Pressable>
            );
          })
        )}
        {moving && (
          <View className="absolute inset-0 justify-center" pointerEvents="none">
            <LockedCard body={STRINGS.driver.locked.direction} />
          </View>
        )}
      </View>

      <ThemedText variant="small" tone="muted" className="text-center">
        {t.note}
      </ThemedText>
    </View>
  );
}
