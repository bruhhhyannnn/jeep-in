import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { STRINGS } from "@/constants";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/store";
import type { Palette } from "@/theme";
import type { Appearance } from "@/types";
import { Icon, IconButton, ThemedText } from "@/components/ui";

const OPTIONS: { value: Appearance; icon: string; circle: string; tone: keyof Palette }[] = [
  { value: "light", icon: "sunny", circle: "bg-warn-tint", tone: "warnInk" },
  { value: "dark", icon: "moon", circle: "bg-inverse", tone: "accent" },
  { value: "system", icon: "phone-portrait-outline", circle: "bg-sunken", tone: "ink" },
];

/** Three big rows, one tap each, for using the phone in the cab at 5 AM without glare. */
export default function DisplayScreen() {
  const { top } = useSafeAreaInsets();
  const appearance = usePreferences((s) => s.appearance);
  const setAppearance = usePreferences((s) => s.setAppearance);
  const labels = STRINGS.settings.appearance;

  return (
    <View style={{ paddingTop: top + 12 }} className="flex-1 gap-5 px-5">
      <View className="flex-row items-center gap-3">
        <IconButton iconName="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
        <ThemedText variant="title" accessibilityRole="header">
          {STRINGS.driver.display.title}
        </ThemedText>
      </View>

      <View className="gap-3">
        {OPTIONS.map((opt) => {
          const selected = appearance === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setAppearance(opt.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              className={cn(
                "min-h-[76px] flex-row items-center gap-3.5 rounded-card bg-card px-4 py-3",
                selected ? "border-2 border-action" : "border-[1.5px] border-line",
              )}
            >
              <View
                className={cn("h-11 w-11 items-center justify-center rounded-full", opt.circle)}
              >
                <Icon name={opt.icon} size={20} tone={opt.tone} />
              </View>
              <ThemedText variant="heading" className="flex-1">
                {labels[opt.value]}
              </ThemedText>
              <View
                className={cn(
                  "h-[26px] w-[26px] items-center justify-center rounded-full border-2",
                  selected ? "border-action" : "border-faint",
                )}
              >
                {selected && <View className="h-3 w-3 rounded-full bg-action" />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <ThemedText variant="small" tone="muted" className="px-1">
        {STRINGS.driver.display.note}
      </ThemedText>
    </View>
  );
}
