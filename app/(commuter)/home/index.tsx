import React, { useEffect, useRef } from "react";
import { ROUTES, STRINGS } from "@/constants";
import { View } from "react-native";
import { router } from "expo-router";
import { FilterModal, JeepCard, StopCard } from "@/components/commuter/";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContainerRef, BottomSheetModalBaseRef } from "@/types";
import { ButtonIcon, BottomSheetContainer, ThemedText, CustomTextInput } from "@/components/ui";
import { useKeyboardSheet, useRecenterToUser, useJeepneysList, useStopsList } from "@/hooks";
import { useMapInitStore } from "@/context";

const HomeScreen = () => {
  // Route navigation for settings

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

  // Fetch jeepneys from firestore
  const jeeps = useJeepneysList();

  // Fetch jeepneys from zustand
  const stops = useStopsList();

  return (
    <View className="absolute inset-0">
      {/* Floating Buttons */}
      <View className="absolute right-6 gap-4" style={{ top: top + 28 }}>
        <ButtonIcon iconName="settings-outline" onPress={() => router.push(ROUTES.root.settings)} />
        {/* TODO: removed for now */}
        {/* <ButtonIcon iconName="filter-outline" onPress={() => filterModalRef.current?.open?.()} /> */}
        <ButtonIcon iconName="navigate-circle-outline" onPress={recenterToUser} />
      </View>

      {/* Bottom Sheet */}
      <BottomSheetContainer ref={bottomSheetRef}>
        <View className="gap-4">
          {/* Search Bar */}
          <CustomTextInput placeholder={STRINGS.commuter.home.searchInput} iconName="search" />

          {/* Nearby Jeeps */}
          <View className="gap-2">
            <ThemedText variant="h400">{STRINGS.commuter.home.nearJeeps}</ThemedText>

            <View className="gap-2">
              {jeeps.length === 0 ? (
                <ThemedText color="secondary" className="text-center">
                  No nearby jeeps
                </ThemedText>
              ) : (
                jeeps.map((j) => (
                  <JeepCard
                    key={j.id}
                    plateNo={j.plate}
                    status={j.status}
                    onPress={() =>
                      router.push({
                        pathname: "/(commuter)/home/jeepney/[id]",
                        params: {
                          id: j.id,
                          plate: j.plate,
                          route_id: j.route_id,
                          status: j.status,
                          lat: String(j.lat),
                          lng: String(j.lng),
                        },
                      })
                    }
                  />
                ))
              )}
            </View>
          </View>

          {/* Nearby Stops */}
          <View className="gap-2">
            <ThemedText variant="h400">{STRINGS.commuter.home.nearStops}</ThemedText>

            <View className="gap-2">
              {stops.map((s) => (
                <StopCard
                  key={s.id}
                  location={s.landmark_name}
                  address={s.address}
                  onPress={() =>
                    router.push({
                      pathname: "/(commuter)/home/stop/[id]",
                      params: {
                        id: s.id,
                        name: s.name,
                        landmark_name: s.landmark_name,
                        address: s.address,
                        route_id: s.route_id,
                        lat: String(s.latitude),
                        lng: String(s.longitude),
                      },
                    })
                  }
                />
              ))}
            </View>
          </View>
        </View>
      </BottomSheetContainer>

      {/* Modal */}
      <FilterModal ref={filterModalRef} />
    </View>
  );
};

export default HomeScreen;
