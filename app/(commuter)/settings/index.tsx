import React, { useRef } from "react";
import { Image, ScrollView, View } from "react-native";
import { ThemedText, ButtonText, SafeAreaContainer, ButtonBack } from "@/components/shared";
import { ButtonCard } from "@/components/settings";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  // actual file
  StopPointsModal,
  FareGuideModal,
  SettingsAccessibilityModal,
  ThemesAvatarModal,
  GetSupportModal,
  AboutJeepInModal,
  // ref
  StopPointsModalRef,
  FareGuideModalRef,
  SettingsAccessibilityModalRef,
  ThemesAvatarModalRef,
  GetSupportModalRef,
  AboutJeepInModalRef,
} from "@/components/settings/modals";

const SettingsScreen = () => {
  const stopPointsRef = useRef<StopPointsModalRef>(null);
  const fareGuideRef = useRef<FareGuideModalRef>(null);
  const accessibilityRef = useRef<SettingsAccessibilityModalRef>(null);
  const themesAvatarRef = useRef<ThemesAvatarModalRef>(null);
  const supportRef = useRef<GetSupportModalRef>(null);
  const aboutRef = useRef<AboutJeepInModalRef>(null);

  return (
    <SafeAreaContainer className="flex-1 bg-dodger-blue-700">
      <BottomSheetModalProvider>
        <ScrollView showsVerticalScrollIndicator={false} className="overflow-visible">
          <View className="gap-6">
            {/* Header */}
            <View>
              <View className="self-start">
                <ButtonBack showIcon label="Go Back" />
              </View>
              <View className="items-center justify-center p-10">
                <ThemedText variant="h900" className="uppercase">
                  🥳
                </ThemedText>
                <ThemedText variant="hero10" color="primary" className="uppercase">
                  Hello User!
                </ThemedText>
                <ThemedText variant="h200" color="primary">
                  Since Jan. 1 2025
                </ThemedText>
              </View>
            </View>

            {/* Getting Around Section */}
            <View className="">
              <ThemedText variant="h400" color="primary">
                Getting around
              </ThemedText>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 rounded-2xl bg-dodger-blue-600 p-4 dark:bg-dodger-blue-600">
                  <ButtonText
                    label="Stop points"
                    onPress={() => stopPointsRef.current?.open()}
                    iconName="map-outline"
                  />
                </View>

                <View className="flex-1 rounded-2xl bg-dodger-blue-600 p-4 dark:bg-dodger-blue-600">
                  <ButtonText
                    label="Fare guide"
                    onPress={() => fareGuideRef.current?.open()}
                    iconName="cash-outline"
                  />
                </View>
              </View>
            </View>

            {/* Preferences Section */}
            <View className="gap-1">
              <ThemedText variant="h400" color="primary">
                Preferences
              </ThemedText>
              <View>
                <ButtonCard
                  label="Settings and accessibility"
                  iconName="settings-outline"
                  showTopRounded
                  onPress={() => accessibilityRef.current?.open()}
                />
                <View className="h-0.5 bg-dodger-blue-400" />
                <ButtonCard
                  label="Themes and avatar"
                  iconName="color-palette-outline"
                  showBottomRounded
                  onPress={() => themesAvatarRef.current?.open()}
                />
              </View>
            </View>

            {/* Help Center Section */}
            <View className="gap-1">
              <ThemedText variant="h400" color="primary">
                Help center
              </ThemedText>
              <View>
                <ButtonCard
                  label="Settings and accessibility"
                  showTopRounded
                  iconName="mail-outline"
                  onPress={() => supportRef.current?.open()}
                />
                <View className="h-0.5 bg-dodger-blue-400" />
                <ButtonCard
                  label="Themes and avatar"
                  showBottomRounded
                  iconName="information-circle-outline"
                  onPress={() => aboutRef.current?.open()}
                />
              </View>
            </View>

            {/* Footer Logo */}
            <View className="items-center self-center rounded-2xl bg-dodger-blue-600 p-4 shadow-xl">
              <Image
                source={require("@/assets/images/logo-jeep-in-2.png")}
                className="aspect-[44/13] h-20"
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
