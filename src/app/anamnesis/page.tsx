import { Suspense } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/auth/session";
import {
  activityOptions,
  choiceValue,
  goalOptions,
  parseAge,
  parseHeightCm,
  parseWeightKg,
  sexOptions,
} from "@/anamnesis";
import { AccountMenu, fieldClass, primaryButtonClass, Screen } from "@/components/ui";
import { db } from "@/db";
import { anamnesis, client } from "@/db/schema";

async function saveAnamnesis(formData: FormData) {
  "use server";

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

  const age = parseAge(String(formData.get("age") ?? ""));
  const heightCm = parseHeightCm(String(formData.get("heightCm") ?? ""));
  const weightKg = parseWeightKg(String(formData.get("weightKg") ?? ""));
  const sex = choiceValue(sexOptions, String(formData.get("sex") ?? ""));
  const goal = choiceValue(goalOptions, String(formData.get("goal") ?? ""));
  const activity = choiceValue(activityOptions, String(formData.get("activity") ?? ""));
  const conditions = String(formData.get("conditions") ?? "").trim();
  const allergies = String(formData.get("allergies") ?? "").trim();
  const medications = String(formData.get("medications") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!sex || !goal || !activity) {
    redirect("/anamnesis?error=choice");
  }
  if (age === null) {
    redirect("/anamnesis?error=age");
  }
  if (heightCm === null) {
    redirect("/anamnesis?error=height");
  }
  if (weightKg === null) {
    redirect("/anamnesis?error=weight");
  }

  await db.insert(anamnesis).values({
    clientId: session.id,
    age: String(age),
    sex,
    heightCm: String(heightCm),
    weightKg: String(weightKg),
    goal,
    conditions,
    allergies,
    medications,
    activity,
    notes,
  });

  redirect("/client");
}

function AnamnesisForm({ error }: { error?: string }) {
  return (
    <form action={saveAnamnesis} className="mt-8 flex flex-col gap-4">
      {error ? (
        <p className="rounded-lg bg-[#fde8e4] px-3 py-2 text-sm text-[#8a2e22]">
          {error === "age"
            ? "Yaş 12 ile 100 arasında olmalı. Doğum yılı da yazabilirsin."
            : error === "height"
              ? "Boy 170 ya da 1,70 şeklinde olmalı."
              : error === "weight"
                ? "Kilo 70 ya da 70,5 şeklinde olmalı."
                : "Cinsiyet, hedef ve hareket seçilmeli."}
        </p>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        Yaş
        <input name="age" inputMode="numeric" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Cinsiyet
        <select name="sex" className={fieldClass} defaultValue="">
          <option value="" disabled>
            Seç
          </option>
          {sexOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Boy (cm)
        <input name="heightCm" inputMode="numeric" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Kilo (kg)
        <input name="weightKg" inputMode="numeric" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Hedef
        <select name="goal" className={fieldClass} defaultValue="">
          <option value="" disabled>
            Seç
          </option>
          {goalOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Hareket
        <select name="activity" className={fieldClass} defaultValue="">
          <option value="" disabled>
            Seç
          </option>
          {activityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Hastalık
        <input name="conditions" className={fieldClass} placeholder="Yoksa boş bırak" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Alerji
        <input name="allergies" className={fieldClass} placeholder="Yoksa boş bırak" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        İlaç
        <input name="medications" className={fieldClass} placeholder="Yoksa boş bırak" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Not
        <textarea name="notes" rows={3} className={fieldClass} />
      </label>
      <button type="submit" className={`${primaryButtonClass} justify-center`}>
        Kaydet
      </button>
    </form>
  );
}

async function AnamnesisRoom({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "client") {
    redirect("/");
  }

  const [person] = await db.select().from(client).where(eq(client.id, session.id));
  if (!person) {
    redirect("/");
  }

  const [existing] = await db
    .select()
    .from(anamnesis)
    .where(eq(anamnesis.clientId, person.id));
  if (existing) {
    redirect("/client");
  }

  const { error } = await searchParams;

  return (
    <Screen
      width="max-w-md"
      actions={<AccountMenu name={person.name} />}
    >
      <div className="rounded-lg border border-[#e6e6e2] bg-white px-8 py-8 shadow-[0_1px_2px_rgba(28,28,26,0.04)]">
        <h1 className="text-3xl font-semibold tracking-tight">Anamnez</h1>
        <p className="mt-2 text-sm text-[#6b6b66]">
          Diyetisyenin listeyi yazmadan önce bunları okur. Bir kez doldurulur.
        </p>
        <AnamnesisForm error={error} />
      </div>
    </Screen>
  );
}

export default function AnamnesisPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense>
      <AnamnesisRoom searchParams={searchParams} />
    </Suspense>
  );
}
