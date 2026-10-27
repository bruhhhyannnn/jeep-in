import { Pressable, View } from "react-native";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme";
import { Icon, ThemedText } from "@/components/ui";

type SettingsRowProps = {
  label: string;
  hint?: string;
  iconName: string;
  onPress: () => void;
  /** Text on the right instead of a chevron, e.g. "Change". */
  action?: string;
  disabled?: boolean;
};

/** Tappable row: icon, label, chevron. 56px, so it clears the 48px tap target. */
export default function SettingsRow({
  label,
  hint,
  iconName,
  onPress,
  action,
  disabled = false,
}: SettingsRowProps) {
  const { shadows } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={shadows.sm}
      className={cn(
        "min-h-[56px] flex-row items-center gap-3 rounded-tile border-[1.5px] border-line bg-card px-4 py-3 active:opacity-90",
        disabled && "opacity-50",
      )}
    >
      <Icon name={iconName} tone="muted" />
      <View className="flex-1">
        <ThemedText variant="strong">{label}</ThemedText>
        {hint && (
          <ThemedText variant="small" tone="muted">
            {hint}
          </ThemedText>
        )}
      </View>
      {action ? (
        <ThemedText variant="label" tone="action">
          {action}
        </ThemedText>
      ) : (
        <Icon name="chevron-forward" size={18} tone="faint" />
      )}
    </Pressable>
  );
}
