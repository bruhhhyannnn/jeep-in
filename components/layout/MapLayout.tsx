import { View } from "react-native";
import { MapboxMap } from "@/components/map";
import { ButtonIcon, ThemedText } from "@/components/ui";
import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecenterToUser } from "@/hooks";
import { router } from "expo-router";
import { ROUTES } from "@/constants";
import { ReactNode } from "react";

const MapLayout = ({ children }: { children: ReactNode }) => {
  // Condition path screens to hide map contents
  const pathname = usePathname();
  const isHome = pathname === "/home";

  // Gets device top safe area for spacing floating buttons
  const { top } = useSafeAreaInsets();

  // Camera control
  const { recenterToUser } = useRecenterToUser();

  return (
    <View className="flex-1">
      {/* Map */}
      <MapboxMap />

      {/* Map Contents */}
      {isHome ? (
        <View className="absolute inset-0" style={{ top: top + 28 }}>
          {/* Legend info */}
          <View className="absolute left-5 gap-3 opacity-60">
            <View className="gap-4">
              {/* Jeepney */}
              <View className="flex-row items-center gap-3">
                <View className="relative">
                  {/* Outer circle */}
                  <View className="absolute inset-[-5px] rounded-full bg-[rgba(10,113,235,0.4)]" />
                  {/* Inner circle */}
                  <View className="h-4 w-4 rounded-full border-2 border-white bg-[#1e90ff]" />
                </View>
                <ThemedText variant="h100">Jeepneys</ThemedText>
              </View>

              {/* Stop Point */}
              <View className="flex-row items-center gap-3">
                <View className="relative">
                  {/* Outer circle */}
                  <View className="absolute inset-[-5px] rounded-full bg-[rgba(16,185,129,0.4)]" />
                  {/* Inner circle */}
                  <View className="h-4 w-4 rounded-full border-2 border-white bg-[#10b981]" />
                </View>
                <ThemedText variant="h100">Pickup points</ThemedText>
              </View>
            </View>

            {/* Route polylines */}
            <View className="gap-1.5">
              {/* Going laoag */}
              <View className="flex-row items-center gap-3">
                <View className="flex-row gap-1">
                  <View className="h-1.5 w-2 rounded-full bg-[#10b981]" />
                  <View className="h-1.5 w-4 rounded-full bg-[#10b981]" />
                  <View className="h-1.5 w-2 rounded-full bg-[#10b981]" />
                </View>
                <ThemedText variant="h100">Going laoag</ThemedText>
              </View>

              {/* Going paoay */}
              <View className="flex-row items-center gap-3">
                <View className="flex-row gap-1">
                  <View className="h-1.5 w-2 rounded-full bg-[#f59e0b]" />
                  <View className="h-1.5 w-4 rounded-full bg-[#f59e0b]" />
                  <View className="h-1.5 w-2 rounded-full bg-[#f59e0b]" />
                </View>
                <ThemedText variant="h100">Going laoag</ThemedText>
              </View>
            </View>
          </View>

          {/* Floating action buttons */}
          <View className="absolute right-6 gap-4">
            <ButtonIcon
              iconName="settings-outline"
              onPress={() => router.push(ROUTES.settings.home)}
            />
            {/* TODO: removed for now */}
            {/* <ButtonIcon iconName="filter-outline" onPress={() => filterModalRef.current?.open?.()} /> */}
            <ButtonIcon iconName="navigate-circle-outline" onPress={recenterToUser} />
          </View>
        </View>
      ) : null}

      {/* Slot screens */}
      {children}
    </View>
  );
};

export default MapLayout;
