import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { signInAgainst, type SignInStore } from "./sign-in-core.ts";
import { hashPassword } from "./password.ts";

const now = new Date("2026-11-16T12:00:00Z");

function memoryStore(passwordHash: string): SignInStore {
  const attempts = new Map<string, { failures: number; lockedUntil: Date | null }>();

  return {
    async findDietitian(email) {
      if (email !== "emre@clinic.demo") {
        return null;
      }
      return { id: "emre", passwordHash };
    },
    async findClient(email) {
      if (email !== "ayse@clinic.demo") {
        return null;
      }
      return { clientId: "ayse", passwordHash };
    },
    async getAttempt(email) {
      return attempts.get(email) ?? null;
    },
    async recordFailure(email) {
      const current = attempts.get(email);
      const failures = (current?.failures ?? 0) + 1;
      attempts.set(email, { failures, lockedUntil: current?.lockedUntil ?? null });
      return { failures };
    },
    async lock(email, until) {
      attempts.set(email, { failures: 0, lockedUntil: until });
    },
    async clear(email) {
      attempts.delete(email);
    },
  };
}

describe("signInAgainst", () => {
  it("locks the email on the next try after five wrong passwords", async () => {
    const store = memoryStore(hashPassword("demo"));

    for (let attempt = 0; attempt < 5; attempt += 1) {
      assert.equal(await signInAgainst(store, "emre@clinic.demo", "wrong", now), null);
    }

    assert.equal(
      await signInAgainst(store, "emre@clinic.demo", "demo", new Date("2026-11-16T12:14:59Z")),
      "locked",
    );
  });

  it("accepts the right password once the 15 minutes are over", async () => {
    const store = memoryStore(hashPassword("demo"));

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await signInAgainst(store, "emre@clinic.demo", "wrong", now);
    }

    assert.deepEqual(
      await signInAgainst(store, "emre@clinic.demo", "demo", new Date("2026-11-16T12:15:00Z")),
      { role: "dietitian", dietitianId: "emre" },
    );
  });

  it("clears the counter when the password is right", async () => {
    const store = memoryStore(hashPassword("demo"));

    for (let attempt = 0; attempt < 4; attempt += 1) {
      await signInAgainst(store, "emre@clinic.demo", "wrong", now);
    }

    assert.deepEqual(await signInAgainst(store, "emre@clinic.demo", "demo", now), {
      role: "dietitian",
      dietitianId: "emre",
    });

    for (let attempt = 0; attempt < 4; attempt += 1) {
      assert.equal(await signInAgainst(store, "emre@clinic.demo", "wrong", now), null);
    }

    assert.deepEqual(await signInAgainst(store, "emre@clinic.demo", "demo", now), {
      role: "dietitian",
      dietitianId: "emre",
    });
  });

  it("counts Emre@ and emre@ as the same email", async () => {
    const store = memoryStore(hashPassword("demo"));

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await signInAgainst(store, "Emre@Clinic.demo", "wrong", now);
    }

    assert.equal(await signInAgainst(store, "emre@clinic.demo", "demo", now), "locked");
  });

  it("signs in a client with the right password", async () => {
    const store = memoryStore(hashPassword("demo"));

    assert.deepEqual(await signInAgainst(store, "ayse@clinic.demo", "demo", now), {
      role: "client",
      clientId: "ayse",
    });
  });
});
