import { useMemo, useState } from "react";
import { ROUTES, STRINGS } from "@/constants";
import { useTransit } from "@/hooks";
import { router } from "@/lib/router";
import { matchesStop } from "@/lib/search";
import { showWarning } from "@/services/ui/toasts";
import { requestLocationPermission, useLocationStore, usePreferences } from "@/store";
import { useTheme } from "@/theme";
import {
  Button,
  RadioCard,
  SafeAreaContainer,
  Spinner,
  TextField,
  ThemedText,
  View,
} from "@/components/ui";

/** Fallback when location is off: the picked stop becomes the boarding stop. */
export default function ChooseStopScreen() {
  const { colors } = useTheme();
  const transit = useTransit();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  const setBoardingStop = usePreferences((s) => s.setBoardingStop);
  const setDirection = usePreferences((s) => s.setDirection);
  const setUseMyLocation = usePreferences((s) => s.setUseMyLocation);
  const completeOnboarding = usePreferences((s) => s.completeOnboarding);
  const canAskAgain = useLocationStore((s) => s.canAskAgain);

  const stops = useMemo(
    () => transit.stops.filter((s) => matchesStop(s, query)),
    [transit.stops, query],
  );
  const pickedStop = picked ? transit.stopById[picked] : undefined;
  const t = STRINGS.commuter.chooseStop;

  const finish = () => {
    completeOnboarding();
    router.replace(ROUTES.commuter.home);
  };

  const boardHere = () => {
    if (pickedStop) {
      setDirection(pickedStop.directionId);
      setBoardingStop(pickedStop.id);
    }
    finish();
  };

  const turnOnLocation = async () => {
    if (!canAskAgain) {
      // A browser can't open its settings or ask again after a denial.
      showWarning(STRINGS.web.blocked.location);
      return;
    }
    if (await requestLocationPermission()) {
      setUseMyLocation(true);
      finish();
    }
  };

  return (
    <SafeAreaContainer className="gap-4">
      <View className="gap-1.5">
        <ThemedText variant="title" accessibilityRole="header">
          {t.title}
        </ThemedText>
        <ThemedText tone="muted">{t.body}</ThemedText>
      </View>

      <TextField
        iconName="search"
        placeholder={STRINGS.commuter.stops.search}
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery("")}
        autoCorrect={false}
        accessibilityLabel={STRINGS.commuter.stops.search}
      />

      <View className="no-scrollbar -mx-1 flex-1 overflow-y-auto px-1">
        <View accessibilityRole="radiogroup" accessibilityLabel={t.title} className="gap-2 pb-2">
          {transit.loading && !transit.stops.length ? (
            <View className="py-6">
              <Spinner color={colors.action} />
            </View>
          ) : transit.stops.length === 0 ? (
            <ThemedText variant="small" tone="muted">
              {t.noStops}
            </ThemedText>
          ) : (
            stops.map((s) => (
              <RadioCard
                key={s.id}
                title={s.name}
                hint={s.address || s.landmark || undefined}
                selected={picked === s.id}
                onPress={() => setPicked(s.id)}
                radioEnd
                compact
              />
            ))
          )}
        </View>
      </View>

      <View className="gap-1">
        {transit.stops.length === 0 ? (
          <Button label={t.continue} size="md" onPress={finish} />
        ) : (
          <Button
            label={pickedStop ? t.boardAt(pickedStop.name) : t.pickOne}
            size="md"
            disabled={!pickedStop}
            onPress={boardHere}
          />
        )}
        <Button
          label={t.turnOnLocation}
          variant="ghost"
          size="md"
          iconName="location-outline"
          onPress={turnOnLocation}
        />
      </View>
    </SafeAreaContainer>
  );
}
