import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashPassword, passwordMatches,passwordLongEnough } from "./password.ts";

describe("passwordMatches", () => {
  it("accepts the right password", () => {
    const stored = hashPassword("demo");
    assert.equal(passwordMatches("demo", stored), true);
  });

  it("rejects the wrong password", () => {
    const stored = hashPassword("demo");
    assert.equal(passwordMatches("wrong", stored), false);
  });

  it("produces a different hash every time", () => {
    assert.notEqual(hashPassword("demo"), hashPassword("demo"));
  });

  it("rejects a malformed record", () => {
    assert.equal(passwordMatches("demo", "plain-text"), false);
  });

  it("rejects a record with a missing part or an unknown method", () => {
    assert.equal(passwordMatches("demo", "scrypt:"), false);
    assert.equal(passwordMatches("demo", "sha256:salt:hash"), false);
  });

  describe("passwordLongEnough", () => {
    it("rejects a short password", () => {
      assert.equal(passwordLongEnough("1"), false);
    });
  
    it("accepts eight characters", () => {
      assert.equal(passwordLongEnough("12345678"), true);
    });
  });
});
