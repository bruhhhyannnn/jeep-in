import { MapboxMap } from "@/components/ui";
import { Slot } from "expo-router";
import { View } from "react-native";

export default function HomeLayout() {
  return (
    <View style={{ flex: 1 }}>
      {/* Persistent map (never unmounts) */}
      <MapboxMap />

      {/* Child screens overlay ABOVE the map */}
      <Slot />
    </View>
  );
}
