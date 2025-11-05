import { TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";
import { ThemedText, Icon } from "@/components/shared";

type ButtonTextProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary"; // secondary = cancel
  iconName?: string;
  fullWidth?: boolean;
  disabled?: boolean;
};

export default function ButtonText({
  label,
  onPress,
  variant = "primary",
  iconName,
  fullWidth = true,
  disabled = false,
}: ButtonTextProps) {
  const baseStyle =
    "flex-row items-center justify-center gap-2 rounded-full py-4 active:opacity-70";

  const styles = cn(
    baseStyle,
    variant === "primary" && "bg-dodger-blue-600",
    variant === "secondary" && "bg-neutral-300 dark:bg-neutral-800",
    fullWidth && "mx-auto w-full",
    disabled && "opacity-50",
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
      {iconName && (
        <Icon
          family="Ionicons"
          name={iconName}
          size={20}
          color={variant === "primary" ? "#edf9ff" : "#737373"}
        />
      )}
      <ThemedText
        variant="h400"
        className="text-center"
        color={variant === "primary" ? "primary" : "secondary"}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
