import { View } from "react-native";
import { MapboxMap } from "@/components/map";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1">
      {/* Map contents */}
      <MapboxMap />

      {children}
    </View>
  );
}
