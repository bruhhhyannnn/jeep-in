import { View } from "react-native";
import { router } from "expo-router";
import { ThemedText, ThemedView, ButtonText } from "@/components/ui";

export default function NotFoundScreen() {
  return (
    <ThemedView variant="bg_light" className="flex-1 items-center justify-center px-6">
      <View className="items-center gap-4">
        <View className="gap-2">
          {/* 404 Header */}
          <ThemedText variant="h900" className="text-center">
            404 — Page Not Found
          </ThemedText>

          {/* Message */}
          <ThemedText color="secondary" variant="h500" className="text-center">
            Oops! The screen you're looking for doesn't exist or has been moved.
          </ThemedText>
        </View>

        {/* Back Button */}
        <View className="w-full">
          <ButtonText
            label="Go Back Home"
            variant="primary"
            iconName="home-outline"
            onPress={() => router.replace("/")}
          />
        </View>
      </View>
    </ThemedView>
  );
}
