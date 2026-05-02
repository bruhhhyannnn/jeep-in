import { TouchableOpacity, View } from "react-native";
import { cn } from "@/lib/utils";
import { useShadows } from "@/hooks";
import { ThemedText, Icon } from "@/components/ui";

type SettingsModalCardProps = {
  label: string;
  onPress: () => void;
  iconName: string;
  disabled?: boolean;
};

export default function SettingsModalCard({
  label,
  onPress,
  iconName = "bus",
  disabled = false,
}: SettingsModalCardProps) {
  const baseStyle =
    "flex-row items-center justify-center gap-2 rounded-full bg-neutral-bg-light-100 px-6 py-4 dark:bg-neutral-bg-dark-100";
  const shadows = useShadows();

  const styles = cn(baseStyle, disabled && "opacity-50");

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} className={styles} style={shadows.card}>
      <View className="flex-1 flex-row items-center gap-4">
        <Icon name={iconName} />
        <ThemedText variant="h400" className="">
          {label}
        </ThemedText>
      </View>
      <Icon name="chevron-forward" />
    </TouchableOpacity>
  );
}
