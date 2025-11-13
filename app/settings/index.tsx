import { ROUTES, STRINGS } from "@/constants";
import { useNicknameStore } from "@/store";
import React, { useEffect, useRef } from "react";
import { Image, ScrollView, View } from "react-native";
import { ThemedText, SafeAreaContainer, ButtonBack } from "@/components/ui";
import { SettingsCard, Divider } from "@/components/settings";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomSheetModalBaseRef } from "@/types";
import { router } from "expo-router";
import {
  StopPointsModal,
  FareGuideModal,
  SettingsAccessibilityModal,
  ThemesAvatarModal,
  GetSupportModal,
  AboutJeepInModal,
} from "@/components/settings";

const SettingsScreen = () => {
  // Modal Refs
  const stopPointsRef = useRef<BottomSheetModalBaseRef>(null);
  const fareGuideRef = useRef<BottomSheetModalBaseRef>(null);
  const accessibilityRef = useRef<BottomSheetModalBaseRef>(null);
  const themesAvatarRef = useRef<BottomSheetModalBaseRef>(null);
  const supportRef = useRef<BottomSheetModalBaseRef>(null);
  const aboutRef = useRef<BottomSheetModalBaseRef>(null);

  // Load user nickname
  const { nickname, loadNickname } = useNicknameStore();
  useEffect(() => {
    loadNickname();
  }, []);

  return (
    <SafeAreaContainer className="flex-1 bg-dodger-blue-700 dark:bg-dodger-blue-950">
      <BottomSheetModalProvider>
        <ScrollView showsVerticalScrollIndicator={false} className="overflow-visible">
          <View className="gap-6">
            {/* Header */}
            <View>
              <View className="self-start">
                <ButtonBack showIcon label={STRINGS.general.goBack} color="primary" />
              </View>
              <View className="items-center justify-center p-10">
                <ThemedText variant="h900" className="uppercase">
                  🥳
                </ThemedText>
                <ThemedText variant="hero10" color="primary" className="uppercase">
                  {STRINGS.settings.hello} {nickname}!
                </ThemedText>
                {/* TODO: make this as to react when this app is installed to this device, someday */}
                <ThemedText variant="h200" color="primary">
                  {STRINGS.settings.since} Jan. 1 2025
                </ThemedText>
              </View>
            </View>

            {/* Getting Around Section */}
            <View className="gap-1">
              <ThemedText variant="h400" color="primary">
                {STRINGS.settings.gettingAround}
              </ThemedText>
              <View className="flex-row items-center gap-2">
                <SettingsCard
                  label={STRINGS.settings.stopPoints.title}
                  iconName="map-outline"
                  variant="secondary"
                  onPress={() => stopPointsRef.current?.open()}
                />
                <SettingsCard
                  label={STRINGS.settings.fareGuide.title}
                  iconName="cash-outline"
                  variant="secondary"
                  onPress={() => fareGuideRef.current?.open()}
                />
              </View>
            </View>

            {/* Preferences Section */}
            <View className="gap-1">
              <ThemedText variant="h400" color="primary">
                {STRINGS.settings.preferences}
              </ThemedText>
              <View className="overflow-hidden rounded-2xl">
                <SettingsCard
                  label={STRINGS.settings.settingsAccessibility.title}
                  iconName="settings-outline"
                  onPress={() => accessibilityRef.current?.open()}
                />
                <Divider />
                <SettingsCard
                  label={STRINGS.settings.themesAvatar.title}
                  iconName="color-palette-outline"
                  onPress={() => themesAvatarRef.current?.open()}
                />
              </View>
            </View>

            {/* Help Center Section */}
            <View className="gap-1">
              <ThemedText variant="h400" color="primary">
                {STRINGS.settings.helpCenter}
              </ThemedText>
              <View className="overflow-hidden rounded-2xl">
                <SettingsCard
                  label={STRINGS.settings.getSupport.title}
                  iconName="mail-outline"
                  onPress={() => supportRef.current?.open()}
                />
                <Divider />
                <SettingsCard
                  label={STRINGS.settings.about.title}
                  iconName="information-circle-outline"
                  onPress={() => aboutRef.current?.open()}
                />
              </View>
            </View>

            {/* Role Selection Section */}
            <View className="gap-1">
              <ThemedText variant="h400" color="primary">
                Account
              </ThemedText>

              <View className="overflow-hidden rounded-2xl">
                <SettingsCard
                  label="Change Role"
                  iconName="swap-horizontal-outline"
                  onPress={() => {
                    router.dismissAll();
                    router.replace(ROUTES.onboarding.roleSelection);
                  }}
                />
                <Divider />
                {/* TODO: render the logout card here someday if the user is detected as logged in if not just hide it */}
                <SettingsCard
                  label="Logout"
                  iconName="log-out-outline"
                  onPress={async () => {
                    // OPTIONAL: if you're using Firebase Auth
                    // await signOut(auth);

                    // OPTIONAL: clear any local role, nickname, or sensitive state
                    // useRoleStore.getState().clearRole();
                    // await SecureStore.deleteItemAsync("uid");

                    router.dismissAll();
                    router.replace(ROUTES.onboarding.welcome);
                  }}
                />
              </View>
            </View>

            {/* Footer Logo */}
            <View className="items-center self-center rounded-2xl bg-dodger-blue-600 p-4 dark:bg-dodger-blue-800">
              <Image
                source={require("@/assets/images/logo-jeep-in-2.png")}
                className="aspect-[44/13] h-16"
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>

        {/* Modals */}
        <StopPointsModal ref={stopPointsRef} />
        <FareGuideModal ref={fareGuideRef} />
        <SettingsAccessibilityModal ref={accessibilityRef} />
        <ThemesAvatarModal ref={themesAvatarRef} />
        <GetSupportModal ref={supportRef} />
        <AboutJeepInModal ref={aboutRef} />
      </BottomSheetModalProvider>
    </SafeAreaContainer>
  );
};

export default SettingsScreen;
