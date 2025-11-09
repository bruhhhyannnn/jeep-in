import { TouchableOpacity, View } from "react-native";
import { cn } from "@/lib/utils";
import { ThemedText, Icon } from "@/components/shared";

type ButtonCard = {
  label: string;
  onPress: () => void;
  variant?: "secondary"; // secondary = getting around section
  // TODO: add also here family name for the icons
  iconName: string;
  showTopRounded?: boolean;
  showBottomRounded?: boolean;
};

export default function ButtonCard({
  label,
  onPress,
  variant,
  iconName,
  showTopRounded,
  showBottomRounded,
}: ButtonCard) {
  const baseStyle = "flex-row gap-2 bg-dodger-blue-600 active:opacity-70";

  const styles = cn(
    baseStyle,
    variant === "secondary" && "h-24 flex-1 items-end rounded-2xl px-4 py-2",
    showTopRounded && "items-center rounded-t-2xl p-4",
    showBottomRounded && "items-center rounded-b-2xl p-4",
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
