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
      <View className="h-[230px] items-center justify-center overflow-hidden rounded-[26px] bg-sunken">
        {/* Streets */}
        <View className="absolute left-[-10%] top-[68%] h-2.5 w-[120%] -rotate-[16deg] rounded-full bg-card" />
        <View className="absolute left-[34%] top-[-10%] h-[120%] w-2.5 -rotate-[8deg] rounded-full bg-card" />
        <View className="absolute left-[66%] top-[-10%] h-[120%] w-2.5 -rotate-[14deg] rounded-full bg-card" />
        <View className="absolute h-[120px] w-[120px] rounded-full bg-action/10" />
        <View
          style={shadows.md}
          className="h-14 w-14 items-center justify-center rounded-full border-[5px] border-card bg-action"
        >
          <Icon name="location-outline" size={24} tone="actionInk" />
        </View>
      </View>

      <View className="gap-2">
        <ThemedText variant="title" accessibilityRole="header">
          {t.title}
        </ThemedText>
        <ThemedText tone="muted">{t.body}</ThemedText>
      </View>

      <Card className="flex-row items-center gap-3 rounded-tile px-4 py-3">
        <Icon name="lock-closed-outline" size={18} tone="muted" />
        <ThemedText variant="small" tone="muted" className="flex-1">
          {t.privacy}
        </ThemedText>
      </Card>

      <View className="flex-1" />

      <View className="gap-2.5">
        <Button label={t.allow} size="md" onPress={allow} />
        <Button label={t.chooseStop} variant="outline" size="md" onPress={chooseStop} />
      </View>
    </SafeAreaContainer>
  );
}
