import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { useRouter } from "expo-router";
import { ThemedText, ButtonIcon, BottomSheetContainer, MapContainer } from "@/components/shared";
import { FilterModal, FilterModalRef } from "@/components/commuter/modals/";
import { DefaultContent } from "@/components/commuter/sections/";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const router = useRouter();
  const filterModalRef = useRef<FilterModalRef>(null);
  const { top } = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="relative flex-1 bg-neutral-300 dark:bg-black">
          {/* Map Area */}
          <MapContainer fullScreen>
            {/* TODO: just a placeholder, remove it once MapboxMap is now available */}
            <View className="flex-1 items-center justify-center">
              <ThemedText variant="h600">Mapbox Map will go here</ThemedText>
            </View>
          </MapContainer>

          {/* Floating Buttons */}
          <View style={{ top: top + 28 }} className="absolute right-6 gap-4">
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
