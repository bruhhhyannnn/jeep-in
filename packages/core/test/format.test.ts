import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inSentence } from "../src/format";

describe("inSentence", () => {
  it("lowers only the first letter, keeping place names and acronyms", () => {
    assert.equal(inSentence("Toward Paoay"), "toward Paoay");
    assert.equal(inSentence("Traditional PUJ"), "traditional PUJ");
  });

  it("leaves a label that starts with an acronym, or is already lower case", () => {
    assert.equal(inSentence("PUJ modern"), "PUJ modern");
    assert.equal(inSentence("laoag_paoay"), "laoag_paoay");
  });
});
