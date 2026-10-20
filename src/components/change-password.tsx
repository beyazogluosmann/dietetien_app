import { changePassword } from "@/auth/change-password";
import { fieldClass, primaryButtonClass } from "@/components/ui";

function notice(code: string | undefined) {
  if (code === "saved") {
    return { bad: false, text: "Şifre değişti." };
  }
  if (code === "wrong") {
    return { bad: true, text: "Mevcut şifre yanlış." };
  }
  if (code === "match") {
    return { bad: true, text: "Yeni şifreler aynı değil." };
  }
  if (code === "missing") {
    return { bad: true, text: "Mevcut şifre ve yeni şifre gerekli." };
  }
  return null;
}

export function ChangePasswordForm({ code }: { code?: string }) {
  const message = notice(code);

  return (
    <section className="mt-10 rounded-lg border border-[#e6e6e2] bg-white p-4">
      <h2 className="text-sm font-medium">Şifre değiştir</h2>
      <form action={changePassword} className="mt-4 flex max-w-sm flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Mevcut şifre
          <input
            name="current"
            type="password"
            autoComplete="current-password"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Yeni şifre
          <input name="next" type="password" autoComplete="new-password" className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Yeni şifre tekrar
          <input name="again" type="password" autoComplete="new-password" className={fieldClass} />
        </label>
        <button type="submit" className={`${primaryButtonClass} justify-center`}>
          Kaydet
        </button>
      </form>
      {message ? (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            message.bad ? "bg-[#fde8e4] text-[#8a2e22]" : "bg-[#eef6f0] text-[#245c3a]"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </section>
  );
}
