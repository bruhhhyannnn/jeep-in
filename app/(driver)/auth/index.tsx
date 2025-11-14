import { ROUTES } from "@/constants";
import { ButtonText, SafeAreaContainer, ThemedText } from "@/components/ui";
import { router } from "expo-router";
import { useRoleStore } from "@/context";

const LoginScreen = () => {
  const { setRole } = useRoleStore();

  return (
    <SafeAreaContainer className="items-center justify-center gap-4">
      <ThemedText variant="h500" className="text-center">
        This is the auth screen, input and password forms will be here
      </ThemedText>
      <ButtonText
        label="Login"
        fullWidth
        onPress={async () => {
          // TODO:
          // await signIn(auth);

          // Remove all stacked screens
          router.dismissAll();

          // Set role as driver
          await setRole("driver");

          // Redirect to driver screen
          router.replace(ROUTES.driver.home);
        }}
      />
    </SafeAreaContainer>
  );
};

export default LoginScreen;
