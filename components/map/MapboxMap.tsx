import { useColorScheme } from "nativewind";
import Mapbox, { MapView, Camera } from "@rnmapbox/maps";
import { useEffect, useRef } from "react";
import { useMap } from "@/context/map/MapContext";
import {
  JeepneysLayer,
  RoutePolylineLayer,
  StopPointsLayer,
  UserLocationLayer,
} from "@/components/map/layers";

const MapboxMap = () => {
  const map = useMap();

  // Theme color changing Mapbox style
  const { colorScheme } = useColorScheme();
  const mapStyle =
    colorScheme === "dark" ? Mapbox.StyleURL.TrafficNight : Mapbox.StyleURL.TrafficDay;

  // Camera center reference
  const cameraRef = useRef<Camera>(null);
  const mapViewRef = useRef<MapView>(null);

  // store the ref globally
  useEffect(() => {
    map.current = {
      ...map.current,
      flyTo: (coords, duration = 1500) => {
        cameraRef.current?.setCamera({
          centerCoordinate: coords,
          animationDuration: duration,
          animationMode: "flyTo",
          zoomLevel: 17.5,
        });
      },

      fitBounds: (sw, ne, padding = 40) => {
        cameraRef.current?.fitBounds(sw, ne, padding, 500);
      },

      zoomInAt: async (coords, zoomIncrement = 1.5) => {
        const currentZoom = await mapViewRef.current?.getZoom();
        console.log(currentZoom);
        const nextZoom = (currentZoom ?? 13) + zoomIncrement;

        cameraRef.current?.setCamera({
          centerCoordinate: coords,
          zoomLevel: nextZoom,
          animationDuration: 300,
        });
      },
    };
  }, []);

  return (
    <MapView style={{ flex: 1 }} styleURL={mapStyle} projection="globe" ref={mapViewRef}>
      {/* Map camera */}
      <Camera
        ref={cameraRef}
        pitch={50}
        zoomLevel={13}
        centerCoordinate={[120.548662, 18.059751]}
      />

      {/* Render Route Polylines */}
      <RoutePolylineLayer />

      {/* Render User Location Puck */}
      <UserLocationLayer />

      {/* Render Stop Points */}
      <StopPointsLayer />

      {/* Render Jeepneys */}
      <JeepneysLayer />

      {/* Register all icons */}
      {/* <Images
        images={{
          "stop-icon": require("@/assets/images/map/stop-pin.png"),
          "jeepney-icon": require("@/assets/images/map/jeepney-pin.png"),
        }}
      /> */}
    </MapView>
  );
};

export default MapboxMap;
