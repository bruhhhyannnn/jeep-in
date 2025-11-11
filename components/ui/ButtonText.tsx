import { TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";
import ThemedText from "@/components/ui/ThemedText";
import Icon from "@/components/ui/Icon";
import { SHADOWS } from "@/style/shadow";

type ButtonTextProps = {
  label: string;
  onPress: () => void;
  // * primary: default blue;
  // * secondary: go back;
  variant?: "primary" | "secondary";
  iconName?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

export default function ButtonText({
  label,
  onPress,
  variant = "primary",
  iconName,
  disabled = false,
  fullWidth = false,
}: ButtonTextProps) {
  const baseStyle =
    "flex-row items-center justify-center gap-2 rounded-full px-4 py-2 active:opacity-70";

  const styles = cn(
    baseStyle,
    variant === "primary" && "bg-dodger-blue-600",
    variant === "secondary" && "bg-neutral-bg-light-200 dark:bg-neutral-bg-dark-200",
    disabled && "opacity-50",
    fullWidth ? "w-full" : "",
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={styles}
      style={[SHADOWS.style, !fullWidth && { alignSelf: "flex-start" }]}
    >
      {iconName && <Icon name={iconName} color={variant === "primary" ? "#edf9ff" : undefined} />}
      <ThemedText variant="h400" color={variant === "primary" ? "primary" : undefined}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
