import { View } from "react-native";
import { router } from "expo-router";
import { ROUTES, STRINGS } from "@/constants";
import { requestLocationPermission, usePreferences } from "@/store";
import { useTheme } from "@/theme";
import { Button, Card, Icon, SafeAreaContainer, ThemedText } from "@/components/ui";

/** Asked once, on first launch: one reason, one reassurance, and a way out that still works. */
export default function LocationPermissionScreen() {
  const { shadows } = useTheme();
  const setUseMyLocation = usePreferences((s) => s.setUseMyLocation);
  const completeOnboarding = usePreferences((s) => s.completeOnboarding);
  const t = STRINGS.commuter.location;

  const allow = async () => {
    if (await requestLocationPermission()) {
      setUseMyLocation(true);
      completeOnboarding();
      router.replace(ROUTES.commuter.home);
    } else {
      setUseMyLocation(false);
      router.replace(ROUTES.onboarding.chooseStop);
    }
  };

  const chooseStop = () => {
    setUseMyLocation(false);
    router.push(ROUTES.onboarding.chooseStop);
  };

  return (
    <SafeAreaContainer className="gap-5">
      <View className="h-[240px] items-center justify-center overflow-hidden rounded-card bg-sunken">
        <View className="absolute h-36 w-36 rounded-full bg-action/10" />
        <View className="absolute h-24 w-24 rounded-full bg-action/15" />
        <View
          style={shadows.md}
          className="h-16 w-16 items-center justify-center rounded-full border-4 border-card bg-action"
        >
          <Icon name="locate" size={26} tone="actionInk" />
        </View>
      </View>

      <View className="gap-2">
        <ThemedText variant="title" accessibilityRole="header">
          {t.title}
        </ThemedText>
        <ThemedText tone="muted">{t.body}</ThemedText>
      </View>

      <Card className="flex-row items-center gap-3 rounded-tile px-4 py-3">
        <Icon name="shield-checkmark-outline" tone="live" />
        <ThemedText variant="small" tone="muted" className="flex-1">
          {t.privacy}
        </ThemedText>
      </Card>

      <View className="flex-1" />

      <View className="gap-2.5">
        <Button label={t.allow} onPress={allow} />
        <Button label={t.chooseStop} variant="outline" onPress={chooseStop} />
      </View>
    </SafeAreaContainer>
  );
}
