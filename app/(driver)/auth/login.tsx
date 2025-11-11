import { ROUTES } from "@/constants";
import { ButtonText, SafeAreaContainer, ThemedText } from "@/components/ui";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaContainer className="items-center justify-center gap-4">
      <ThemedText variant="h500" className="text-center">
        This is the auth screen, input and password forms will be here
      </ThemedText>
      <ButtonText
        label="Go to Driver Home Screen"
        fullWidth
        onPress={() => router.replace(ROUTES.driver.home)}
      />
    </SafeAreaContainer>
  );
};

export default LoginScreen;
