"use client";

import { dayHasText, meals, weekDays, type DayId, type DietPlan } from "@/diet-plan";

export function filledMeals(plan: DietPlan, day: DayId) {
  return meals.filter((meal) => plan.days[day][meal.id].trim());
}

export function DietWeek({
  day,
  plan,
  onSelect,
}: {
  day: DayId;
  plan: DietPlan;
  onSelect: (day: DayId) => void;
}) {
  const current = weekDays.find((item) => item.id === day) ?? weekDays[0];
  const count = filledMeals(plan, day).length;

  return (
    <div className="px-5 pt-6 sm:px-7">
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((item) => {
          const selected = item.id === day;
          const filled = dayHasText(plan, item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2.5 text-sm font-medium transition ${
                selected ? "bg-[#1f4d3a] text-white" : "text-[#3c3933] hover:bg-[#f4efe4]"
              }`}
            >
              {item.short}
              <span
                className={`size-1.5 rounded-full ${
                  filled ? (selected ? "bg-white" : "bg-[#1f4d3a]") : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-7 flex items-end justify-between gap-4">
        <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{current.label}</h3>
        <p className="pb-1 text-sm text-[#6d6a62]">{count === 0 ? "Öğün yok" : `${count} öğün`}</p>
      </div>
    </div>
  );
}
