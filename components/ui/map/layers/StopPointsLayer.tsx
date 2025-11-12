import { ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import type { FeatureCollection, Point } from "geojson";
import { useStops } from "@/hooks/useStops";

export default function StopPointsLayer() {
  const geoJson = useStops();

  if (!geoJson) return null;

  return (
    <ShapeSource
      id="stopPoints"
      shape={geoJson as FeatureCollection<Point>}
      // 🚫 No cluster props
    >
      {/* Basic icon for all stops */}
      <SymbolLayer
        id="stopIcon"
        style={{
          iconImage: "stop-icon", // Make sure it's in your sprite or images
          iconSize: 1,
          iconAllowOverlap: true,
          iconAnchor: "bottom",
        }}
      />

      {/* Label for each stop */}
      <SymbolLayer
        id="stopLabel"
        style={{
          textField: ["get", "name"],
          textSize: 12,
          textColor: "#ffffff",
          textHaloColor: "#0a71eb",
          textHaloWidth: 4,
          textOffset: [0, -2.0],
          textAllowOverlap: true,
        }}
      />
    </ShapeSource>
  );
}
