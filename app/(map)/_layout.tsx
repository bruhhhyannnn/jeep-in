import { Slot } from "expo-router";
import { MapProvider } from "@/store";
import { MapLayout } from "@/components/layout";

export default function MapViewLayout() {
  return (
    <MapProvider>
      <MapLayout>
        <Slot />
      </MapLayout>
    </MapProvider>
  );
}
