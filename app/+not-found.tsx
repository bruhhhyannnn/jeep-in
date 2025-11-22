import { ROUTES, STRINGS } from "@/constants";
import { View } from "react-native";
import { router } from "expo-router";
import { ThemedText, ThemedView, ButtonText } from "@/components/ui";

export default function NotFoundScreen() {
  return (
    <ThemedView variant="bg" className="flex-1 items-center justify-center px-6">
      <View className="items-center gap-4">
        <View className="gap-2">
          {/* 404 Header */}
          <ThemedText variant="h900" className="text-center">
            {STRINGS.errors.notFound}
          </ThemedText>

          {/* Message */}
          <ThemedText color="text_muted" variant="h500" className="text-center">
            {STRINGS.errors.notFoundDescription}
          </ThemedText>
        </View>

        {/* Back Button */}
        <View className="w-full">
          <ButtonText
            label={STRINGS.general.goBack}
            iconName="home-outline"
            onPress={() => router.replace(ROUTES.root.index)}
          />
        </View>
      </View>
    </ThemedView>
  );
}
