import { useEffect, useRef, useState } from "react";
import { STRINGS } from "@/constants";
import { View } from "react-native";
import { router } from "expo-router";
import { JeepCard, StopCard } from "@/components/card";
import { FilterModal } from "@/components/commuter";
import { BottomSheetContainerRef, BottomSheetModalBaseRef } from "@/types";
import { BottomSheetContainer, ThemedText, CustomTextInput } from "@/components/ui";
import { useMapInitStore } from "@/store";
import { distanceKm } from "@/utils";
import {
  useKeyboardSheet,
  useRecenterToUser,
  useJeepneysList,
  useStopsList,
  useLocationCurrent,
} from "@/hooks";

const HomeScreen = () => {
  // Ref for the filter modal
  const filterModalRef = useRef<BottomSheetModalBaseRef>(null);

  // Ref for bottom sheet container
  const bottomSheetRef = useRef<BottomSheetContainerRef>(null);
  useKeyboardSheet(bottomSheetRef);

  // Camera control
  const { recenterToUser } = useRecenterToUser();

  // Center to user location when component mounts
  const hasCentered = useMapInitStore((s) => s.hasCentered);
  const setHasCentered = useMapInitStore((s) => s.setHasCentered);
  useEffect(() => {
    if (hasCentered) return;
    setHasCentered(); // Mark as done so it never runs again
    recenterToUser();
  }, [hasCentered, recenterToUser]);

  // Fetch jeepneys from firestore
  const jeeps = useJeepneysList();

  // Fetch jeepneys from zustand
  const stops = useStopsList();

  // Search state
  const [search, setSearch] = useState("");

  // Search functionality
  const searchLower = search.toLowerCase();
  const filteredJeeps = jeeps.filter((j) => {
    return (
      j.plate.toLowerCase().includes(searchLower) ||
      j.route_id.toLowerCase().includes(searchLower) ||
      j.status.toLowerCase().includes(searchLower)
    );
  });
  const filteredStops = stops.filter((s) => {
    return (
      s.landmark_name.toLowerCase().includes(searchLower) ||
      s.address.toLowerCase().includes(searchLower) ||
      s.name.toLowerCase().includes(searchLower)
    );
  });

  // Get current location value
  const { currentLocation } = useLocationCurrent();
  const userLat = currentLocation?.latitude;
  const userLng = currentLocation?.longitude;

  // Filter jeeps to only close to the users location
  const RADIUS_KM = 1.5;
  const nearbyJeeps =
    userLat && userLng
      ? filteredJeeps
          .filter((j) => distanceKm(userLat, userLng, j.lat, j.lng) <= RADIUS_KM)
          .slice(0, 10)
      : filteredJeeps.slice(0, 5);
  // Filter stops to only close to the users location
  const nearbyStops =
    userLat && userLng
      ? filteredStops
          .filter((s) => distanceKm(userLat, userLng, s.latitude, s.longitude) <= RADIUS_KM)
          .slice(0, 10)
      : filteredStops.slice(0, 5);

  return (
    <View className="absolute inset-0">
      {/* Bottom Sheet */}
      <BottomSheetContainer ref={bottomSheetRef}>
        <View className="gap-4">
          {/* Search Bar */}
          <CustomTextInput
            placeholder={STRINGS.commuter.home.searchInput}
            variant="bg"
            iconName="search"
            value={search}
            onChangeText={setSearch}
          />

          {/* Nearby Jeeps */}
          <View className="gap-2">
            <ThemedText variant="h400">{STRINGS.commuter.home.nearJeeps}</ThemedText>

            <View className="gap-2">
              {jeeps.length === 0 ? (
                <ThemedText color="text_muted" className="text-center">
                  {STRINGS.commuter.home.noJeepsFound}
                </ThemedText>
              ) : (
                nearbyJeeps.map((j) => {
                  const dist =
                    userLat && userLng ? distanceKm(userLat, userLng, j.lat, j.lng) : null;

                  return (
                    <JeepCard
                      key={j.id}
                      plateNo={j.plate}
                      status={j.status}
                      distanceKm={dist}
                      onPress={() =>
                        router.push({
                          pathname: "/(map)/jeepney/[id]",
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
                  );
                })
              )}
            </View>
          </View>

          {/* Nearby Stops */}
          <View className="gap-2">
            <ThemedText variant="h400">{STRINGS.commuter.home.nearStops}</ThemedText>

            <View className="gap-2">
              {stops.length === 0 ? (
                <ThemedText color="text_muted" className="text-center">
                  {STRINGS.commuter.home.noStopsFound}
                </ThemedText>
              ) : (
                nearbyStops.map((s) => {
                  const dist =
                    userLat && userLng
                      ? distanceKm(userLat, userLng, s.latitude, s.longitude)
                      : null;

                  return (
                    <StopCard
                      key={s.id}
                      location={s.landmark_name}
                      address={s.name}
                      distanceKm={dist}
                      onPress={() =>
                        router.push({
                          pathname: "/(map)/stop/[id]",
                          params: {
                            id: s.id,
                            name: s.name,
                            landmark_name: s.landmark_name,
                            address: s.address,
                            route_id: s.route_id,
                            lat: String(s.latitude),
                            lng: String(s.longitude),
                            distance: dist ? dist.toFixed(1) : "0",
                          },
                        })
                      }
                    />
                  );
                })
              )}
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
