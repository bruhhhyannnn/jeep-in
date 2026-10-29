import { cn } from "../lib/utils";
import ThemedText from "./ThemedText";
import Pressable from "./Pressable";
import View from "./View";

type SegmentedProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
};

/** Segmented track; the selected option is solid blue. */
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        "border-line bg-card flex-row gap-1 rounded-full border-[1.5px] p-1",
        className,
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className={cn(
              "min-h-10 flex-1 items-center justify-center rounded-full px-3",
              selected && "bg-action",
            )}
          >
            <ThemedText
              variant="label"
              tone={selected ? "actionInk" : "muted"}
              numberOfLines={1}
              className="text-center"
            >
              {opt.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
