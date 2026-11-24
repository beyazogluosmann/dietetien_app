import { Suspense } from "react";
import { redirect } from "next/navigation";
import { and, asc, desc, eq } from "drizzle-orm";
import { getSession } from "@/auth/session";
import { ClientProfile } from "@/components/client-profile";
import { DietView } from "@/components/diet-view";
import { AccountMenu, cardClass, fieldClass, mutedClass, primaryButtonClass, Screen } from "@/components/ui";
import { db } from "@/db";
import { anamnesis, client, clientRequest, dietList, dietitian, mealNote, waterLog } from "@/db/schema";
import { withNotice } from "@/notice";
import { fullName } from "@/person";

async function requestAgain(formData: FormData) {
  "use server";

  const session = await getSession();
  if (!session || session.role !== "client") {
    redirect("/");
  }

  const dietitianId = String(formData.get("dietitianId") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  if (!dietitianId) {
    redirect("/client");
  }

  const [chosen] = await db.select().from(dietitian).where(eq(dietitian.id, dietitianId));
  if (!chosen) {
    redirect("/client");
  }

  await db
    .update(client)
    .set({ dietitianId: chosen.id })
    .where(eq(client.id, session.id));

  await db
    .update(clientRequest)
    .set({ dietitianId: chosen.id, message, status: "pending" })
    .where(and(eq(clientRequest.clientId, session.id), eq(clientRequest.status, "rejected")));

  redirect(withNotice("/client", "request-sent"));
}

async function ClientRoom({ searchParams }: { searchParams: Promise<{ day?: string }> }) {
  const { day } = await searchParams;
  const session = await getSession();
  if (!session || session.role !== "client") {
    redirect("/");
  }

  const [person] = await db
    .select()
    .from(client)
    .where(eq(client.id, session.id));

  if (!person) {
    redirect("/");
  }

  const historyQuery = db.select().from(anamnesis).where(eq(anamnesis.clientId, person.id));
  const listQuery = db
    .select({
      id: dietList.id,
      body: dietList.body,
      status: dietList.status,
      authorName: dietitian.name,
    })
    .from(dietList)
    .leftJoin(dietitian, eq(dietList.authorId, dietitian.id))
    .where(and(eq(dietList.clientId, person.id), eq(dietList.status, "sent")))
    .orderBy(desc(dietList.updatedAt));
  const dietitianQuery = db.select().from(dietitian).where(eq(dietitian.id, person.dietitianId));
  const requestQuery = db.select().from(clientRequest).where(eq(clientRequest.clientId, person.id));
  const [[history], [list], [chosen], [request]] = await Promise.all([
    historyQuery,
    listQuery,
    dietitianQuery,
    requestQuery,
  ]);
  if (!history) {
    redirect("/anamnesis");
  }

  const visibleList = list?.status === "sent" ? list : null;
  const notesQuery = visibleList
    ? db.select().from(mealNote).where(eq(mealNote.listId, visibleList.id))
    : Promise.resolve([]);
  const waterQuery = visibleList
    ? db.select().from(waterLog).where(eq(waterLog.listId, visibleList.id))
    : Promise.resolve([]);
  const dietitiansQuery =
    request?.status === "rejected"
      ? db.select().from(dietitian).orderBy(asc(dietitian.name))
      : Promise.resolve([]);
  const [noteRows, waterRows, dietitians] = await Promise.all([notesQuery, waterQuery, dietitiansQuery]);
  const notes = Object.fromEntries(noteRows.map((note) => [`${note.day}:${note.meal}`, note.body]));
  const water = Object.fromEntries(waterRows.map((row) => [row.day, row.glasses]));

  return (
    <Screen
      width="max-w-3xl"
      actions={
        <AccountMenu name={fullName(person.name, person.surname)} />
      }
    >
      <ClientProfile name={fullName(person.name, person.surname)} phone={person.phone} history={history} />
      <h2 className="mt-10 mb-4 text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">
        DİYET LİSTESİ
      </h2>
      {visibleList ? (
        <DietView
          body={visibleList.body}
          authorName={visibleList.authorName}
          notes={notes}
          water={water}
          editable
          initialDay={day}
        />
      ) : request?.status === "rejected" ? (
        <div className={`${cardClass} px-5 py-6 sm:px-8 sm:py-8`}>
          <p className={mutedClass}>
            {chosen?.name ?? "Diyetisyenin"} talebi kabul etmedi. Başka bir diyetisyen seçebilirsin.
          </p>
          <form action={requestAgain} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Diyetisyen
              <select name="dietitianId" className={fieldClass} defaultValue="">
                <option value="" disabled>
                  Seç
                </option>
                {dietitians.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Mesaj
              <textarea name="message" rows={3} className={fieldClass} />
            </label>
            <button type="submit" className={`${primaryButtonClass} justify-center`}>
              Talep gönder
            </button>
          </form>
        </div>
      ) : (
        <p className={`${cardClass} px-5 py-6 sm:px-8 sm:py-8 ${mutedClass}`}>
          {request?.status === "pending"
            ? `${chosen?.name ?? "Diyetisyenin"} talebini aldı. Listeyi yazınca burada görünür.`
            : "Yayınlanmış bir listen yok. Diyetisyenin yayınlayınca burada görünür."}
        </p>
      )}
    </Screen>
  );
}

export default function ClientPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  return (
    <Suspense>
      <ClientRoom searchParams={searchParams} />
    </Suspense>
  );
}
