import { ShapeSource, CircleLayer, SymbolLayer } from "@rnmapbox/maps";
import { router } from "expo-router";
import type { FeatureCollection, Point } from "geojson";
import { useStops } from "@/hooks/useStops";

export default function StopPointsLayer() {
  const geoJson = useStops();
  if (!geoJson) return null;

  const featureCollection = geoJson as FeatureCollection<Point>;

  return (
    <ShapeSource
      id="stopPoints"
      shape={featureCollection}
      onPress={(event) => {
        const feature = event.features[0] as any;
        if (!feature) return;

        const props = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        // Navigate to stop screen
        router.push({
          pathname: "/(commuter)/home/stop/[id]",
          params: {
            id: String(feature.id ?? ""),
            name: String(props.name ?? ""),
            landmark_name: String(props.landmark_name ?? ""),
            address: String(props.address ?? ""),
            route_id: String(props.route_id ?? ""),
            lat: String(lat),
            lng: String(lng),
          },
        });
      }}
    >
      {/* STOP POINT CIRCLE */}
      <CircleLayer
        id="stopCircle"
        style={{
          circleRadius: 5.5,
          circleColor: "#10b981",
          circleOpacity: 0.95,
          circleStrokeColor: "#064e3b",
          circleStrokeWidth: 2,

          circlePitchAlignment: "map",
        }}
      />

      {/* STOP LABEL */}
      <SymbolLayer
        id="stopLabel"
        style={{
          textField: ["get", "landmark_name"],
          textSize: 10,
          textColor: "#ecfdf5",
          textHaloColor: "#022c22",
          textHaloWidth: 2,

          textOffset: [0, 1.2],
          textAllowOverlap: true,
        }}
      />
    </ShapeSource>
  );
}
