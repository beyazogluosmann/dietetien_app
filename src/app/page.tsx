import { Suspense } from "react";
import { redirect } from "next/navigation";
import { signIn } from "@/auth/sign-in";
import { setSession } from "@/auth/session";

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

  return <p>E-posta veya şifre yanlış.</p>;
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">Giriş</h1>
      <form action={login} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          E-posta
          <input
            name="email"
            type="email"
            autoComplete="username"
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Şifre
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="rounded border px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Giriş yap
        </button>
      </form>
      <Suspense>
        <LoginError searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
