import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText, ButtonIcon, BottomSheetContainer } from "@/components/shared";
import { DefaultContent } from "@/components/commuter/";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="relative flex-1 bg-black">
        {/* Map Area */}
        <View className="absolute inset-0">
          <View className="flex-1 items-center justify-center">
            <ThemedText variant="h600">Mapbox Map will go here</ThemedText>
          </View>

          {/* Floating Buttons */}
          <View className="absolute right-6 top-14 gap-4">
            {/* Settings Button */}
            <ButtonIcon
              iconName="settings-outline"
              onPress={() => router.push("/(commuter)/settings")}
            />

            {/* Filter Button */}
            <ButtonIcon
              iconName="filter-outline"
              // TODO: Implement filter modal bottom sheet
              onPress={() => console.log("Filter Clicked")}
            />

            {/* Location Button */}
            <ButtonIcon
              iconName="navigate-circle-outline"
              onPress={() => console.log("Recenter Location Clicked")}
            />
          </View>
        </View>

        {/* Bottom Sheet */}
        <BottomSheetContainer>
          <DefaultContent />
        </BottomSheetContainer>
      </View>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;
