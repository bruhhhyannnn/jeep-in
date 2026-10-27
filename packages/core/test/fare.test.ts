import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PLACEHOLDER_FARE_MATRIX } from "../src/documents";
import { fareFormula, isPlaceholderMatrix, quoteFare } from "../src/fare";
import type { FareMatrix } from "../src/model";

const placeholder: FareMatrix = { ...PLACEHOLDER_FARE_MATRIX, id: "p", routeId: "r" };

// The rule behind the Laoag–Batac–Paoay guide, without its table.
const rule: FareMatrix = {
  ...placeholder,
  baseFare: 14,
  baseKm: 4,
  perKm: 2.2,
  roundTo: 0.25,
  discountRate: 0.2,
  discountRoundTo: 0.25,
};

// Rows from the posted Laoag–Batac–Paoay guide, including two the rule doesn't reproduce.
const posted: FareMatrix = {
  ...rule,
  table: [
    { km: 0, landmark: "Laoag City", regular: 14, discounted: 11.25 },
    { km: 6, landmark: "San Nicolas Ice Plant", regular: 18.5, discounted: 14.75 },
    { km: 7, landmark: "San Lorenzo", regular: 20.5, discounted: 16.5 },
    { km: 16, landmark: "Batac Public Market", regular: 40.5, discounted: 32.25 },
    { km: 18, landmark: "Batac Crossing", regular: 44.75, discounted: 36 },
  ],
};

describe("quoteFare", () => {
  it("charges the base fare inside the base distance", () => {
    assert.deepEqual(quoteFare(placeholder, 3.2), {
      km: 3.2,
      extraKm: 0,
      regular: 13,
      discounted: 10.4,
      row: null,
    });
  });

  it("rounds the discount to the centavo when the matrix sets no step", () => {
    const quote = quoteFare(placeholder, 10.7);
    assert.equal(quote.extraKm, 6.7);
    assert.equal(quote.regular, 25); // 13 + 6.7 × 1.80 = 25.06
    assert.equal(quote.discounted, 20);
  });

  it("rounds both fares to the matrix steps", () => {
    assert.equal(quoteFare(rule, 4).discounted, 11.25);
    // 14 + 3 × 2.20 = 20.60 → 20.50; 20.50 × 0.8 = 16.40 → 16.50
    assert.deepEqual([quoteFare(rule, 7).regular, quoteFare(rule, 7).discounted], [20.5, 16.5]);
  });

  it("charges the posted fares, even where the rule differs", () => {
    const quote = quoteFare(posted, 18);
    assert.deepEqual([quote.regular, quote.discounted], [44.75, 36]);
    assert.equal(quote.row?.landmark, "Batac Crossing");
    assert.equal(quoteFare(rule, 18).discounted, 35.75);
  });

  it("uses the row for the nearest whole km", () => {
    assert.equal(quoteFare(posted, 6.4).regular, 18.5);
    assert.equal(quoteFare(posted, 6.5).regular, 20.5);
    assert.equal(quoteFare(posted, 15.6).discounted, 32.25);
    assert.equal(quoteFare(posted, 6.4).extraKm, 2);
  });

  it("falls back to the rule where the guide has no row", () => {
    const quote = quoteFare(posted, 30);
    assert.equal(quote.row, null);
    assert.equal(quote.regular, 71.25); // 14 + 26 × 2.20 = 71.20
  });
});

describe("isPlaceholderMatrix", () => {
  it("is a placeholder with neither an order number nor posted fares", () => {
    assert.equal(isPlaceholderMatrix(placeholder), true);
    assert.equal(isPlaceholderMatrix(posted), false);
    assert.equal(isPlaceholderMatrix({ ...placeholder, orderNo: "2023-001" }), false);
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
