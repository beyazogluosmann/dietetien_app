import { Suspense } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { signOut } from "@/auth/sign-out";
import { getSession } from "@/auth/session";
import { db } from "@/db";
import { dietitian } from "@/db/schema";

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

  return (
    <main className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold">Diyetisyen odası</h1>
      <p>{person.name}</p>
      <form action={signOut}>
        <button type="submit" className="rounded border px-3 py-2">
          Çıkış yap
        </button>
      </form>
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
