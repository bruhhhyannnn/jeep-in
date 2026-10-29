import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeStopPoint } from "../src/documents";
import { nearestStop } from "../src/geo";

const stop = (id: string, lat: number, long: number) =>
  normalizeStopPoint(id, { name: id, lat, long, routeId: "r", directionId: "d", order: 1 });

describe("nearestStop", () => {
  const stops = [stop("laoag", 18.198, 120.594), stop("batac", 18.056, 120.565)];

  it("picks the closest stop and gives its distance", () => {
    const best = nearestStop(stops, [120.566, 18.06]);
    assert.equal(best?.stop.id, "batac");
    assert.ok(best && best.km > 0.4 && best.km < 0.5);
  });

  it("is null with no stops", () => {
    assert.equal(nearestStop([], [120.566, 18.06]), null);
  });
});
