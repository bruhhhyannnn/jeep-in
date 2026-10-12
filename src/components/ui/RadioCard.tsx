import { Pressable, View } from "react-native";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme";
import ThemedText from "@/components/ui/ThemedText";
import Icon from "@/components/ui/Icon";

type RadioCardProps = {
  title: string;
  hint?: string;
  selected: boolean;
  onPress: () => void;
  iconName?: string;
  /** Short mono text on the right, e.g. "5 live". */
  trailing?: string;
};

/** Selected rows get a 2px blue border and a deeper shadow. */
export default function RadioCard({
  title,
  hint,
  selected,
  onPress,
  iconName,
  trailing,
}: RadioCardProps) {
  const { shadows } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={selected ? shadows.md : shadows.sm}
      className={cn(
        "min-h-[64px] flex-row items-center gap-3 rounded-card bg-card px-4 py-3.5 active:opacity-90",
        selected ? "border-2 border-action" : "border-[1.5px] border-line",
      )}
    >
      <View
        className={cn(
          "h-[22px] w-[22px] items-center justify-center rounded-full border-2",
          selected ? "border-action" : "border-line-strong",
        )}
      >
        {selected && <View className="h-2.5 w-2.5 rounded-full bg-action" />}
      </View>
      {iconName && <Icon name={iconName} tone={selected ? "action" : "muted"} />}
      <View className="flex-1">
        <ThemedText variant="heading">{title}</ThemedText>
        {hint && (
          <ThemedText variant="small" tone="muted">
            {hint}
          </ThemedText>
        )}
      </View>
      {trailing && (
        <ThemedText variant="dataSm" tone={selected ? "ink" : "muted"}>
          {trailing}
        </ThemedText>
      )}
    </Pressable>
  );
}
