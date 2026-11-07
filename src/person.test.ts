import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fullName, parseEmail, parsePersonName } from "./person.ts";

describe("parseEmail", () => {
  it("trims and lowercases the address", () => {
    assert.equal(parseEmail("  Emre@Clinic.demo "), "emre@clinic.demo");
  });

  it("rejects an invalid address", () => {
    assert.equal(parseEmail("emre"), null);
    assert.equal(parseEmail("emre@clinic"), null);
    assert.equal(parseEmail("emre..kara@clinic.demo"), null);
  });

  it("rejects a domain that starts with a hyphen or exceeds the length limit", () => {
    assert.equal(parseEmail("emre@-clinic.demo"), null);
    assert.equal(parseEmail(`${"a".repeat(65)}@clinic.demo`), null);
    assert.equal(parseEmail(`${"a".repeat(250)}@clinic.demo`), null);
  });
});

describe("parsePersonName", () => {
  it("collapses extra spaces", () => {
    assert.equal(parsePersonName("  Ayşe   Yılmaz "), "Ayşe Yılmaz");
  });

  it("rejects a digit and a single letter", () => {
    assert.equal(parsePersonName("A"), null);
    assert.equal(parsePersonName("Ayşe2"), null);
  });

  it("accepts a Turkish or hyphenated name and rejects more than 40 letters", () => {
    assert.equal(parsePersonName("Çağrı"), "Çağrı");
    assert.equal(parsePersonName("Ayşe-Nur"), "Ayşe-Nur");
    assert.equal(parsePersonName("a".repeat(41)), null);
  });
});

describe("fullName", () => {
  it("returns the given name when the surname is missing", () => {
    assert.equal(fullName("Selin", null), "Selin");
    assert.equal(fullName("Selin", "Kara"), "Selin Kara");
  });
});
