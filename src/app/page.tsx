import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/auth/sign-in";
import { setSession } from "@/auth/session";
import { cardClass, fieldClass, linkClass, mutedClass, primaryButtonClass, Screen } from "@/components/ui";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await signIn(email, password);

  if (!result) {
    redirect("/?error=1");
  }

  if (result.role === "dietitian") {
    await setSession({ role: "dietitian", id: result.dietitianId });
    redirect("/dietitian");
  }

  await setSession({ role: "client", id: result.clientId });
  redirect("/client");
}

async function LoginError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  if (params.error !== "1") {
    return null;
  }

  return (
    <p className="rounded-lg bg-[#fde8e4] px-3 py-2 text-sm text-[#8a2e22]">
      E-posta veya şifre yanlış.
    </p>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Screen width="max-w-md">
      <div className={`${cardClass} px-8 py-10`}>
        <p className="text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">KLİNİK</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Hoş geldin</h1>
        <p className={`${mutedClass} mt-2`}>Diyetisyen veya danışan hesabınla gir.</p>
        <form action={login} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            E-posta
            <input
              name="email"
              type="email"
              autoComplete="username"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Şifre
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className={fieldClass}
            />
          </label>
          <button type="submit" className={`${primaryButtonClass} mt-2 justify-center`}>
            Giriş yap
          </button>
        </form>
        <div className="mt-4">
          <Suspense>
            <LoginError searchParams={searchParams} />
          </Suspense>
        </div>
        <p className="mt-6 text-sm">
          <Link href="/register" className={linkClass}>
            Kayıt ol
          </Link>
        </p>
      </div>
    </Screen>
  );
}
