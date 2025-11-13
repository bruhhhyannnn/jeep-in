import { ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import type { FeatureCollection, Point } from "geojson";
import { useStops } from "@/hooks/useStops";
import { router } from "expo-router";

export default function StopPointsLayer() {
  const geoJson = useStops();

  if (!geoJson) return null;

  return (
    <ShapeSource
      id="stopPoints"
      shape={geoJson as FeatureCollection<Point>}
      onPress={(event) => {
        const feature = event.features[0] as any;
        if (!feature) return;

        const stopId = feature.id as string;
        const props = feature.properties || {};
        const [lng, lat] = feature.geometry.coordinates as [number, number];

        // Navigate to stop screen & pass full data
        router.push({
          // TODO: replace this one someday
          pathname: "/(commuter)/home/stop/[id]",
          params: {
            id: stopId,
            name: props.name,
            landmark_name: props.landmark_name,
            address: props.address,
            route_id: props.route_id,
            lat: String(lat),
            lng: String(lng),
          },
        });
      }}
    >
      <SymbolLayer
        id="stopIcon"
        style={{
          iconImage: "stop-icon",
          iconSize: 1,
          iconAllowOverlap: true,
          iconAnchor: "bottom",
        }}
      />

      <SymbolLayer
        id="stopLabel"
        style={{
          textField: ["get", "landmark_name"],
          textSize: 10,
          textColor: "#edf9ff",
          textHaloColor: "#0a71eb",
          textHaloWidth: 4,
          textOffset: [0, -4.5],
          textAllowOverlap: true,
        }}
      />
    </ShapeSource>
  );
}
