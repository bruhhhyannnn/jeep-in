import { View } from "react-native";
import Mapbox, { MapView, Camera } from "@rnmapbox/maps";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY!);

type MapboxMapProps = {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode; // markers will maybe go here?
  styleURL?: string;
};

export default function MapboxMap({
  center = [120.5936, 18.1984],
  zoom = 13,
  children,
  styleURL = Mapbox.StyleURL.Street,
}: MapboxMapProps) {
  return (
    <View className="flex-1">
      <MapView className="flex-1" styleURL={styleURL}>
        <Camera centerCoordinate={center} zoomLevel={zoom} />
        {children}
      </MapView>
    </View>
  );
}
