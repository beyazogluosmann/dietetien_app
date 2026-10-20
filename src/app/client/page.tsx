import { Suspense } from "react";
import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { getSession } from "@/auth/session";
import { AccountMenu, fieldClass, primaryButtonClass, Screen } from "@/components/ui";
import { db } from "@/db";
import { client, clientRequest, dietList, dietitian } from "@/db/schema";

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

  redirect("/client");
}

async function ClientRoom() {
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

  const [list] = await db
    .select({
      body: dietList.body,
      status: dietList.status,
      authorName: dietitian.name,
    })
    .from(dietList)
    .leftJoin(dietitian, eq(dietList.authorId, dietitian.id))
    .where(eq(dietList.clientId, person.id));

  const [chosen] = await db
    .select()
    .from(dietitian)
    .where(eq(dietitian.id, person.dietitianId));

  const [request] = await db
    .select()
    .from(clientRequest)
    .where(eq(clientRequest.clientId, person.id));

  const dietitians =
    request?.status === "rejected"
      ? await db.select().from(dietitian).orderBy(asc(dietitian.name))
      : [];

  const visibleList = list?.status === "sent" ? list : null;

  return (
    <Screen
      width="max-w-2xl"
      actions={
        <AccountMenu name={person.name} />
      }
    >
      <div className="mb-8">
        <p className="text-sm text-[#6b6b66]">Diyet listesi</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{person.name}</h1>
      </div>
      {visibleList ? (
        <article className="rounded-lg border border-[#e6e6e2] bg-white px-8 py-8 shadow-[0_1px_2px_rgba(28,28,26,0.04)]">
          <p className="mb-6 text-sm text-[#6b6b66]">{visibleList.authorName} hazırladı</p>
          <p className="whitespace-pre-wrap text-[15px] leading-8">{visibleList.body}</p>
        </article>
      ) : request?.status === "rejected" ? (
        <div className="rounded-lg border border-[#e6e6e2] bg-white px-8 py-8">
          <p className="text-sm text-[#6b6b66]">
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
        <p className="rounded-lg border border-[#e6e6e2] bg-white px-8 py-8 text-sm text-[#6b6b66]">
          {request?.status === "pending"
            ? `${chosen?.name ?? "Diyetisyenin"} talebini aldı. Listeyi yazınca burada görünür.`
            : "Yayınlanmış bir listen yok. Diyetisyenin yayınlayınca burada görünür."}
        </p>
      )}
    </Screen>
  );
}

export default function ClientPage() {
  return (
    <Suspense>
      <ClientRoom />
    </Suspense>
  );
}
