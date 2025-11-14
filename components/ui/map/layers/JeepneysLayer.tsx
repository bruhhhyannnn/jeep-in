import { ShapeSource, CircleLayer, SymbolLayer } from "@rnmapbox/maps";
import { router } from "expo-router";
import { useJeepneys } from "@/hooks/useJeepneys";
import type { Feature, FeatureCollection, Point } from "geojson";

export default function JeepneysLayer() {
  const geoJson = useJeepneys();

  if (!geoJson) return null;

  const featureCollection = geoJson as FeatureCollection<Point>;

  return (
    <ShapeSource
      id="jeepneys"
      shape={featureCollection}
      onPress={(event) => {
        const feature = event.features[0] as Feature<Point>;
        if (!feature) return;

        const props = (feature.properties || {}) as any;
        const [lng, lat] = feature.geometry.coordinates as [number, number];

        // Navigate to jeepney screen
        router.push({
          // TODO: replace this one someday
          pathname: "/(commuter)/home/jeepney/[id]",
          params: {
            id: String(feature.id ?? ""),
            plate: String(props.plate ?? ""),
            route_id: String(props.route_id ?? ""),
            status: String(props.status ?? ""),
            lat: String(lat),
            lng: String(lng),
          },
        });
      }}
    >
      {/* Circular jeepney marker */}
      <CircleLayer
        id="jeepneyCircle"
        style={{
          circleRadius: 7,
          circleColor: "#0a71eb",
          circleOpacity: 0.95,
          circleStrokeColor: "#edf9ff",
          circleStrokeWidth: 2,
          circlePitchAlignment: "map",
        }}
      />

      {/* Plate label above marker */}
      <SymbolLayer
        id="jeepneyLabel"
        style={{
          textField: ["get", "plate"],
          textSize: 11,
          textColor: "#edf9ff",
          textHaloColor: "#0a71eb",
          textHaloWidth: 4,
          textOffset: [0, -1.7], // slightly above circle
          textAllowOverlap: true,
        }}
      />
    </ShapeSource>
  );
}
