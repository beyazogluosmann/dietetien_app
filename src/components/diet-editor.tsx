"use client";

import { useState } from "react";
import { dayHasText, emptyPlan, meals, parsePlan, weekDays, type DayId } from "@/diet-plan";
import { fieldClass } from "@/components/ui";

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
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm ${
                selected
                  ? "bg-[#1f4d3a] text-white"
                  : "bg-[#f6f4ef] text-[#1c1c1a] hover:bg-[#efece4]"
              }`}
            >
              {item.short}
              {filled ? <span className={`ml-1.5 inline-block size-1.5 rounded-full ${selected ? "bg-white" : "bg-[#1f4d3a]"}`} /> : null}
            </button>
          );
        })}
      </div>
      <div className="px-6 pt-5 pb-2">
        <p className="text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">{current.label.toLocaleUpperCase("tr")}</p>
        <div className="mt-4 grid gap-4">
          {meals.map((meal) => (
            <label key={meal.id} className="flex flex-col gap-2 text-sm">
              <span className="font-medium">{meal.label}</span>
              <textarea
                value={plan.days[day][meal.id]}
                onChange={(event) => update(meal.id, event.target.value)}
                rows={3}
                placeholder="Serbest yaz. Gram ve kalori yok."
                className={fieldClass}
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
