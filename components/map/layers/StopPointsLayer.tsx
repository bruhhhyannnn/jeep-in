import { ShapeSource, CircleLayer, SymbolLayer } from "@rnmapbox/maps";
import { router } from "expo-router";
import type { FeatureCollection, Point } from "geojson";
import { useStops } from "@/hooks/useStops";
import { useMap } from "@/context/map/MapContext";

export default function StopPointsLayer() {
  const map = useMap();

  const geoJson = useStops();
  if (!geoJson) return null;

  const featureCollection = geoJson as FeatureCollection<Point>;

  return (
    <ShapeSource
      id="stopPoints"
      shape={featureCollection}
      cluster
      clusterRadius={40}
      onPress={(event) => {
        const feature = event.features[0] as any;
        if (!feature) return;

        const props = feature.properties;

        // If cluster → zoom in, don't open stop screen
        if (props.cluster) {
          const coords = feature.geometry.coordinates;
          map.current.zoomInAt?.(coords, 1.5);
          return;
        }

        const [lng, lat] = feature.geometry.coordinates;

        router.push({
          pathname: "/(map)/stop/[id]",
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
      {/* 0. Glow effect */}
      <CircleLayer
        id="stopCircleGlow"
        filter={["!", ["has", "point_count"]]}
        style={{
          circleRadius: 15, // bigger than inner circle
          circleColor: "rgba(16,185,129,0.4)", // soft emerald glow (20% opacity)
          circlePitchAlignment: "map",
        }}
      />

      {/* 1. Normal circles */}
      <CircleLayer
        id="stopCircle"
        filter={["!", ["has", "point_count"]]}
        style={{
          circleRadius: 7,
          circleColor: "#10b981",
          circleStrokeColor: "#d1fae5",
          circleStrokeWidth: 2,
          circlePitchAlignment: "map",
        }}
      />

      {/* 2. Cluster bubble (NEW) */}
      <CircleLayer
        id="stopClusterCircle"
        filter={["has", "point_count"]}
        style={{
          circleColor: "#047857",
          circleRadius: 8,
          circleStrokeWidth: 2,
          circleStrokeColor: "#ecfdf5",
        }}
      />

      {/* 3. Cluster text (NEW) */}
      <SymbolLayer
        id="stopClusterText"
        filter={["has", "point_count"]}
        style={{
          textField: ["format", "Stops +", ["get", "point_count"]],
          textSize: 11,
          textColor: "#ecfdf5",
          textHaloColor: "#064e3b",
          textHaloWidth: 2,
          textOffset: [0, 1.4],
          textAllowOverlap: true,
        }}
      />

      {/* 4. Landmark Name Label */}
      <SymbolLayer
        id="stopLabel"
        filter={["!", ["has", "point_count"]]}
        style={{
          textField: ["get", "landmark_name"],
          textSize: 11,
          textColor: "#ecfdf5",
          textHaloColor: "#022c22",
          textHaloWidth: 2,
          textOffset: [0, 1.8],
          textAllowOverlap: false,
        }}
      />
    </ShapeSource>
  );
}
