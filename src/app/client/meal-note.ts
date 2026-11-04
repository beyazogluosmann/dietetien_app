"use server";

import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getSession } from "@/auth/session";
import { db } from "@/db";
import { dietList, mealNote } from "@/db/schema";
import { meals, weekDays } from "@/diet-plan";

const noteLimit = 400;

export async function saveMealNote(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "client") {
    redirect("/");
  }

  const day = String(formData.get("day") ?? "");
  const meal = String(formData.get("meal") ?? "");
  const body = String(formData.get("note") ?? "").trim();
  const knownDay = weekDays.some((item) => item.id === day);
  const knownMeal = meals.some((item) => item.id === meal);
  if (!knownDay || !knownMeal || body.length > noteLimit) {
    redirect("/client");
  }

  const [list] = await db
    .select()
    .from(dietList)
    .where(and(eq(dietList.clientId, session.id), eq(dietList.status, "sent")))
    .orderBy(desc(dietList.updatedAt));
  if (!list) {
    redirect("/client");
  }

  const mine = and(eq(mealNote.listId, list.id), eq(mealNote.day, day), eq(mealNote.meal, meal));
  if (!body) {
    await db.delete(mealNote).where(mine);
    redirect("/client");
  }

  await db
    .insert(mealNote)
    .values({
      clientId: session.id,
      listId: list.id,
      day,
      meal,
      body,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [mealNote.listId, mealNote.day, mealNote.meal],
      set: { body, updatedAt: new Date() },
    });

  redirect("/client");
}
