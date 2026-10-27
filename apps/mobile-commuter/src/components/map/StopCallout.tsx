import { Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { fonts, useTheme } from "@/theme";

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
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={{ fontFamily: fonts.bold, fontSize: 9, letterSpacing: 0.8 }}
          className={cn("uppercase", suggested ? "text-accent" : "text-ink")}
        >
          {eyebrow}
        </Text>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={{ fontFamily: fonts.bold, fontSize: 13 }}
          className={suggested ? "text-white" : "text-ink"}
        >
          {name}
        </Text>
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
