import { z } from "zod";

/* ─── Auth ─── */
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/* ─── Driver ─── */
export const driverCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const driverEditSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  isActive: z.boolean().default(true),
});

/* ─── Jeepney ─── */
export const jeepneySchema = z.object({
  plateNumber: z
    .string()
    .min(1, "Plate number is required")
    .max(8, "Plate number must be 8 characters or less"),
  jeepneyNumber: z
    .string()
    .min(1, "Jeepney number is required")
    .max(2, "Jeepney number must be 2 characters or less"),
});

/* ─── Fare Guide ─── */
export const fareGuideSchema = z.object({
  routeId: z.string().min(1, "Route is required"),
  stopPointName: z.string().min(1, "Stop point name is required"),
  distanceKm: z.coerce.number().min(0, "Distance must be 0 or more"),
  regularFare: z.coerce.number().min(0, "Fare must be 0 or more"),
  discountedFare: z.coerce.number().min(0, "Discounted fare must be 0 or more"),
});

/* ─── Working Hours ─── */
export const workingHoursSchema = z.object({
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
});

/* ─── Stop Point ─── */
export const stopPointSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  landmark: z.string().optional(),
  description: z.string().optional(),
  /** Comma-separated, e.g. "Covered shed, Lights". */
  amenities: z.string().optional(),
  directionId: z.string().min(1, "Direction is required"),
  /** Position along the direction, 1 for the first stop. The other stops move to make room. */
  order: z.coerce.number().int("Use a whole number").min(1, "The first stop is 1"),
  lat: z.coerce.number().min(-90, "Invalid latitude").max(90, "Invalid latitude"),
  long: z.coerce.number().min(-180, "Invalid longitude").max(180, "Invalid longitude"),
  isActive: z.boolean().default(true),
});

/** "Laoag, Batac, Paoay" or "Laoag → Batac → Paoay" → ["Laoag", "Batac", "Paoay"]. */
export const splitList = (value: string | undefined) =>
  (value ?? "")
    .split(/\s*(?:,|→|->)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

/* ─── Route ─── */
export const routeDirectionSchema = z.object({
  /** Kept for an existing direction; a new one gets an id from its towns. */
  id: z.string().optional(),
  label: z.string().min(1, "Name the direction, e.g. Toward Paoay"),
  /** Towns in travel order, e.g. "Laoag, Batac, Paoay". */
  via: z.string().refine((v) => splitList(v).length >= 2, "List at least the first and last town"),
});

export const routeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  vehicleClass: z.string().min(1, "Vehicle class is required"),
  averageSpeedKph: z.coerce
    .number()
    .min(5, "Use the average speed including stops, 5 km/h or more")
    .max(80, "That's faster than a jeepney averages"),
  directions: z.array(routeDirectionSchema).min(1, "At least one direction is required"),
  isActive: z.boolean().default(true),
  workingHours: z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
  }),
});

/* ─── Organization ─── */
export const organizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  shortName: z
    .string()
    .min(1, "Short name is required")
    .max(10, "Short name must be 10 characters or less"),
  routeId: z.string().min(1, "Route is required"),
  isActive: z.boolean().default(true),
});

/* ─── Admin Account (created by super admin) ─── */
export const adminCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organizationId: z.string().min(1, "Organization is required"),
});

/* ─── Inferred Types ─── */
export type SignInFormData = z.infer<typeof signInSchema>;
export type DriverCreateFormData = z.infer<typeof driverCreateSchema>;
export type JeepneyFormData = z.infer<typeof jeepneySchema>;
export type FareGuideFormData = z.infer<typeof fareGuideSchema>;
export type WorkingHoursFormData = z.infer<typeof workingHoursSchema>;
export type StopPointFormData = z.infer<typeof stopPointSchema>;
export type RouteFormData = z.infer<typeof routeSchema>;
export type RouteDirectionFormData = z.infer<typeof routeDirectionSchema>;
export type OrganizationFormData = z.infer<typeof organizationSchema>;
export type AdminCreateFormData = z.infer<typeof adminCreateSchema>;
