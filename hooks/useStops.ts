import { useEffect, useState } from "react";
import { getCollection } from "@/services/firebase/firestore";
import type { PickupPoint } from "@/types";
import type { FeatureCollection, Feature, Point } from "geojson";

export const useStops = () => {
  const [geoJson, setGeoJson] = useState<FeatureCollection<Point> | null>(null);

  useEffect(() => {
    async function load() {
      // 1. Fetch raw stops
      const stops = await getCollection<PickupPoint>("stops");

      // 2. Convert to GeoJSON
      const features: Feature<Point>[] = stops.map((stop) => ({
        type: "Feature",
        id: stop.id,
        properties: {
          name: stop.name,
          landmark_name: stop.landmark_name,
          address: stop.address,
          route_id: stop.route_id,
        },
        geometry: {
          type: "Point",
          coordinates: [stop.longitude, stop.latitude], // Mapbox: [lng, lat]
        },
      }));

      setGeoJson({
        type: "FeatureCollection",
        features,
      });
    }

    load();
  }, []);

  return geoJson;
};
