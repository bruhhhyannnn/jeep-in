import { cn } from "../lib/utils";
import { useTheme } from "../theme";
import Icon, { type IconName } from "./Icon";
import Pressable from "./Pressable";

type IconButtonProps = {
  iconName: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  /** Diameter; 48 is the minimum tap target. */
  size?: 44 | 48 | 52;
  variant?: "surface" | "plain";
  disabled?: boolean;
};

/** Round button for map controls and sheet headers. */
export default function IconButton({
  iconName,
  onPress,
  accessibilityLabel,
  size = 48,
  variant = "surface",
  disabled = false,
}: IconButtonProps) {
  const { shadows } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={size < 48 ? (48 - size) / 2 : undefined}
      style={{ width: size, height: size, ...(variant === "surface" ? shadows.sm : undefined) }}
      className={cn(
        "items-center justify-center rounded-full active:opacity-80",
        variant === "surface" && "border-line bg-card border-[1.5px]",
        disabled && "opacity-50",
      )}
    >
      <Icon name={iconName} size={size >= 52 ? 22 : 20} />
    </Pressable>
  );
}
