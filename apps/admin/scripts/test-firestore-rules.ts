/**
 * Firestore rules test — against the emulator, never the live project
 * Run from the monorepo root (needs firebase-tools and Java):
 *   npm run test:rules
 *
 * Loads firestore.rules into the Firestore emulator and makes the reads and writes
 * the commuter apps, the driver app and the dashboard make, plus the ones the rules
 * must refuse, as each kind of account. Exits non-zero if any case goes the wrong way.
 * Deploy with scripts/deploy-firestore-rules.ts once this passes.
 *
 * On Windows, firebase-tools can leave the emulator's Java process running after the
 * test; if the next run says port 8080 is taken, end that Java process first.
 */

import { deleteApp, initializeApp as initializeClient, type FirebaseApp } from "firebase/app";
import {
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  setLogLevel,
  type Firestore,
} from "firebase/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "demo-jeep-in";
const emulator = process.env.FIRESTORE_EMULATOR_HOST;
if (!emulator) {
  console.error("FIRESTORE_EMULATOR_HOST is not set. Run this through `npm run test:rules`.");
  process.exit(1);
}
const [host, port] = emulator.split(":");
// Refused writes are the point of half the cases; the SDK would log each one.
setLogLevel("silent");

// The Admin SDK skips the rules: it sets up each document's state before a case.
initializeApp({ projectId: PROJECT_ID });
const seed = getAdminFirestore();

type Auth = { uid: string; token: { role?: string } } | null;
type Case = {
  name: string;
  allow: boolean;
  auth: Auth;
  method: "get" | "list" | "create" | "update" | "delete";
  path: string;
  /** The document after the write (request.resource.data). */
  data?: Record<string, unknown>;
  /** The document before the write (resource.data). */
  existing?: Record<string, unknown>;
};

const commuter: Auth = null;
const driver: Auth = { uid: "driver-1", token: { role: "driver" } };
const admin: Auth = { uid: "admin-1", token: { role: "admin" } };
const superAdmin: Auth = { uid: "super-1", token: { role: "super_admin" } };

const location = {
  driverId: "driver-1",
  lat: 18.05,
  long: 120.55,
  heading: 90,
  speed: 5,
  isSharing: true,
  updatedAt: "2026-10-29T08:00:00Z",
};
const report = {
  driverId: "driver-1",
  jeepneyId: "jeep-1",
  unit: "J14",
  reason: "breakdown",
  note: null,
  lat: 18.05,
  long: 120.55,
  directionId: "laoag_paoay",
  status: "sent",
  createdAt: "2026-10-29T08:00:00Z",
};

const CASES: Case[] = [
  // Commuters, no account
  ...["routes", "stop_points", "fare_matrices", "fare_guide", "jeepneys", "driver_locations"].map(
    (c): Case => ({
      name: `commuter lists ${c}`,
      allow: true,
      auth: commuter,
      method: "list",
      path: `${c}/x`,
    }),
  ),
  {
    name: "commuter writes a route",
    allow: false,
    auth: commuter,
    method: "update",
    path: "routes/r1",
    data: { name: "x" },
    existing: { name: "y" },
  },
  {
    name: "commuter deletes a stop",
    allow: false,
    auth: commuter,
    method: "delete",
    path: "stop_points/s1",
    existing: { name: "y" },
  },
  {
    name: "commuter moves a jeep",
    allow: false,
    auth: commuter,
    method: "update",
    path: "driver_locations/driver-1",
    data: { ...location, lat: 1 },
    existing: location,
  },
  {
    name: "commuter reads users",
    allow: false,
    auth: commuter,
    method: "get",
    path: "users/driver-1",
  },
  { name: "commuter lists admins", allow: false, auth: commuter, method: "list", path: "admins/x" },
  {
    name: "commuter reads organizations",
    allow: false,
    auth: commuter,
    method: "get",
    path: "organizations/ITC",
  },
  {
    name: "commuter reads audit logs",
    allow: false,
    auth: commuter,
    method: "list",
    path: "audit_logs/x",
  },

  // The driver app
  {
    name: "driver reads own user profile",
    allow: true,
    auth: driver,
    method: "get",
    path: "users/driver-1",
  },
  {
    name: "driver reads another user profile",
    allow: false,
    auth: driver,
    method: "get",
    path: "users/driver-2",
  },
  {
    name: "driver reads own record",
    allow: true,
    auth: driver,
    method: "get",
    path: "drivers/driver-1",
  },
  {
    name: "driver reads another driver's record",
    allow: false,
    auth: driver,
    method: "get",
    path: "drivers/driver-2",
  },
  {
    name: "driver stamps lastLocationUpdate",
    allow: true,
    auth: driver,
    method: "update",
    path: "drivers/driver-1",
    data: { firstName: "A", lastLocationUpdate: "now" },
    existing: { firstName: "A", lastLocationUpdate: null },
  },
  {
    name: "driver edits own record",
    allow: false,
    auth: driver,
    method: "update",
    path: "drivers/driver-1",
    data: { firstName: "B" },
    existing: { firstName: "A" },
  },
  {
    name: "driver shares a first position",
    allow: true,
    auth: driver,
    method: "create",
    path: "driver_locations/driver-1",
    data: location,
  },
  {
    name: "driver sends a position",
    allow: true,
    auth: driver,
    method: "update",
    path: "driver_locations/driver-1",
    data: { ...location, lat: 18.06 },
    existing: location,
  },
  {
    name: "driver sets direction",
    allow: true,
    auth: driver,
    method: "update",
    path: "driver_locations/driver-1",
    data: { ...location, directionId: "paoay_laoag" },
    existing: location,
  },
  {
    name: "driver stops sharing",
    allow: true,
    auth: driver,
    method: "update",
    path: "driver_locations/driver-1",
    data: { ...location, isSharing: false },
    existing: location,
  },
  {
    name: "driver stops sharing, no doc yet",
    allow: true,
    auth: driver,
    method: "create",
    path: "driver_locations/driver-1",
    data: { isSharing: false },
  },
  {
    name: "driver logs extra time",
    allow: true,
    auth: driver,
    method: "update",
    path: "driver_locations/driver-1",
    data: { ...location, overtimeUntil: "2026-10-29T20:30:00Z" },
    existing: location,
  },
  {
    name: "driver moves another driver's jeep",
    allow: false,
    auth: driver,
    method: "update",
    path: "driver_locations/driver-2",
    data: { ...location, driverId: "driver-2" },
    existing: { ...location, driverId: "driver-2" },
  },
  {
    name: "driver writes an unknown field",
    allow: false,
    auth: driver,
    method: "update",
    path: "driver_locations/driver-1",
    data: { ...location, role: "admin" },
    existing: location,
  },
  {
    name: "driver deletes own position",
    allow: false,
    auth: driver,
    method: "delete",
    path: "driver_locations/driver-1",
    existing: location,
  },
  {
    name: "driver sends a report",
    allow: true,
    auth: driver,
    method: "create",
    path: "driver_reports/rep-1",
    data: report,
  },
  {
    name: "driver sends a report as someone else",
    allow: false,
    auth: driver,
    method: "create",
    path: "driver_reports/rep-1",
    data: { ...report, driverId: "driver-2" },
  },
  {
    name: "driver takes a report back",
    allow: true,
    auth: driver,
    method: "update",
    path: "driver_reports/rep-1",
    data: { ...report, status: "withdrawn", withdrawnAt: "now" },
    existing: report,
  },
  {
    name: "driver rewrites a report",
    allow: false,
    auth: driver,
    method: "update",
    path: "driver_reports/rep-1",
    data: { ...report, reason: "accident" },
    existing: report,
  },
  {
    name: "driver takes back another's report",
    allow: false,
    auth: driver,
    method: "update",
    path: "driver_reports/rep-2",
    data: { ...report, driverId: "driver-2", status: "withdrawn" },
    existing: { ...report, driverId: "driver-2" },
  },
  {
    name: "driver assigns a jeepney",
    allow: false,
    auth: driver,
    method: "update",
    path: "jeepneys/jeep-1",
    data: { assignedDriverId: "driver-1" },
    existing: { assignedDriverId: null },
  },
  {
    name: "commuter sends a report",
    allow: false,
    auth: commuter,
    method: "create",
    path: "driver_reports/rep-1",
    data: report,
  },

  // The dashboard's browser side (its writes go through the server)
  {
    name: "admin reads own admin profile",
    allow: true,
    auth: admin,
    method: "get",
    path: "admins/admin-1",
  },
  {
    name: "admin reads another admin profile",
    allow: false,
    auth: admin,
    method: "get",
    path: "admins/admin-2",
  },
  {
    name: "admin lists live positions",
    allow: true,
    auth: admin,
    method: "list",
    path: "driver_locations/x",
  },
  {
    name: "admin writes a route from the browser",
    allow: false,
    auth: admin,
    method: "update",
    path: "routes/r1",
    data: { name: "x" },
    existing: { name: "y" },
  },
  {
    name: "admin reads driver reports from the browser",
    allow: false,
    auth: admin,
    method: "list",
    path: "driver_reports/x",
  },
  {
    name: "super admin reads own profile",
    allow: true,
    auth: superAdmin,
    method: "get",
    path: "admins/super-1",
  },
  {
    name: "super admin writes users from the browser",
    allow: false,
    auth: superAdmin,
    method: "update",
    path: "users/driver-1",
    data: { role: "super_admin" },
    existing: { role: "driver" },
  },
];

const clients = new Map<string, { app: FirebaseApp; db: Firestore }>();

/** A browser signed in as `auth` (or signed out), talking to the emulator. */
function clientFor(auth: Auth) {
  const key = auth ? `${auth.uid}:${auth.token.role ?? ""}` : "signed-out";
  let client = clients.get(key);
  if (!client) {
    const app = initializeClient({ projectId: PROJECT_ID, apiKey: "demo" }, key);
    const db = getFirestore(app);
    connectFirestoreEmulator(db, host, Number(port), {
      ...(auth ? { mockUserToken: { sub: auth.uid, user_id: auth.uid, ...auth.token } } : {}),
    });
    client = { app, db };
    clients.set(key, client);
  }
  return client.db;
}

async function attempt(c: Case): Promise<boolean> {
  const db = clientFor(c.auth);
  const ref = doc(db, c.path);
  switch (c.method) {
    case "get":
      await getDoc(ref);
      break;
    case "list":
      await getDocs(collection(db, c.path.split("/").slice(0, -1).join("/")));
      break;
    case "create":
    case "update":
      await setDoc(ref, c.data ?? {});
      break;
    case "delete":
      await deleteDoc(ref);
      break;
  }
  return true;
}

async function run(c: Case): Promise<{ ok: boolean; detail?: string }> {
  const seeded = seed.doc(c.path);
  if (c.existing) await seeded.set(c.existing);
  else await seeded.delete();

  try {
    await attempt(c);
    return { ok: c.allow };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "permission-denied") return { ok: !c.allow };
    return { ok: false, detail: String(err) };
  }
}

async function main() {
  let failed = 0;
  for (const c of CASES) {
    const { ok, detail } = await run(c);
    if (!ok) failed++;
    console.log(`${ok ? "pass" : "FAIL"}  ${c.allow ? "allow" : "deny "}  ${c.name}`);
    if (detail) console.log("      ", detail);
  }
  console.log(`
${CASES.length - failed}/${CASES.length} cases as expected.`);
  await Promise.all([...clients.values()].map(({ app }) => deleteApp(app)));
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
