import { saveMealNote } from "@/app/client/meal-note";
import { meals, parsePlan, weekDays, type DietPlan } from "@/diet-plan";
import { buttonClass, cardClass, fieldClass, mutedClass } from "@/components/ui";

function DayBlock({
  plan,
  day,
  notes,
  editable,
}: {
  plan: DietPlan;
  day: (typeof weekDays)[number];
  notes: Record<string, string>;
  editable: boolean;
}) {
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
        {filled.map((meal) => {
          const note = notes[`${day.id}:${meal.id}`] ?? "";
          return (
            <div key={meal.id} className={`rounded-2xl px-4 py-3 ${meal.tint}`}>
              <p className={`text-xs font-medium ${meal.ink}`}>{meal.label}</p>
              <p className="mt-1 whitespace-pre-wrap text-[15px] leading-7">{plan.days[day.id][meal.id]}</p>
              {editable ? (
                <form action={saveMealNote} className="mt-3">
                  <input type="hidden" name="day" value={day.id} />
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
    </section>
  );
}

export function DietView({
  body,
  authorName,
  notes = {},
  editable = false,
}: {
  body: string;
  authorName?: string | null;
  notes?: Record<string, string>;
  editable?: boolean;
}) {
  const plan = parsePlan(body);
  const written = plan ? weekDays.some((day) => meals.some((meal) => plan.days[day.id][meal.id].trim())) : false;

  return (
    <article className={`${cardClass} overflow-hidden`}>
      {authorName ? <p className={`${mutedClass} px-6 pt-6`}>{authorName} hazırladı</p> : null}
      {plan && written ? (
        <div className={authorName ? "mt-2" : ""}>
          {weekDays.map((day) => (
            <DayBlock key={day.id} plan={plan} day={day} notes={notes} editable={editable} />
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
