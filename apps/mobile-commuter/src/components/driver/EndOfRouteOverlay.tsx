import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { STRINGS } from "@/constants";
import type { EndOfRoute } from "@/hooks";
import { useDriverSession } from "@/store";
import { Button, Card, Icon, ThemedText, ThemedView } from "@/components/ui";

/** Opens by itself when GPS puts the jeep at the last stop of its direction. */
export default function EndOfRouteOverlay({ endOfRoute }: { endOfRoute: EndOfRoute }) {
  const { top, bottom } = useSafeAreaInsets();
  const setDirection = useDriverSession((s) => s.setDirection);
  const setResting = useDriverSession((s) => s.setResting);
  const { terminal, next, dismiss } = endOfRoute;
  const destination = next.via[next.via.length - 1] ?? next.label;
  const t = STRINGS.driver.endOfRoute;

  return (
    <ThemedView
      style={{ paddingTop: top + 16, paddingBottom: bottom + 16 }}
      className="absolute inset-0 gap-5 px-5"
    >
      <Card className="flex-row items-center gap-3 rounded-tile px-3 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-sunken">
          <Icon name="flag-outline" size={18} tone="muted" />
        </View>
        <View className="flex-1">
          <ThemedText variant="small" tone="muted">
            {t.reached}
          </ThemedText>
          <ThemedText variant="strong">{terminal.name}</ThemedText>
        </View>
      </Card>

      <View className="gap-1.5">
        <ThemedText variant="title" accessibilityRole="header">
          {t.title}
        </ThemedText>
        <ThemedText tone="muted">{t.body(destination)}</ThemedText>
      </View>

      <View className="flex-1 items-center justify-center gap-2.5 rounded-[30px] border-[3px] border-action bg-card p-4">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-action">
          <Icon name="swap-vertical" size={22} tone="actionInk" />
        </View>
        <ThemedText variant="momentMd" className="text-center">
          {next.label}
        </ThemedText>
        {next.via.length > 0 && (
          <ThemedText variant="small" tone="muted">
            {next.via.join(" → ")}
          </ThemedText>
        )}
      </View>

      <View className="gap-2.5">
        <Button
          label={t.yes(destination)}
          onPress={() => {
            setDirection(next.id);
            dismiss();
          }}
        />
        <Button
          label={t.notYet}
          variant="outline"
          onPress={() => {
            setResting(true);
            dismiss();
          }}
        />
        <ThemedText variant="small" tone="muted" className="text-center">
          {t.auto}
        </ThemedText>
      </View>
    </ThemedView>
  );
}
