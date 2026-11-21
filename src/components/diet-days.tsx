"use client";

import { useState } from "react";
import { weekDays, type DayId, type DietPlan, type MealId } from "@/diet-plan";
import { DietWeek, filledMeals } from "@/components/diet-week";
import { WaterDay } from "@/components/water-day";
import { buttonClass, fieldClass } from "@/components/ui";

export function DietDays({
  plan,
  notes,
  water = {},
  editable,
  initialDay,
  saveMealNote,
}: {
  plan: DietPlan;
  notes: Record<string, string>;
  water?: Record<string, number>;
  editable: boolean;
  initialDay?: string;
  saveMealNote: (formData: FormData) => void;
}) {
  const [day, setDay] = useState<DayId>(() => {
    if (weekDays.some((item) => item.id === initialDay)) {
      return initialDay as DayId;
    }
    return weekDays.find((item) => filledMeals(plan, item.id).length > 0)?.id ?? "monday";
  });
  const filled = filledMeals(plan, day);

  return (
    <div className="pb-6">
      <DietWeek day={day} plan={plan} onSelect={setDay} />
      <div className="mt-5 grid gap-3 px-5 sm:px-7">
        <WaterDay day={day} glasses={water[day] ?? 0} editable={editable} />
        {filled.length === 0 ? (
          <p className="py-8 text-sm text-[#6d6a62]">Bu gün için öğün yazılmamış.</p>
        ) : (
          filled.map((meal) => {
            const note = notes[`${day}:${meal.id}`] ?? "";
            return (
              <article key={`${day}:${meal.id}`} className={`rounded-2xl px-5 py-5 ${meal.wash}`}>
                <p className={`flex items-center gap-2 text-xs font-medium tracking-[0.14em] ${meal.ink}`}>
                  <span className={`size-2 rounded-full ${meal.mark}`} />
                  {meal.label.toLocaleUpperCase("tr")}
                </p>
                <p className="mt-3 text-[17px] leading-8 whitespace-pre-wrap">{plan.days[day][meal.id]}</p>
                {editable ? (
                  <MealNote day={day} meal={meal.id} note={note} ink={meal.ink} saveMealNote={saveMealNote} />
                ) : note ? (
                  <p className="mt-4 text-sm leading-6 text-[#5c5850]">{note}</p>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

function MealNote({
  day,
  meal,
  note,
  ink,
  saveMealNote,
}: {
  day: DayId;
  meal: MealId;
  note: string;
  ink: string;
  saveMealNote: (formData: FormData) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div className="mt-4 flex items-start justify-between gap-4">
        {note ? <p className="text-sm leading-6 text-[#5c5850]">{note}</p> : <span />}
        <button type="button" onClick={() => setEditing(true)} className={`shrink-0 text-sm font-medium ${ink}`}>
          {note ? "Değiştir" : "Not ekle"}
        </button>
      </div>
    );
  }

  return (
    <form action={saveMealNote} className="mt-4">
      <input type="hidden" name="day" value={day} />
      <input type="hidden" name="meal" value={meal} />
      <textarea
        name="note"
        rows={2}
        defaultValue={note}
        placeholder="Farklı yaptıysan yaz"
        className={fieldClass}
      />
      <div className="mt-2 flex gap-2">
        <button type="submit" className={`${buttonClass} h-8 px-3`}>
          Kaydet
        </button>
        <button type="button" onClick={() => setEditing(false)} className="h-8 px-3 text-sm text-[#6d6a62]">
          Vazgeç
        </button>
      </div>
    </form>
  );
}
