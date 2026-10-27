import { meals, parsePlan, weekDays, type DietPlan } from "@/diet-plan";
import { cardClass, mutedClass } from "@/components/ui";

function DayBlock({ plan, day }: { plan: DietPlan; day: (typeof weekDays)[number] }) {
  const filled = meals.filter((meal) => plan.days[day.id][meal.id].trim());
  if (filled.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#eee] px-6 py-5 first:border-t-0">
      <h3 className="text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">
        {day.label.toLocaleUpperCase("tr")}
      </h3>
      <div className="mt-3 grid gap-3">
        {filled.map((meal) => (
          <div key={meal.id} className={`rounded-2xl px-4 py-3 ${meal.tint}`}>
            <p className={`text-xs font-medium ${meal.ink}`}>{meal.label}</p>
            <p className="mt-1 whitespace-pre-wrap text-[15px] leading-7">{plan.days[day.id][meal.id]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DietView({ body, authorName }: { body: string; authorName?: string | null }) {
  const plan = parsePlan(body);
  const written = plan ? weekDays.some((day) => meals.some((meal) => plan.days[day.id][meal.id].trim())) : false;

  return (
    <article className={`${cardClass} overflow-hidden`}>
      {authorName ? <p className={`${mutedClass} px-6 pt-6`}>{authorName} hazırladı</p> : null}
      {plan && written ? (
        <div className={authorName ? "mt-2" : ""}>
          {weekDays.map((day) => (
            <DayBlock key={day.id} plan={plan} day={day} />
          ))}
        </div>
      ) : plan ? (
        <p className={`${mutedClass} px-6 py-8`}>Bu hafta için öğün yazılmamış.</p>
      ) : (
        <p className="whitespace-pre-wrap px-8 py-8 text-[16px] leading-8">{body}</p>
      )}
    </article>
  );
}
