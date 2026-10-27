/**
 * Migration Script — the shared data model (packages/core)
 *
 * Brings the live documents to the field names the apps read first. Each group can
 * be applied on its own:
 *
 *   stops       stop_points: `lat` / `long` from `latitude` / `longitude`, and
 *               `directionId` from `routeDirection`. The old fields are kept until
 *               every app writes the new ones.
 *   distances   stop_points: `distanceKm` from fare_guide, only for a direction whose
 *               stops all have a fare_guide entry of the same name.
 *   route-info  routes: `vehicleClass` and `averageSpeedKph`, where missing.
 *   directions  routes: `directions` from labels ("laoag_paoay") to objects
 *               ({ id, label, via }). The ids stay the same, so stops and saved
 *               commuter settings still match. ⚠️ An admin deployed before this
 *               change shows directions as text and breaks on objects: apply this
 *               group only once the new admin is live.
 *   fares       fare_matrices: one document per route that has fare_guide rows, with
 *               the rule those rows follow. Rows the rule doesn't reproduce are listed.
 *
 * Dry run (default) — changes nothing; writes scripts/backups/model-plan.json:
 *   npx tsx scripts/migrate-data-model.ts
 * Apply the reviewed plan, all groups or some:
 *   npx tsx scripts/migrate-data-model.ts --apply
 *   npx tsx scripts/migrate-data-model.ts --apply --groups=stops,route-info,fares
 *
 * Back up first: npx tsx scripts/backup-collections.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue, type DocumentData } from "firebase-admin/firestore";
import { quoteFare, type FareMatrix, type RouteDirection } from "@jeep-in/core";

// ─── CONFIGURE BEFORE RUNNING ───────────────────────────────────────────────
const SERVICE_ACCOUNT_PATH = "./serviceAccountKey.json";
const VEHICLE_CLASS = "Traditional PUJ";
/** Average jeep speed including stops; the apps' default until a route sets its own. */
const AVERAGE_SPEED_KPH = 20;
/** The fare rule's rounding steps. fare_guide's fares are all multiples of ₱0.25. */
const ROUND_TO = 0.25;
const DISCOUNT_ROUND_TO = 0.25;
const DISCOUNT_RATE = 0.2;
// ─────────────────────────────────────────────────────────────────────────────

const GROUPS = ["stops", "distances", "route-info", "directions", "fares"] as const;
type Group = (typeof GROUPS)[number];

const APPLY = process.argv.includes("--apply");
const groupsArg = process.argv.find((a) => a.startsWith("--groups="));
const SELECTED = new Set<Group>(
  groupsArg ? (groupsArg.slice("--groups=".length).split(",") as Group[]) : GROUPS,
);
const BACKUP_DIR = join(__dirname, "backups");
const PLAN_FILE = join(BACKUP_DIR, "model-plan.json");

if (!getApps().length) {
  const serviceAccount = require(SERVICE_ACCOUNT_PATH);
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

type Change = {
  group: Group;
  collection: string;
  id: string;
  label: string;
  /** "create" writes a new document and refuses to overwrite one. */
  kind: "update" | "create";
  /** Fields as they are now, for the review. */
  before: Record<string, unknown>;
  set: Record<string, unknown>;
};

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
const title = (s: string) => s.toLowerCase().replace(/(^|\s)\p{L}/gu, (c) => c.toUpperCase());
const peso = (n: number) => `₱${n.toFixed(2)}`;

/** "laoag_paoay" on "Laoag–Batac–Paoay" → { label: "Toward Paoay", via: [Laoag, Batac, Paoay] }. */
function toDirection(routeName: string, id: string): RouteDirection {
  const [from, to] = id.split("_").map(title);
  if (!from || !to) return { id, label: id, via: [], path: [] };
  const towns = routeName
    .split(/\s*[–—-]\s*|\s+/)
    .filter(Boolean)
    .map(title);
  let via = [from, to];
  if (towns.length >= 2 && towns[0] === from && towns.at(-1) === to) via = towns;
  else if (towns.length >= 2 && towns[0] === to && towns.at(-1) === from) via = towns.reverse();
  return { id, label: `Toward ${to}`, via, path: [] };
}

async function plan(): Promise<Change[]> {
  const [routesSnap, stopsSnap, guideSnap, matricesSnap] = await Promise.all([
    db.collection("routes").get(),
    db.collection("stop_points").get(),
    db.collection("fare_guide").get(),
    db.collection("fare_matrices").get(),
  ]);
  const changes: Change[] = [];
  const routes = new Map(routesSnap.docs.map((d) => [d.id, d.data()]));

  // ── stops ──
  console.log(`\nstops — ${stopsSnap.size} stop_points`);
  for (const d of stopsSnap.docs) {
    const s = d.data();
    const set: DocumentData = {};
    if (typeof s.lat !== "number" && typeof s.latitude === "number") set.lat = s.latitude;
    if (typeof s.long !== "number" && typeof s.longitude === "number") set.long = s.longitude;
    if (typeof s.directionId !== "string" && typeof s.routeDirection === "string") {
      set.directionId = s.routeDirection;
    }
    if (!routes.has(s.routeId)) {
      console.log(`  ❓ ${s.name} (${d.id}) is on route ${s.routeId}, which doesn't exist`);
    }
    if (!Object.keys(set).length) continue;
    changes.push({
      group: "stops",
      collection: "stop_points",
      id: d.id,
      label: `stop ${s.name}`,
      kind: "update",
      before: { latitude: s.latitude, longitude: s.longitude, routeDirection: s.routeDirection },
      set,
    });
  }
  console.log(`  ${changes.length} stops get lat / long / directionId`);

  // ── distances ──
  console.log("\ndistances — posted distances from fare_guide");
  const guideByRoute = new Map<string, { name: string; km: number }[]>();
  for (const d of guideSnap.docs) {
    const g = d.data();
    const rows = guideByRoute.get(g.routeId) ?? [];
    rows.push({ name: String(g.stopPointName), km: Number(g.distanceKm) });
    guideByRoute.set(g.routeId, rows);
  }
  for (const [routeId, rows] of guideByRoute) {
    const byName = new Map(rows.map((r) => [normalize(r.name), r.km]));
    const lastKm = Math.max(...rows.map((r) => r.km));
    const routeStops = stopsSnap.docs.filter((d) => d.data().routeId === routeId);
    const directions = new Set(
      routeStops.map((d) => String(d.data().directionId ?? d.data().routeDirection)),
    );
    for (const direction of directions) {
      const stops = routeStops
        .filter((d) => String(d.data().directionId ?? d.data().routeDirection) === direction)
        .sort((a, b) => Number(a.data().order ?? 0) - Number(b.data().order ?? 0));
      const missing = stops.filter((d) => !byName.has(normalize(String(d.data().name))));
      if (missing.length) {
        console.log(
          `  ${direction}: ${stops.length - missing.length} of ${stops.length} stops have a fare_guide entry — skipped (measured along the path instead)`,
        );
        console.log(`    no entry: ${missing.map((d) => d.data().name).join(", ")}`);
        continue;
      }
      // fare_guide counts from the start of the route; the other direction counts back.
      const firstKm = byName.get(normalize(String(stops[0].data().name))) ?? 0;
      const reverse = firstKm > 0;
      console.log(
        `  ${direction}: all ${stops.length} stops matched${reverse ? " (reversed)" : ""}`,
      );
      for (const d of stops) {
        const km = byName.get(normalize(String(d.data().name))) ?? 0;
        const distanceKm = reverse ? lastKm - km : km;
        if (d.data().distanceKm === distanceKm) continue;
        changes.push({
          group: "distances",
          collection: "stop_points",
          id: d.id,
          label: `${direction} ${d.data().name}`,
          kind: "update",
          before: { distanceKm: d.data().distanceKm ?? null },
          set: { distanceKm },
        });
      }
    }
  }

  // ── route-info and directions ──
  console.log("\nroutes");
  for (const [id, r] of routes) {
    const info: DocumentData = {};
    if (typeof r.vehicleClass !== "string") info.vehicleClass = VEHICLE_CLASS;
    if (typeof r.averageSpeedKph !== "number") info.averageSpeedKph = AVERAGE_SPEED_KPH;
    if (Object.keys(info).length) {
      changes.push({
        group: "route-info",
        collection: "routes",
        id,
        label: `route ${r.name}`,
        kind: "update",
        before: {
          vehicleClass: r.vehicleClass ?? null,
          averageSpeedKph: r.averageSpeedKph ?? null,
        },
        set: info,
      });
    }
    const labels: unknown[] = Array.isArray(r.directions) ? r.directions : [];
    if (labels.some((d) => typeof d === "string")) {
      // A route mixing labels and objects keeps its objects as they are.
      const directions = labels.map((d) =>
        typeof d === "string" ? toDirection(String(r.name), d) : (d as RouteDirection),
      );
      for (const d of directions) {
        console.log(`  ${r.name}: ${d.id} → "${d.label}" via ${d.via.join(" → ") || "—"}`);
      }
      changes.push({
        group: "directions",
        collection: "routes",
        id,
        label: `route ${r.name}`,
        kind: "update",
        before: { directions: labels },
        // Paths stay unset: the apps trace the road through the stops.
        set: { directions: directions.map(({ id, label, via }) => ({ id, label, via })) },
      });
    }
  }

  // ── fares ──
  console.log("\nfares — fare_matrices from fare_guide");
  const existing = new Set(matricesSnap.docs.map((d) => d.data().routeId));
  for (const routeId of guideByRoute.keys()) {
    const route = routes.get(routeId);
    if (existing.has(routeId)) {
      console.log(`  ${route?.name ?? routeId}: already has a fare matrix — left as is`);
      continue;
    }
    const rows = guideSnap.docs
      .map((d) => d.data())
      .filter((g) => g.routeId === routeId)
      .map((g) => ({
        km: Number(g.distanceKm),
        regular: Number(g.regularFare),
        discounted: Number(g.discountedFare),
      }))
      .sort((a, b) => a.km - b.km);

    // The base fare is the one charged at the shortest distances, until the fare first rises.
    const baseFare = rows[0].regular;
    const firstRise = rows.find((r) => r.regular > baseFare);
    const baseKm = firstRise ? firstRise.km - 1 : rows.at(-1)!.km;
    // Per-km rate from the longest distance: regular fares are rounded, so this is the best estimate.
    const last = rows.at(-1)!;
    const perKm = Math.round(((last.regular - baseFare) / (last.km - baseKm)) * 10) / 10;

    const matrix: Omit<FareMatrix, "id"> = {
      routeId,
      vehicleClass: route?.vehicleClass ?? VEHICLE_CLASS,
      orderNo: null,
      issuedBy: null,
      effectiveDate: null,
      baseFare,
      baseKm,
      perKm,
      discountRate: DISCOUNT_RATE,
      roundTo: ROUND_TO,
      discountRoundTo: DISCOUNT_ROUND_TO,
    };
    console.log(
      `  ${route?.name ?? routeId}: ${peso(baseFare)} for the first ${baseKm} km, then ${peso(perKm)}/km; rounded to ${peso(ROUND_TO)}; ${DISCOUNT_RATE * 100}% discount rounded to ${peso(DISCOUNT_ROUND_TO)}`,
    );
    const off = rows.filter((r) => {
      const q = quoteFare({ ...matrix, id: "check" }, r.km);
      return q.regular !== r.regular || q.discounted !== r.discounted;
    });
    console.log(`    reproduces ${rows.length - off.length} of ${rows.length} fare_guide rows`);
    for (const r of off) {
      const q = quoteFare({ ...matrix, id: "check" }, r.km);
      console.log(
        `    ⚠️ ${String(r.km).padStart(2)} km: fare_guide ${peso(r.regular)} / ${peso(r.discounted)}, rule ${peso(q.regular)} / ${peso(q.discounted)}`,
      );
    }
    changes.push({
      group: "fares",
      collection: "fare_matrices",
      id: routeId,
      label: `fare matrix for ${route?.name ?? routeId}`,
      kind: "create",
      before: {},
      set: matrix,
    });
  }

  return changes;
}

async function apply() {
  if (!existsSync(PLAN_FILE)) {
    console.error(
      "❌ No reviewed plan. Run the dry run first: npx tsx scripts/migrate-data-model.ts",
    );
    process.exit(1);
  }
  const changes = (JSON.parse(readFileSync(PLAN_FILE, "utf8")) as Change[]).filter((c) =>
    SELECTED.has(c.group),
  );
  const batch = db.batch();
  for (const c of changes) {
    const ref = db.collection(c.collection).doc(c.id);
    const exists = (await ref.get()).exists;
    if (c.kind === "update" && !exists) {
      console.error(`❌ ${c.collection}/${c.id} no longer exists — run the dry run again.`);
      process.exit(1);
    }
    if (c.kind === "create" && exists) {
      console.error(`❌ ${c.collection}/${c.id} already exists — run the dry run again.`);
      process.exit(1);
    }
    const now = FieldValue.serverTimestamp();
    if (c.kind === "create") batch.create(ref, { ...c.set, createdAt: now, updatedAt: now });
    else batch.update(ref, { ...c.set, updatedAt: now });
  }
  await batch.commit();
  const groups = [...new Set(changes.map((c) => c.group))].join(", ");
  console.log(`✅ Applied ${changes.length} changes (${groups}) from ${PLAN_FILE}`);
}

async function main() {
  if (APPLY) return apply();

  mkdirSync(BACKUP_DIR, { recursive: true });
  const changes = await plan();
  writeFileSync(PLAN_FILE, JSON.stringify(changes, null, 2));
  const counts = changes.reduce<Record<string, number>>((acc, c) => {
    acc[c.group] = (acc[c.group] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`\n📝 Dry run: ${changes.length} changes planned ${JSON.stringify(counts)}`);
  console.log(`   Plan saved to ${PLAN_FILE}. Nothing was written.`);
  console.log("   Apply it with: npx tsx scripts/migrate-data-model.ts --apply [--groups=…]\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
