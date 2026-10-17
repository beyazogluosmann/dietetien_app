import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/auth/session";
import { linkClass, ListStatus, Screen, SignOutButton } from "@/components/ui";
import { db } from "@/db";
import { client, clientAccount, dietList, dietitian } from "@/db/schema";

async function DietitianRoom() {
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

  const rows = await db
    .select({
      id: client.id,
      name: client.name,
      dietitianName: dietitian.name,
      status: dietList.status,
      inviteCode: client.inviteCode,
      accountId: clientAccount.id,
    })
    .from(client)
    .innerJoin(dietitian, eq(client.dietitianId, dietitian.id))
    .leftJoin(dietList, eq(dietList.clientId, client.id))
    .leftJoin(clientAccount, eq(clientAccount.clientId, client.id))
    .orderBy(client.name);

  return (
    <Screen
      actions={
        <div className="flex items-center gap-4">
          <p className="hidden text-sm text-[#6b6b66] sm:block">{person.name}</p>
          <SignOutButton />
        </div>
      }
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Danışanlar</h1>
        <p className="mt-1 text-sm text-[#6b6b66]">{rows.length} kayıt</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-[#e6e6e2] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#eee] bg-[#fafaf8] text-xs text-[#6b6b66]">
            <tr>
              <th className="px-4 py-3 font-medium">Danışan</th>
              <th className="px-4 py-3 font-medium">Sorumlu</th>
              <th className="px-4 py-3 font-medium">Liste</th>
              <th className="px-4 py-3 font-medium">Giriş</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#f0f0ec] last:border-0 hover:bg-[#fafaf8]">
                <td className="px-4 py-3.5">
                  <Link href={`/dietitian/clients/${row.id}`} className={linkClass}>
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-[#6b6b66]">{row.dietitianName}</td>
                <td className="px-4 py-3.5">
                  <ListStatus status={row.status} />
                </td>
                <td className="px-4 py-3.5 text-[#6b6b66]">
                  {row.accountId ? "Hesabı var" : row.inviteCode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Screen>
  );
}

export default function DietitianPage() {
  return (
    <Suspense>
      <DietitianRoom />
    </Suspense>
  );
}
