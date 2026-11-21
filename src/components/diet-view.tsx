import { saveMealNote } from "@/app/client/meal-note";
import { DietDays } from "@/components/diet-days";
import { parsePlan } from "@/diet-plan";
import { cardClass, mutedClass } from "@/components/ui";

export function DietView({
  body,
  authorName,
  notes = {},
  water = {},
  editable = false,
  initialDay,
}: {
  body: string;
  authorName?: string | null;
  notes?: Record<string, string>;
  water?: Record<string, number>;
  editable?: boolean;
  initialDay?: string;
}) {
  const plan = parsePlan(body);

  return (
    <article className={`${cardClass} overflow-hidden`}>
      {authorName ? <p className={`${mutedClass} px-5 pt-6 sm:px-7`}>{authorName} hazırladı</p> : null}
      {plan ? (
        <div className={authorName ? "" : "pt-1"}>
          <DietDays
            plan={plan}
            notes={notes}
            water={water}
            editable={editable}
            initialDay={initialDay}
            saveMealNote={saveMealNote}
          />
        </div>
      ) : (
        <p className="whitespace-pre-wrap px-5 py-6 text-[16px] leading-8 sm:px-8 sm:py-8">{body}</p>
      )}
    </article>
  );
}
