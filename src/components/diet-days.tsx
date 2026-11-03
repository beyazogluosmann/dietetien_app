"use client";

import { useState } from "react";
import { dayHasText, meals, weekDays, type DayId, type DietPlan } from "@/diet-plan";
import { buttonClass, fieldClass, mutedClass } from "@/components/ui";

export function DietDays({
  plan,
  notes,
  editable,
  saveMealNote,
}: {
  plan: DietPlan;
  notes: Record<string, string>;
  editable: boolean;
  saveMealNote: (formData: FormData) => void;
}) {
  const [day, setDay] = useState<DayId>(
    () => weekDays.find((item) => dayHasText(plan, item.id))?.id ?? "monday",
  );
  const current = weekDays.find((item) => item.id === day) ?? weekDays[0];
  const filled = meals.filter((meal) => plan.days[day][meal.id].trim());

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto px-5 pt-5 pb-1">
        {weekDays.map((item) => {
          const selected = item.id === day;
          const hasText = dayHasText(plan, item.id);
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
              {hasText ? (
                <span
                  className={`ml-1.5 inline-block size-1.5 rounded-full ${selected ? "bg-[#ffd27a]" : "bg-[#e2a23a]"}`}
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <section className="px-6 pt-5 pb-6">
        <h3 className="text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">
          {current.label.toLocaleUpperCase("tr")}
        </h3>
        {filled.length === 0 ? (
          <p className={`${mutedClass} mt-3`}>Bu gün için öğün yazılmamış.</p>
        ) : (
          <div className="mt-3 grid gap-3">
            {filled.map((meal) => {
              const note = notes[`${day}:${meal.id}`] ?? "";
              return (
                <div key={`${day}:${meal.id}`} className={`rounded-2xl px-4 py-3 ${meal.tint}`}>
                  <p className={`text-xs font-medium ${meal.ink}`}>{meal.label}</p>
                  <p className="mt-1 whitespace-pre-wrap text-[15px] leading-7">{plan.days[day][meal.id]}</p>
                  {editable ? (
                    <form action={saveMealNote} className="mt-3">
                      <input type="hidden" name="day" value={day} />
                      <input type="hidden" name="meal" value={meal.id} />
                      <textarea
                        name="note"
                        rows={2}
                        defaultValue={note}
                        placeholder="Farklı yaptıysan yaz"
                        className={fieldClass}
                      />
                      <button type="submit" className={`${buttonClass} mt-2 h-8 px-3`}>
                        Kaydet
                      </button>
                    </form>
                  ) : note ? (
                    <p className="mt-3 text-sm leading-6">
                      <span className={`font-medium ${meal.ink}`}>Bunu yaptım. </span>
                      {note}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
