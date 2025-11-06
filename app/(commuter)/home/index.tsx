import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText, ButtonIcon, BottomSheetContainer } from "@/components/shared";
import DefaultContent from "@/components/commuter/DefaultContent";

const HomeScreen = () => {
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
              onPress={() => console.log("Settings Clicked")}
            />

            {/* Filter Button */}
            <ButtonIcon iconName="filter-outline" onPress={() => console.log("Filter Clicked")} />

            {/* Location Button */}
            <ButtonIcon
              iconName="navigate-circle-outline"
              onPress={() => console.log("Recenter Location Clicked")}
            />
          </View>

          {/* Location Button */}
          {/* TODO: Might delete this later on */}
          {/* <View className="absolute bottom-[13%] right-6">
            <ButtonIcon
              iconName="navigate-circle-outline"
              onPress={() => console.log("Recenter Location Clicked")}
            />
          </View> */}
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
