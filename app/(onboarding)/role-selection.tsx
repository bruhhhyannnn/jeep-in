import { ROUTES, STRINGS } from "@/constants";
import { router } from "expo-router";
import { View, Image } from "react-native";
import { SafeAreaContainer, ThemedView, ThemedText, ButtonText } from "@/components/ui";
import { useRoleStore } from "@/context";

const RoleSelectionScreen = () => {
  const { setRole } = useRoleStore();

  return (
    <SafeAreaContainer>
      <View className="h-full gap-10 pt-36">
        {/* Image Container */}
        <View className="flex-row items-center justify-center gap-5">
          <Image
            source={require("@/assets/images/logo-nstw.png")}
            className="h-16 flex-1"
            resizeMode="contain"
          />
          <ThemedText variant="h700" className="text-center">
            X
          </ThemedText>
          <Image
            source={require("@/assets/images/logo-jeep-in.png")}
            className="h-16 flex-1"
            resizeMode="contain"
          />
        </View>

        {/* Welcome card */}
        <ThemedView variant="bg_light" className="gap-5 rounded-3xl p-5">
          <View>
            <ThemedText variant="h900" className="text-center">
              {STRINGS.onboarding.roleSelection.title}
            </ThemedText>
            <ThemedText variant="h600" color="secondary" className="text-center">
              {STRINGS.onboarding.roleSelection.subtitle}
            </ThemedText>
          </View>
          <View className="gap-3">
            <ButtonText
              label={STRINGS.onboarding.roleSelection.commuter}
              variant="primaryLarge"
              fullWidth
              onPress={async () => {
                await setRole("commuter");
                router.replace(ROUTES.commuter.home);
              }}
            />
            <ButtonText
              label={STRINGS.onboarding.roleSelection.operator}
              variant="primaryLarge"
              fullWidth
              onPress={() => router.push(ROUTES.driver.auth)}
            />
          </View>
        </ThemedView>

        {/* Image bottom container */}
        <View className="absolute bottom-0 left-0 right-0 items-center">
          <Image
            source={require("@/assets/images/logo-dost.png")}
            className="h-10 flex-1"
            resizeMode="contain"
          />
        </View>
      </View>
    </SafeAreaContainer>
  );
};

export default RoleSelectionScreen;
