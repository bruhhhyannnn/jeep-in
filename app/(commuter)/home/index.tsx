import React, { useEffect, useRef } from "react";
import { ROUTES } from "@/constants";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { FilterModal } from "@/components/commuter/";
import { DefaultContent } from "@/components/commuter/";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContainerRef, BottomSheetModalBaseRef } from "@/types";
import { ButtonIcon, BottomSheetContainer } from "@/components/ui";
import { useKeyboardSheet, useRecenterToUser } from "@/hooks";
import { useMapInitStore } from "@/context/useMapInitStore";

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

  // Camera control
  const { recenterToUser } = useRecenterToUser();

  // Center to user location when component mounts
  const hasCentered = useMapInitStore((s) => s.hasCentered);
  const setHasCentered = useMapInitStore((s) => s.setHasCentered);
  useEffect(() => {
    if (hasCentered) return; // ❌ Already centered in this session → skip
    setHasCentered(); // Mark as done so it never runs again
    recenterToUser();
  }, [hasCentered, recenterToUser]);

  return (
    <View className="absolute inset-0">
      {/* Floating Buttons */}
      <View className="absolute right-6 gap-4" style={{ top: top + 28 }}>
        <ButtonIcon iconName="settings-outline" onPress={() => router.push(ROUTES.root.settings)} />
        <ButtonIcon iconName="filter-outline" onPress={() => filterModalRef.current?.open?.()} />
        <ButtonIcon iconName="navigate-circle-outline" onPress={recenterToUser} />
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
