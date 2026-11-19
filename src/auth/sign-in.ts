import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { clientAccount, dietitian, loginAttempt } from "@/db/schema";
import { signInAgainst, type SignInResult, type SignInStore } from "@/auth/sign-in-core";

export type { SignInResult };

const postgres: SignInStore = {
  async findDietitian(email) {
    const [row] = await db.select().from(dietitian).where(eq(dietitian.email, email));
    return row ? { id: row.id, passwordHash: row.passwordHash } : null;
  },
  async findClient(email) {
    const [row] = await db.select().from(clientAccount).where(eq(clientAccount.email, email));
    return row ? { clientId: row.clientId, passwordHash: row.passwordHash } : null;
  },
  async getAttempt(email) {
    const [row] = await db.select().from(loginAttempt).where(eq(loginAttempt.email, email));
    return row ? { failures: row.failures, lockedUntil: row.lockedUntil } : null;
  },
  async recordFailure(email) {
    const [row] = await db
      .insert(loginAttempt)
      .values({ email, failures: 1 })
      .onConflictDoUpdate({
        target: loginAttempt.email,
        set: { failures: sql`${loginAttempt.failures} + 1` },
      })
      .returning();
    return { failures: row.failures };
  },
  async lock(email, until) {
    await db
      .update(loginAttempt)
      .set({ failures: 0, lockedUntil: until })
      .where(eq(loginAttempt.email, email));
  },
  async clear(email) {
    await db.delete(loginAttempt).where(eq(loginAttempt.email, email));
  },
};

export async function signIn(email: string, password: string): Promise<SignInResult | "locked" | null> {
  return signInAgainst(postgres, email, password);
}
