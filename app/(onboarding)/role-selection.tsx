import { ROUTES } from "@/constants";
import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import { SafeAreaContainer, ThemedView, ThemedText, ButtonText } from "@/components/ui";

const RoleSelectionScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaContainer>
      <View className="h-full gap-10 pt-16">
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
              Welcome to JEEP-IN
            </ThemedText>
            <ThemedText variant="h600" color="secondary" className="text-center">
              Select how you want to use the app. Continue as…
            </ThemedText>
          </View>
          <View className="gap-3">
            <ButtonText
              label="Commuter"
              showChevron={true}
              fullWidth
              onPress={() => router.push(ROUTES.commuter.home)}
            />
            <ButtonText
              label="Operator"
              showChevron={true}
              fullWidth
              onPress={() => router.push(ROUTES.commuter.home)}
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
