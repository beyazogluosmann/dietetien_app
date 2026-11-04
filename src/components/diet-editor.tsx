"use client";

import { useState } from "react";
import { dayHasText, emptyPlan, meals, parsePlan, weekDays, type DayId } from "@/diet-plan";

export function DietEditor({
  initialBody,
  notes = {},
}: {
  initialBody: string;
  notes?: Record<string, string>;
}) {
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
      <div className="flex gap-2 overflow-x-auto px-5 pt-5">
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
                  ? "bg-[#1f4d3a] text-white"
                  : "bg-[#f4efe4] text-[#1c1c1a] hover:bg-[#ebe4d4]"
              }`}
            >
              {item.short}
              {filled ? (
                <span
                  className={`ml-1.5 inline-block size-1.5 rounded-full align-middle ${selected ? "bg-white/80" : "bg-[#1f4d3a]"}`}
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="px-6 pt-5 pb-6">
        <p className="text-sm font-medium text-[#1f4d3a]">{current.label}</p>
        <div className="mt-4 grid gap-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`flex flex-col gap-2 rounded-xl border border-[#e6e1d6] border-l-4 px-4 py-4 text-sm ${meal.tint}`}
            >
              <label className="flex flex-col gap-2">
                <span className={`text-xs font-medium tracking-[0.08em] ${meal.ink}`}>
                  {meal.label.toLocaleUpperCase("tr")}
                </span>
                <textarea
                  value={plan.days[day][meal.id]}
                  onChange={(event) => update(meal.id, event.target.value)}
                  rows={3}
                  placeholder="Serbest yaz. Gram ve kalori yok."
                  className="w-full resize-y rounded-lg border border-[#e6e1d6] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#1f4d3a] focus:ring-4 focus:ring-[#1f4d3a]/10"
                />
              </label>
              {notes[`${day}:${meal.id}`] ? (
                <p className="text-sm leading-6 text-[#1c1c1a]">
                  <span className={`font-medium ${meal.ink}`}>Bunu yaptım. </span>
                  {notes[`${day}:${meal.id}`]}
                </p>
              ) : null}
            </div>
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
