import { useJeepneys } from "./useJeepneys";

export const useJeepneysList = () => {
  const geojson = useJeepneys();

  if (!geojson) return [];

  return geojson.features.map((f) => ({
    id: String(f.id),
    plate: f.properties?.plate || "",
    route_id: f.properties?.route_id || "",
    status: f.properties?.status || "",
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
  }));
};
