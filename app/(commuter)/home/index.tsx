import React, { useEffect, useRef } from "react";
import { ROUTES } from "@/constants";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { FilterModal } from "@/components/commuter/modals/";
import { DefaultContent } from "@/components/commuter/sections/";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContainerRef, BottomSheetModalBaseRef } from "@/types";
import { ButtonIcon, BottomSheetContainer } from "@/components/ui";
import { useKeyboardSheet, useRecenterToUser } from "@/hooks";
import { useMap } from "@/context/map/MapContext";

const HomeScreen = () => {
  const map = useMap();

  // Route navigation for settings
  const router = useRouter();

  // Gets device top safe area for spacing floating buttons
  const { top } = useSafeAreaInsets();

  // Ref for the filter modal
  const filterModalRef = useRef<BottomSheetModalBaseRef>(null);

  // Ref for commuter bottom sheet container
  const bottomSheetRef = useRef<BottomSheetContainerRef>(null);
  useKeyboardSheet(bottomSheetRef);

  // Camera control
  const { recenterToUser } = useRecenterToUser();

  // Center to user location when component mounts
  useEffect(() => {
    recenterToUser();
  }, [recenterToUser]);

  return (
    <View className="absolute inset-0">
      {/* Floating Buttons */}
      <View className="absolute right-6 gap-4" style={{ top: top + 28 }}>
        <ButtonIcon
          iconName="settings-outline"
          onPress={() => router.push(ROUTES.commuter.settings)}
        />
        <ButtonIcon iconName="filter-outline" onPress={() => filterModalRef.current?.open?.()} />
        <ButtonIcon iconName="navigate-circle-outline" onPress={recenterToUser} />
        <ButtonIcon
          iconName="navigate-circle-outline"
          onPress={() => map.current.flyTo([120.55, 18.06], 1200)}
        />
      </View>

      {/* Bottom Sheet */}
      <BottomSheetContainer ref={bottomSheetRef}>
        <DefaultContent />
      </BottomSheetContainer>

      {/* Modal */}
      <FilterModal ref={filterModalRef} />
    </View>
  );
};

export default HomeScreen;
