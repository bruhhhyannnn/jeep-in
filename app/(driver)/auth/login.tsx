import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import { SafeAreaContainer, ThemedView, ThemedText, ButtonText } from "@/components/shared";

const LoginScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaContainer>
      <View className="h-full gap-10 pt-16">
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
              onPress={() => router.push("/(commuter)/home")}
            />
            <ButtonText
              label="Operator"
              showChevron={true}
              onPress={() => router.push("/(commuter)/home")}
            />
          </View>
        </ThemedView>
      </View>
    </SafeAreaContainer>
  );
};

export default LoginScreen;
