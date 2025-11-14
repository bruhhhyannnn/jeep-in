import { ROUTES, STRINGS } from "@/constants";
import { MapLayout } from "@/components/layout";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText, ButtonText } from "@/components/ui";
import { JeepStatusBadge, StopCard } from "@/components/commuter";
import { useMap } from "@/context/map/MapContext";
import { useEffect } from "react";
import { JeepneyStatus } from "@/types";

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

  return (
    <MapLayout title={STRINGS.commuter.jeepneyScreen.title}>
      <View className="gap-5">
        {/* Header */}
        <View>
          <View className="flex-row items-center gap-2">
            <ThemedText variant="h600">{plate}</ThemedText>
            <JeepStatusBadge status={status} />
          </View>
          <ThemedText color="secondary">{route_id}</ThemedText>
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
            onPress={() => router.push(ROUTES.commuter.etaJeepney(id))}
          />
        </View>
      </View>
    </MapLayout>
  );
}
