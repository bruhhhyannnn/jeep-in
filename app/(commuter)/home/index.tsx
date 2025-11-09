import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { useRouter } from "expo-router";
import { ThemedText, ButtonIcon, BottomSheetContainer } from "@/components/shared";
import { FilterModal, FilterModalRef } from "@/components/commuter/modals/";
import { DefaultContent } from "@/components/commuter/sections/";

const HomeScreen = () => {
  const router = useRouter();
  const filterModalRef = useRef<FilterModalRef>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="relative flex-1 bg-black">
          {/* Map Area */}
          <View className="absolute inset-0 items-center justify-center">
            <ThemedText variant="h600">Mapbox Map will go here</ThemedText>
          </View>

          {/* Floating Buttons */}
          <View className="absolute right-6 top-14 gap-4">
            <ButtonIcon
              iconName="settings-outline"
              onPress={() => router.push("/(commuter)/settings")}
            />
            <ButtonIcon iconName="filter-outline" onPress={() => filterModalRef.current?.open()} />
            <ButtonIcon
              iconName="navigate-circle-outline"
              onPress={() => console.log("Recenter Location Clicked")}
            />
          </View>

          {/* Bottom Sheet */}
          <BottomSheetContainer>
            <DefaultContent />
          </BottomSheetContainer>

          {/* Modal */}
          <FilterModal ref={filterModalRef} />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;
