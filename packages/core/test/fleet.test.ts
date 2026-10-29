import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeDriverLocation, normalizeJeepney } from "../src/documents";
import { OUT_OF_SERVICE, buildLiveJeeps } from "../src/fleet";

const now = Date.parse("2026-10-29T08:00:00Z");
const unit = (id: string, driverId: string, extra: Record<string, unknown> = {}) =>
  normalizeJeepney(id, {
    plateNumber: `ABC ${id}`,
    jeepneyNumber: id,
    routeId: "r",
    assignedDriverId: driverId,
    ...extra,
  });
const sharing = (driverId: string, isSharing = true) =>
  normalizeDriverLocation(driverId, {
    driverId,
    lat: 18.05,
    long: 120.56,
    isSharing,
    updatedAt: new Date(now - 10_000),
  });

describe("buildLiveJeeps", () => {
  const live = (jeepneys: ReturnType<typeof unit>[], locations = [sharing("d1"), sharing("d2")]) =>
    buildLiveJeeps(jeepneys, locations, [], {}, now).map((j) => j.id);

  it("shows the jeeps whose drivers are sharing", () => {
    assert.deepEqual(live([unit("14", "d1"), unit("15", "d2")]), ["14", "15"]);
  });

  it("leaves out a jeep whose driver stopped sharing", () => {
    assert.deepEqual(live([unit("14", "d1")], [sharing("d1", false)]), []);
  });

  it("leaves out a jeep the dashboard marked out of service, even while sharing", () => {
    assert.deepEqual(live([unit("14", "d1", { status: OUT_OF_SERVICE }), unit("15", "d2")]), [
      "15",
    ]);
  });
});
