import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/auth/sign-out";

export const linkClass =
  "font-medium text-[#1c1c1a] underline decoration-[#1c1c1a]/30 underline-offset-4 hover:decoration-[#1c1c1a]";

export const fieldClass =
  "w-full rounded-md border border-[#e2e2de] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1c1c1a]";

export const buttonClass =
  "inline-flex h-9 items-center rounded-md border border-[#e2e2de] bg-white px-3 text-sm hover:bg-[#f6f6f4]";

export const primaryButtonClass =
  "inline-flex h-9 items-center rounded-md bg-[#1c1c1a] px-3 text-sm text-white hover:bg-[#333330]";

export function Screen({
  children,
  actions,
  width = "max-w-3xl",
}: {
  children: ReactNode;
  actions?: ReactNode;
  width?: string;
}) {
  return (
    <div className="min-h-dvh bg-[#f7f7f5] text-[#1c1c1a]">
      <header className="relative z-30 border-b border-[#e6e6e2] bg-white">
        <div className={`mx-auto flex h-16 items-center justify-between px-6 ${width}`}>
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-[#1c1c1a] text-[11px] font-medium text-white">
              K
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Klinik</span>
          </div>
          {actions}
        </div>
      </header>
      <main className={`mx-auto w-full px-6 py-10 ${width}`}>{children}</main>
    </div>
  );
}

export function AccountMenu({ name }: { name: string }) {
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm text-[#6b6b66] hover:text-[#1c1c1a] [&::-webkit-details-marker]:hidden">
        {name}
        <span aria-hidden="true" className="text-[10px]">
          ▾
        </span>
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-[#e6e6e2] bg-white py-1 shadow-[0_8px_24px_rgba(28,28,26,0.08)]">
        <Link href="/account" className="block px-3 py-2 text-sm hover:bg-[#fafaf8]">
          Şifre değiştir
        </Link>
        <form action={signOut}>
          <button type="submit" className="w-full px-3 py-2 text-left text-sm hover:bg-[#fafaf8]">
            Çıkış yap
          </button>
        </form>
      </div>
    </details>
  );
}

export function ListStatus({ status }: { status: string | null }) {
  const label =
    status === "sent" ? "Gönderildi" : status === "draft" ? "Taslak" : "Liste yok";
  const tone =
    status === "sent"
      ? "bg-[#eef6f0] text-[#245c3a]"
      : status === "draft"
        ? "bg-[#f8f4ea] text-[#7a6230]"
        : "bg-[#f3f3f1] text-[#6b6b66]";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-sm text-[#6b6b66] hover:text-[#1c1c1a]">
      ← {children}
    </Link>
  );
}
