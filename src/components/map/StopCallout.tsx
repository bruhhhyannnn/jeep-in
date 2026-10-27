import { cn } from "@/lib/utils";
import { fonts, useTheme } from "@/theme";
import { View } from "@/components/ui";

type StopCalloutProps = {
  eyebrow: string;
  name: string;
  /** suggested: dark fill, the app picked it · chosen: white with outline, the commuter picked it */
  variant: "suggested" | "chosen";
};

/** Name tag above the nearest or chosen stop. Sits on the stop dot through a pointer. */
export default function StopCallout({ eyebrow, name, variant }: StopCalloutProps) {
  const { shadows } = useTheme();
  const suggested = variant === "suggested";

  return (
    <View className="items-center pb-3">
      <View
        style={shadows.md}
        className={cn(
          "max-w-[200px] rounded-xl px-3 py-1.5",
          suggested ? "bg-inverse" : "border-2 border-inverse bg-card",
        )}
      >
        <span
          style={{ fontFamily: fonts.bold, fontSize: 9, letterSpacing: 0.8, lineHeight: 1.3 }}
          className={cn("truncate uppercase", suggested ? "text-accent" : "text-ink")}
        >
          {eyebrow}
        </span>
        <span
          style={{ fontFamily: fonts.bold, fontSize: 13, lineHeight: 1.3 }}
          className={cn("truncate", suggested ? "text-white" : "text-ink")}
        >
          {name}
        </span>
      </View>
      <View
        className={cn(
          "-mt-[6px] h-3 w-3 rotate-45",
          suggested ? "bg-inverse" : "border-b-2 border-r-2 border-inverse bg-card",
        )}
      />
    </View>
  );
}
