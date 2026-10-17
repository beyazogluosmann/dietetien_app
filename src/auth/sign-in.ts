import { scryptSync, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { clientAccount, dietitian } from "@/db/schema";

export type SignInResult =
  | { role: "dietitian"; dietitianId: string }
  | { role: "client"; clientId: string };

function passwordMatches(password: string, stored: string) {
  const [method, salt, hash] = stored.split(":");
  if (method !== "scrypt" || !salt || !hash) {
    return false;
  }

  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult | null> {
  const cleanedEmail = email.trim();
  if (!cleanedEmail || !password) {
    return null;
  }

  const [foundDietitian] = await db
    .select()
    .from(dietitian)
    .where(eq(dietitian.email, cleanedEmail));

  if (foundDietitian) {
    if (!passwordMatches(password, foundDietitian.passwordHash)) {
      return null;
    }
    return { role: "dietitian", dietitianId: foundDietitian.id };
  }

  const [foundAccount] = await db
    .select()
    .from(clientAccount)
    .where(eq(clientAccount.email, cleanedEmail));

  if (!foundAccount) {
    return null;
  }

  if (!passwordMatches(password, foundAccount.passwordHash)) {
    return null;
  }

  return { role: "client", clientId: foundAccount.clientId };
}