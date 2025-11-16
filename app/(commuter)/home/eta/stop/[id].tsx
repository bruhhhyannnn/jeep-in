import { STRINGS } from "@/constants";
import { MapLayout } from "@/components/layout";
import { StopCard, UserCard } from "@/components/commuter";
import { Icon, ThemedText } from "@/components/ui";
import { useLocalSearchParams, router } from "expo-router";
import { View } from "react-native";
import { useRecenterToUser, useLocationCurrent } from "@/hooks";
import { useEffect, useState } from "react";
import { getDrivingDirections } from "@/services/mapbox/getDirections";
import { useMap } from "@/context/map/MapContext";

export default function EtaStopPointInfoScreen() {
  const map = useMap();
  const params = useLocalSearchParams();
  const { recenterToUser } = useRecenterToUser();
  const { currentLocation, loading, permissionGranted } = useLocationCurrent();

  const id = params.id as string;
  const name = params.name as string;
  const landmark_name = params.landmark_name as string;
  const address = params.address as string;
  const route_id = params.route_id as string;
  const lat = params.lat as string;
  const lng = params.lng as string;

  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // AUTO-REFRESH ETA/DISTANCE
  useEffect(() => {
    if (!currentLocation) return;

    const refreshInterval = setInterval(async () => {
      try {
        const start: [number, number] = [currentLocation.longitude, currentLocation.latitude];

        const end: [number, number] = [Number(lng), Number(lat)];

        const { duration, distance } = await getDrivingDirections(start, end);

        setEta(duration / 60);
        setDistance(distance / 1000);
      } catch (err) {
        console.error("Auto-refresh ETA error:", err);
      }
    }, 15000); // 15 seconds

    return () => clearInterval(refreshInterval);
  }, [currentLocation, lat, lng]);

  // INITIAL FETCH: GET ROUTE GEOMETRY + ETA + DISTANCE
  useEffect(() => {
    if (!currentLocation) return;

    const fetchRoute = async () => {
      try {
        const start: [number, number] = [currentLocation.longitude, currentLocation.latitude];

        const end: [number, number] = [Number(lng), Number(lat)];

        const { coordinates, duration, distance } = await getDrivingDirections(start, end);

        setRouteCoords(coordinates);
        setEta(duration / 60);
        setDistance(distance / 1000);
      } catch (err) {
        console.error("ETA route error:", err);
      }
    };

    fetchRoute();
  }, [currentLocation, lat, lng]);

  useEffect(() => {
    if (!map.current || routeCoords.length < 2) return;

    const { sw, ne } = getRouteBounds(routeCoords);
    map.current.fitBounds(sw, ne, 60);
  }, [routeCoords]);

  if (!permissionGranted) {
    return (
      <MapLayout title={STRINGS.commuter.etaStopPointScreen.title}>
        <View className="flex-1 items-center justify-center">
          <ThemedText>Location permission is required.</ThemedText>
        </View>
      </MapLayout>
    );
  }

  if (loading || !currentLocation) {
    return (
      <MapLayout title={STRINGS.commuter.etaStopPointScreen.title}>
        <View className="flex-1 items-center justify-center">
          <ThemedText>Getting your location…</ThemedText>
        </View>
      </MapLayout>
    );
  }

  return (
    <MapLayout title={STRINGS.commuter.etaStopPointScreen.title}>
      <View className="gap-3">
        <View className="flex-row items-center gap-2">
          <ThemedText variant="h600">Driving to this stop —</ThemedText>
          <ThemedText variant="h600" color="primary">
            {eta ? `${eta.toFixed(1)} mins` : "..."}
          </ThemedText>
        </View>

        <View className="gap-2">
          {/* USER CARD */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.etaStopPointScreen.from}
            </ThemedText>

            <UserCard onPress={recenterToUser} />
          </View>

          {/* INDICATOR ICON */}
          <View className="items-center">
            <Icon name="arrow-down-circle-outline" size={26} />
          </View>

          {/* STOP CARD */}
          <View className="flex-1 gap-1">
            <ThemedText variant="h300" className="uppercase">
              {STRINGS.commuter.etaStopPointScreen.to}
            </ThemedText>

            <StopCard
              location={landmark_name || name}
              address={address}
              onPress={() =>
                router.push({
                  // pathname: ROUTES.commuter.stop(id.toString()),
                  pathname: "/(commuter)/home/stop/[id]",
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
            />
          </View>
        </View>

        <ThemedText variant="h200" color="secondary" className="text-center">
          {STRINGS.commuter.etaStopPointScreen.footer}
        </ThemedText>
      </View>
    </MapLayout>
  );
}

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
