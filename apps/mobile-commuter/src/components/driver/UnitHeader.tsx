import { View } from "react-native";
import { STRINGS } from "@/constants";
import { cn } from "@/lib/utils";
import { useTheme } from "@/theme";
import type { Jeepney } from "@/types";
import { Icon, ThemedText } from "@/components/ui";

type UnitHeaderProps = {
  jeepney: Jeepney | null;
  /** Second line, e.g. the driver's name or "Last leg · toward Laoag". */
  detail: string;
};

/** Which unit this phone is sharing for. Dashed when nothing is assigned. */
export default function UnitHeader({ jeepney, detail }: UnitHeaderProps) {
  const { shadows } = useTheme();
  return (
    <View
      style={jeepney ? shadows.sm : undefined}
      className={cn(
        "flex-row items-center gap-3 rounded-full py-2 pl-2 pr-4",
        jeepney
          ? "border-[1.5px] border-line bg-card"
          : "border-[1.5px] border-dashed border-line-strong",
      )}
    >
      <View
        className={cn(
          "h-11 w-11 items-center justify-center rounded-full bg-sunken",
          jeepney
            ? "border-[1.5px] border-line"
            : "border-[1.5px] border-dashed border-line-strong",
        )}
      >
        {jeepney && <Icon name="bus-outline" size={20} tone="muted" />}
      </View>
      <View className="flex-1">
        <ThemedText variant="strong" tone={jeepney ? "ink" : "muted"} numberOfLines={1}>
          {jeepney
            ? STRINGS.driver.unit(jeepney.jeepneyNumber || "—", jeepney.plateNumber)
            : STRINGS.driver.noUnit}
        </ThemedText>
        <ThemedText variant="small" tone={jeepney ? "muted" : "faint"} numberOfLines={1}>
          {detail}
        </ThemedText>
      </View>
    </View>
  );
}
