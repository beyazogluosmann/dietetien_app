import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/auth/sign-out";

export const linkClass =
  "font-medium text-[#1f4d3a] underline decoration-[#1f4d3a]/30 underline-offset-4 hover:decoration-[#1f4d3a]";

export const fieldClass =
  "w-full rounded-xl border border-[#e6e1d6] bg-[#fcfbf8] px-3.5 py-3 text-sm outline-none transition focus:border-[#1f4d3a] focus:bg-white focus:ring-4 focus:ring-[#1f4d3a]/10";

export const buttonClass =
  "inline-flex h-10 items-center rounded-xl border border-[#e6e1d6] bg-white px-4 text-sm hover:bg-[#f6f4ef]";

export const primaryButtonClass =
  "inline-flex h-10 items-center rounded-xl bg-[#1f4d3a] px-4 text-sm font-medium text-white hover:bg-[#173c2d]";

export const cardClass =
  "rounded-2xl border border-[#e6e1d6] bg-white shadow-[0_16px_40px_rgba(31,77,58,0.06)]";

export const mutedClass = "text-sm leading-6 text-[#6d6a62]";

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
    <div className="min-h-dvh bg-[#f6f1e6] bg-[radial-gradient(900px_420px_at_0%_-10%,#d9efe0,transparent),radial-gradient(700px_380px_at_100%_0%,#ffe4bf,transparent)] text-[#1c1c1a]">
      <header className="relative z-30 border-b border-[#e6e1d6] bg-white/90 backdrop-blur">
        <div className={`mx-auto flex h-16 items-center justify-between px-6 ${width}`}>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-[#1f4d3a] text-xs font-medium text-white">
              K
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Klinik</span>
          </div>
          {actions}
        </div>
      </header>
      <main className={`mx-auto w-full px-6 py-12 ${width}`}>{children}</main>
    </div>
  );
}

export function AccountMenu({ name }: { name: string }) {
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[#e6e1d6] bg-[#fcfbf8] px-3 py-1.5 text-sm text-[#1c1c1a] hover:bg-white [&::-webkit-details-marker]:hidden">
        {name}
        <span aria-hidden="true" className="text-[10px]">
          ▾
        </span>
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-[#e6e1d6] bg-white py-1 shadow-[0_16px_40px_rgba(31,77,58,0.08)]">
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
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-sm text-[#6d6a62] hover:text-[#1f4d3a]">
      ← {children}
    </Link>
  );
}
