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
    <form action={changePassword} className="mt-8 flex flex-col gap-4">
      {message ? (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            message.bad ? "bg-[#fde8e4] text-[#8a2e22]" : "bg-[#eef6f0] text-[#245c3a]"
          }`}
        >
          {message.text}
        </p>
      ) : null}
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
      <div className="mt-2 flex justify-end">
        <button type="submit" className={primaryButtonClass}>
          Kaydet
        </button>
      </div>
    </form>
  );
}
