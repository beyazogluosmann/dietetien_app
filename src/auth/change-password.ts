"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { hashPassword, passwordMatches } from "@/auth/password";
import { getSession } from "@/auth/session";
import { db } from "@/db";
import { clientAccount, dietitian } from "@/db/schema";

export async function changePassword(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const again = String(formData.get("again") ?? "");

  if (!current || !next || !again) {
    redirect("/account?password=missing");
  }

  if (next !== again) {
    redirect("/account?password=match");
  }

  if (session.role === "dietitian") {
    const [person] = await db.select().from(dietitian).where(eq(dietitian.id, session.id));
    if (!person || !passwordMatches(current, person.passwordHash)) {
      redirect("/account?password=wrong");
    }

    await db
      .update(dietitian)
      .set({ passwordHash: hashPassword(next) })
      .where(eq(dietitian.id, session.id));
    redirect("/account?password=saved");
  }

  const [account] = await db
    .select()
    .from(clientAccount)
    .where(eq(clientAccount.clientId, session.id));

  if (!account || !passwordMatches(current, account.passwordHash)) {
    redirect("/account?password=wrong");
  }

  await db
    .update(clientAccount)
    .set({ passwordHash: hashPassword(next) })
    .where(eq(clientAccount.clientId, session.id));

  redirect("/account?password=saved");
}
