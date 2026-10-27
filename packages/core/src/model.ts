// The JEEP-IN data model: what every app reads from Firestore, after the readers in
// documents.ts have filled in defaults for older documents.

/** [longitude, latitude], the order Mapbox and GeoJSON use. */
export type LngLat = [number, number];

export type UserRole = "commuter" | "driver";
export type JeepneyStatus = "On route" | "Stationed" | "Out of service";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
}

/** One way along a route, e.g. "Toward Paoay". Stops point to it through `directionId`. */
export interface RouteDirection {
  id: string;
  label: string;
  /** Towns in travel order, shown as "Laoag → Batac → Paoay". */
  via: string[];
  /** Road geometry in travel order. Empty when not set; the app then traces it through the stops. */
  path: LngLat[];
}

export interface Route {
  id: string;
  name: string;
  /** e.g. "Traditional PUJ"; shown on the fare matrix. */
  vehicleClass: string;
  directions: RouteDirection[];
  isActive: boolean;
  /** 24-hour "HH:mm" times when service usually starts and ends. */
  workingHours: { start: string; end: string };
  /** Average jeep speed including stops, used for arrival estimates. */
  averageSpeedKph: number;
}

export interface StopPoint {
  id: string;
  name: string;
  address: string;
  /** Nearby landmark; searched along with the name and address. */
  landmark: string | null;
  /** Shown under "About this stop". */
  description: string | null;
  /** Short facts shown as chips, e.g. "Covered shed". */
  amenities: string[];
  photoUrl: string | null;
  routeId: string;
  directionId: string;
  /** 1-based position along the direction. */
  order: number;
  /** Kilometres from the first stop of the direction, as posted for fares. Null → measured along the path. */
  distanceKm: number | null;
  lat: number;
  long: number;
  isActive: boolean;
}

export interface Jeepney {
  id: string;
  plateNumber: string;
  /** Unit code painted on the jeep, e.g. "J-14". */
  jeepneyNumber: string;
  organizationId: string;
  routeId: string;
  assignedDriverId: string | null;
  status?: JeepneyStatus;
  seats: number | null;
}

export type DriverRole = "main" | "reliever";

/** Driver record kept by the manager; read-only in the driver app. */
export interface Driver {
  id: string;
  name: string;
  /** e.g. "DRV-0142" */
  employeeId: string | null;
  role: DriverRole;
  phone: string | null;
  licenseNo: string | null;
  /** ISO date */
  licenseExpiry: string | null;
  photoUrl: string | null;
}

export type ReportReason = "breakdown" | "road_blocked" | "accident" | "heavy_traffic" | "other";

/** A problem the driver sends to the manager's alerts list. */
export interface DriverReport {
  id: string;
  driverId: string;
  jeepneyId: string;
  unit: string;
  reason: ReportReason;
  note: string | null;
  lat: number | null;
  long: number | null;
  directionId: string | null;
  /** "withdrawn" after "Take it back". */
  status: "sent" | "withdrawn";
  createdAt: number | null;
}

export interface DriverLocation {
  id: string;
  driverId: string;
  lat: number;
  long: number;
  heading: number | null;
  /** Metres per second, from the phone's GPS. */
  speed: number | null;
  /** Set by the driver app; when missing the commuter app infers it from heading. */
  directionId: string | null;
  isSharing: boolean;
  /** Epoch ms of the last position written. Null for drivers on older app versions. */
  updatedAt: number | null;
}

/** Fare rule from the posted LTFRB order: base fare covers `baseKm`, then `perKm` for each km after. */
export interface FareMatrix {
  id: string;
  routeId: string;
  vehicleClass: string;
  /** Null until the official order is added; the app then labels the rates as placeholders. */
  orderNo: string | null;
  issuedBy: string | null;
  /** ISO date the order took effect. */
  effectiveDate: string | null;
  baseFare: number;
  baseKm: number;
  perKm: number;
  /** Student, senior and PWD discount as a fraction, e.g. 0.2. */
  discountRate: number;
  /** Regular fares are rounded to the nearest multiple of this, e.g. 1 for the nearest peso. */
  roundTo: number;
  /** Discounted fares are rounded to the nearest multiple of this, e.g. 0.25. Null → to the centavo. */
  discountRoundTo: number | null;
}

export type AlertKind = "arrival" | "live" | "passed" | "lost";

/** Kept on the device only; there is no commuter account to sync to. */
export interface CommuterAlert {
  id: string;
  kind: AlertKind;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  jeepneyId: string | null;
}
