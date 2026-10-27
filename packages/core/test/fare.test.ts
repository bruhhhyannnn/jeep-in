import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PLACEHOLDER_FARE_MATRIX } from "../src/documents";
import { fareFormula, quoteFare } from "../src/fare";
import type { FareMatrix } from "../src/model";

const placeholder: FareMatrix = { ...PLACEHOLDER_FARE_MATRIX, id: "p", routeId: "r" };

// The Laoag–Batac–Paoay rule in the fare_guide collection.
const fareGuide: FareMatrix = {
  ...placeholder,
  baseFare: 14,
  baseKm: 4,
  perKm: 2.2,
  roundTo: 0.25,
  discountRate: 0.2,
  discountRoundTo: 0.25,
};

describe("quoteFare", () => {
  it("charges the base fare inside the base distance", () => {
    assert.deepEqual(quoteFare(placeholder, 3.2), {
      km: 3.2,
      extraKm: 0,
      regular: 13,
      discounted: 10.4,
    });
  });

  it("rounds the discount to the centavo when the matrix sets no step", () => {
    const quote = quoteFare(placeholder, 10.7);
    assert.equal(quote.extraKm, 6.7);
    assert.equal(quote.regular, 25); // 13 + 6.7 × 1.80 = 25.06
    assert.equal(quote.discounted, 20);
  });

  it("rounds both fares to the matrix steps", () => {
    assert.deepEqual(quoteFare(fareGuide, 4), {
      km: 4,
      extraKm: 0,
      regular: 14,
      discounted: 11.25,
    });
    // 14 + 3 × 2.20 = 20.60 → 20.50; 20.50 × 0.8 = 16.40 → 16.50
    assert.deepEqual(quoteFare(fareGuide, 7), {
      km: 7,
      extraKm: 3,
      regular: 20.5,
      discounted: 16.5,
    });
    // 14 + 13 × 2.20 = 42.60 → 42.50; 42.50 × 0.8 = 34.00
    assert.equal(quoteFare(fareGuide, 17).discounted, 34);
  });
});

describe("fareFormula", () => {
  it("names the base distance when there are no extra km", () => {
    assert.equal(fareFormula(placeholder, quoteFare(placeholder, 2)), "₱13.00 base · first 4 km");
  });

  it("shows the per-km part", () => {
    const quote = quoteFare(placeholder, 10.7);
    assert.equal(fareFormula(placeholder, quote), "₱13.00 base + 6.7 km × ₱1.80");
  });
});
