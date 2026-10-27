import { ROUTES, STRINGS } from "@/constants";
import type { Arrival } from "@/lib/fleet";
import { router } from "@/lib/router";
import { ALERT_MINUTES, useAlerts } from "@/store";
import { fonts } from "@/theme";
import { Pressable, ThemedText, View } from "@/components/ui";

/** Height the card adds to the bottom of the Map sheet. */
export const FOLLOWING_CARD_SPACE = 84;

/** Navy card at the bottom of the Map sheet after "Notify me". */
export default function FollowingCard({ arrival }: { arrival: Arrival | null }) {
  const following = useAlerts((s) => s.following);
  const unfollow = useAlerts((s) => s.unfollow);

  if (!following) return null;

  const t = STRINGS.commuter.following;
  const line = t.minutesAway(following.plate, arrival?.etaMin ?? null);
  const alertAt = t.alertAt(ALERT_MINUTES, following.stopName);

  // The card opens the jeep; Stop sits on top of it (a button can't contain another button on the web).
  return (
    <View className="min-h-[64px] flex-row items-center gap-3 rounded-[20px] bg-navy-900 py-2 pl-2.5 pr-2 active:opacity-90">
      <Pressable
        onPress={() => router.push(ROUTES.commuter.jeepney(following.jeepneyId))}
        accessibilityRole="button"
        accessibilityLabel={`${t.eyebrow}: ${line}. ${alertAt}`}
        className="absolute inset-0 rounded-[inherit]"
      />
      <View
        pointerEvents="none"
        className="h-10 w-10 items-center justify-center rounded-[10px] border-[3px] border-white bg-accent"
      >
        <span style={{ fontFamily: fonts.monoBold, fontSize: 9 }} className="text-accent-ink">
          {following.unit.replace(/[^A-Za-z0-9]/g, "").slice(0, 4)}
        </span>
      </View>
      <View pointerEvents="none" className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-live" />
          <ThemedText variant="eyebrow" tone="accent">
            {t.eyebrow}
          </ThemedText>
        </View>
        <ThemedText variant="strong" tone="onInverse" numberOfLines={1}>
          {line}
        </ThemedText>
        <ThemedText variant="label" tone="onInverseMuted" numberOfLines={1}>
          {alertAt}
        </ThemedText>
      </View>
      <Pressable
        onPress={unfollow}
        accessibilityRole="button"
        accessibilityLabel={`${t.stop} following ${following.unit}`}
        className="h-11 items-center justify-center rounded-full border-[1.5px] border-navy-400 px-4 active:opacity-80"
      >
        <ThemedText variant="label" tone="onInverse">
          {t.stop}
        </ThemedText>
      </Pressable>
    </View>
  );
}
