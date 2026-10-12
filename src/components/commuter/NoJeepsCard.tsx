import { View } from "react-native";
import { STRINGS } from "@/constants";
import { formatHourMinute, minutesOfDay } from "@/lib/format";
import type { Route, RouteDirection } from "@/types";
import { Button, Card, ThemedText } from "@/components/ui";

type NoJeepsCardProps = {
  direction: RouteDirection;
  route: Route | null;
  watching: boolean;
  onWatch: () => void;
  onStopWatching: () => void;
  /** The other direction, when it has jeeps out. */
  other: { direction: RouteDirection; live: number } | null;
  onSwitch: () => void;
};

/** When service usually runs, from the route's working hours. */
function serviceLine(route: Route | null) {
  const t = STRINGS.commuter.home;
  if (!route) return t.duringService;
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = formatHourMinute(route.workingHours.start);
  const end = formatHourMinute(route.workingHours.end);
  if (minutes < minutesOfDay(route.workingHours.start)) return t.beforeService(start);
  if (minutes >= minutesOfDay(route.workingHours.end)) return t.afterService(end, start);
  return t.duringService;
}

/**
 * The state a commuter hits at 5 AM and after the last trip. It says when
 * service runs and what to do now instead of showing an empty list.
 */
export default function NoJeepsCard({
  direction,
  route,
  watching,
  onWatch,
  onStopWatching,
  other,
  onSwitch,
}: NoJeepsCardProps) {
  const t = STRINGS.commuter.home;

  return (
    <View className="gap-3">
      <Card elevation="md" className="items-center gap-3 px-4 py-5">
        <View className="h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-line-strong">
          <ThemedText variant="heading" tone="faint">
            0
          </ThemedText>
        </View>
        <View className="items-center gap-1">
          <ThemedText variant="heading" className="text-center">
            {t.noJeepsTitle(direction.label)}
          </ThemedText>
          <ThemedText variant="small" tone="muted" className="text-center">
            {serviceLine(route)}
          </ThemedText>
        </View>
      </Card>
      {watching ? (
        <View className="gap-2">
          <View className="h-12 flex-row items-center justify-center gap-2 rounded-full bg-live-tint">
            <View className="h-2 w-2 rounded-full bg-live" />
            <ThemedText variant="label" tone="live">
              {t.watchingLive}
            </ThemedText>
          </View>
          <Button label={t.stopWatching} variant="ghost" size="md" onPress={onStopWatching} />
        </View>
      ) : (
        <Button label={t.alertWhenLive} iconName="notifications-outline" onPress={onWatch} />
      )}
      {other && other.live > 0 && (
        <Button
          label={t.otherDirection(other.direction.label, other.live)}
          variant="outline"
          size="md"
          iconRight="arrow-forward"
          onPress={onSwitch}
        />
      )}
      <ThemedText variant="small" tone="muted" className="text-center">
        {t.stillWorks}
      </ThemedText>
    </View>
  );
}
