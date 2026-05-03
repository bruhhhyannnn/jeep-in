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
  useJeepneys,
  useStopPoints,
  useLocationCurrent,
} from "@/hooks";

const HomeScreen = () => {
  const filterModalRef = useRef<BottomSheetModalBaseRef>(null);
  const bottomSheetRef = useRef<BottomSheetContainerRef>(null);
  useKeyboardSheet(bottomSheetRef);

  const { recenterToUser } = useRecenterToUser();
  const hasCentered = useMapInitStore((s) => s.hasCentered);
  const setHasCentered = useMapInitStore((s) => s.setHasCentered);
  useEffect(() => {
    if (hasCentered) return;
    setHasCentered();
    recenterToUser();
  }, [hasCentered, recenterToUser]);

  const jeepGeoJson = useJeepneys();
  const jeeps = jeepGeoJson.features.map((f) => ({
    id: String(f.id),
    plate: f.properties?.plate || "",
    route_id: f.properties?.route_id || "",
    status: f.properties?.status || "",
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
  }));

  const { data: stops = [] } = useStopPoints();

  const [search, setSearch] = useState("");
  const searchLower = search.toLowerCase();

  const filteredJeeps = jeeps.filter(
    (j) =>
      j.plate.toLowerCase().includes(searchLower) ||
      j.route_id.toLowerCase().includes(searchLower) ||
      j.status.toLowerCase().includes(searchLower),
  );

  const filteredStops = stops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchLower) || s.address.toLowerCase().includes(searchLower),
  );

  const { currentLocation } = useLocationCurrent();
  const userLat = currentLocation?.latitude;
  const userLng = currentLocation?.longitude;

  const RADIUS_KM = 1.5;
  const nearbyJeeps =
    userLat && userLng
      ? filteredJeeps
          .filter((j) => distanceKm(userLat, userLng, j.lat, j.lng) <= RADIUS_KM)
          .slice(0, 10)
      : filteredJeeps.slice(0, 5);

  const nearbyStops =
    userLat && userLng
      ? filteredStops
          .filter((s) => distanceKm(userLat, userLng, s.lat, s.long) <= RADIUS_KM)
          .slice(0, 10)
      : filteredStops.slice(0, 5);

  return (
    <View className="absolute inset-0">
      <BottomSheetContainer ref={bottomSheetRef}>
        <View className="gap-4">
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
                    userLat && userLng ? distanceKm(userLat, userLng, s.lat, s.long) : null;
                  return (
                    <StopCard
                      key={s.id}
                      location={s.name}
                      address={s.address}
                      distanceKm={dist}
                      onPress={() =>
                        router.push({
                          pathname: "/(map)/stop/[id]",
                          params: {
                            id: s.id,
                            name: s.name,
                            address: s.address,
                            route_id: s.routeId,
                            lat: String(s.lat),
                            lng: String(s.long),
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

      <FilterModal ref={filterModalRef} />
    </View>
  );
};

export default HomeScreen;
