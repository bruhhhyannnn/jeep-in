import React, { useRef } from "react";
import { ROUTES } from "@/constants";
import { Keyboard, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { FilterModal } from "@/components/commuter/modals/";
import { DefaultContent } from "@/components/commuter/sections/";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContainerRef, BottomSheetModalBaseRef } from "@/types";
import { useFocusEffect } from "expo-router";
import { ButtonIcon, BottomSheetContainer, MapContainer, MapboxMap } from "@/components/ui";

const HomeScreen = () => {
  const router = useRouter();
  const filterModalRef = useRef<BottomSheetModalBaseRef>(null);
  const { top } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetContainerRef>(null);

  // React to keyboard show and hide for the bottom sheet to expand
  useFocusEffect(
    React.useCallback(() => {
      const showSub = Keyboard.addListener("keyboardDidShow", () => {
        bottomSheetRef.current?.expand();
      });
      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        bottomSheetRef.current?.collapse();
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []),
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="relative flex-1 bg-neutral-300 dark:bg-black">
          {/* Map Area */}
          <MapContainer fullScreen>
            <MapboxMap center={[120.5936, 18.1984]} zoom={14}></MapboxMap>
          </MapContainer>

          {/* Floating Buttons */}
          <View style={{ top: top + 28 }} className="absolute right-6 gap-4">
            <ButtonIcon
              iconName="settings-outline"
              onPress={() => router.push(ROUTES.commuter.settings)}
            />
            <ButtonIcon iconName="filter-outline" onPress={() => filterModalRef.current?.open()} />
            <ButtonIcon
              iconName="navigate-circle-outline"
              onPress={() => console.log("Recenter Location Clicked")}
            />
          </View>

          {/* Bottom Sheet */}
          <BottomSheetContainer ref={bottomSheetRef}>
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
