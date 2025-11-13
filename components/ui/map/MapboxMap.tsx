import { useColorScheme } from "nativewind";
import Mapbox, { MapView, Camera, Images } from "@rnmapbox/maps";
import { useEffect, useRef } from "react";
import { useMap } from "@/context/map/MapContext";
import {
  JeepneysLayer,
  RoutePolylineLayer,
  StopPointsLayer,
  UserLocationLayer,
} from "@/components/ui/map/layers";

type MapboxMapProps = {
  center?: [number, number];
  zoom?: number;
};

const MapboxMap = ({ center = [120.548662, 18.059751], zoom = 13 }: MapboxMapProps) => {
  const map = useMap();

  // Theme color changing Mapbox style
  const { colorScheme } = useColorScheme();
  const mapStyle =
    colorScheme === "dark" ? Mapbox.StyleURL.TrafficNight : Mapbox.StyleURL.TrafficDay;

  // Camera center reference
  const cameraRef = useRef<Camera>(null);



  // store the ref globally
  useEffect(() => {
    map.current = {
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
    };
  }, []);

  return (
    <MapView style={{ flex: 1 }} styleURL={mapStyle} projection="globe">
      {/* Map camera */}
      <Camera ref={cameraRef} pitch={50} zoomLevel={zoom} centerCoordinate={center} />

      {/* Render Route Polylines */}
      <RoutePolylineLayer />

      {/* Render User Location Puck */}
      <UserLocationLayer />

      {/* Render Stop Points */}
      <StopPointsLayer />

      {/* Render Jeepneys */}
      <JeepneysLayer />

      {/* Register all icons */}
      <Images
        images={{
          "stop-icon": require("@/assets/images/map/stop-pin.png"),
          "jeepney-icon": require("@/assets/images/map/jeepney-pin.png"),
        }}
      />
    </MapView>
  );
};

export default MapboxMap;
