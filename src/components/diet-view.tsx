import { saveMealNote } from "@/app/client/meal-note";
import { DietDays } from "@/components/diet-days";
import { dayHasText, parsePlan, weekDays } from "@/diet-plan";
import { cardClass, mutedClass } from "@/components/ui";

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
  const written = plan ? weekDays.some((day) => dayHasText(plan, day.id)) : false;

  return (
    <article className={`${cardClass} overflow-hidden`}>
      {authorName ? <p className={`${mutedClass} px-6 pt-6`}>{authorName} hazırladı</p> : null}
      {plan && written ? (
        <div className={authorName ? "" : "pt-1"}>
          <DietDays plan={plan} notes={notes} editable={editable} saveMealNote={saveMealNote} />
        </div>
      ) : plan ? (
        <p className={`${mutedClass} px-6 py-8`}>Bu hafta için öğün yazılmamış.</p>
      ) : (
        <p className="whitespace-pre-wrap px-8 py-8 text-[16px] leading-8">{body}</p>
      )}
    </article>
  );
}
