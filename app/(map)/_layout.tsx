import { Outlet } from "react-router";
import { MapProvider } from "@/store";
import { MapboxMap } from "@/components/map";
import { useFleetSubscription } from "@/hooks";
import { View } from "@/components/ui";

/** One map stays mounted under every commuter screen; screens draw on top of it. */
export default function MapGroupLayout() {
  useFleetSubscription();

  return (
    <MapProvider>
      <View className="flex-1 overflow-hidden bg-page">
        <MapboxMap />
        <View className="absolute inset-0" pointerEvents="box-none">
          <Outlet />
        </View>
      </View>
    </MapProvider>
  );
}
