import { ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import { router } from "expo-router";
import { useJeepneys } from "@/hooks/useJeepneys";
import { useMap } from "@/context/map/MapContext";

export default function JeepneysLayer() {
  const geoJson = useJeepneys();
  const map = useMap();

  if (!geoJson) return null;

  return (
    <ShapeSource
      id="jeepneys"
      shape={geoJson}
      onPress={(event) => {
        const feature = event.features[0] as any;
        if (!feature) return;

        const props = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        // Move camera
        map.current?.flyTo([lng, lat], 1000);

        // Navigate to jeepney screen
        router.push({
          pathname: "/(commuter)/home/jeepney/[id]",
          params: {
            id: feature.id,
            plate: props.plate,
            route_id: props.route_id,
            status: props.status,
            lat: String(lat),
            lng: String(lng),
          },
        });
      }}
    >
      {/* Jeepney icon */}
      <SymbolLayer
        id="jeepneyIcon"
        style={{
          iconImage: "jeepney-icon",
          iconSize: 1,
          iconAllowOverlap: true,
          iconAnchor: "bottom",
        }}
      />

      {/* Plate Number Label */}
      <SymbolLayer
        id="jeepneyLabel"
        style={{
          textField: ["get", "plate"],
          textSize: 10,
          textColor: "#fff",
          textHaloColor: "#0a71eb",
          textHaloWidth: 4,
          textOffset: [0, -3.0],
        }}
      />
    </ShapeSource>
  );
}

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
