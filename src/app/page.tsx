import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/auth/sign-in";
import { setSession } from "@/auth/session";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { AppleMark, CarrotMark, LeafMark, LemonMark } from "@/components/produce-marks";
import { SocialSignIn } from "@/components/social-sign-in";
import { cardClass, fieldClass, linkClass, mutedClass, primaryButtonClass } from "@/components/ui";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await signIn(email, password);

  if (result === "locked") {
    redirect("/?error=locked");
  }

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
  const message =
    params.error === "locked"
      ? "Çok fazla hatalı deneme yapıldı. 15 dakika sonra tekrar dene."
      : params.error === "1"
        ? "E-posta veya şifre yanlış."
        : null;
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-lg bg-[#fde8e4] px-3 py-2 text-sm text-[#8a2e22]">{message}</p>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <aside className="relative hidden overflow-hidden bg-[#1f4d3a] px-14 py-12 text-[#f6f1e6] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -left-20 size-80 rounded-full bg-[#2f6b50]" />
        <div className="absolute right-0 bottom-0 size-96 rounded-full bg-[#173c2d]" />
        <LemonMark className="absolute top-16 right-16 size-24 -rotate-12" />
        <LeafMark className="absolute top-28 left-10 size-20 rotate-6" />
        <AppleMark className="absolute right-24 bottom-16 size-24" />
        <CarrotMark className="absolute top-1/2 right-12 size-20 -translate-y-1/2 -rotate-12" />
        <div className="relative z-10 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#f6f1e6] text-sm font-semibold text-[#1f4d3a]">
            K
          </span>
          <span className="text-lg font-semibold tracking-tight">Klinik</span>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl leading-[1.05] font-semibold tracking-tight">
            Danışanın, listesi ve notu bir arada.
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-[#d7ebe0]">
            <li>Talebi kabul et, haftalık listeyi yaz.</li>
            <li>Danışan öğünde ne yediğini not etsin.</li>
            <li>Diyetisyen ve danışan hesapları ayrı kalsın.</li>
          </ul>
        </div>
      </aside>
      <main className="flex items-center justify-center bg-[#f6f1e6] px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-[#1f4d3a] text-xs font-medium text-white">
                K
              </span>
              <span className="text-[15px] font-semibold tracking-tight">Klinik</span>
            </div>
            <div className="flex items-center">
              <AppleMark className="size-9" />
              <LemonMark className="size-9" />
              <CarrotMark className="size-9" />
            </div>
          </div>
          <div className={`${cardClass} px-8 py-10`}>
            <p className="text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">GİRİŞ</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Hoş geldin</h1>
            <p className={`${mutedClass} mt-2`}>Diyetisyen veya danışan hesabınla gir.</p>
            <div className="mt-8">
              <SocialSignIn />
            </div>
            <div className="my-6 flex items-center gap-3 text-xs tracking-[0.14em] text-[#8a867c]">
              <span className="h-px flex-1 bg-[#e6e1d6]" />
              VEYA
              <span className="h-px flex-1 bg-[#e6e1d6]" />
            </div>
            <form action={login} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                E-posta
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  className={fieldClass}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Şifre
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={fieldClass}
                />
              </label>
              <button type="submit" className={`${primaryButtonClass} mt-2 h-11 justify-center`}>
                Giriş yap
              </button>
            </form>
            <div className="mt-4">
              <Suspense>
                <LoginError searchParams={searchParams} />
              </Suspense>
            </div>
            <p className="mt-6 text-sm text-[#6d6a62]">
              Hesabın yok mu?{" "}
              <Link href="/register" className={linkClass}>
                Kayıt ol
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
