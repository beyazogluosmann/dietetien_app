import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { hashPassword } from "@/auth/password";
import { setSession } from "@/auth/session";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { cardClass, fieldClass, linkClass, mutedClass, primaryButtonClass, Screen } from "@/components/ui";
import { db } from "@/db";
import { client, clientAccount, clientRequest, dietitian } from "@/db/schema";
import { parseEmail, parsePersonName } from "@/person";

async function register(formData: FormData) {
  "use server";

  const name = parsePersonName(String(formData.get("name") ?? ""));
  const surname = parsePersonName(String(formData.get("surname") ?? ""));
  const phone = String(formData.get("phone") ?? "").trim();
  const email = parseEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const dietitianId = String(formData.get("dietitianId") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (!phone || !password || !dietitianId) {
    redirect("/register?error=missing");
  }

  if (!name || !surname) {
    redirect("/register?error=name");
  }

  if (!email) {
    redirect("/register?error=email-invalid");
  }

  const [chosen] = await db.select().from(dietitian).where(eq(dietitian.id, dietitianId));
  if (!chosen) {
    redirect("/register?error=dietitian");
  }

  const [emailTaken] = await db
    .select()
    .from(clientAccount)
    .where(eq(clientAccount.email, email));
  const [dietitianEmail] = await db
    .select()
    .from(dietitian)
    .where(eq(dietitian.email, email));
  if (emailTaken || dietitianEmail) {
    redirect("/register?error=email");
  }

  const [card] = await db
    .insert(client)
    .values({
      name,
      surname,
      phone,
      note: message,
      dietitianId: chosen.id,
    })
    .returning();

  await db.insert(clientAccount).values({
    clientId: card.id,
    email,
    passwordHash: hashPassword(password),
  });

  await db.insert(clientRequest).values({
    clientId: card.id,
    dietitianId: chosen.id,
    message,
    status: "pending",
  });

  await setSession({ role: "client", id: card.id });
  redirect("/anamnesis");
}

function registerMessage(error: string | undefined) {
  if (error === "missing") {
    return "Ad, soyad, telefon, e-posta, şifre ve diyetisyen gerekli.";
  }
  if (error === "name") {
    return "Ad ve soyad en az 2 harf olmalı. Rakam ve işaret kullanma.";
  }
  if (error === "email-invalid") {
    return "Geçerli bir e-posta yaz.";
  }
  if (error === "email") {
    return "Bu e-posta kullanılıyor.";
  }
  if (error === "dietitian") {
    return "Seçilen diyetisyen bulunamadı.";
  }
  return null;
}

async function RegisterForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const message = registerMessage(params.error);
  const dietitians = await db.select().from(dietitian).orderBy(asc(dietitian.name));

  return (
    <Screen width="max-w-md">
      <div className={`${cardClass} px-8 py-10`}>
        <p className="text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">KLİNİK</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Kayıt ol</h1>
        <p className={`${mutedClass} mt-2`}>
          Diyetisyenini seç. Talebin onun paneline düşer.
        </p>
        <form action={register} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Ad
            <input name="name" autoComplete="given-name" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Soyad
            <input name="surname" autoComplete="family-name" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Telefon
            <input name="phone" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            E-posta
            <input name="email" type="email" autoComplete="username" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Şifre
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Diyetisyen
            <select name="dietitianId" className={fieldClass} defaultValue="">
              <option value="" disabled>
                Seç
              </option>
              {dietitians.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Mesaj
            <textarea name="message" rows={3} className={fieldClass} />
          </label>
          <button type="submit" className={`${primaryButtonClass} mt-2 justify-center`}>
            Talep gönder
          </button>
        </form>
        {message ? (
          <p className="mt-4 rounded-lg bg-[#fde8e4] px-3 py-2 text-sm text-[#8a2e22]">{message}</p>
        ) : null}
        <p className="mt-6 text-sm">
          <Link href="/" className={linkClass}>
            Giriş yap
          </Link>
        </p>
      </div>
    </Screen>
  );
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense>
      <RedirectIfSignedIn />
      <RegisterForm searchParams={searchParams} />
    </Suspense>
  );
}
