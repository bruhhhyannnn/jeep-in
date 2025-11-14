import { Stack } from "expo-router";
import { MapProvider } from "@/context/map/MapContext";

export default function HomeLayout() {
  return (
    <MapProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      />
    </MapProvider>
  );
}
