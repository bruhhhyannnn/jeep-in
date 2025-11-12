import Mapbox, { ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import { useJeepneys } from "@/hooks/useJeepneys";

export default function JeepneysLayer() {
  const geoJson = useJeepneys();

  if (!geoJson) return null;

  return (
    <ShapeSource id="jeepneys" shape={geoJson}>
      <SymbolLayer
        id="jeepneyIcon"
        style={{
          iconImage: "jeepney-icon",
          iconSize: 1.1,
          iconAllowOverlap: true,
          iconRotate: ["get", "bearing"],
        }}
      />
    </ShapeSource>
  );
}
