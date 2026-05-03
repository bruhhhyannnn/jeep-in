export type UserRole = "commuter" | "driver";
export type JeepneyStatus = "On route" | "Stationed" | "Out of service";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
}

export interface DriverLocation {
  id: string;
  driverId: string;
  lat: number;
  long: number;
  heading: number | null;
  isSharing: boolean;
}

export interface Jeepney {
  id: string;
  plateNumber: string;
  jeepneyNumber: string;
  organizationId: string;
  routeId: string;
  assignedDriverId: string | null;
  status?: JeepneyStatus;
}

export interface StopPoint {
  id: string;
  name: string;
  address: string;
  routeId: string;
  routeDirection: string;
  lat: number;
  long: number;
  order: number;
  isActive: boolean;
}

export interface Route {
  id: string;
  name: string;
  directions: string[];
  isActive: boolean;
  workingHours: { start: string; end: string };
}

export interface FareGuide {
  id: string;
  routeId: string;
  stopPointName: string;
  distanceKm: number;
  regularFare: number;
  discountedFare: number;
}
