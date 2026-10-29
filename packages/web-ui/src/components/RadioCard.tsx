import { cn } from "../lib/utils";
import { useTheme } from "../theme";
import ThemedText from "./ThemedText";
import Icon, { type IconName } from "./Icon";
import Pressable from "./Pressable";
import View from "./View";

type RadioCardProps = {
  title: string;
  hint?: string;
  selected: boolean;
  onPress: () => void;
  iconName?: IconName;
  /** Drawn before the text, e.g. a theme thumbnail. */
  leading?: React.ReactNode;
  /** Short mono text on the right, e.g. "5 live". */
  trailing?: string;
  /** Radio on the right instead of the left. */
  radioEnd?: boolean;
  /** Smaller title and padding, for long lists such as stops. */
  compact?: boolean;
};

function Radio({ selected }: { selected: boolean }) {
  return (
    <View
      className={cn(
        "h-[22px] w-[22px] items-center justify-center rounded-full border-2",
        selected ? "border-action" : "border-line-strong",
      )}
    >
      {selected && <View className="bg-action h-2.5 w-2.5 rounded-full" />}
    </View>
  );
}

/** Selected rows get a 2px blue border and a deeper shadow. */
export default function RadioCard({
  title,
  hint,
  selected,
  onPress,
  iconName,
  leading,
  trailing,
  radioEnd = false,
  compact = false,
}: RadioCardProps) {
  const { shadows } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={selected ? shadows.md : shadows.sm}
      className={cn(
        "bg-card flex-row items-center gap-3 active:opacity-90",
        compact ? "min-h-[56px] rounded-[18px] py-2.5" : "rounded-card min-h-[64px] py-3.5",
        leading ? "pl-2.5 pr-4" : compact ? "px-3.5" : "px-4",
        selected ? "border-action border-2" : "border-line border-[1.5px]",
      )}
    >
      {!radioEnd && <Radio selected={selected} />}
      {leading}
      {iconName && <Icon name={iconName} tone={selected ? "action" : "muted"} />}
      <View className="flex-1">
        <ThemedText variant={compact ? "strong" : "heading"}>{title}</ThemedText>
        {hint && (
          <ThemedText variant={compact ? "label" : "small"} tone="muted">
            {hint}
          </ThemedText>
        )}
      </View>
      {trailing && (
        <ThemedText variant="dataSm" tone={selected ? "ink" : "muted"}>
          {trailing}
        </ThemedText>
      )}
      {radioEnd && <Radio selected={selected} />}
    </Pressable>
  );
}
