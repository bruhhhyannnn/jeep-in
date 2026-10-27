import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeDriverLocation,
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
