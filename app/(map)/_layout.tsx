import { Slot } from "expo-router";
import { MapLayout } from "@/components/layout";
import { MapProvider } from "@/context";

export default function MapViewLayout() {
  return (
    <MapProvider>
      <MapLayout>
        <Slot />
      </MapLayout>
    </MapProvider>
  );
}
