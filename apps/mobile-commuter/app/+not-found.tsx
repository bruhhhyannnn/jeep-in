import { ROUTES, STRINGS } from "@/constants";
import { View } from "react-native";
import { router } from "expo-router";
import { Button, Icon, SafeAreaContainer, ThemedText } from "@/components/ui";

export default function NotFoundScreen() {
  return (
    <SafeAreaContainer className="items-center justify-center gap-5">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-sunken">
        <Icon name="compass-outline" size={28} tone="muted" />
      </View>
      <View className="items-center gap-1.5">
        <ThemedText variant="title" className="text-center" accessibilityRole="header">
          {STRINGS.errors.notFound}
        </ThemedText>
        <ThemedText tone="muted" className="text-center">
          {STRINGS.errors.notFoundDescription}
        </ThemedText>
      </View>
      <View className="w-full">
        <Button
          label={STRINGS.general.goBack}
          iconName="home-outline"
          onPress={() => router.replace(ROUTES.root.index)}
        />
      </View>
    </SafeAreaContainer>
  );
}
