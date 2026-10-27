import type {
  Driver,
  DriverLocation,
  FareMatrix,
  Jeepney,
  LngLat,
  Route,
  RouteDirection,
  StopPoint,
} from "./model";
import { num, optionalNum, optionalStr, str, strList, toLngLat, toMillis } from "./normalize";

// Readers that turn a Firestore document into the data model. They take plain
// data, so the web SDK, the React Native SDK and firebase-admin can all use them.

/** A document's fields, as the Firestore SDKs return them (`DocumentData`). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the SDKs' own shape
export type RawDoc = { [field: string]: any };

const toDirection = (raw: unknown, index: number): RouteDirection => {
  // Older route documents stored directions as plain labels.
  if (typeof raw === "string") return { id: raw, label: raw, via: [], path: [] };

  const d = (raw ?? {}) as Record<string, unknown>;
  const id = str(d.id ?? d.label, `direction-${index + 1}`);
  return {
    id,
    label: str(d.label ?? d.name, id),
    via: strList(d.via),
    path: Array.isArray(d.path) ? d.path.map(toLngLat).filter((p): p is LngLat => p !== null) : [],
  };
};

export const normalizeRoute = (id: string, d: RawDoc): Route => ({
  id,
  name: str(d.name, "Route"),
  vehicleClass: str(d.vehicleClass, "Traditional PUJ"),
  directions: Array.isArray(d.directions) ? d.directions.map(toDirection) : [],
  isActive: d.isActive !== false,
  workingHours: {
    start: str(d.workingHours?.start, "05:00"),
    end: str(d.workingHours?.end, "19:00"),
  },
  averageSpeedKph: num(d.averageSpeedKph, 20),
});

export const normalizeStopPoint = (id: string, d: RawDoc): StopPoint => ({
  id,
  name: str(d.name, "Stop"),
  address: str(d.address),
  landmark: optionalStr(d.landmark),
  description: optionalStr(d.description),
  amenities: strList(d.amenities),
  photoUrl: optionalStr(d.photoUrl),
  routeId: str(d.routeId),
  // `routeDirection` is the field name used before directions had ids.
  directionId: str(d.directionId ?? d.routeDirection),
  order: num(d.order, 0),
  distanceKm: optionalNum(d.distanceKm),
  // `latitude` / `longitude` are the field names on the current stop documents.
  lat: num(d.lat ?? d.latitude, 0),
  long: num(d.long ?? d.lng ?? d.longitude, 0),
  isActive: d.isActive !== false,
});

/**
 * Used when a route has no fare matrix document yet. Rates follow the current
 * traditional PUJ rule, but with no order number the app shows them as placeholders.
 */
export const PLACEHOLDER_FARE_MATRIX: Omit<FareMatrix, "id" | "routeId"> = {
  vehicleClass: "Traditional PUJ",
  orderNo: null,
  issuedBy: null,
  effectiveDate: null,
  baseFare: 13,
  baseKm: 4,
  perKm: 1.8,
  discountRate: 0.2,
  roundTo: 1,
  discountRoundTo: null,
};

export const normalizeFareMatrix = (id: string, d: RawDoc): FareMatrix => ({
  id,
  routeId: str(d.routeId),
  vehicleClass: str(d.vehicleClass, PLACEHOLDER_FARE_MATRIX.vehicleClass),
  orderNo: optionalStr(d.orderNo),
  issuedBy: optionalStr(d.issuedBy),
  effectiveDate: optionalStr(d.effectiveDate),
  baseFare: num(d.baseFare, PLACEHOLDER_FARE_MATRIX.baseFare),
  baseKm: num(d.baseKm, PLACEHOLDER_FARE_MATRIX.baseKm),
  perKm: num(d.perKm, PLACEHOLDER_FARE_MATRIX.perKm),
  discountRate: num(d.discountRate, PLACEHOLDER_FARE_MATRIX.discountRate),
  roundTo: num(d.roundTo, PLACEHOLDER_FARE_MATRIX.roundTo),
  discountRoundTo: optionalNum(d.discountRoundTo),
});

export const normalizeJeepney = (id: string, d: RawDoc): Jeepney => ({
  id,
  plateNumber: str(d.plateNumber),
  jeepneyNumber: str(d.jeepneyNumber),
  organizationId: str(d.organizationId),
  routeId: str(d.routeId),
  assignedDriverId: typeof d.assignedDriverId === "string" ? d.assignedDriverId : null,
  status: d.status ?? undefined,
  seats: optionalNum(d.seats),
});

export const normalizeDriverLocation = (id: string, d: RawDoc): DriverLocation => {
  const heading = optionalNum(d.heading);
  const speed = optionalNum(d.speed);
  return {
    id,
    driverId: typeof d.driverId === "string" ? d.driverId : id,
    lat: num(d.lat, 0),
    long: num(d.long, 0),
    // GPS reports -1 when it has no heading or speed.
    heading: heading != null && heading >= 0 ? heading : null,
    speed: speed != null && speed >= 0 ? speed : null,
    directionId: optionalStr(d.directionId),
    isSharing: d.isSharing === true,
    updatedAt: toMillis(d.updatedAt),
  };
};

export const normalizeDriver = (id: string, d: RawDoc, fallbackName = "Driver"): Driver => ({
  id,
  name: str(d.name ?? d.displayName, fallbackName),
  employeeId: optionalStr(d.employeeId),
  role: d.role === "reliever" ? "reliever" : "main",
  phone: optionalStr(d.phone),
  licenseNo: optionalStr(d.licenseNo),
  licenseExpiry: optionalStr(d.licenseExpiry),
  photoUrl: optionalStr(d.photoUrl),
});
