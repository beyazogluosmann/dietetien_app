"use client";

import { useState } from "react";
import { emptyPlan, meals, parsePlan, type DayId } from "@/diet-plan";
import { DietWeek } from "@/components/diet-week";
import { WaterDay } from "@/components/water-day";

export function DietEditor({
  initialBody,
  notes = {},
  water = {},
}: {
  initialBody: string;
  notes?: Record<string, string>;
  water?: Record<string, number>;
}) {
  const legacy = parsePlan(initialBody) ? "" : initialBody.trim();
  const [plan, setPlan] = useState(() => parsePlan(initialBody) ?? emptyPlan());
  const [day, setDay] = useState<DayId>("monday");

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
    <div className="pb-6">
      <input type="hidden" name="body" value={JSON.stringify(plan)} />
      <DietWeek day={day} plan={plan} onSelect={setDay} />
      <div className="mt-5 grid gap-3 px-5 sm:px-7">
        <WaterDay day={day} glasses={water[day] ?? 0} editable={false} />
        {meals.map((meal) => (
          <label key={meal.id} className={`block rounded-2xl px-5 py-5 ${meal.wash}`}>
            <span className={`flex items-center gap-2 text-xs font-medium tracking-[0.14em] ${meal.ink}`}>
              <span className={`size-2 rounded-full ${meal.mark}`} />
              {meal.label.toLocaleUpperCase("tr")}
            </span>
            <textarea
              value={plan.days[day][meal.id]}
              onChange={(event) => update(meal.id, event.target.value)}
              rows={2}
              placeholder="Serbest yaz"
              className="mt-3 w-full resize-y bg-transparent text-[17px] leading-8 outline-none placeholder:text-[#b7b0a4]"
            />
            {notes[`${day}:${meal.id}`] ? (
              <p className="mt-3 text-sm leading-6 text-[#5c5850]">{notes[`${day}:${meal.id}`]}</p>
            ) : null}
          </label>
        ))}
      </div>
      {legacy ? (
        <p className="mx-5 mt-4 rounded-2xl bg-[#f6f4ef] px-4 py-3 text-sm leading-6 text-[#6d6a62] sm:mx-7">
          Eski liste metin olarak duruyor. Bu haftalık planı kaydedince onun yerine geçer.
          <span className="mt-2 block whitespace-pre-wrap text-[#1c1c1a]">{legacy}</span>
        </p>
      ) : null}
    </div>
  );
}
