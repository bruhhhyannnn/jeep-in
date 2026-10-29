import { bearing, length, lineSliceAlong, lineString, nearestPointOnLine, point } from "@turf/turf";
import type { Feature, LineString } from "geojson";
import type { LngLat, StopPoint } from "./model";

const lines = new WeakMap<LngLat[], Feature<LineString>>();

const asLine = (path: LngLat[]) => {
  let line = lines.get(path);
  if (!line) {
    line = lineString(path);
    lines.set(path, line);
  }
  return line;
};

export type PathMeasure = {
  /** Distance from the start of the path to the snapped point. */
  alongKm: number;
  /** Distance between the point and the path. */
  offsetKm: number;
  segmentIndex: number;
};

/** Snaps a point onto a path. Null when the path has fewer than two points. */
export function measureOnPath(path: LngLat[], p: LngLat): PathMeasure | null {
  if (path.length < 2) return null;
  const snapped = nearestPointOnLine(asLine(path), point(p), {
    units: "kilometers",
  });
  return {
    alongKm: snapped.properties.location ?? 0,
    offsetKm: snapped.properties.dist ?? Number.POSITIVE_INFINITY,
    segmentIndex: snapped.properties.index ?? 0,
  };
}

export function pathLengthKm(path: LngLat[]): number {
  return path.length < 2 ? 0 : length(asLine(path), { units: "kilometers" });
}

/** The part of a path between two distances along it. */
export function slicePath(path: LngLat[], fromKm: number, toKm: number): LngLat[] {
  if (path.length < 2 || toKm - fromKm < 0.01) return [];
  return lineSliceAlong(asLine(path), fromKm, toKm, { units: "kilometers" }).geometry
    .coordinates as LngLat[];
}

/** Compass bearing of the path segment at `index`. */
export function segmentBearing(path: LngLat[], index: number): number {
  const a = path[Math.min(index, path.length - 2)];
  const b = path[Math.min(index + 1, path.length - 1)];
  return bearing(point(a), point(b));
}

/** Smallest angle between two compass bearings, 0–180. */
export const angleBetween = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

export function boundsOf(points: LngLat[]): { sw: LngLat; ne: LngLat } | null {
  if (!points.length) return null;
  let [minX, minY] = points[0];
  let [maxX, maxY] = points[0];
  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { sw: [minX, minY], ne: [maxX, maxY] };
}

/** Straight-line (great-circle) distance in km. */
export const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/** The stop closest to a point, with its distance; null when there are no stops. */
export function nearestStop(stops: StopPoint[], [lng, lat]: LngLat) {
  let best: { stop: StopPoint; km: number } | null = null;
  for (const s of stops) {
    const km = distanceKm(lat, lng, s.lat, s.long);
    if (!best || km < best.km) best = { stop: s, km };
  }
  return best;
}
