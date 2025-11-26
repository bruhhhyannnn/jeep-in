import { TouchableOpacity, View } from "react-native";
import { cn } from "@/lib/utils";
import { ThemedText, Icon } from "@/components/ui";
import { useShadows } from "@/style/shadow";

type SettingsCardProp = {
  label: string;
  onPress: () => void;
  variant?: "default" | "secondary"; // secondary = getting around section
  iconName: string;
};

export default function SettingsCard({
  label,
  onPress,
  variant = "default",
  iconName,
}: SettingsCardProp) {
  const shadows = useShadows();
  const baseStyle = "flex-row gap-2 bg-dodger-blue-600 dark:bg-dodger-blue-800";

  const styles = cn(
    baseStyle,
    variant === "default" && "items-center p-4",
    variant === "secondary" && "h-24 flex-1 items-end rounded-2xl px-4 py-2",
  );

  return (
    <TouchableOpacity onPress={onPress} className={styles}>
      <View className="flex-1 flex-row items-center gap-2" style={shadows.card}>
        <ThemedText variant="h500" color="default_blue" className="flex-1">
          {label}
        </ThemedText>
        <Icon name={iconName} color="#edf9ff" />
      </View>
    </TouchableOpacity>
  );
}
