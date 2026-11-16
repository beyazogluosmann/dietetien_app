"use client";

import { useState } from "react";

const providers = [
  { id: "google", label: "Google" },
  { id: "apple", label: "Apple" },
] as const;

type ProviderId = (typeof providers)[number]["id"];

function ProviderIcon({ id }: { id: ProviderId }) {
  if (id === "google") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
        <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1C6.2 6.9 8.9 4.8 12 4.8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.3c.7-1 1.2-2.1 1.5-3.2-3.9-1.5-3.8-5.1-3.8-5.2Z" />
      <path d="M14.7 5.7c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3Z" />
    </svg>
  );
}

export function SocialSignIn() {
  const [pending, setPending] = useState<ProviderId | null>(null);
  const chosen = providers.find((provider) => provider.id === pending);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => setPending(provider.id)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e6e1d6] bg-white text-sm text-[#1c1c1a] transition hover:border-[#1f4d3a]/30 hover:bg-[#fbfaf6]"
          >
            <ProviderIcon id={provider.id} />
            {provider.label}
          </button>
        ))}
      </div>
      {chosen ? (
        <p className="mt-3 text-sm text-[#6d6a62]">
          {chosen.label} ile giriş yakında. Şimdilik e-posta ve şifreni kullan.
        </p>
      ) : null}
    </div>
  );
}
