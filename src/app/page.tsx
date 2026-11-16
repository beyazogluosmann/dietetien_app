import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/auth/sign-in";
import { setSession } from "@/auth/session";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { withNotice } from "@/notice";
import { cardClass, fieldClass, linkClass, mutedClass, primaryButtonClass, Screen } from "@/components/ui";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await signIn(email, password);

  if (result === "locked") {
    redirect(withNotice("/", "locked"));
  }

  if (!result) {
    redirect(withNotice("/", "bad-password"));
  }

  if (result.role === "dietitian") {
    await setSession({ role: "dietitian", id: result.dietitianId });
    redirect(withNotice("/dietitian", "signed-in"));
  }

  await setSession({ role: "client", id: result.clientId });
  redirect(withNotice("/client", "signed-in"));
}

export default function Home() {
  return (
    <Screen width="max-w-md">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
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
        <p className="mt-6 text-sm">
          <Link href="/register" className={linkClass}>
            Kayıt ol
          </Link>
        </p>
      </div>
    </Screen>
  );
}
