import { useMemo, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { ROUTES, STRINGS } from "@/constants";
import { useTransit } from "@/hooks";
import { matchesStop } from "@/lib/search";
import { requestLocationPermission, useLocationStore, usePreferences } from "@/store";
import { useTheme } from "@/theme";
import { Button, RadioCard, SafeAreaContainer, TextField, ThemedText } from "@/components/ui";

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
      Linking.openSettings();
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
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2 pb-2"
        keyboardShouldPersistTaps="handled"
      >
        {transit.loading && !transit.stops.length ? (
          <ActivityIndicator color={colors.action} className="py-6" />
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
      </ScrollView>

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
