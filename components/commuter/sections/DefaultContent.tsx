import { STRINGS } from "@/constants";
import { View } from "react-native";
import { router } from "expo-router";
import { ThemedText, CustomTextInput } from "@/components/ui/";
import { JeepCard, StopCard } from "@/components/commuter/card";
import { useJeepneysList } from "@/hooks/useJeepneysList";
import { useStopsList } from "@/hooks/useStopsList";

export default function DefaultContent() {
  const jeeps = useJeepneysList();
  const stops = useStopsList();

  return (
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
  );
}
