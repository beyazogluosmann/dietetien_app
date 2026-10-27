"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/auth/session";
import {
  activityOptions,
  type AnamnesisFormState,
  choiceValue,
  goalOptions,
  parseAge,
  parseHeightCm,
  parseWeightKg,
  sexOptions,
} from "@/anamnesis";
import { db } from "@/db";
import { anamnesis } from "@/db/schema";

export async function saveAnamnesis(
  _previous: AnamnesisFormState,
  formData: FormData,
): Promise<AnamnesisFormState> {
  const session = await getSession();
  if (!session || session.role !== "client") {
    redirect("/");
  }

  const [existing] = await db
    .select()
    .from(anamnesis)
    .where(eq(anamnesis.clientId, session.id));
  if (existing) {
    redirect("/client");
  }

  const values = {
    age: String(formData.get("age") ?? ""),
    sex: String(formData.get("sex") ?? ""),
    height: String(formData.get("heightCm") ?? ""),
    weight: String(formData.get("weightKg") ?? ""),
    goal: String(formData.get("goal") ?? ""),
    activity: String(formData.get("activity") ?? ""),
    conditions: String(formData.get("conditions") ?? ""),
    allergies: String(formData.get("allergies") ?? ""),
    medications: String(formData.get("medications") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const age = parseAge(values.age);
  const heightCm = parseHeightCm(values.height);
  const weightKg = parseWeightKg(values.weight);
  const sex = choiceValue(sexOptions, values.sex);
  const goal = choiceValue(goalOptions, values.goal);
  const activity = choiceValue(activityOptions, values.activity);

  const errors: AnamnesisFormState["errors"] = {};
  if (age === null) {
    errors.age = "Yaş 12 ile 100 arasında olmalı. Doğum yılı da yazabilirsin.";
  }
  if (!sex) {
    errors.sex = "Cinsiyet seçilmeli.";
  }
  if (heightCm === null) {
    errors.height = "Boy 170 ya da 1,70 şeklinde olmalı.";
  }
  if (weightKg === null) {
    errors.weight = "Kilo 70 ya da 70,5 şeklinde olmalı.";
  }
  if (!goal) {
    errors.goal = "Hedef seçilmeli.";
  }
  if (!activity) {
    errors.activity = "Hareket seçilmeli.";
  }

  if (age === null || heightCm === null || weightKg === null || !sex || !goal || !activity) {
    return { errors, values };
  }

  await db.insert(anamnesis).values({
    clientId: session.id,
    age: String(age),
    sex,
    heightCm: String(heightCm),
    weightKg: String(weightKg),
    goal,
    conditions: values.conditions.trim(),
    allergies: values.allergies.trim(),
    medications: values.medications.trim(),
    activity,
    notes: values.notes.trim(),
  });

  redirect("/client");
}
