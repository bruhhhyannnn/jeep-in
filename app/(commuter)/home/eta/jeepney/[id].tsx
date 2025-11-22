import { STRINGS } from "@/constants";
import { ContentLayout } from "@/components/layout";
import { JeepCard, UserCard } from "@/components/card";
import { Icon, ThemedText } from "@/components/ui";
import { useLocalSearchParams, router } from "expo-router";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { getDrivingDirections } from "@/services/mapbox/getDirections";
import { useLocationCurrent } from "@/hooks";
import { useMap } from "@/context/map/MapContext";
import { JeepneyStatus } from "@/types";

export default function EtaJeepneyInfoScreen() {
  const map = useMap();
  const params = useLocalSearchParams();
  const { currentLocation, loading, permissionGranted } = useLocationCurrent();

  // Jeep params (must be passed from JeepneyInfoScreen)
  const jeepId = params.id as string;
  const plate = params.plate as string;
  const status = params.status as JeepneyStatus;
  const routeId = params.route_id as string;

  const jeepLat = Number(params.jeep_lat);
  const jeepLng = Number(params.jeep_lng);

  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [eta, setEta] = useState<number | null>(null);

  // 📍 INITIAL FETCH OF ROUTE + ETA
  useEffect(() => {
    if (!currentLocation || !jeepLat || !jeepLng) return;

    const fetchRoute = async () => {
      try {
        const start: [number, number] = [currentLocation.longitude, currentLocation.latitude];

        const end: [number, number] = [jeepLng, jeepLat];

        const { coordinates, duration } = await getDrivingDirections(start, end);

        setRouteCoords(coordinates);
        setEta(duration / 60);
      } catch (err) {
        console.error("ETA Jeepney fetch error:", err);
      }
    };

    fetchRoute();
  }, [currentLocation, jeepLat, jeepLng]);

  // 🔁 AUTO-REFRESH ETA
  useEffect(() => {
    if (!currentLocation || !jeepLat || !jeepLng) return;

    const interval = setInterval(async () => {
      try {
        const start: [number, number] = [currentLocation.longitude, currentLocation.latitude];
        const end: [number, number] = [jeepLng, jeepLat];

        const { duration } = await getDrivingDirections(start, end);

        setEta(duration / 60);
      } catch (err) {
        console.error("Auto-refresh Jeep ETA:", err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [currentLocation, jeepLat, jeepLng]);

  // 🎯 AUTO-FIT CAMERA (User ↔ Jeepney)
  useEffect(() => {
    if (!map.current || routeCoords.length < 2) return;

    const { sw, ne } = getRouteBounds(routeCoords);
    map.current.fitBounds(sw, ne, 60);
  }, [routeCoords]);

  if (!permissionGranted) {
    return (
      <ContentLayout title={STRINGS.commuter.etaJeepneyScreen.title}>
        <View className="flex-1 items-center justify-center">
          <ThemedText>Location permission is required.</ThemedText>
        </View>
      </ContentLayout>
    );
  }

  if (loading || !currentLocation) {
    return (
      <ContentLayout title={STRINGS.commuter.etaJeepneyScreen.title}>
        <View className="flex-1 items-center justify-center">
          <ThemedText>Getting your location…</ThemedText>
        </View>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={STRINGS.commuter.etaJeepneyScreen.title}>
      <View className="gap-3">
        {/* HEADER */}
        <View className="flex-row items-center gap-2">
          <ThemedText variant="h600">Jeepney arriving in —</ThemedText>
          <ThemedText variant="h600" color="default_blue">
            {eta ? `${eta.toFixed(1)} mins` : "..."}
          </ThemedText>
        </View>

        {/* USER → JEEPNEY */}
        <View className="gap-3">
          <View>
            <ThemedText variant="h300" className="uppercase">
              From
            </ThemedText>
            <UserCard />
          </View>

          <View className="items-center">
            <Icon name="arrow-down-circle-outline" size={26} />
          </View>

          <View>
            <ThemedText variant="h300" className="uppercase">
              Jeepney Location
            </ThemedText>

            <JeepCard
              plateNo={plate}
              status={status}
              onPress={() =>
                router.push({
                  pathname: "/(commuter)/home/jeepney/[id]",
                  params: {
                    id: jeepId,
                    plate,
                    route_id: routeId,
                    status,
                    lat: String(jeepLat),
                    lng: String(jeepLng),
                  },
                })
              }
            />
          </View>
        </View>

        <ThemedText variant="h200" color="text_muted" className="text-center">
          {STRINGS.commuter.etaJeepneyScreen.footer}
        </ThemedText>
      </View>
    </ContentLayout>
  );
}

// 📍 Utility for map fitBounds
function getRouteBounds(coords: [number, number][]) {
  let minX = coords[0][0];
  let minY = coords[0][1];
  let maxX = coords[0][0];
  let maxY = coords[0][1];

  coords.forEach(([lng, lat]) => {
    minX = Math.min(minX, lng);
    minY = Math.min(minY, lat);
    maxX = Math.max(maxX, lng);
    maxY = Math.max(maxY, lat);
  });

  return {
    sw: [minX, minY] as [number, number],
    ne: [maxX, maxY] as [number, number],
  };
}
