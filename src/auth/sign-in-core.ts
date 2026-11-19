import { passwordMatches } from "./password.ts";

export type SignInResult =
  | { role: "dietitian"; dietitianId: string }
  | { role: "client"; clientId: string };

const maxFailures = 5;
const lockMinutes = 15;

export type SignInStore = {
  findDietitian(email: string): Promise<{ id: string; passwordHash: string } | null>;
  findClient(email: string): Promise<{ clientId: string; passwordHash: string } | null>;
  getAttempt(email: string): Promise<{ failures: number; lockedUntil: Date | null } | null>;
  recordFailure(email: string): Promise<{ failures: number }>;
  lock(email: string, until: Date): Promise<void>;
  clear(email: string): Promise<void>;
};

export async function signInAgainst(
  store: SignInStore,
  email: string,
  password: string,
  now = new Date(),
): Promise<SignInResult | "locked" | null> {
  const cleanedEmail = email.trim();
  if (!cleanedEmail || !password) {
    return null;
  }

  const key = cleanedEmail.toLowerCase();
  const attempt = await store.getAttempt(key);
  if (attempt?.lockedUntil && attempt.lockedUntil > now) {
    return "locked";
  }

  const foundDietitian = await store.findDietitian(cleanedEmail);
  if (foundDietitian) {
    if (!passwordMatches(password, foundDietitian.passwordHash)) {
      await recordFailure(store, key, now);
      return null;
    }
    await store.clear(key);
    return { role: "dietitian", dietitianId: foundDietitian.id };
  }

  const foundClient = await store.findClient(cleanedEmail);
  if (!foundClient || !passwordMatches(password, foundClient.passwordHash)) {
    await recordFailure(store, key, now);
    return null;
  }

  await store.clear(key);
  return { role: "client", clientId: foundClient.clientId };
}

async function recordFailure(store: SignInStore, key: string, now: Date) {
  const saved = await store.recordFailure(key);
  if (saved.failures >= maxFailures) {
    await store.lock(key, new Date(now.getTime() + lockMinutes * 60 * 1000));
  }
}
