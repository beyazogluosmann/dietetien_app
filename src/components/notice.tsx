"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const notices: Record<string, { tone: "ok" | "bad"; text: string }> = {
  "signed-in": { tone: "ok", text: "Giriş yapıldı." },
  "bad-password": { tone: "bad", text: "E-posta veya şifre yanlış." },
  locked: { tone: "bad", text: "Çok fazla hatalı deneme. 15 dakika sonra tekrar dene." },
  registered: { tone: "ok", text: "Hesabın açıldı." },
  "list-saved": { tone: "ok", text: "Liste kaydedildi." },
  "list-sent": { tone: "ok", text: "Liste danışana gönderildi." },
  "list-new": { tone: "ok", text: "Yeni hafta açıldı." },
  "password-saved": { tone: "ok", text: "Şifre değişti." },
  "password-wrong": { tone: "bad", text: "Mevcut şifre yanlış." },
  "password-match": { tone: "bad", text: "Yeni şifreler aynı değil." },
  "password-missing": { tone: "bad", text: "Mevcut şifre ve yeni şifre gerekli." },
  "note-saved": { tone: "ok", text: "Not kaydedildi." },
  "note-removed": { tone: "ok", text: "Not silindi." },
  "request-sent": { tone: "ok", text: "Talep gönderildi." },
  "request-rejected": { tone: "ok", text: "Talep reddedildi." },
  "anamnesis-saved": { tone: "ok", text: "Anamnez kaydedildi." },
};

function clearNotice() {
  const next = new URLSearchParams(window.location.search);
  next.delete("notice");
  const query = next.toString();
  const path = window.location.pathname;
  window.history.replaceState(window.history.state, "", query ? `${path}?${query}` : path);
}

export function Notice() {
  const params = useSearchParams();
  const code = params.get("notice");
  const message = code ? notices[code] : undefined;
  const [dismissed, setDismissed] = useState<string | null>(null);

  function dismiss() {
    if (!code) {
      return;
    }
    setDismissed(code);
    clearNotice();
  }

  useEffect(() => {
    if (!message || dismissed === code) {
      return;
    }

    const timer = window.setTimeout(() => {
      setDismissed(code);
      clearNotice();
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [code, dismissed, message]);

  if (!message || dismissed === code) {
    return null;
  }

  const bad = message.tone === "bad";

  return (
    <div className="pointer-events-none fixed top-5 right-5 left-5 z-50 flex justify-end sm:left-auto">
      <div
        role={bad ? "alert" : "status"}
        className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border border-[#e6e1d6] bg-white shadow-[0_18px_50px_rgba(28,28,26,0.14)]"
        style={{ animation: "notice-in 280ms ease-out" }}
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span
            className={`grid size-8 shrink-0 place-items-center rounded-full ${
              bad ? "bg-[#fde8e4] text-[#8a2e22]" : "bg-[#eef6f0] text-[#1f4d3a]"
            }`}
          >
            {bad ? <AlertIcon /> : <CheckIcon />}
          </span>
          <div className="min-w-0 flex-1">
            {bad ? (
              <p className="text-[11px] font-medium tracking-[0.14em] text-[#8a2e22]">DİKKAT</p>
            ) : null}
            <p className={`text-sm leading-5 text-[#1c1c1a] ${bad ? "mt-1" : ""}`}>{message.text}</p>
          </div>
          <button
            type="button"
            aria-label="Kapat"
            onClick={dismiss}
            className="grid size-7 shrink-0 place-items-center rounded-full text-[#8a867c] hover:bg-[#f6f4ef] hover:text-[#1c1c1a]"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="h-1 bg-[#f3f1ea]">
          <div
            className={`h-full origin-left ${bad ? "bg-[#8a2e22]" : "bg-[#1f4d3a]"}`}
            style={{ animation: "notice-bar 4s linear forwards" }}
          />
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
      <path d="M8 3.5v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="12.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
      <path
        d="M4 4l8 8M12 4l-8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
