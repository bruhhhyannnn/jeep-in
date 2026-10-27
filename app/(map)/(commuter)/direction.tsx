import { useState } from "react";
import { STRINGS } from "@/constants";
import { useEscape, useFleet, useSafeAreaInsets, useTransit } from "@/hooks";
import { router } from "@/lib/router";
import { showWarning } from "@/services/ui/toasts";
import { requestLocationPermission, useLocationStore, usePreferences } from "@/store";
import { layout, useTheme } from "@/theme";
import {
  Button,
  Card,
  Icon,
  IconButton,
  Pressable,
  RadioCard,
  ThemedText,
  Toggle,
  View,
} from "@/components/ui";

/** Sheet over the map: the commuter picks the direction. It is never guessed from location. */
export default function DirectionSheet() {
  const { top, bottom } = useSafeAreaInsets();
  const { shadows } = useTheme();
  const transit = useTransit();
  const { jeeps } = useFleet(transit);
  const { directions, route } = transit;

  const savedDirectionId = usePreferences((s) => s.directionId);
  const setDirection = usePreferences((s) => s.setDirection);
  const useMyLocation = usePreferences((s) => s.useMyLocation);
  const setUseMyLocation = usePreferences((s) => s.setUseMyLocation);
  const permission = useLocationStore((s) => s.permission);
  const canAskAgain = useLocationStore((s) => s.canAskAgain);

  const [picked, setPicked] = useState(savedDirectionId ?? directions[0]?.id ?? null);
  const t = STRINGS.commuter.direction;
  useEscape(() => router.back());

  const toggleLocation = async (value: boolean) => {
    if (value && permission !== "granted") {
      if (!canAskAgain) {
        // A browser can't open its settings or ask again after a denial.
        showWarning(STRINGS.web.blocked.location);
        return;
      }
      if (!(await requestLocationPermission())) return;
    }
    setUseMyLocation(value);
  };

  const showJeeps = () => {
    if (picked) setDirection(picked);
    router.back();
  };

  return (
    <View className="absolute inset-0">
      <Pressable
        onPress={() => router.back()}
        accessibilityLabel="Close"
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-navy-950/30"
      />
      <View style={{ top: top + 8 }} className="absolute left-4">
        <IconButton iconName="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
      </View>

      <View
        style={{ paddingBottom: bottom + 16, maxWidth: layout.contentMaxWidth, ...shadows.lg }}
        className="absolute bottom-0 left-0 right-0 mx-auto w-full gap-3 rounded-t-sheet bg-page px-5 pt-3"
      >
        <View className="h-1 w-10 self-center rounded-full bg-line-strong" />
        <View>
          <ThemedText variant="title" accessibilityRole="header">
            {t.title}
          </ThemedText>
          <ThemedText variant="small" tone="muted">
            {t.subtitle(route?.name ?? STRINGS.commuter.routeFallback)}
          </ThemedText>
        </View>

        {directions.length === 0 ? (
          <ThemedText tone="muted">{t.noDirections}</ThemedText>
        ) : (
          <View accessibilityRole="radiogroup" accessibilityLabel={t.title} className="gap-3">
            {directions.map((d) => (
              <RadioCard
                key={d.id}
                title={d.label}
                hint={d.via.length ? d.via.join(" → ") : undefined}
                trailing={t.live(jeeps.filter((j) => j.directionId === d.id && !j.stale).length)}
                selected={picked === d.id}
                onPress={() => setPicked(d.id)}
              />
            ))}
          </View>
        )}

        <Card className="min-h-[56px] flex-row items-center gap-3 rounded-full px-4">
          <Icon name="locate" size={18} tone="action" />
          <ThemedText variant="strong" className="flex-1">
            {t.useMyLocation}
          </ThemedText>
          <Toggle
            value={useMyLocation && permission === "granted"}
            onValueChange={toggleLocation}
            accessibilityLabel={t.useMyLocation}
          />
        </Card>

        <Button label={t.showJeeps} onPress={showJeeps} disabled={!picked} />
      </View>
    </View>
  );
}
