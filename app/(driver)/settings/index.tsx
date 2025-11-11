import { ThemedText, SafeAreaContainer } from "@/components/ui";

const SettingsScreen = () => {
  return (
    <SafeAreaContainer className="flex-1 bg-dodger-blue-700 dark:bg-dodger-blue-950">
      <ThemedText variant="hero10">Driver Settings Screen!</ThemedText>
    </SafeAreaContainer>
  );
};

export default SettingsScreen;
