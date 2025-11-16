import { ShapeSource, CircleLayer, SymbolLayer } from "@rnmapbox/maps";
import { router } from "expo-router";
import { useJeepneys } from "@/hooks/useJeepneys";
import type { Feature, FeatureCollection, Point } from "geojson";
import { useMap } from "@/context/map/MapContext";

export default function JeepneysLayer() {
  const geoJson = useJeepneys();
  const map = useMap();

  if (!geoJson) return null;

  const featureCollection = geoJson as FeatureCollection<Point>;

  return (
    <ShapeSource
      id="jeepneys"
      shape={featureCollection}
      cluster
      clusterRadius={45}
      onPress={(event) => {
        const feature = event.features[0] as Feature<Point> | undefined;
        if (!feature) return;

        const props: any = feature.properties;

        // If it's a cluster → zoom in instead of navigating
        if (props?.cluster) {
          const coords = feature.geometry.coordinates as [number, number];
          map.current.zoomInAt?.(coords, 1.5);
          return;
        }

        // --- INDIVIDUAL JEEPNEY TAPPED ---
        const [lng, lat] = feature.geometry.coordinates;

        router.push({
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
      {/* 1. Cluster Circle Bubble */}
      <CircleLayer
        id="jeepneyClusterCircle"
        filter={["has", "point_count"]}
        style={{
          circleColor: "#FFF",
          circleRadius: 9,
          circleStrokeWidth: 2,
          circleStrokeColor: "#edf9ff",
        }}
      />

      {/* 2. Cluster Text Label */}
      <SymbolLayer
        id="jeepneyClusterText"
        filter={["has", "point_count"]}
        style={{
          textField: ["format", "Jeeps +", ["get", "point_count"]],
          textSize: 12,
          textColor: "#edf9ff",
          textHaloColor: "#134e95",
          textHaloWidth: 2,
          textOffset: [0, 1.5],
          textAllowOverlap: true,
        }}
      />

      {/* 2.5 Normal Jeepney Outer Circle */}
      <CircleLayer
        id="jeepneyOuterCircle"
        filter={["!", ["has", "point_count"]]}
        style={{
          circleRadius: 22, // bigger than inner circle
          circleColor: "rgba(10, 113, 235, 0.3)", // slightly transparent blue
          circlePitchAlignment: "map",
        }}
      />

      {/* 3. Normal Jeepney Marker */}
      <CircleLayer
        id="jeepneyCircle"
        filter={["!", ["has", "point_count"]]}
        style={{
          circleRadius: 9,
          circleColor: "#0a71eb",
          circleOpacity: 0.95,
          circleStrokeColor: "#edf9ff",
          circleStrokeWidth: 2,
          circlePitchAlignment: "map",
        }}
      />

      {/* 4. Plate Label */}
      <SymbolLayer
        id="jeepneyLabel"
        filter={["!", ["has", "point_count"]]}
        style={{
          textField: ["get", "plate"],
          textSize: 12,
          textColor: "#edf9ff",
          textHaloColor: "#11305a",
          textHaloWidth: 3,
          textOffset: [0, -1.8],
          textAllowOverlap: true,
        }}
      />
    </ShapeSource>
  );
}
