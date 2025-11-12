import { PointAnnotation } from "@rnmapbox/maps";
import { View } from "react-native";

export default function JeepneyMarker({ id, coords }: { id: string; coords: [number, number] }) {
  return (
    <PointAnnotation id={id} coordinate={coords}>
      <View className="h-4 w-4 rounded-full border-2 border-white bg-blue-600" />
    </PointAnnotation>
  );
}
