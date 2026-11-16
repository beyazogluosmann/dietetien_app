import { changePassword } from "@/auth/change-password";
import { fieldClass, primaryButtonClass } from "@/components/ui";

export function ChangePasswordForm() {
  return (
    <form action={changePassword} className="mt-8 flex flex-col gap-4">
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
