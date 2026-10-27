import type { LngLat } from "@/types";

const MAX_WAYPOINTS = 25; // Mapbox Directions limit for the driving profile

/** Keeps the first and last point and spreads the rest evenly. */
const sampleWaypoints = (points: LngLat[]): LngLat[] => {
  if (points.length <= MAX_WAYPOINTS) return points;
  const step = (points.length - 1) / (MAX_WAYPOINTS - 1);
  return Array.from({ length: MAX_WAYPOINTS }, (_, i) => points[Math.round(i * step)]);
};

/** Road geometry that passes through the given points in order. */
export async function getRoadPath(points: LngLat[]): Promise<LngLat[]> {
  const coords = sampleWaypoints(points)
    .map(([lng, lat]) => `${lng},${lat}`)
    .join(";");
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?alternatives=false&geometries=geojson&overview=full&access_token=${process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY}`;
  const res = await fetch(url);
  const json = await res.json();

  if (!json.routes || !json.routes[0]) {
    throw new Error("No route found");
  }

  return json.routes[0].geometry.coordinates as LngLat[];
}
