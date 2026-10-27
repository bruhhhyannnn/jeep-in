import { useEffect } from "react";
import type mapboxgl from "mapbox-gl";
import type { GeoJSONSource } from "mapbox-gl";
import type { Feature, Point } from "geojson";
import type { LngLat } from "@/types";
import { useTheme } from "@/theme";
import { View } from "@/components/ui";
import MapMarker from "@/components/map/MapMarker";

/** Metres per pixel at zoom 22 on the equator (512px tiles). */
const METRES_PER_PX_Z22 = 78271.517 / 2 ** 22;

type LocationPuckProps = {
  map: mapboxgl.Map;
  coords: LngLat;
  accuracyM: number | null;
  /** GPS direction of travel; draws the bearing wedge while moving. */
  heading: number | null;
  /** Bumped when the map style reloads, so the accuracy layer is added again. */
  styleVersion: number;
};

/**
 * rnmapbox's LocationPuck: blue dot with a soft pulse, the GPS accuracy as a
 * pale circle (drawn on the map so it scales with zoom), and the direction of
 * travel when moving.
 */
export default function LocationPuck({
  map,
  coords,
  accuracyM,
  heading,
  styleVersion,
}: LocationPuckProps) {
  const { colors } = useTheme();
  const [lng, lat] = coords;

  useEffect(() => {
    const data: Feature<Point> = {
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: [lng, lat] },
    };
    const source = map.getSource("user-accuracy") as GeoJSONSource | undefined;
    if (source) source.setData(data);
    else map.addSource("user-accuracy", { type: "geojson", data });

    // Radius in metres, as pixels at each zoom: doubles with every zoom level.
    const pxAt22 = (accuracyM ?? 0) / (METRES_PER_PX_Z22 * Math.cos((lat * Math.PI) / 180));
    const radius: mapboxgl.Expression = [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      0,
      0,
      22,
      pxAt22,
    ];
    if (!map.getLayer("user-accuracy")) {
      map.addLayer(
        {
          id: "user-accuracy",
          type: "circle",
          source: "user-accuracy",
          paint: { "circle-pitch-alignment": "map" },
        },
        map.getLayer("stop-dots") ? "stop-dots" : undefined,
      );
    }
    map.setPaintProperty("user-accuracy", "circle-radius", radius);
    map.setPaintProperty("user-accuracy", "circle-color", colors.action);
    map.setPaintProperty("user-accuracy", "circle-opacity", 0.12);
  }, [map, lng, lat, accuracyM, colors.action, styleVersion]);

  useEffect(
    () => () => {
      if (!map.getStyle()) return;
      if (map.getLayer("user-accuracy")) map.removeLayer("user-accuracy");
      if (map.getSource("user-accuracy")) map.removeSource("user-accuracy");
    },
    [map],
  );

  return (
    <MapMarker map={map} coordinate={coords} anchor="center">
      <View className="pointer-events-none h-[22px] w-[22px] items-center justify-center">
        <span
          className="absolute h-[22px] w-[22px] rounded-full"
          style={{ backgroundColor: colors.action, animation: "puck-pulse 2s ease-out infinite" }}
        />
        {heading != null && (
          <span
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderBottom: `10px solid ${colors.action}`,
              transform: `rotate(${heading}deg) translateY(-15px)`,
            }}
          />
        )}
        <span
          className="h-[18px] w-[18px] rounded-full border-[3px] border-white shadow-md"
          style={{ backgroundColor: colors.action }}
        />
      </View>
    </MapMarker>
  );
}
