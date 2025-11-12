import { useColorScheme } from "nativewind";
import Mapbox, { MapView, Camera, LocationPuck } from "@rnmapbox/maps";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { MapboxMapRef } from "@/types";

type MapboxMapProps = {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
};

const MapboxMap = forwardRef<MapboxMapRef, MapboxMapProps>(
  ({ center = [120.548662, 18.059751], zoom = 13, children }, ref) => {
    // Theme color changing
    const { colorScheme } = useColorScheme();
    const mapStyle =
      colorScheme === "dark" ? Mapbox.StyleURL.TrafficNight : Mapbox.StyleURL.TrafficDay;

    // Camera center reference
    const cameraRef = useRef<Camera>(null);
    useImperativeHandle(ref, () => ({
      recenter: (coords) => {
        cameraRef.current?.setCamera({
          centerCoordinate: coords,
          zoomLevel: 17,
          animationDuration: 600,
        });
      },
    }));

    useEffect(() => {
      Mapbox.locationManager.start();

      const interval = setInterval(async () => {
        const loc = await Mapbox.locationManager.getLastKnownLocation();
        if (loc) console.log("📍 Interval Loc:", loc.coords.latitude);
      }, 5000);

      return () => {
        clearInterval(interval);
        Mapbox.locationManager.stop();
      };
    }, []);

    return (
      <MapView style={{ flex: 1 }} styleURL={mapStyle} projection="globe">
        {/* Map camera */}
        <Camera ref={cameraRef} pitch={50} zoomLevel={zoom} centerCoordinate={center} />

        {/* Shows user blue dot */}
        <LocationPuck pulsing={"default"} visible puckBearingEnabled puckBearing="heading" />

        {children}
      </MapView>
    );
  },
);

export default MapboxMap;
