import { STRINGS } from "@/constants";
import { ContentLayout } from "@/components/layout";
import { StopTitleBadge } from "@/components/badge";
import { ButtonText, Icon, ThemedText, ThemedView } from "@/components/ui";
import { useLocalSearchParams, router } from "expo-router";
import { View } from "react-native";
import { useMap } from "@/context/map/MapContext";
import { useEffect } from "react";

export default function StopPointInfoScreen() {
  const params = useLocalSearchParams();

  const id = params.id as string;
  const name = (params.name as string) ?? id;
  const landmark_name = params.landmark_name as string;
  const address = params.address as string;
  const route_id = (params.route_id as string) ?? "";
  const lat = params.lat as string | undefined;
  const lng = params.lng as string | undefined;

  // Center camera on stop
  const map = useMap();
  useEffect(() => {
    if (!map.current || !lat || !lng) return;
    map.current.flyTo([Number(lng), Number(lat)], 1000);
  }, [lat, lng]);

  return (
    <ContentLayout title={STRINGS.commuter.stopPointScreen.title}>
      <View className="gap-3">
        {/* Header Info */}
        <View>
          <View className="flex-row gap-2">
            <Icon family="MaterialCommunityIcons" name="bus-stop" size={28} />
            <ThemedText variant="h600" className="flex-1">
              {name}
            </ThemedText>
          </View>
          <View className="flex-row items-start gap-2">
            {landmark_name && <StopTitleBadge title={landmark_name} />}
            {route_id && (
              <ThemedText color="text_muted" numberOfLines={1}>
                {route_id}
              </ThemedText>
            )}
          </View>
        </View>

        <View className="flex-1 gap-1">
          <ThemedText variant="h300" className="uppercase">
            {STRINGS.commuter.stopPointScreen.address}
          </ThemedText>

          <ThemedView variant="bg" className="flex-row gap-2 rounded-full px-6 py-4">
            <Icon name="location-outline" />
            <ThemedText variant="h400" className="flex-1">
              {address}
            </ThemedText>
          </ThemedView>
        </View>

        {/* Get Directions Button */}
        <View className="self-center">
          <ButtonText
            label={STRINGS.commuter.stopPointScreen.getDirections}
            onPress={() =>
              router.push({
                pathname: "/(map)/eta-stop/[id]",
                params: {
                  id,
                  name,
                  landmark_name,
                  address,
                  route_id,
                  lat,
                  lng,
                },
              })
            }
            iconName="timer-outline"
          />
        </View>
      </View>
    </ContentLayout>
  );
}
