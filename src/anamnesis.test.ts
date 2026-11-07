import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseAge, parseHeightCm, parseWeightKg } from "./anamnesis.ts";

describe("parseAge", () => {
  it("accepts an age and a birth year", () => {
    const year = new Date().getFullYear();
    assert.equal(parseAge("28"), 28);
    assert.equal(parseAge("28 yaş"), 28);
    assert.equal(parseAge("1990"), year - 1990);
  });

  it("rejects an age outside 12 to 100", () => {
    const year = new Date().getFullYear();
    assert.equal(parseAge("11"), null);
    assert.equal(parseAge("101"), null);
    assert.equal(parseAge(String(year - 11)), null);
  });
});

describe("parseHeightCm", () => {
  it("accepts centimeters and a meter value with a comma", () => {
    assert.equal(parseHeightCm("170 cm"), 170);
    assert.equal(parseHeightCm("1,70"), 170);
  });

  it("rejects a height outside 120 to 230 cm", () => {
    assert.equal(parseHeightCm("119"), null);
    assert.equal(parseHeightCm("231"), null);
  });
});

describe("parseWeightKg", () => {
  it("accepts a decimal weight written with a comma and a unit", () => {
    assert.equal(parseWeightKg("70,5 kg"), 70.5);
  });

  it("rejects a weight outside 30 to 250 kg", () => {
    assert.equal(parseWeightKg("29"), null);
    assert.equal(parseWeightKg("251"), null);
  });
});
