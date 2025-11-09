import React, { useRef } from "react";
import { Image, ScrollView, View } from "react-native";
import { ThemedText, SafeAreaContainer, ButtonBack } from "@/components/shared";
import { ButtonCard, Divider } from "@/components/settings";
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
                <ButtonBack showIcon label="Go Back" color="primary" />
              </View>
              <View className="items-center justify-center p-10">
                <ThemedText variant="h900" className="uppercase">
                  🥳
                </ThemedText>
                {/* TODO: make this as to be dynamic on what user changes someday */}
                <ThemedText variant="hero10" color="primary" className="uppercase">
                  Hello User!
                </ThemedText>
                {/* TODO: make this as to react when this app is installed to this device, someday */}
                <ThemedText variant="h200" color="primary">
                  Since Jan. 1 2025
                </ThemedText>
              </View>
            </View>

            {/* Getting Around Section */}
            <View className="gap-1">
              <ThemedText variant="h400" color="primary">
                Getting around
              </ThemedText>
              <View className="flex-row items-center gap-2">
                <ButtonCard
                  label="Stop points"
                  iconName="map-outline"
                  variant="secondary"
                  onPress={() => stopPointsRef.current?.open()}
                />
                <ButtonCard
                  label="Fare guide"
                  iconName="cash-outline"
                  variant="secondary"
                  onPress={() => fareGuideRef.current?.open()}
                />
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
                <Divider />
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
                  label="Get support"
                  showTopRounded
                  iconName="mail-outline"
                  onPress={() => supportRef.current?.open()}
                />
                <Divider />
                <ButtonCard
                  label="About JEEP-IN"
                  showBottomRounded
                  iconName="information-circle-outline"
                  onPress={() => aboutRef.current?.open()}
                />
              </View>
            </View>

            {/* Footer Logo */}
            <View className="items-center self-center rounded-2xl bg-dodger-blue-600 p-4">
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
