// Shared Types & Enums
export type Timestamp = string | Date; // Firestore timestamp or JS date
export type UserRole = "commuter" | "driver";
export type JeepneyStatus = "On route" | "Stationed" | "Out of service";

// Pickup Point
export interface PickupPoint {
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
  speed?: number;
  bearing?: number;
  current_direction?: string; // must match Route.route_direction
  last_pickup_point_id?: string; // FK → PickupPoint.id
  next_pickup_point_id?: string; // FK → PickupPoint.id
  status: JeepneyStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// User
export interface User {
  id: string; // Firebase UID
  email: string;
  name: string;
  role: UserRole;
  profile_image_url?: string; // optional Firebase Storage URL
  created_at: Timestamp;
  updated_at: Timestamp;
}
