import { Suspense } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/auth/session";
import { AccountMenu, cardClass, mutedClass, Screen } from "@/components/ui";
import { db } from "@/db";
import { anamnesis, client } from "@/db/schema";
import { AnamnesisForm } from "./form";

async function AnamnesisRoom() {
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

  return (
    <Screen
      width="max-w-md"
      actions={<AccountMenu name={person.name} />}
    >
      <div className={`${cardClass} px-8 py-10`}>
        <p className="text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">KLİNİK</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Anamnez</h1>
        <p className={`${mutedClass} mt-2`}>
          Diyetisyenin listeyi yazmadan önce bunları okur. Bir kez doldurulur.
        </p>
        <AnamnesisForm />
      </div>
    </Screen>
  );
}

export default function AnamnesisPage() {
  return (
    <Suspense>
      <AnamnesisRoom />
    </Suspense>
  );
}
