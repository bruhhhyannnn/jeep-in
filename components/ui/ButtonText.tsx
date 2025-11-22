import { TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";
import ThemedText from "@/components/ui/ThemedText";
import Icon from "@/components/ui/Icon";
import { useShadows } from "@/style/shadow";

type ButtonTextProps = {
  label: string;
  onPress: () => void;
  // * primary: default blue;
  // * secondary: go back;
  // * primaryLarge: larger primary version;
  variant?: "primary" | "secondary" | "primaryLarge";
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
  const baseStyle = "flex-row items-center justify-center gap-2 rounded-full px-4 py-2";
  const shadows = useShadows();

  const styles = cn(
    baseStyle,
    variant === "primary" && "bg-dodger-blue-600",
    variant === "secondary" && "bg-neutral-bg-light-100 dark:bg-neutral-bg-dark-100",
    variant === "primaryLarge" && "bg-dodger-blue-600 px-6 py-4",
    disabled && "opacity-50",
    fullWidth ? "w-full" : "",
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={styles}
      style={[shadows.card, !fullWidth && { alignSelf: "flex-start" }]}
    >
      {iconName && <Icon name={iconName} color={variant === "primary" ? "#edf9ff" : undefined} />}
      <ThemedText
        variant={variant === "primaryLarge" ? "h500" : "h400"}
        color={variant === "primary" || variant === "primaryLarge" ? "default_blue" : undefined}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
