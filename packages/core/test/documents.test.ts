import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeDriver,
  normalizeDriverLocation,
  normalizeDriverReport,
  normalizeFareMatrix,
  normalizeRoute,
  normalizeStopPoint,
} from "../src/documents";

describe("normalizeStopPoint", () => {
  it("reads the current stop documents' field names", () => {
    const stop = normalizeStopPoint("s1", {
      name: "Batac Terminal",
      routeId: "r1",
      routeDirection: "toward-paoay",
      latitude: 18.06,
      longitude: 120.56,
    });
    assert.equal(stop.directionId, "toward-paoay");
    assert.equal(stop.lat, 18.06);
    assert.equal(stop.long, 120.56);
  });

  it("prefers the new field names", () => {
    const stop = normalizeStopPoint("s1", {
      directionId: "d1",
      routeDirection: "old",
      lat: 18.1,
      latitude: 1,
      long: 120.6,
      longitude: 2,
    });
    assert.deepEqual([stop.directionId, stop.lat, stop.long], ["d1", 18.1, 120.6]);
  });

  it("fills in defaults", () => {
    const stop = normalizeStopPoint("s1", {});
    assert.equal(stop.name, "Stop");
    assert.equal(stop.isActive, true);
    assert.equal(stop.distanceKm, null);
    assert.deepEqual(stop.amenities, []);
  });
});

describe("normalizeRoute", () => {
  it("turns plain direction labels into directions", () => {
    const route = normalizeRoute("r1", { name: "Laoag – Paoay", directions: ["laoag_paoay"] });
    assert.deepEqual(route.directions, [
      { id: "laoag_paoay", label: "laoag_paoay", via: [], path: [] },
    ]);
  });

  it("reads direction objects and their paths", () => {
    const route = normalizeRoute("r1", {
      directions: [
        {
          id: "d1",
          label: "Toward Paoay",
          via: ["Laoag", "Batac", "Paoay"],
          path: [{ latitude: 18.2, longitude: 120.59 }, [120.56, 18.06]],
        },
      ],
      averageSpeedKph: "22",
    });
    assert.deepEqual(route.directions[0].path, [
      [120.59, 18.2],
      [120.56, 18.06],
    ]);
    assert.equal(route.averageSpeedKph, 22);
    assert.deepEqual(route.workingHours, { start: "05:00", end: "19:00" });
  });
});

describe("normalizeFareMatrix", () => {
  it("keeps discountRoundTo empty unless the document sets it", () => {
    assert.equal(normalizeFareMatrix("f1", {}).discountRoundTo, null);
    assert.equal(normalizeFareMatrix("f1", { discountRoundTo: 0.25 }).discountRoundTo, 0.25);
  });

  it("sorts the posted table and drops incomplete rows", () => {
    const matrix = normalizeFareMatrix("f1", {
      table: [
        { km: 5, landmark: "Green Meadows", regular: 16.25, discounted: 13 },
        { km: 0, regular: 14, discounted: 11.25 },
        { km: 1, landmark: "Gabu Junction", regular: 14 },
      ],
    });
    assert.deepEqual(matrix.table, [
      { km: 0, landmark: null, regular: 14, discounted: 11.25 },
      { km: 5, landmark: "Green Meadows", regular: 16.25, discounted: 13 },
    ]);
    assert.deepEqual(normalizeFareMatrix("f2", {}).table, []);
  });
});

describe("normalizeDriverLocation", () => {
  it("drops the GPS's -1 for a missing heading or speed", () => {
    const location = normalizeDriverLocation("u1", { heading: -1, speed: -1, isSharing: true });
    assert.equal(location.heading, null);
    assert.equal(location.speed, null);
    assert.equal(location.driverId, "u1");
  });

  it("reads a Firestore Timestamp", () => {
    const location = normalizeDriverLocation("u1", { updatedAt: { toMillis: () => 1_700_000 } });
    assert.equal(location.updatedAt, 1_700_000);
  });
});

describe("normalizeDriver", () => {
  it("builds the name from the admin's first and last name", () => {
    const driver = normalizeDriver("u1", {
      firstName: " Juan ",
      lastName: "Dela Cruz",
      name: "Old",
    });
    assert.equal(driver.name, "Juan Dela Cruz");
  });

  it("falls back to name, then to the name it is given", () => {
    assert.equal(normalizeDriver("u1", { name: "Pedro" }).name, "Pedro");
    assert.equal(normalizeDriver("u1", {}, "Maria Santos").name, "Maria Santos");
  });

  it("treats anything but reliever as the main driver", () => {
    assert.equal(normalizeDriver("u1", { role: "reliever" }).role, "reliever");
    assert.equal(normalizeDriver("u1", { role: "spare" }).role, "main");
  });
});

describe("normalizeDriverReport", () => {
  it("reads a report as the driver app writes it", () => {
    const report = normalizeDriverReport("r1", {
      driverId: "u1",
      jeepneyId: "j1",
      unit: "14",
      reason: "road_blocked",
      note: "  Flood at Quiling Sur ",
      lat: 18.04,
      long: 120.55,
      directionId: "laoag_paoay",
      status: "sent",
      createdAt: { toMillis: () => 1_700_000 },
    });
    assert.equal(report.reason, "road_blocked");
    assert.equal(report.note, "Flood at Quiling Sur");
    assert.equal(report.createdAt, 1_700_000);
    assert.equal(report.status, "sent");
  });

  it("files an unknown reason under other, and keeps a taken-back report withdrawn", () => {
    const report = normalizeDriverReport("r1", { reason: "flat_tire", status: "withdrawn" });
    assert.equal(report.reason, "other");
    assert.equal(report.status, "withdrawn");
    assert.equal(report.lat, null);
    assert.equal(report.createdAt, null);
  });
});
