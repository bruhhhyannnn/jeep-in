import { useEffect, useMemo, useState } from "react";
import { subscribeToJeepneys, subscribeToAllDriverLocations } from "@/api";
import type { Jeepney, DriverLocation } from "@/types";
import type { Feature, FeatureCollection, Point } from "geojson";

export const useJeepneys = (): FeatureCollection<Point> => {
  const [jeepneys, setJeepneys] = useState<Jeepney[]>([]);
  const [locations, setLocations] = useState<Record<string, DriverLocation>>({});

  useEffect(() => {
    return subscribeToJeepneys(setJeepneys);
  }, []);

  useEffect(() => {
    return subscribeToAllDriverLocations((locs) => {
      const map: Record<string, DriverLocation> = {};
      locs.forEach((l) => {
        map[l.driverId] = l;
      });
      setLocations(map);
    });
  }, []);

  return useMemo((): FeatureCollection<Point> => {
    const features: Feature<Point>[] = jeepneys
      .filter((j) => j.assignedDriverId != null && locations[j.assignedDriverId]?.isSharing)
      .map((j) => {
        const loc = locations[j.assignedDriverId!];
        return {
          type: "Feature",
          id: j.id,
          properties: {
            plate: j.plateNumber,
            route_id: j.routeId,
            status: j.status ?? null,
          },
          geometry: {
            type: "Point",
            coordinates: [loc.long, loc.lat],
          },
        };
      });

    return { type: "FeatureCollection", features };
  }, [jeepneys, locations]);
};
