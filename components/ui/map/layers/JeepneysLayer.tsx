import { ShapeSource, SymbolLayer } from "@rnmapbox/maps";
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
