import { ShapeSource, LineLayer } from "@rnmapbox/maps";
import { useEffect, useState } from "react";
import type { Feature } from "geojson";

type AnimatedRouteProps = {
  id: string;
  coordinates: [number, number][];
  color: string;
  translate?: [number, number];
};

export default function AnimatedRoute({
  id,
  coordinates,
  color,
  translate = [0, 0], // optional offset
}: AnimatedRouteProps) {
  const [dashArray, setDashArray] = useState<number[]>([0, 4, 3]);

  // Dash animation frames (loop sequence)
  const dashSequence = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
    [0, 3.5, 3, 0.5],
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % dashSequence.length;
      setDashArray(dashSequence[step]);
    }, 90); // speed

    return () => clearInterval(interval);
  }, []);

  const feature: Feature = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates,
    },
  };

  return (
    <ShapeSource id={`route-${id}`} shape={feature}>
      <LineLayer
        id={`route-line-${id}`}
        style={{
          lineColor: color,
          lineOpacity: 0.6,
          lineWidth: 5,
          lineDasharray: dashArray,
          lineCap: "round",
          lineJoin: "round",
          lineTranslate: translate, // to avoid overlapping looking weird
        }}
      />
    </ShapeSource>
  );
}
