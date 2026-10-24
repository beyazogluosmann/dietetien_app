import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { and, eq, ilike } from "drizzle-orm";
import { getSession } from "@/auth/session";
import { ClientSearch } from "@/components/client-search";
import { AccountMenu, linkClass, ListStatus, Screen } from "@/components/ui";
import { db } from "@/db";
import { client, clientAccount, clientRequest, dietList, dietitian } from "@/db/schema";

function requestLabel(status: string | null) {
  if (status === "pending") return "Bekliyor";
  if (status === "accepted") return "Kabul edildi";
  if (status === "rejected") return "Reddedildi";
  return "Talep yok";
}

async function DietitianRoom({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const session = await getSession();
  if (!session || session.role !== "dietitian") {
    redirect("/");
  }

  const [person] = await db
    .select()
    .from(dietitian)
    .where(eq(dietitian.id, session.id));

  if (!person) {
    redirect("/");
  }

  const requests = await db
    .select({
      id: clientRequest.id,
      clientId: client.id,
      clientName: client.name,
      message: clientRequest.message,
    })
    .from(clientRequest)
    .innerJoin(client, eq(clientRequest.clientId, client.id))
    .where(and(eq(clientRequest.dietitianId, person.id), eq(clientRequest.status, "pending")));

  const pattern = `%${query.replace(/[%_\\]/g, "\\$&")}%`;
  const clients = db
    .select({
      id: client.id,
      name: client.name,
      dietitianName: dietitian.name,
      status: dietList.status,
      accountId: clientAccount.id,
      requestStatus: clientRequest.status,
    })
    .from(client)
    .innerJoin(dietitian, eq(client.dietitianId, dietitian.id))
    .leftJoin(dietList, eq(dietList.clientId, client.id))
    .leftJoin(clientAccount, eq(clientAccount.clientId, client.id))
    .leftJoin(clientRequest, eq(clientRequest.clientId, client.id));
  const rows = await (query ? clients.where(ilike(client.name, pattern)) : clients).orderBy(
    client.name,
  );

  return (
    <Screen
      actions={
        <AccountMenu name={person.name} />
      }
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Danışanlar</h1>
        <p className="mt-1 text-sm text-[#6b6b66]">{rows.length} kayıt</p>
        <ClientSearch query={query} />
      </div>
      {requests.length > 0 ? (
        <section className="mb-6 rounded-lg border border-[#eadfc4] bg-[#fbf8f1] p-4">
          <h2 className="text-sm font-medium">Talepler</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {requests.map((request) => (
              <li key={request.id}>
                <Link href={`/dietitian/clients/${request.clientId}`} className={linkClass}>
                  {request.clientName}
                </Link>
                <p className="mt-1 text-sm text-[#6b6b66]">
                  {request.message || "Liste istiyor."}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="overflow-hidden rounded-lg border border-[#e6e6e2] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#eee] bg-[#fafaf8] text-xs text-[#6b6b66]">
            <tr>
              <th className="px-4 py-3 font-medium">Danışan</th>
              <th className="px-4 py-3 font-medium">Talep</th>
              <th className="px-4 py-3 font-medium">Sorumlu</th>
              <th className="px-4 py-3 font-medium">Liste</th>
              <th className="px-4 py-3 font-medium">Giriş</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-sm text-[#6b6b66]">
                  Bu ada uyan danışan yok.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#f0f0ec] last:border-0 hover:bg-[#fafaf8]">
                <td className="px-4 py-3.5">
                  <Link href={`/dietitian/clients/${row.id}`} className={linkClass}>
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-[#6b6b66]">{requestLabel(row.requestStatus)}</td>
                <td className="px-4 py-3.5 text-[#6b6b66]">{row.dietitianName}</td>
                <td className="px-4 py-3.5">
                  <ListStatus status={row.status} />
                </td>
                <td className="px-4 py-3.5 text-[#6b6b66]">
                  {row.accountId ? "Hesabı var" : "Hesabı yok"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Screen>
  );
}

export default function DietitianPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense>
      <DietitianRoom searchParams={searchParams} />
    </Suspense>
  );
}
