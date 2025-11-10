import { TouchableOpacity, View } from "react-native";
import { cn } from "@/lib/utils";
import { ThemedText, Icon } from "@/components/ui";

type SettingsCardProp = {
  label: string;
  onPress: () => void;
  variant?: "default" | "secondary"; // secondary = getting around section
  // TODO: maybe add also here family name for the icons
  iconName: string;
};

export default function SettingsCard({
  label,
  onPress,
  variant = "default",
  iconName,
}: SettingsCardProp) {
  const baseStyle =
    "flex-row items-center gap-2 bg-dodger-blue-600 dark:bg-dodger-blue-800 active:opacity-70";

  const styles = cn(
    baseStyle,
    variant === "default" && "p-4",
    variant === "secondary" && "h-24 flex-1 items-end rounded-2xl px-4 py-2",
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      className={styles}
      style={{
        shadowColor: "#0A0A0A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4, // Android
      }}
    >
      <View className="flex-1 flex-row items-center gap-2">
        <ThemedText variant="h500" color="primary" className="flex-1">
          {label}
        </ThemedText>
        <Icon name={iconName} color={"#edf9ff"} />
      </View>
    </TouchableOpacity>
  );
}
