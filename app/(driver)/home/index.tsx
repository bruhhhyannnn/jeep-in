import { ThemedText, SafeAreaContainer, ButtonText } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useDriverTracking } from "@/hooks";
import { router } from "expo-router";

const HomeScreen = () => {
  const { startTracking, stopTracking } = useDriverTracking();

  return (
    <SafeAreaContainer className="items-center justify-center gap-4">
      <ThemedText variant="h900" className="text-center">
        This will be the driver dashboard
      </ThemedText>
      <ButtonText
        label="Go to Driver Settings Screen"
        onPress={() => router.push(ROUTES.root.settings)}
      />

      <ButtonText label="Start Trip" onPress={startTracking} variant="primary" />

      <ButtonText label="Stop Trip" onPress={stopTracking} variant="secondary" />
    </SafeAreaContainer>
  );
};

export default HomeScreen;
