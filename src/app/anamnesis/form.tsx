"use client";

import { useActionState, type ReactNode } from "react";
import {
  activityOptions,
  emptyAnamnesisForm,
  goalOptions,
  sexOptions,
  type AnamnesisFormState,
} from "@/anamnesis";
import { fieldClass, primaryButtonClass } from "@/components/ui";
import { saveAnamnesis } from "./actions";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      {children}
      {error ? <span className="text-sm text-[#8a2e22]">{error}</span> : null}
    </label>
  );
}

export function AnamnesisForm() {
  const [state, formAction] = useActionState<AnamnesisFormState, FormData>(
    saveAnamnesis,
    emptyAnamnesisForm,
  );
  const { errors, values } = state;

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <Field label="Yaş" error={errors.age}>
        <input
          key={`age-${values.age}`}
          name="age"
          inputMode="numeric"
          defaultValue={values.age}
          className={fieldClass}
        />
      </Field>
      <Field label="Cinsiyet" error={errors.sex}>
        <select
          key={`sex-${values.sex}`}
          name="sex"
          defaultValue={values.sex}
          className={fieldClass}
        >
          <option value="" disabled>
            Seç
          </option>
          {sexOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Boy (cm)" error={errors.height}>
        <input
          key={`height-${values.height}`}
          name="heightCm"
          inputMode="numeric"
          defaultValue={values.height}
          className={fieldClass}
        />
      </Field>
      <Field label="Kilo (kg)" error={errors.weight}>
        <input
          key={`weight-${values.weight}`}
          name="weightKg"
          inputMode="numeric"
          defaultValue={values.weight}
          className={fieldClass}
        />
      </Field>
      <Field label="Hedef" error={errors.goal}>
        <select
          key={`goal-${values.goal}`}
          name="goal"
          defaultValue={values.goal}
          className={fieldClass}
        >
          <option value="" disabled>
            Seç
          </option>
          {goalOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Hareket" error={errors.activity}>
        <select
          key={`activity-${values.activity}`}
          name="activity"
          defaultValue={values.activity}
          className={fieldClass}
        >
          <option value="" disabled>
            Seç
          </option>
          {activityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Hastalık">
        <input
          key={`conditions-${values.conditions}`}
          name="conditions"
          defaultValue={values.conditions}
          className={fieldClass}
          placeholder="Yoksa boş bırak"
        />
      </Field>
      <Field label="Alerji">
        <input
          key={`allergies-${values.allergies}`}
          name="allergies"
          defaultValue={values.allergies}
          className={fieldClass}
          placeholder="Yoksa boş bırak"
        />
      </Field>
      <Field label="İlaç">
        <input
          key={`medications-${values.medications}`}
          name="medications"
          defaultValue={values.medications}
          className={fieldClass}
          placeholder="Yoksa boş bırak"
        />
      </Field>
      <Field label="Not">
        <textarea
          key={`notes-${values.notes}`}
          name="notes"
          rows={3}
          defaultValue={values.notes}
          className={fieldClass}
        />
      </Field>
      <button type="submit" className={`${primaryButtonClass} justify-center`}>
        Kaydet
      </button>
    </form>
  );
}
