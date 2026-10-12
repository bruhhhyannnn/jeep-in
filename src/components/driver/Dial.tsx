import { View } from "react-native";
import { cn } from "@/lib/utils";
import { ThemedText } from "@/components/ui";

type DialProps = {
  /** live: solid blue ring · dropped: ring partly grey · pending: dashed · blocked/off: grey */
  state: "live" | "dropped" | "pending" | "off" | "blocked" | "overtime";
  value: string;
  caption: string;
  size?: "lg" | "md";
};

/** The status read-out in the middle of the GPS tab. */
export default function Dial({ state, value, caption, size = "md" }: DialProps) {
  const big = size === "lg";
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${value}, ${caption}`}
      style={{ width: big ? 184 : 156, height: big ? 184 : 156 }}
      className={cn(
        "items-center justify-center gap-1 rounded-full border-8",
        state === "live" && "border-action bg-card",
        state === "dropped" && "border-action border-b-line border-r-line bg-card",
        state === "pending" && "border-dashed border-faint bg-card",
        state === "overtime" && "border-dashed border-action bg-card",
        state === "off" && "border-line bg-card",
        state === "blocked" && "border-line bg-sunken",
      )}
    >
      <ThemedText
        variant={big ? "moment" : "momentMd"}
        tone={state === "live" || state === "dropped" || state === "overtime" ? "ink" : "muted"}
        className="text-center"
      >
        {value}
      </ThemedText>
      <ThemedText variant="label" tone="muted" className="px-3 text-center">
        {caption}
      </ThemedText>
    </View>
  );
}
