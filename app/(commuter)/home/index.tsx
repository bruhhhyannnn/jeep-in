import * as Location from "expo-location";
import React, { useEffect, useRef } from "react";
import { ROUTES } from "@/constants";
import { Keyboard, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { FilterModal } from "@/components/commuter/modals/";
import { DefaultContent } from "@/components/commuter/sections/";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContainerRef, BottomSheetModalBaseRef, MapboxMapRef } from "@/types";
import { useFocusEffect } from "expo-router";
import {
  ButtonIcon,
  BottomSheetContainer,
  MapContainer,
  MapboxMap,
  JeepneyMarker,
} from "@/components/ui";

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

  // Recenter
  const mapRef = useRef<MapboxMapRef>(null);
  const recenterToUser = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const coords: [number, number] = [loc.coords.longitude, loc.coords.latitude];
    mapRef.current?.recenter(coords);
  };

  // Mock jeepney data
  const jeepneys = [
    { id: "jeep-1", coords: [120.543994, 18.059955] },
    { id: "jeep-2", coords: [120.545116, 18.059409] },
    { id: "jeep-3", coords: [120.546111, 18.059246] },
  ];

  // Center to user location once mounted
  useEffect(() => {
    (async () => {
      await recenterToUser();
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="relative flex-1 bg-neutral-300 dark:bg-black">
          {/* Map Area */}
          <MapContainer fullScreen>
            <MapboxMap ref={mapRef}>
              {jeepneys.map((j) => (
                <JeepneyMarker key={j.id} id={j.id} coords={j.coords} />
              ))}
            </MapboxMap>
          </MapContainer>

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
