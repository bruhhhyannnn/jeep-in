import { Pressable, View } from "react-native";
import { cn } from "@/lib/utils";

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  /** For toggles sitting on a navy inverse card. */
  onInverse?: boolean;
  disabled?: boolean;
};

export default function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
  onInverse = false,
  disabled = false,
}: ToggleProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      hitSlop={10}
      className={cn(
        "h-7 w-12 justify-center rounded-full px-[3px]",
        value
          ? onInverse
            ? "bg-accent"
            : "bg-action"
          : onInverse
            ? "border-[1.5px] border-navy-400"
            : "bg-line-strong",
        value ? "items-end" : "items-start",
        disabled && "opacity-50",
      )}
    >
      <View
        className={cn(
          "rounded-full",
          !value && onInverse ? "h-[18px] w-[18px] bg-navy-400" : "h-[22px] w-[22px] bg-white",
        )}
      />
    </Pressable>
  );
}
