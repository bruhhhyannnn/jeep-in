import { View } from "react-native";
import { MapboxMap } from "@/components/map";
import { ButtonIcon } from "@/components/ui";
import { router } from "expo-router";
import { ROUTES } from "@/constants";
import { useRecenterToUser } from "@/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  // Gets device top safe area for spacing floating buttons
  const { top } = useSafeAreaInsets();

  // Camera control
  const { recenterToUser } = useRecenterToUser();

  return (
    <View className="flex-1">
      {/* Map contents */}
      <MapboxMap />

      {/* Floating action buttons */}
      <View className="absolute right-6 gap-4" style={{ top: top + 28 }}>
        <ButtonIcon iconName="settings-outline" onPress={() => router.push(ROUTES.settings.home)} />
        {/* TODO: removed for now */}
        {/* <ButtonIcon iconName="filter-outline" onPress={() => filterModalRef.current?.open?.()} /> */}
        <ButtonIcon iconName="navigate-circle-outline" onPress={recenterToUser} />
      </View>

      {children}
    </View>
  );
}
