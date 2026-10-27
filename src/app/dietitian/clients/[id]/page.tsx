import { Suspense } from "react";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/auth/session";
import {
  AccountMenu,
  BackLink,
  buttonClass,
  ListStatus,
  primaryButtonClass,
  Screen,
} from "@/components/ui";
import { db } from "@/db";
import {
  activityOptions,
  bodyMassIndex,
  bodyMassLabel,
  goalOptions,
  optionLabel,
  sexOptions,
} from "@/anamnesis";
import { anamnesis, client, clientAccount, clientRequest, dietList, dietitian } from "@/db/schema";

async function saveList(formData: FormData) {
  "use server";

  const session = await getSession();
  if (!session || session.role !== "dietitian") {
    redirect("/");
  }

  const clientId = String(formData.get("clientId") ?? "");
  const body = String(formData.get("body") ?? "");
  const intent = String(formData.get("intent") ?? "");

  const [card] = await db.select().from(client).where(eq(client.id, clientId));
  const [request] = await db
    .select()
    .from(clientRequest)
    .where(eq(clientRequest.clientId, clientId));
  if (!card || card.dietitianId !== session.id || request?.status === "rejected") {
    redirect("/dietitian");
  }

  const [list] = await db
    .select()
    .from(dietList)
    .where(eq(dietList.clientId, clientId));

  if (!list) {
    await db.insert(dietList).values({
      clientId,
      authorId: session.id,
      body,
      status: intent === "sent" ? "sent" : "draft",
      updatedAt: new Date(),
    });
    await db
      .update(clientRequest)
      .set({ status: "accepted" })
      .where(
        and(eq(clientRequest.clientId, clientId), eq(clientRequest.dietitianId, session.id)),
      );
    redirect(`/dietitian/clients/${clientId}`);
  }

  if (list.authorId !== session.id) {
    redirect(`/dietitian/clients/${clientId}`);
  }

  await db
    .update(dietList)
    .set({
      body,
      status: intent === "sent" ? "sent" : list.status,
      updatedAt: new Date(),
    })
    .where(eq(dietList.id, list.id));

  await db
    .update(clientRequest)
    .set({ status: "accepted" })
    .where(and(eq(clientRequest.clientId, clientId), eq(clientRequest.dietitianId, session.id)));

  redirect(`/dietitian/clients/${clientId}`);
}

async function rejectRequest(formData: FormData) {
  "use server";

  const session = await getSession();
  if (!session || session.role !== "dietitian") {
    redirect("/");
  }

  const clientId = String(formData.get("clientId") ?? "");
  await db
    .update(clientRequest)
    .set({ status: "rejected" })
    .where(
      and(
        eq(clientRequest.clientId, clientId),
        eq(clientRequest.dietitianId, session.id),
        eq(clientRequest.status, "pending"),
      ),
    );

  redirect("/dietitian");
}

async function DietListPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "dietitian") {
    redirect("/");
  }

  const { id } = await params;
  const [card] = await db.select().from(client).where(eq(client.id, id));
  const [account] = await db.select().from(clientAccount).where(eq(clientAccount.clientId, id));
  const [list] = await db.select().from(dietList).where(eq(dietList.clientId, id));
  const [request] = await db
    .select()
    .from(clientRequest)
    .where(eq(clientRequest.clientId, id));
  const [history] = await db.select().from(anamnesis).where(eq(anamnesis.clientId, id));
  const index = history ? bodyMassIndex(history.heightCm, history.weightKg) : null;

  if (!card || card.dietitianId !== session.id || request?.status === "rejected") {
    redirect("/dietitian");
  }

  const [me] = await db.select().from(dietitian).where(eq(dietitian.id, session.id));
  const [author] = list
    ? await db.select().from(dietitian).where(eq(dietitian.id, list.authorId))
    : [];

  const canEdit = !list || list.authorId === session.id;

  return (
    <Screen
      width="max-w-2xl"
      actions={
        <AccountMenu name={me?.name ?? "Hesap"} />
      }
    >
      <BackLink href="/dietitian">Danışanlar</BackLink>
      <div className="mt-6 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">{card.name}</h1>
          {list ? <ListStatus status={list.status} /> : <ListStatus status={null} />}
        </div>
        <p className="mt-3 text-sm text-[#6d6a62]">Telefon numarası: {card.phone}</p>
        <p className="mt-1 text-sm text-[#6d6a62]">E-posta: {account?.email ?? "Hesabı yok"}</p>
      </div>
      <section className="mb-6 rounded-2xl border border-[#e6e1d6] bg-white px-6 py-5 shadow-[0_16px_40px_rgba(31,77,58,0.06)]">
        <h2 className="text-sm font-medium">Anamnez</h2>
        {history ? (
          <dl className="mt-4 grid gap-3 text-sm text-[#6d6a62] sm:grid-cols-2">
            <div>Yaş: {history.age}</div>
            <div>Cinsiyet: {optionLabel(sexOptions, history.sex)}</div>
            <div>Boy: {history.heightCm} cm</div>
            <div>Kilo: {history.weightKg} kg</div>
            <div>
              Beden kitle indeksi: {index} · {index !== null ? bodyMassLabel(index) : ""}
            </div>
            <div>Hedef: {optionLabel(goalOptions, history.goal)}</div>
            <div>Hareket: {optionLabel(activityOptions, history.activity)}</div>
            <div>Hastalık: {history.conditions || "Yok"}</div>
            <div>Alerji: {history.allergies || "Yok"}</div>
            <div>İlaç: {history.medications || "Yok"}</div>
            <div>Not: {history.notes || "Yok"}</div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-[#6d6a62]">Anamnez yok.</p>
        )}
      </section>
      <p className="mb-6 text-sm text-[#6d6a62]">
        {list
          ? `${author?.name} yazdı. ${canEdit ? "Düzenleyebilirsin." : "Okuyorsun."}`
          : "Liste yok. Yazınca senin adın yazar."}
      </p>
      {request?.status === "pending" ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eadfc4] bg-[#fbf8f1] px-5 py-4">
          <p className="text-sm">Talep: {request.message || "Liste istiyor."}</p>
          {request.dietitianId === session.id ? (
            <form action={rejectRequest}>
              <input type="hidden" name="clientId" value={card.id} />
              <button type="submit" className={buttonClass}>
                Reddet
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
      {canEdit ? (
        <form
          action={saveList}
          className="overflow-hidden rounded-2xl border border-[#e6e1d6] bg-white shadow-[0_16px_40px_rgba(31,77,58,0.06)]"
        >
          <input type="hidden" name="clientId" value={card.id} />
          <textarea
            name="body"
            defaultValue={list?.body ?? ""}
            rows={12}
            className="w-full resize-y px-8 py-8 text-[15px] leading-8 outline-none"
          />
          <div className="flex flex-wrap justify-end gap-2 border-t border-[#eee] bg-[#fafaf8] px-4 py-3">
            <button type="submit" name="intent" value="draft" className={buttonClass}>
              Taslağı kaydet
            </button>
            <button type="submit" name="intent" value="sent" className={primaryButtonClass}>
              Danışana gönder
            </button>
          </div>
        </form>
      ) : (
        <article className="rounded-2xl border border-[#e6e1d6] bg-white px-8 py-8 shadow-[0_16px_40px_rgba(31,77,58,0.06)]">
          <p className="whitespace-pre-wrap text-[15px] leading-8">{list?.body}</p>
        </article>
      )}
    </Screen>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <DietListPage params={params} />
    </Suspense>
  );
}
