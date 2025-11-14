import { TouchableOpacity, View } from "react-native";
import { cn } from "@/lib/utils";
import { SHADOWS } from "@/style/shadow";
import { ThemedText, Icon } from "@/components/ui";

type ButtonSettingsProps = {
  label: string;
  onPress: () => void;
  iconName: string;
  disabled?: boolean;
};

export default function ButtonSettings({
  label,
  onPress,
  iconName = "bus",
  disabled = false,
}: ButtonSettingsProps) {
  const baseStyle =
    "flex-row items-center justify-center gap-2 rounded-full bg-neutral-bg-light-200 px-6 py-4 dark:bg-neutral-bg-dark-200";

  const styles = cn(baseStyle, disabled && "opacity-50");

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={styles}
      style={SHADOWS.style}
    >
      <View className="flex-1 flex-row items-center gap-2">
        <Icon name={iconName} />
        <ThemedText variant="h400" className="">
          {label}
        </ThemedText>
      </View>
      <Icon name="chevron-forward" />
    </TouchableOpacity>
  );
}
