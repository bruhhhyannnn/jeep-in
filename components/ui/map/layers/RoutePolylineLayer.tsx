import { ShapeSource, LineLayer } from "@rnmapbox/maps";
import type { FeatureCollection, LineString } from "geojson";
import { useEffect, useState } from "react";

export default function RoutePolylineLayer() {
  const [geoJson, setGeoJson] = useState<FeatureCollection<LineString> | null>(null);
  const [dashOffset, setDashOffset] = useState(0);

  useEffect(() => {
    // Static example route
    const route: FeatureCollection<LineString> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [120.987, 18.124],
              [120.99, 18.125],
              [120.992, 18.13],
            ],
          },
        },
      ],
    };
    setGeoJson(route);
  }, []);

  // ⚡ Animate dash offset using requestAnimationFrame
  useEffect(() => {
    let frame: number;

    const animate = () => {
      setDashOffset((prev) => {
        // loop 0 → 4
        const next = prev + 0.1;
        return next > 4 ? 0 : next;
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!geoJson) return null;

  return (
    <ShapeSource id="routePolyline" shape={geoJson}>
      {/* Background line */}
      <LineLayer
        id="routeLineBg"
        style={{
          lineColor: "#0a71eb",
          lineWidth: 6,
          lineOpacity: 0.3,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      {/* Animated dashed line */}
      <LineLayer
        id="routeLineAnimated"
        style={{
          lineColor: "#0a71eb",
          lineWidth: 6,
          lineDasharray: [dashOffset, 2], // 👈 animate offset
          lineCap: "round",
          lineJoin: "round",
        }}
      />
    </ShapeSource>
  );
}
