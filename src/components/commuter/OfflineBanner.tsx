import { Pressable, View } from "react-native";
import { STRINGS } from "@/constants";
import { formatAgo, formatClock } from "@/lib/format";
import { useNow } from "@/hooks";
import { reconnectFleet } from "@/hooks/useFleet";
import { useTheme } from "@/theme";
import { Icon, ThemedText } from "@/components/ui";

/** Blue banner over the map while positions can't update. Same blue in dark mode. */
export default function OfflineBanner({ since }: { since: number | null }) {
  const { shadows } = useTheme();
  const now = useNow(15000);
  const t = STRINGS.commuter.home;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={shadows.md}
      className="min-h-[56px] flex-row items-center gap-3 rounded-tile bg-blue-600 px-3.5 py-2.5"
    >
      <Icon name="cloud-offline-outline" size={20} tone="onInverse" />
      <View className="flex-1">
        <ThemedText variant="strong" tone="onInverse">
          {t.offlineTitle}
        </ThemedText>
        <ThemedText variant="label" tone="onBlueMuted">
          {since != null
            ? t.offlineSince(formatClock(since), formatAgo(since, now))
            : t.offlineNoPositions}
        </ThemedText>
      </View>
      <Pressable
        onPress={() => reconnectFleet().catch(() => {})}
        accessibilityRole="button"
        className="h-10 justify-center rounded-full border-[1.5px] border-white/70 px-4 active:opacity-80"
      >
        <ThemedText variant="label" tone="onInverse">
          {t.retry}
        </ThemedText>
      </Pressable>
    </View>
  );
}
