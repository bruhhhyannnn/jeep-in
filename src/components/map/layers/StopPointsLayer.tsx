import { ShapeSource, CircleLayer, SymbolLayer } from "@rnmapbox/maps";
import { router } from "expo-router";
import type { FeatureCollection, Point } from "geojson";
import { useStopPoints } from "@/hooks";
import { useMap } from "@/store";

export default function StopPointsLayer() {
  const map = useMap();
  const { data: stops = [] } = useStopPoints();

  const featureCollection: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: stops.map((s) => ({
      type: "Feature",
      id: s.id,
      properties: {
        name: s.name,
        address: s.address,
        route_id: s.routeId,
      },
      geometry: {
        type: "Point",
        coordinates: [s.long, s.lat],
      },
    })),
  };

  if (!featureCollection.features.length) return null;

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
          circleRadius: 15,
          circleColor: "rgba(16,185,129,0.4)",
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

      {/* 2. Cluster bubble */}
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

      {/* 3. Cluster text */}
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

      {/* 4. Stop Name Label */}
      <SymbolLayer
        id="stopLabel"
        filter={["!", ["has", "point_count"]]}
        style={{
          textField: ["get", "name"],
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
