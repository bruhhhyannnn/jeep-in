import { useEffect, useState } from "react";
import { getCollection } from "@/services/firebase/firestore";
import type { PickupPoint } from "@/types";
import type { FeatureCollection, Feature, Point } from "geojson";

export const useStops = () => {
  const [geoJson, setGeoJson] = useState<FeatureCollection<Point> | null>(null);

  useEffect(() => {
    async function load() {
      const stops = await getCollection<PickupPoint>("stops");

      const features: Feature<Point>[] = stops.map((s) => ({
        type: "Feature",
        id: s.id,
        properties: {
          name: s.name,
          landmark_name: s.landmark_name,
          address: s.address,
          route_id: s.route_id,
        },
        geometry: {
          type: "Point",
          coordinates: [s.longitude, s.latitude],
        },
      }));

      setGeoJson({ type: "FeatureCollection", features });
    }

    load();
  }, []);

  return geoJson;
};
