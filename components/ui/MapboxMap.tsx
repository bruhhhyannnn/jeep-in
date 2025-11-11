import React from "react";
import { View, StyleSheet } from "react-native";
import Mapbox, { MapView, Camera } from "@rnmapbox/maps";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY!);

type MapboxMapProps = {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode; // markers go here
  styleURL?: string;
};

export default function MapboxMap({
  center = [120.5936, 18.1984],
  zoom = 13,
  children,
  styleURL = Mapbox.StyleURL.Street,
}: MapboxMapProps) {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} styleURL={styleURL}>
        <Camera centerCoordinate={center} zoomLevel={zoom} />
        {children}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
