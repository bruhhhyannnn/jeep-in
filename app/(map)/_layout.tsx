import { View } from "react-native";
import { Slot } from "expo-router";
import { MapProvider } from "@/store";
import { MapboxMap } from "@/components/map";
import { useFleetSubscription } from "@/hooks";

/** One map stays mounted under every commuter screen; screens draw on top of it. */
export default function MapGroupLayout() {
  useFleetSubscription();

  return (
    <MapProvider>
      <View className="flex-1 bg-page">
        <MapboxMap />
        <View className="absolute inset-0" pointerEvents="box-none">
          <Slot />
        </View>
      </View>
    </MapProvider>
  );
}
