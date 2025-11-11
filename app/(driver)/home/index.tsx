import { ThemedText, SafeAreaContainer, ButtonText } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaContainer className="items-center justify-center gap-4">
      <ThemedText variant="h900" className="text-center">
        This will be the driver dashboard
      </ThemedText>
      <ButtonText
        label="Go to Driver Settings Screen"
        fullWidth
        onPress={() => router.push(ROUTES.driver.settings)}
      />
    </SafeAreaContainer>
  );
};

export default HomeScreen;
