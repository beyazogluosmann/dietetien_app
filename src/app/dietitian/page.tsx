import { Suspense } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { signOut } from "@/auth/sign-out";
import { getSession } from "@/auth/session";
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
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Danışanlar</h1>
          <p>{person.name}</p>
        </div>
        <form action={signOut}>
          <button type="submit" className="rounded border px-3 py-2">
            Çıkış yap
          </button>
        </form>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2 font-medium">Danışan</th>
            <th className="py-2 font-medium">Sorumlu</th>
            <th className="py-2 font-medium">Liste</th>
            <th className="py-2 font-medium">Giriş</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b">
              <td className="py-2">{row.name}</td>
              <td className="py-2">{row.dietitianName}</td>
              <td className="py-2">
                {row.status === "sent"
                  ? "Gönderildi"
                  : row.status === "draft"
                    ? "Taslak"
                    : "Liste yok"}
              </td>
              <td className="py-2">{row.accountId ? "Hesabı var" : row.inviteCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default function DietitianPage() {
  return (
    <Suspense>
      <DietitianRoom />
    </Suspense>
  );
}
