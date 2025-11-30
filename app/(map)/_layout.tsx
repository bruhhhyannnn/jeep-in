import { Slot } from "expo-router";
import { MapProvider } from "@/context";
import { View } from "react-native";
import { MapboxMap } from "@/components/map";
import { ThemedText } from "@/components/ui";
import { usePathname } from "expo-router";

export default function MapLayout() {
  const pathname = usePathname();
  const isHome = pathname === "/(commuter)/home" || "/(driver)/home";

  return (
    <MapProvider>
      <View style={{ flex: 1 }}>
        {/* Persistent map (never unmounts) */}
        <MapboxMap />

        {isHome ? (
          // Legend info
          <View className="absolute left-5 top-16 opacity-50">
            <View className="flex gap-4">
              {/* Jeepney */}

              {/* Stop Point */}
              <View className="flex-row items-center gap-3">
                <View className="relative">
                  {/* Outer circle */}
                  <View className="absolute inset-[-5px] rounded-full bg-[rgba(16,185,129,0.4)]" />
                  {/* Inner circle */}
                  <View className="h-4 w-4 rounded-full border-2 border-white bg-[#10b981]" />
                </View>
                <ThemedText>Pickup points</ThemedText>
              </View>

              {/* Route polylines */}
            </View>
          </View>
        ) : // Action buttons
        null}

        {/* Child screens overlay ABOVE the map */}
        <Slot />
      </View>
    </MapProvider>
  );
}
