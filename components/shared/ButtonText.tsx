import { TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";
import ThemedText from "@/components/shared/ThemedText";
import Icon from "@/components/shared/Icon";

type ButtonTextProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary"; // secondary = cancel
  iconName?: string;
  disabled?: boolean;
  showChevron?: boolean;
};

export default function ButtonText({
  label,
  onPress,
  variant = "primary",
  iconName,
  disabled = false,
  showChevron = false,
}: ButtonTextProps) {
  const baseStyle =
    "w-full mx-auto flex-row items-center gap-2 rounded-full px-6 py-4 active:opacity-70";

  const styles = cn(
    baseStyle,
    variant === "primary" && "bg-dodger-blue-600",
    variant === "secondary" && "bg-neutral-300 dark:bg-neutral-800",
    disabled && "opacity-50",
    showChevron ? "justify-between" : "justify-center",
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
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
      <ThemedText variant="h400" color={variant === "primary" ? "primary" : "secondary"}>
        {label}
      </ThemedText>
      {showChevron && (
        <Icon name={"chevron-forward"} color={variant === "primary" ? "#edf9ff" : "#737373"} />
      )}
    </TouchableOpacity>
  );
}
