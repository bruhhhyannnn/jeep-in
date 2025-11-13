import { ROUTES } from "@/constants";
import { ButtonText, SafeAreaContainer, ThemedText } from "@/components/ui";
import { router } from "expo-router";

const LoginScreen = () => {
  return (
    <SafeAreaContainer className="items-center justify-center gap-4">
      <ThemedText variant="h500" className="text-center">
        This is the auth screen, input and password forms will be here
      </ThemedText>
      <ButtonText label="Login" fullWidth onPress={() => router.replace(ROUTES.driver.home)} />
    </SafeAreaContainer>
  );
};

export default LoginScreen;
