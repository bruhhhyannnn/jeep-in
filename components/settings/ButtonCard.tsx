import { TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";
import { ThemedText, Icon } from "@/components/shared";

type ButtonCard = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary"; // secondary = getting around section
  // TODO: add also here family name for the icons
  iconName?: string;
  showAllRounded?: boolean;
  showTopRounded?: boolean;
  showBottomRounded?: boolean;
};

export default function ButtonCard({
  label,
  onPress,
  variant = "primary",
  iconName,
  showAllRounded,
  showTopRounded,
  showBottomRounded,
}: ButtonCard) {
  const baseStyle = "flex-row items-center gap-2 bg-dodger-blue-600 p-4 active:opacity-70";

  const styles = cn(
    baseStyle,
    variant === "primary" && "bg-dodger-blue-600",
    variant === "secondary" && "bg-neutral-300 dark:bg-neutral-800",
    showAllRounded && "rounded-2xl",
    showTopRounded && "rounded-t-2xl",
    showBottomRounded && "rounded-b-2xl",
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
        elevation: 6, // Android
      }}
    >
      {iconName && <Icon name={iconName} color={variant === "primary" ? "#edf9ff" : "#737373"} />}
      <ThemedText variant="h500" color={variant === "primary" ? "primary" : "secondary"}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
