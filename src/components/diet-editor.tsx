"use client";

import { useState } from "react";
import { dayHasText, emptyPlan, meals, parsePlan, weekDays, type DayId } from "@/diet-plan";

export function DietEditor({ initialBody }: { initialBody: string }) {
  const legacy = parsePlan(initialBody) ? "" : initialBody.trim();
  const [plan, setPlan] = useState(() => parsePlan(initialBody) ?? emptyPlan());
  const [day, setDay] = useState<DayId>("monday");
  const current = weekDays.find((item) => item.id === day) ?? weekDays[0];

  function update(meal: (typeof meals)[number]["id"], value: string) {
    setPlan((previous) => ({
      ...previous,
      days: {
        ...previous.days,
        [day]: { ...previous.days[day], [meal]: value },
      },
    }));
  }

  return (
    <div>
      <input type="hidden" name="body" value={JSON.stringify(plan)} />
      <div className="flex gap-2 overflow-x-auto px-5 pt-5 pb-1">
        {weekDays.map((item) => {
          const selected = item.id === day;
          const filled = dayHasText(plan, item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setDay(item.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                selected
                  ? "bg-[#1f4d3a] text-white shadow-[0_8px_18px_rgba(31,77,58,0.25)]"
                  : "border border-[#e6dcc8] bg-white text-[#1c1c1a] hover:border-[#1f4d3a]/30"
              }`}
            >
              {item.short}
              {filled ? <span className={`ml-1.5 inline-block size-1.5 rounded-full ${selected ? "bg-[#ffd27a]" : "bg-[#e2a23a]"}`} /> : null}
            </button>
          );
        })}
      </div>
      <div className="px-6 pt-5 pb-2">
        <p className="text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">{current.label.toLocaleUpperCase("tr")}</p>
        <div className="mt-4 grid gap-4">
          {meals.map((meal) => (
            <label key={meal.id} className={`flex flex-col gap-2 rounded-2xl px-4 py-3 text-sm ${meal.tint}`}>
              <span className={`font-medium ${meal.ink}`}>{meal.label}</span>
              <textarea
                value={plan.days[day][meal.id]}
                onChange={(event) => update(meal.id, event.target.value)}
                rows={3}
                placeholder="Serbest yaz. Gram ve kalori yok."
                className="w-full resize-y rounded-xl border border-black/5 bg-white/70 px-3.5 py-3 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-[#1f4d3a]/10"
              />
            </label>
          ))}
        </div>
      </div>
      {legacy ? (
        <p className="mx-6 mb-4 rounded-2xl bg-[#f6f4ef] px-4 py-3 text-sm leading-6 text-[#6d6a62]">
          Eski liste metin olarak duruyor. Bu haftalık planı kaydedince onun yerine geçer.
          <span className="mt-2 block whitespace-pre-wrap text-[#1c1c1a]">{legacy}</span>
        </p>
      ) : null}
    </div>
  );
}
