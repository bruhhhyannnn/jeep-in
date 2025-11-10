import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaContainer, ThemedView, ThemedText, ButtonText } from "@/components/ui";

const LoginScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaContainer>
      <ThemedText>This is the auth screen</ThemedText>
    </SafeAreaContainer>
  );
};

export default LoginScreen;
