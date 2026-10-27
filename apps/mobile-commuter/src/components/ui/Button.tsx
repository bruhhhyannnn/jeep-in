import { Pressable, View } from "react-native";
import { cn } from "@/lib/utils";
import type { Palette } from "@/theme";
import ThemedText, { type TextTone } from "@/components/ui/ThemedText";
import Icon from "@/components/ui/Icon";

type ButtonProps = {
  label: string;
  onPress: () => void;
  /**
   * primary: the default action · accent: the one moment per screen ·
   * navy: final step of a flow · outline: secondary · ghost: text only
   */
  variant?: "primary" | "accent" | "navy" | "outline" | "ghost";
  size?: "lg" | "md" | "sm";
  iconName?: string;
  iconRight?: string;
  disabled?: boolean;
  className?: string;
  accessibilityHint?: string;
};

const containers = {
  primary: "bg-action",
  accent: "bg-accent",
  navy: "bg-inverse",
  outline: "border-[1.5px] border-line-strong bg-card",
  ghost: "",
};

const labelTones: Record<NonNullable<ButtonProps["variant"]>, TextTone> = {
  primary: "actionInk",
  accent: "accentInk",
  navy: "onInverse",
  outline: "ink",
  ghost: "action",
};

const iconTones: Record<NonNullable<ButtonProps["variant"]>, keyof Palette> = {
  primary: "actionInk",
  accent: "accentInk",
  navy: "onInverse",
  outline: "muted",
  ghost: "action",
};

const heights = { lg: "h-[52px] px-6", md: "h-12 px-5", sm: "h-9 px-4" };

export default function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  iconName,
  iconRight,
  disabled = false,
  className,
  accessibilityHint,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      className={cn(
        "flex-row items-center justify-center gap-2 rounded-full active:opacity-80",
        heights[size],
        disabled ? "bg-line" : containers[variant],
        className,
      )}
    >
      {iconName && (
        <Icon name={iconName} size={18} tone={disabled ? "faint" : iconTones[variant]} />
      )}
      <ThemedText
        variant={size === "sm" ? "label" : "button"}
        tone={disabled ? "faint" : labelTones[variant]}
        numberOfLines={1}
        className="shrink"
      >
        {label}
      </ThemedText>
      {iconRight && (
        <View>
          <Icon name={iconRight} size={18} tone={disabled ? "faint" : iconTones[variant]} />
        </View>
      )}
    </Pressable>
  );
}
