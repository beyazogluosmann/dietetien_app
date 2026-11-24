"use client";

import { useRef, useState, startTransition } from "react";
import { saveWater } from "@/app/client/water";
import { waterGoal, type DayId } from "@/diet-plan";

export function WaterDay({
  day,
  glasses,
  editable,
}: {
  day: DayId;
  glasses: number;
  editable: boolean;
}) {
  const [counts, setCounts] = useState<Partial<Record<DayId, number>>>({});
  const [failedDay, setFailedDay] = useState<DayId | null>(null);
  const saved = useRef<Partial<Record<DayId, number>>>({});
  const request = useRef<{ day: DayId; glasses: number } | null>(null);
  const count = counts[day] ?? glasses;

  function choose(next: number) {
    const savedDay = day;
    const previous = saved.current[savedDay] ?? glasses;
    setCounts((current) => ({ ...current, [savedDay]: next }));
    setFailedDay(null);
    request.current = { day: savedDay, glasses: next };
    startTransition(async () => {
      const ok = await saveWater(savedDay, next);
      if (ok) {
        saved.current[savedDay] = next;
      }
      if (request.current?.day !== savedDay || request.current.glasses !== next) {
        return;
      }
      if (!ok) {
        const back = saved.current[savedDay] ?? previous;
        setCounts((current) => ({ ...current, [savedDay]: back }));
        request.current = { day: savedDay, glasses: back };
        setFailedDay(savedDay);
      }
    });
  }

  return (
    <div className="relative flex items-center justify-center gap-4 overflow-hidden rounded-[1.75rem] bg-[linear-gradient(165deg,#49c8ea_0%,#1789bc_46%,#0a466c_100%)] px-5 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_16px_32px_rgba(10,70,108,0.16)]">
      <div className="pointer-events-none absolute -top-8 left-1/2 h-28 w-72 -translate-x-1/2 rounded-full bg-white/35 blur-2xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(190,240,255,0.55)_0%,transparent_68%)]" />
      <div className="relative size-72 shrink-0">
        <div className="pointer-events-none absolute top-[14%] left-[14%] size-[72%] rounded-full border border-dashed border-white/70" />
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-white/80">SU</p>
            <p className="text-4xl font-semibold tracking-tight text-white">{count}</p>
            <p className="text-xs text-white/75">/ {waterGoal} bardak</p>
            {failedDay === day ? <p className="mt-1 text-xs text-white">Kaydedilemedi.</p> : null}
          </div>
        </div>
        {Array.from({ length: waterGoal }, (_, index) => {
          const glass = index + 1;
          const angle = (index / waterGoal) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + Math.cos(angle) * 36;
          const top = 50 + Math.sin(angle) * 36;
          const filled = glass <= count;
          const place = { left: `${left}%`, top: `${top}%` };
          const clearsTheDay = filled && count === 1;
          if (!editable || clearsTheDay) {
            return (
              <span key={glass} aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2" style={place}>
                <Glass filled={filled} />
              </span>
            );
          }
          const next = glass === count ? glass - 1 : glass;
          return (
            <button
              key={glass}
              type="button"
              aria-label={`${glass} bardak`}
              onClick={() => choose(next)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition hover:scale-105"
              style={place}
            >
              <Glass filled={filled} />
            </button>
          );
        })}
      </div>
      {editable && count > 0 ? (
        <button
          type="button"
          onClick={() => choose(0)}
          className="rounded-full border border-white/70 bg-white px-3 py-2 text-sm font-medium text-[#0b4f78]"
        >
          Sıfırla
        </button>
      ) : null}
    </div>
  );
}

function Glass({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 48 64" className="h-14 w-10 drop-shadow-[0_8px_10px_rgba(4,32,52,0.28)]" aria-hidden="true">
      <ellipse cx="24" cy="58" rx="10" ry="2.2" fill="#042033" opacity="0.28" />
      <path
        d="M10 16 L15 52 Q24 58 33 52 L38 16"
        fill={filled ? "#d6f3fc" : "#ffffff"}
        stroke="#0e86b6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {filled ? <path d="M12.2 30 L15.4 51.2 Q24 56.2 32.6 51.2 L35.8 30 Z" fill="#14a4dc" /> : null}
      {filled ? <path d="M13 30 Q24 33.5 35 30" fill="none" stroke="#7ed4f4" strokeWidth="2" strokeLinecap="round" /> : null}
      <ellipse cx="24" cy="16" rx="14" ry="4.2" fill={filled ? "#5ec8ee" : "#ffffff"} stroke="#0e86b6" strokeWidth="2" />
      <ellipse cx="24" cy="16" rx="9" ry="2.2" fill={filled ? "#dff6fd" : "#f4fbfe"} />
      <path d="M16 20 Q17.2 34 16.4 46" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
