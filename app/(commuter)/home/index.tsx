import React, { useEffect, useRef } from "react";
import { ROUTES } from "@/constants";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { FilterModal } from "@/components/commuter/modals/";
import { DefaultContent } from "@/components/commuter/sections/";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContainerRef, BottomSheetModalBaseRef, MapboxMapRef } from "@/types";
import { ButtonIcon, BottomSheetContainer, MapboxContainer, MapboxMap } from "@/components/ui";
import { useKeyboardSheet, useRecenterToUser } from "@/hooks";

const HomeScreen = () => {
  // Route navigation for settings
  const router = useRouter();

  // Gets device top safe area for spacing floating buttons
  const { top } = useSafeAreaInsets();

  // Ref for the filter modal
  const filterModalRef = useRef<BottomSheetModalBaseRef>(null);

  // Ref for commuter bottom sheet container
  const bottomSheetRef = useRef<BottomSheetContainerRef>(null);

  useKeyboardSheet(bottomSheetRef);

  // Mapbox setup + camera control
  const mapRef = useRef<MapboxMapRef>(null);
  const { recenterToUser } = useRecenterToUser(mapRef);

  // Center to user location when component mounts
  useEffect(() => {
    recenterToUser();
  }, [recenterToUser]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="relative flex-1 bg-neutral-300 dark:bg-black">
          {/* Map Area */}
          <MapboxContainer fullScreen>
            <MapboxMap ref={mapRef} />
          </MapboxContainer>

          {/* Floating Buttons */}
          <View style={{ top: top + 28 }} className="absolute right-6 gap-4">
            <ButtonIcon
              iconName="settings-outline"
              onPress={() => router.push(ROUTES.commuter.settings)}
            />
            <ButtonIcon iconName="filter-outline" onPress={() => filterModalRef.current?.open()} />
            <ButtonIcon iconName="navigate-circle-outline" onPress={recenterToUser} />
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
