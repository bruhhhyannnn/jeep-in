import { ROUTES, STRINGS } from "@/constants";
import { ContentLayout } from "@/components/layout";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText, ButtonText, Icon } from "@/components/ui";
import { StopCard } from "@/components/card";
import { JeepStatusBadge } from "@/components/badge";
import { useMap } from "@/store";
import { useEffect } from "react";
import { JeepneyStatus } from "@/types";
import { useDriverLocation } from "@/hooks";

export default function JeepneyInfoScreen() {
  const params = useLocalSearchParams();

  const id = params.id as string;
  const plate = params.plate as string;
  const route_id = params.route_id as string;
  const status = params.status as JeepneyStatus;
  const last_stop = params.last_stop as string;
  const next_stop = params.next_stop as string;
  const lat = params.lat ? Number(params.lat) : undefined;
  const lng = params.lng ? Number(params.lng) : undefined;

  // Center map on jeepney
  const map = useMap();
  useEffect(() => {
    if (!map.current || !lat || !lng) return;
    map.current.flyTo([lng, lat], 1000);
  }, [lat, lng]);

  // Follow user functionality
  const driver = useDriverLocation(id);
  useEffect(() => {
    if (!driver) return;

    map.current?.flyTo([driver.long, driver.lat], 800);
  }, [driver]);

  return (
    <ContentLayout title={STRINGS.commuter.jeepneyScreen.title}>
      <View className="gap-5">
        {/* Header */}
        <View>
          <View className="flex-row items-center gap-2">
            <Icon family="MaterialCommunityIcons" name="bus" size={28} />
            <ThemedText variant="h600">{plate}</ThemedText>
            <JeepStatusBadge variant={status} />
          </View>
          {/* TODO: add actual route name here and route_direction */}
          {/* <ThemedText color="text_muted">{route_id}</ThemedText> */}
        </View>

        {/* Last Stop */}
        {last_stop && (
          <View>
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.jeepneyScreen.lastStop}
            </ThemedText>

            <StopCard
              location={last_stop}
              address="MMSU"
              onPress={() => router.push(ROUTES.commuter.stop(last_stop))}
            />
          </View>
        )}

        {/* Next Stop */}
        {next_stop && (
          <View>
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.jeepneyScreen.nextStop}
            </ThemedText>
            <StopCard
              location={next_stop}
              address="MMSU"
              onPress={() => router.push(ROUTES.commuter.stop(next_stop))}
            />
          </View>
        )}

        {/* ETA Button */}
        <View className="self-center">
          <ButtonText
            label={STRINGS.commuter.jeepneyScreen.getEta}
            iconName="timer-outline"
            onPress={() =>
              router.push({
                pathname: "/(map)/eta-jeepney/[id]",
                params: {
                  id,
                  plate,
                  status,
                  route_id,
                  jeep_lat: String(lat),
                  jeep_lng: String(lng),
                },
              })
            }
          />
        </View>
      </View>
    </ContentLayout>
  );
}
