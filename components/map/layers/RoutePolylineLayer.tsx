import AnimatedRoute from "@/components/map/layers/AnimatedRoute";

import route1 from "@/data/routes/centinal-rob.json";
import route2 from "@/data/routes/rob-centinnal.json";

export default function RouteLayers() {
  return (
    <>
      {/* Route 1 → CHS to COE */}
      <AnimatedRoute
        id="chs-coe"
        coordinates={route1.coordinates as [number, number][]}
        color="#10b981"
        translate={[2, -4]} // top
      />

      {/* Route 2 → COE to CHS */}
      <AnimatedRoute
        id="coe-chs"
        coordinates={route2.coordinates as [number, number][]}
        color="#f59e0b"
        translate={[2, 4]} // tiny offset so they don't overlap perfectly
      />
    </>
  );
}
