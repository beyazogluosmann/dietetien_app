import { eq, sql } from "drizzle-orm";
import { passwordMatches } from "@/auth/password";
import { db } from "@/db";
import { clientAccount, dietitian, loginAttempt } from "@/db/schema";

export type SignInResult =
  | { role: "dietitian"; dietitianId: string }
  | { role: "client"; clientId: string };

const maxFailures = 5;
const lockMinutes = 15;

async function findAccount(email: string, password: string): Promise<SignInResult | null> {
  const [foundDietitian] = await db
    .select()
    .from(dietitian)
    .where(eq(dietitian.email, email));

  if (foundDietitian) {
    if (!passwordMatches(password, foundDietitian.passwordHash)) {
      return null;
    }
    return { role: "dietitian", dietitianId: foundDietitian.id };
  }

  const [foundAccount] = await db
    .select()
    .from(clientAccount)
    .where(eq(clientAccount.email, email));

  if (!foundAccount) {
    return null;
  }

  if (!passwordMatches(password, foundAccount.passwordHash)) {
    return null;
  }

  return { role: "client", clientId: foundAccount.clientId };
}

async function isLocked(key: string) {
  const [attempt] = await db.select().from(loginAttempt).where(eq(loginAttempt.email, key));
  return Boolean(attempt?.lockedUntil && attempt.lockedUntil > new Date());
}

async function recordFailure(key: string) {
  const [attempt] = await db
    .insert(loginAttempt)
    .values({ email: key, failures: 1 })
    .onConflictDoUpdate({
      target: loginAttempt.email,
      set: { failures: sql`${loginAttempt.failures} + 1` },
    })
    .returning();

  if (attempt.failures >= maxFailures) {
    await db
      .update(loginAttempt)
      .set({ failures: 0, lockedUntil: new Date(Date.now() + lockMinutes * 60 * 1000) })
      .where(eq(loginAttempt.email, key));
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult | "locked" | null> {
  const cleanedEmail = email.trim();
  if (!cleanedEmail || !password) {
    return null;
  }

  const key = cleanedEmail.toLowerCase();
  if (await isLocked(key)) {
    return "locked";
  }

  const result = await findAccount(cleanedEmail, password);
  if (!result) {
    await recordFailure(key);
    return null;
  }

  await db.delete(loginAttempt).where(eq(loginAttempt.email, key));
  return result;
}
