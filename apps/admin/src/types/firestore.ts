import type { Timestamp } from "firebase/firestore";
import type {
  FareMatrix,
  FareRow,
  Route as RouteModel,
  RouteDirection,
  StopPoint,
} from "@jeep-in/core/model";

// Routes, stops and fares follow the model every app shares (packages/core).
export type { FareMatrix, FareRow, RouteDirection, StopPoint };

/* ─── Role ─── */
export type UserRole = "super_admin" | "admin" | "driver" | "commuter";

/* ─── Organization ─── */
export interface Organization {
  id: string;
  name: string;
  shortName: string;
  routeId: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/* ─── Admin profile (/admins/{uid}) ─── */
export interface AdminProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/* ─── Driver profile (/drivers/{uid}) ─── */
export interface DriverProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  assignedJeepneyId: string | null;
  routeId: string | null;
  isActive: boolean;
  /**
   * mustChangePassword: true when the admin first creates the account.
   * TODO: Mobile app should prompt the driver to change their password on first login
   * and update this field to false via a Firebase Cloud Function or direct Firestore write.
   */
  mustChangePassword: boolean;
  lastLocationUpdate: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/* ─── Jeepney (/jeepneys/{jeepneyId}) ─── */
export interface Jeepney {
  id: string;
  plateNumber: string;
  jeepneyNumber: string;
  organizationId: string;
  routeId: string | null;
  assignedDriverId: string | null;
  isActive: boolean;
  /** A simulated unit from the "Simulate jeeps" panel (jeepneys/sim-0N); its driver is bot-0N. */
  isBot?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/* ─── Driver Location (/driver_locations/{uid}) — realtime ─── */
export interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
  heading: number | null;
  /**
   * isSharing: controlled by the driver's GPS toggle in the mobile app.
   * TODO: working-hours enforcement — when outside working hours,
   * the mobile app should set isSharing to false automatically.
   * See: /src/app/(admin)/working-hours/page.tsx for the schedule config.
   */
  isSharing: boolean;
  updatedAt: Timestamp;
}

/* ─── Route (/routes/{routeId}) ─── */
export interface Route extends RouteModel {
  /** Shown to admins only. */
  description: string | null;
}

/* ─── Fare Guide: a posted fare in a route's fare matrix (/fare_matrices/{id}.table) ─── */
export interface FareGuideRow extends FareRow {
  routeId: string;
}

/* ─── Audit Log (/audit_logs/{logId}) ─── */
export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  actorName: string;
  action: string; // e.g. "CREATE_DRIVER", "DELETE_JEEPNEY", "GPS_TOGGLE_ON"
  targetType: string; // e.g. "driver", "jeepney", "fare_guide"
  targetId: string;
  targetName: string | null;
  details: string | null;
  organizationId: string | null;
  createdAt: Timestamp;
}
