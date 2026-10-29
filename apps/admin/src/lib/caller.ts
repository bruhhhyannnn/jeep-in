/**
 * Who is calling a server action — SERVER ONLY, and not exported from "@/lib".
 *
 * Server actions run with the Admin SDK, which skips the Firestore rules, and anyone
 * can post to them. So every action starts here: the session cookie is verified (not
 * just present), the role is checked, and an admin only reaches their own organization
 * and its route. Super admins reach everything.
 */
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export type Caller =
  | { uid: string; role: "super_admin"; organizationId: null }
  | { uid: string; role: "admin"; organizationId: string };

const OTHER_ORG = "That belongs to another organization.";

/** The signed-in admin or super admin. Throws for anyone else. */
export async function requireCaller(): Promise<Caller> {
  const session = (await cookies()).get("jeep-in-session")?.value;
  // Expired, revoked, disabled or forged sessions all get the same plain answer.
  const decoded = session
    ? await adminAuth.verifySessionCookie(session, true).catch(() => null)
    : null;
  if (!decoded) throw new Error("Your session has ended. Sign in again.");

  if (decoded.role === "super_admin") {
    return { uid: decoded.uid, role: "super_admin", organizationId: null };
  }
  if (decoded.role !== "admin") throw new Error("This account can't use the dashboard.");

  const admin = (await adminDb.collection("admins").doc(decoded.uid).get()).data();
  if (!admin || admin.isActive === false) {
    throw new Error("This account has been turned off. Ask a super admin.");
  }
  if (typeof admin.organizationId !== "string" || !admin.organizationId) {
    throw new Error("This account has no organization yet. Ask a super admin.");
  }
  return { uid: decoded.uid, role: "admin", organizationId: admin.organizationId };
}

/** Organizations, routes and admin accounts. */
export async function requireSuperAdmin(): Promise<Caller> {
  const caller = await requireCaller();
  if (caller.role !== "super_admin") throw new Error("Only super admins can do this.");
  return caller;
}

/** An admin can only act inside their own organization. */
export function assertOrg(caller: Caller, organizationId: unknown) {
  if (caller.role === "admin" && organizationId !== caller.organizationId) {
    throw new Error(OTHER_ORG);
  }
}

/** An admin can only change their organization's route: its stops, fares and hours. */
export async function assertRoute(caller: Caller, routeId: unknown) {
  if (caller.role === "super_admin") return;
  const org = await adminDb.collection("organizations").doc(caller.organizationId).get();
  if (!routeId || org.data()?.routeId !== routeId) throw new Error(OTHER_ORG);
}

/** Checks a document's organization before an admin reads or changes it. */
export async function assertOrgOf(caller: Caller, collection: string, id: string) {
  if (caller.role === "super_admin") return;
  const snap = await adminDb.collection(collection).doc(id).get();
  if (!snap.exists || snap.data()?.organizationId !== caller.organizationId) {
    throw new Error(OTHER_ORG);
  }
}
