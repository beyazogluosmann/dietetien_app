import { saveWater } from "@/app/client/water";
import { waterGoal, type DayId } from "@/diet-plan";

export function WaterDay({
  day,
  glasses,
  editable,
}: {
  day: DayId;
  glasses: number;
  editable: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-4 rounded-2xl bg-[#d7f2fb] px-5 py-6">
      <div className="relative size-64 shrink-0">
        <div className="pointer-events-none absolute top-[14%] left-[14%] size-[72%] rounded-full border border-dashed border-[#4eb6de]" />
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-[#0b7eab]">SU</p>
            <p className="text-4xl font-semibold tracking-tight text-[#08688f]">{glasses}</p>
            <p className="text-xs text-[#1a8bb8]">/ {waterGoal} bardak</p>
          </div>
        </div>
        {Array.from({ length: waterGoal }, (_, index) => {
          const count = index + 1;
          const angle = (index / waterGoal) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + Math.cos(angle) * 36;
          const top = 50 + Math.sin(angle) * 36;
          const filled = count <= glasses;
          const face = `absolute size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border transition ${
            filled
              ? "border-[#0b8ec4] bg-[#14a4dc] shadow-[0_8px_16px_rgba(14,158,212,0.45)]"
              : "border-[#7ecae8] bg-white shadow-[0_6px_14px_rgba(14,140,190,0.12)]"
          }`;
          const place = { left: `${left}%`, top: `${top}%` };
          const clearsTheDay = filled && glasses === 1;
          if (!editable || clearsTheDay) {
            return <span key={count} aria-hidden="true" className={face} style={place} />;
          }
          const next = count === glasses ? count - 1 : count;
          return (
            <form key={count} action={saveWater} className="contents">
              <input type="hidden" name="day" value={day} />
              <input type="hidden" name="glasses" value={next} />
              <button
                type="submit"
                aria-label={`${count} bardak`}
                className={`${face} hover:scale-105`}
                style={place}
              />
            </form>
          );
        })}
      </div>
      {editable && glasses > 0 ? (
        <form action={saveWater}>
          <input type="hidden" name="day" value={day} />
          <input type="hidden" name="glasses" value="0" />
          <button
            type="submit"
            className="rounded-full border border-[#7ecae8] bg-white px-3 py-2 text-sm font-medium text-[#08688f]"
          >
            Sıfırla
          </button>
        </form>
      ) : null}
    </div>
  );
}
