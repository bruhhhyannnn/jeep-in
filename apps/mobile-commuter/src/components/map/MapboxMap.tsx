import Mapbox, { MapView, Camera } from "@rnmapbox/maps";
import { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMap } from "@/store";
import { useTheme } from "@/theme";
import type { CameraPadding, LngLat } from "@/types";
import { CommuterMapLayers } from "@/components/map/layers";

const DEFAULT_CENTER: LngLat = [120.548662, 18.059751];

const toPaddingArray = (p: number | CameraPadding) =>
  typeof p === "number" ? p : [p.top, p.right, p.bottom, p.left];

const MapboxMap = () => {
  const mapRef = useMap();
  const { isDark } = useTheme();
  const { top } = useSafeAreaInsets();

  const cameraRef = useRef<Camera>(null);
  const mapViewRef = useRef<MapView>(null);

  // Expose camera controls to screens through the map context.
  useEffect(() => {
    mapRef.current = {
      ...mapRef.current,
      flyTo: (coords, { duration = 1200, zoom = 16, bottomInset = 0 } = {}) => {
        cameraRef.current?.setCamera({
          centerCoordinate: coords,
          zoomLevel: zoom,
          animationDuration: duration,
          animationMode: "flyTo",
          padding: { paddingTop: 0, paddingRight: 0, paddingBottom: bottomInset, paddingLeft: 0 },
        });
      },

      fitBounds: (sw, ne, padding = 48) => {
        cameraRef.current?.fitBounds(ne, sw, toPaddingArray(padding), 700);
      },

      zoomInAt: async (coords, zoomIncrement = 1.5) => {
        const currentZoom = await mapViewRef.current?.getZoom();
        cameraRef.current?.setCamera({
          centerCoordinate: coords,
          zoomLevel: (currentZoom ?? 13) + zoomIncrement,
          animationDuration: 300,
        });
      },
    };
  }, [mapRef]);

  return (
    <MapView
      ref={mapViewRef}
      style={{ flex: 1 }}
      styleURL={isDark ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Light}
      pitchEnabled={false}
      compassEnabled={false}
      scaleBarEnabled={false}
      // Keep the Mapbox logo and attribution clear of the bottom sheets.
      logoPosition={{ top: top + 80, left: 16 }}
      attributionPosition={{ top: top + 80, left: 100 }}
    >
      <Camera
        ref={cameraRef}
        defaultSettings={{ centerCoordinate: DEFAULT_CENTER, zoomLevel: 13 }}
      />

      <CommuterMapLayers />
    </MapView>
  );
};

export default MapboxMap;
