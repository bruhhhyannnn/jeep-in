import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { ROUTES, STRINGS } from "@/constants";
import { useArrivals, useTransit } from "@/hooks";
import { ALERT_MINUTES, useAlerts } from "@/store";
import { fonts, useTheme } from "@/theme";
import { ThemedText } from "@/components/ui";
import { useTabBarInset } from "@/components/commuter/TabBar";

export const FOLLOWING_CARD_SPACE = 84;

/** Space the tab bar and, while following a jeep, the Following card take at the bottom. */
export function useBottomChrome() {
  const tabBar = useTabBarInset();
  const following = useAlerts((s) => s.following != null);
  return tabBar + (following ? FOLLOWING_CARD_SPACE : 0);
}

/** Navy card pinned above the tab bar after "Notify me". */
export default function FollowingCard() {
  const { shadows } = useTheme();
  const following = useAlerts((s) => s.following);
  const unfollow = useAlerts((s) => s.unfollow);
  const bottom = useTabBarInset();
  const transit = useTransit();
  const target = following ? (transit.stopById[following.stopId] ?? null) : null;
  const { arrivals } = useArrivals(transit, following?.directionId ?? null, target);

  if (!following) return null;

  const arrival = arrivals.find((a) => a.jeep.id === following.jeepneyId);
  const t = STRINGS.commuter.following;

  return (
    <View
      pointerEvents="box-none"
      style={{ bottom }}
      className="absolute left-0 right-0 items-center px-3"
    >
      <Pressable
        onPress={() => router.push(ROUTES.commuter.jeepney(following.jeepneyId))}
        accessibilityRole="button"
        style={shadows.lg}
        className="h-[76px] w-full max-w-[480px] flex-row items-center gap-3 rounded-card bg-inverse px-3.5"
      >
        <View className="h-10 w-10 items-center justify-center rounded-[10px] border-[3px] border-white bg-accent">
          <Text
            allowFontScaling={false}
            style={{ fontFamily: fonts.monoBold, fontSize: 9 }}
            className="text-accent-ink"
          >
            {following.unit.replace(/[^A-Za-z0-9]/g, "").slice(0, 4)}
          </Text>
        </View>
        <View className="flex-1">
          <ThemedText variant="eyebrow" tone="accent">
            {t.eyebrow}
          </ThemedText>
          <ThemedText variant="strong" tone="onInverse" numberOfLines={1}>
            {t.minutesAway(following.plate, arrival?.etaMin ?? null)}
          </ThemedText>
          <ThemedText variant="label" tone="onInverseMuted" numberOfLines={1}>
            {t.alertAt(ALERT_MINUTES, following.stopName)}
          </ThemedText>
        </View>
        <Pressable
          onPress={unfollow}
          accessibilityRole="button"
          accessibilityLabel={`${t.stop} following ${following.unit}`}
          className="h-11 items-center justify-center rounded-full border-[1.5px] border-white/40 px-4 active:opacity-80"
        >
          <ThemedText variant="label" tone="onInverse">
            {t.stop}
          </ThemedText>
        </Pressable>
      </Pressable>
    </View>
  );
}
