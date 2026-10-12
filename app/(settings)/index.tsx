import { useRef } from "react";
import { Image, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { useAuthStore, usePreferences } from "@/store";
import type { Appearance, BottomSheetModalBaseRef, TextSize } from "@/types";
import { Card, RadioCard, Segmented, ThemedText, ThemedView } from "@/components/ui";
import { ScreenHeader } from "@/components/commuter";
import { AboutJeepInModal, GetSupportModal, SettingsRow } from "@/components/settings";

const APPEARANCE: { value: Appearance; icon: string; label: string; hint: string }[] = [
  {
    value: "light",
    icon: "sunny-outline",
    label: STRINGS.settings.appearance.light,
    hint: STRINGS.settings.appearance.lightHint,
  },
  {
    value: "dark",
    icon: "moon-outline",
    label: STRINGS.settings.appearance.dark,
    hint: STRINGS.settings.appearance.darkHint,
  },
  {
    value: "system",
    icon: "phone-portrait-outline",
    label: STRINGS.settings.appearance.system,
    hint: STRINGS.settings.appearance.systemHint,
  },
];

const TEXT_SIZES: { value: TextSize; label: string }[] = [
  { value: "default", label: STRINGS.settings.textSize.default },
  { value: "large", label: STRINGS.settings.textSize.large },
  { value: "largest", label: STRINGS.settings.textSize.largest },
];

/** Opened from the gear on the map. Everything here is saved on this phone. */
export default function SettingsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const supportRef = useRef<BottomSheetModalBaseRef>(null);
  const aboutRef = useRef<BottomSheetModalBaseRef>(null);

  const appearance = usePreferences((s) => s.appearance);
  const setAppearance = usePreferences((s) => s.setAppearance);
  const textSize = usePreferences((s) => s.textSize);
  const setTextSize = usePreferences((s) => s.setTextSize);
  const clearRole = useAuthStore((s) => s.clearRole);

  const changeRole = async () => {
    await clearRole();
    router.dismissAll();
    router.replace(ROUTES.onboarding.roleSelection);
  };

  const t = STRINGS.settings;

  return (
    <ThemedView className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingTop: top + 12, paddingBottom: bottom + 32 }}
        contentContainerClassName="gap-6 px-5"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title={t.title} back />

        <View className="gap-2.5">
          <ThemedText variant="eyebrow" tone="muted">
            {t.appearance.title}
          </ThemedText>
          {APPEARANCE.map((opt) => (
            <RadioCard
              key={opt.value}
              title={opt.label}
              hint={opt.hint}
              iconName={opt.icon}
              selected={appearance === opt.value}
              onPress={() => setAppearance(opt.value)}
            />
          ))}
          <ThemedText variant="small" tone="muted">
            {t.appearance.note}
          </ThemedText>
        </View>

        <View className="gap-2.5">
          <ThemedText variant="eyebrow" tone="muted">
            {t.textSize.title}
          </ThemedText>
          <Segmented options={TEXT_SIZES} value={textSize} onChange={setTextSize} />
          <Card className="px-4 py-3">
            <ThemedText>{t.textSize.preview}</ThemedText>
          </Card>
        </View>

        <View className="gap-2.5">
          <ThemedText variant="eyebrow" tone="muted">
            {t.help}
          </ThemedText>
          <SettingsRow
            label={t.getSupport.title}
            iconName="chatbubble-ellipses-outline"
            onPress={() => supportRef.current?.open()}
          />
          <SettingsRow
            label={t.about.title}
            iconName="information-circle-outline"
            onPress={() => aboutRef.current?.open()}
          />
        </View>

        <View className="gap-2.5">
          <ThemedText variant="eyebrow" tone="muted">
            {t.account}
          </ThemedText>
          <SettingsRow
            label={t.logout.changeRole}
            hint={t.logout.changeRoleHint}
            iconName="swap-horizontal-outline"
            onPress={changeRole}
          />
        </View>

        <View className="flex-row items-center justify-center gap-4 pt-2">
          <Image
            source={require("@/assets/images/logo-mmsu.png")}
            className="h-16 w-16"
            resizeMode="contain"
            accessibilityLabel="Mariano Marcos State University"
          />
          <Image
            source={require("@/assets/images/logo-jeep-in.png")}
            className="h-12 w-32"
            resizeMode="contain"
            accessibilityLabel={STRINGS.general.appName}
          />
        </View>
      </ScrollView>

      <GetSupportModal ref={supportRef} />
      <AboutJeepInModal ref={aboutRef} />
    </ThemedView>
  );
}
