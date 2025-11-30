import { useEffect, useState } from "react";
import { listenToCollection } from "@/services/firebase/firestore";
import type { Jeepney } from "@/types";
import type { Feature, FeatureCollection, Point } from "geojson";

export const useJeepneys = (): FeatureCollection<Point> | null => {
  const [geoJson, setGeoJson] = useState<FeatureCollection<Point> | null>(null);

  useEffect(() => {
    const unsubscribe = listenToCollection<Jeepney>("jeepneys", (data) => {
      const features: Feature<Point>[] = data.map((j) => ({
        type: "Feature",
        id: j.id,
        properties: {
          plate: j.plate_number,
          route_id: j.route_id,
          status: j.status,
        },
        geometry: {
          type: "Point",
          coordinates: [j.longitude, j.latitude],
        },
      }));

      setGeoJson({
        type: "FeatureCollection",
        features,
      });
    });

    return unsubscribe;
  }, []);

  return geoJson;
};
