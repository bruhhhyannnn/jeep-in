// Shared Types & Enums
export type Timestamp = string | Date; // Firestore timestamp or JS date
export type UserRole = "commuter" | "driver" | "admin" | "super_admin";
export type JeepneyStatus = "On route" | "Stationed" | "Out of service";
export type DriverStatus = "active" | "inactive";

// User
export interface User {
  id: string; // Firebase UID
  email: string;
  name: string;
  role: UserRole;
  profile_image?: string; // optional Firebase Storage URL
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Route
export interface Route {
  id: string;
  name: string; // e.g., "Laoag Paoay (via Batac)"
  route_direction: string[]; // ["laoag_paoay", "paoay_laoag"]
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Pickup Point
export interface PickupPoint { // or Stop Point
  id: string;
  route_id: string; // FK → Route.id
  name: string;
  landmark_name: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url?: string; // optional landmark image
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Jeepney
export interface Jeepney {
  id: string;
  route_id: string; // FK → Route.id
  driver_profile_id: string; // FK → DriverProfile.id
  plate_number: string;
  latitude: number;
  longitude: number;
  bearing?: number;
  current_direction?: string; // must match Route.route_direction
  last_pickup_point_id?: string; // FK → PickupPoint.id
  next_pickup_point_id?: string; // FK → PickupPoint.id
  status: JeepneyStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Driver Profile
export interface DriverProfile {
  id: string;
  user_id: string; // FK → User.id
  route_id: string; // FK → Route.id
  status: DriverStatus; // "active" | "inactive"
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Admin Profile
export interface AdminProfile {
  id: string;
  user_id: string; // FK → User.id
  route_id: string; // FK → Route.id
  working_hours_start: number; // 0–23
  working_hours_end: number; // 0–23
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Super Admin Profile
export interface SuperAdminProfile {
  id: string;
  user_id: string; // FK → User.id
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Relationships & Utility Types
export interface JeepneyWithDriver extends Jeepney {
  driver?: DriverProfile;
}
export interface RouteWithPoints extends Route {
  pickup_points?: PickupPoint[];
}
export interface UserWithProfile extends User {
  driver_profile?: DriverProfile;
  admin_profile?: AdminProfile;
  super_admin_profile?: SuperAdminProfile;
}
