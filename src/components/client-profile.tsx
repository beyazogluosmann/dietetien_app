import {
  activityOptions,
  bodyMassIndex,
  bodyMassLabel,
  goalOptions,
  optionLabel,
  sexOptions,
} from "@/anamnesis";
import { cardClass, mutedClass } from "@/components/ui";

type History = {
  age: string;
  sex: string;
  heightCm: string;
  weightKg: string;
  goal: string;
  activity: string;
  conditions: string;
  allergies: string;
  medications: string;
  notes: string;
};

function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "");
  return letters.join("").toLocaleUpperCase("tr") || "?";
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-[#f6f4ef] px-4 py-4">
      <dt className="text-xs text-[#6d6a62]">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold tracking-tight">{value}</dd>
      {hint ? <p className="mt-1 text-xs font-medium text-[#1f4d3a]">{hint}</p> : null}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e6e1d6] px-4 py-3">
      <dt className="text-xs text-[#6d6a62]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

export function ClientProfile({
  name,
  phone,
  email,
  history,
}: {
  name: string;
  phone?: string;
  email?: string | null;
  history: History | null;
}) {
  const index = history ? bodyMassIndex(history.heightCm, history.weightKg) : null;

  return (
    <section className={`${cardClass} px-6 py-7 sm:px-8`}>
      <div className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#1f4d3a] text-lg font-medium text-white">
          {initials(name)}
        </span>
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-[#1f4d3a]">PROFİL</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{name}</h1>
          {history ? (
            <p className={`${mutedClass} mt-1`}>
              {optionLabel(sexOptions, history.sex)} · {optionLabel(goalOptions, history.goal)}
            </p>
          ) : null}
        </div>
      </div>
      {phone || email ? (
        <p className={`${mutedClass} mt-4`}>
          {[phone, email].filter(Boolean).join(" · ")}
        </p>
      ) : null}
      {history ? (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Yaş" value={history.age} />
            <Stat label="Boy" value={`${history.heightCm} cm`} />
            <Stat label="Kilo" value={`${history.weightKg} kg`} />
            <Stat
              label="İndeks"
              value={index !== null ? String(index) : "—"}
              hint={index !== null ? bodyMassLabel(index) : undefined}
            />
          </dl>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Fact label="Hareket" value={optionLabel(activityOptions, history.activity)} />
            <Fact label="Hastalık" value={history.conditions || "Yok"} />
            <Fact label="Alerji" value={history.allergies || "Yok"} />
            <Fact label="İlaç" value={history.medications || "Yok"} />
          </dl>
          <p className={`${mutedClass} mt-4`}>Not: {history.notes || "Yok"}</p>
        </>
      ) : (
        <p className={`${mutedClass} mt-6`}>Anamnez yok.</p>
      )}
    </section>
  );
}
