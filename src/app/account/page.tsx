import { Suspense } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/auth/session";
import { ChangePasswordForm } from "@/components/change-password";
import { AccountMenu, BackLink, Screen } from "@/components/ui";
import { db } from "@/db";
import { client, dietitian } from "@/db/schema";

async function AccountRoom({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const { password } = await searchParams;
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const [person] =
    session.role === "dietitian"
      ? await db.select().from(dietitian).where(eq(dietitian.id, session.id))
      : await db.select().from(client).where(eq(client.id, session.id));

  if (!person) {
    redirect("/");
  }

  const home = session.role === "dietitian" ? "/dietitian" : "/client";

  return (
    <Screen
      width="max-w-md"
      actions={
        <AccountMenu name={person.name} />
      }
    >
      <BackLink href={home}>{session.role === "dietitian" ? "Danışanlar" : "Diyet listesi"}</BackLink>
      <div className="mt-6 rounded-lg border border-[#e6e6e2] bg-white px-8 py-8 shadow-[0_1px_2px_rgba(28,28,26,0.04)]">
        <h1 className="text-3xl font-semibold tracking-tight">Şifre</h1>
        <p className="mt-2 text-sm text-[#6b6b66]">Hesabının şifresini değiştir.</p>
        <ChangePasswordForm code={password} />
      </div>
    </Screen>
  );
}

export default function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  return (
    <Suspense>
      <AccountRoom searchParams={searchParams} />
    </Suspense>
  );
}
