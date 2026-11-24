"use server";

import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getSession } from "@/auth/session";
import { db } from "@/db";
import { dietList, waterLog } from "@/db/schema";
import { waterGoal, weekDays } from "@/diet-plan";

export async function saveWater(day: string, glasses: number) {
  const session = await getSession();
  if (!session || session.role !== "client") {
    redirect("/");
  }

  const knownDay = weekDays.some((item) => item.id === day);
  if (!knownDay || !Number.isInteger(glasses) || glasses < 0 || glasses > waterGoal) {
    return false;
  }

  const [list] = await db
    .select()
    .from(dietList)
    .where(and(eq(dietList.clientId, session.id), eq(dietList.status, "sent")))
    .orderBy(desc(dietList.updatedAt));
  if (!list) {
    return false;
  }

  const mine = and(eq(waterLog.listId, list.id), eq(waterLog.day, day));
  if (glasses === 0) {
    await db.delete(waterLog).where(mine);
  } else {
    await db
      .insert(waterLog)
      .values({
        clientId: session.id,
        listId: list.id,
        day,
        glasses,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [waterLog.listId, waterLog.day],
        set: { glasses, updatedAt: new Date() },
      });
  }

  return true;
}
