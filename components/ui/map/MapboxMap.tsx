import { useColorScheme } from "nativewind";
import Mapbox, { MapView, Camera, Images } from "@rnmapbox/maps";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { MapboxMapRef } from "@/types";
import {
  JeepneysLayer,
  RoutePolylineLayer,
  StopPointsLayer,
  UserLocationLayer,
} from "@/components/ui/map/layers";
import { useMap } from "@/context/map/MapContext";

type MapboxMapProps = {
  center?: [number, number];
  zoom?: number;
};

const MapboxMap = forwardRef<MapboxMapRef, MapboxMapProps>(
  ({ center = [120.548662, 18.059751], zoom = 13 }, ref) => {
    const map = useMap();

    // Theme color changing Mapbox style
    const { colorScheme } = useColorScheme();
    const mapStyle =
      colorScheme === "dark" ? Mapbox.StyleURL.TrafficNight : Mapbox.StyleURL.TrafficDay;

    // Camera center reference
    const cameraRef = useRef<Camera>(null);

    // TODO: Console log location every 5 seconds, might be using this one instead of expo location someday
    // useEffect(() => {
    //   Mapbox.locationManager.start();

    //   const interval = setInterval(async () => {
    //     const loc = await Mapbox.locationManager.getLastKnownLocation();
    //     if (loc) console.log("📍 Interval Loc:", loc.coords.latitude);
    //   }, 5000);

    //   return () => {
    //     clearInterval(interval);
    //     Mapbox.locationManager.stop();
    //   };
    // }, []);

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

        {/* Render User Location Puck */}
        <UserLocationLayer />

        {/* Render Jeepneys */}
        <JeepneysLayer />

        {/* Render Stop Points */}
        <StopPointsLayer />

        {/* Render Route Polylines */}
        <RoutePolylineLayer />

        {/* Register all icons */}
        <Images
          images={{
            "stop-icon": require("@/assets/images/map/stop-pin.png"),
            "jeepney-icon": require("@/assets/images/map/jeepney-pin.png"),
          }}
        />
      </MapView>
    );
  },
);

export default MapboxMap;
