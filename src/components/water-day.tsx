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
    <div className="relative flex items-center justify-center gap-4 overflow-hidden rounded-[1.75rem] bg-[linear-gradient(165deg,#49c8ea_0%,#1789bc_46%,#0a466c_100%)] px-5 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_16px_32px_rgba(10,70,108,0.16)]">
      <div className="pointer-events-none absolute -top-8 left-1/2 h-28 w-72 -translate-x-1/2 rounded-full bg-white/35 blur-2xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(190,240,255,0.55)_0%,transparent_68%)]" />
      <div className="relative size-72 shrink-0">
        <div className="pointer-events-none absolute top-[14%] left-[14%] size-[72%] rounded-full border border-dashed border-white/70" />
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-white/80">SU</p>
            <p className="text-4xl font-semibold tracking-tight text-white">{glasses}</p>
            <p className="text-xs text-white/75">/ {waterGoal} bardak</p>
          </div>
        </div>
        {Array.from({ length: waterGoal }, (_, index) => {
          const count = index + 1;
          const angle = (index / waterGoal) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + Math.cos(angle) * 36;
          const top = 50 + Math.sin(angle) * 36;
          const filled = count <= glasses;
          const place = { left: `${left}%`, top: `${top}%` };
          const clearsTheDay = filled && glasses === 1;
          if (!editable || clearsTheDay) {
            return (
              <span key={count} aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2" style={place}>
                <Glass filled={filled} />
              </span>
            );
          }
          const next = count === glasses ? count - 1 : count;
          return (
            <form key={count} action={saveWater} className="contents">
              <input type="hidden" name="day" value={day} />
              <input type="hidden" name="glasses" value={next} />
              <button
                type="submit"
                aria-label={`${count} bardak`}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition hover:scale-105"
                style={place}
              >
                <Glass filled={filled} />
              </button>
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
            className="rounded-full border border-white/70 bg-white px-3 py-2 text-sm font-medium text-[#0b4f78]"
          >
            Sıfırla
          </button>
        </form>
      ) : null}
    </div>
  );
}

function Glass({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 48 64" className="h-14 w-10 drop-shadow-[0_8px_10px_rgba(4,32,52,0.28)]" aria-hidden="true">
      <ellipse cx="24" cy="58" rx="10" ry="2.2" fill="#042033" opacity="0.28" />
      <path
        d="M10 16 L15 52 Q24 58 33 52 L38 16"
        fill={filled ? "#d6f3fc" : "#ffffff"}
        stroke="#0e86b6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {filled ? <path d="M12.2 30 L15.4 51.2 Q24 56.2 32.6 51.2 L35.8 30 Z" fill="#14a4dc" /> : null}
      {filled ? <path d="M13 30 Q24 33.5 35 30" fill="none" stroke="#7ed4f4" strokeWidth="2" strokeLinecap="round" /> : null}
      <ellipse cx="24" cy="16" rx="14" ry="4.2" fill={filled ? "#5ec8ee" : "#ffffff"} stroke="#0e86b6" strokeWidth="2" />
      <ellipse cx="24" cy="16" rx="9" ry="2.2" fill={filled ? "#dff6fd" : "#f4fbfe"} />
      <path d="M16 20 Q17.2 34 16.4 46" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
