import { Slot } from "expo-router";
import { MapProvider } from "@/context";
import { View } from "react-native";
import { MapboxMap } from "@/components/map";

export default function MapLayout() {
  return (
    <MapProvider>
      <View style={{ flex: 1 }}>
        {/* Persistent map (never unmounts) */}
        <MapboxMap />

        {/* TODO: add here the legend info */}

        {/* Child screens overlay ABOVE the map */}
        <Slot />
      </View>
    </MapProvider>
  );
}
