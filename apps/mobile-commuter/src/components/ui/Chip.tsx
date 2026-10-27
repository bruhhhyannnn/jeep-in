import { View } from "react-native";
import { cn } from "@/lib/utils";
import ThemedText, { type TextTone } from "@/components/ui/ThemedText";

export type ChipTone =
  "live" | "pending" | "stale" | "error" | "selected" | "neutral" | "fresh" | "onInverse";

const containers: Record<ChipTone, string> = {
  live: "bg-live-tint",
  pending: "bg-warn-tint",
  stale: "border-[1.5px] border-dashed border-line-strong",
  error: "bg-danger-tint",
  selected: "bg-action",
  neutral: "border-[1.5px] border-line bg-card",
  fresh: "border-[1.5px] border-line bg-card",
  onInverse: "bg-white/15",
};

const labels: Record<ChipTone, TextTone> = {
  live: "live",
  pending: "warn",
  stale: "muted",
  error: "danger",
  selected: "actionInk",
  neutral: "ink",
  fresh: "muted",
  onInverse: "onInverse",
};

const dots: Partial<Record<ChipTone, string>> = {
  live: "bg-live",
  pending: "bg-accent",
  error: "bg-danger",
  fresh: "bg-muted",
};

type ChipProps = {
  label: string;
  tone?: ChipTone;
  /** Mono text, for times and counts. */
  data?: boolean;
  className?: string;
};

/**
 * Status chip: Live, Pending, Stale (dashed), Error, a solid blue selected filter,
 * or Fresh — the quiet "8s ago" on the jeep list.
 */
export default function Chip({ label, tone = "neutral", data = false, className }: ChipProps) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-1",
        containers[tone],
        className,
      )}
    >
      {dots[tone] && <View className={cn("h-1.5 w-1.5 rounded-full", dots[tone])} />}
      <ThemedText variant={data ? "dataSm" : "label"} tone={labels[tone]} numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}
