export const sexOptions = [
  { value: "female", label: "Kadın" },
  { value: "male", label: "Erkek" },
] as const;

export const goalOptions = [
  { value: "lose", label: "Kilo vermek" },
  { value: "gain", label: "Kilo almak" },
  { value: "keep", label: "Korumak" },
] as const;

export const activityOptions = [
  { value: "desk", label: "Masa başı" },
  { value: "light", label: "Hafif" },
  { value: "medium", label: "Orta" },
  { value: "high", label: "Yüksek" },
] as const;

export function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function parseNumber(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/cm|kg|yaş|yas/g, "")
    .replace(/\s/g, "")
    .replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return null;
  }
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

export function parseAge(value: string) {
  const number = parseNumber(value);
  if (number === null) {
    return null;
  }
  const year = new Date().getFullYear();
  if (number >= 1900 && number <= year) {
    const age = year - number;
    return age >= 12 && age <= 100 ? age : null;
  }
  if (Number.isInteger(number) && number >= 12 && number <= 100) {
    return number;
  }
  return null;
}

export function parseHeightCm(value: string) {
  const number = parseNumber(value);
  if (number === null) {
    return null;
  }
  const cm = number >= 1.2 && number <= 2.5 ? Math.round(number * 100) : number;
  if (cm >= 120 && cm <= 230) {
    return Math.round(cm);
  }
  return null;
}

export function parseWeightKg(value: string) {
  const number = parseNumber(value);
  if (number === null) {
    return null;
  }
  if (number >= 30 && number <= 250) {
    return Math.round(number * 10) / 10;
  }
  return null;
}

export function choiceValue(
  options: readonly { value: string; label: string }[],
  raw: string,
) {
  const text = raw.trim().toLocaleLowerCase("tr");
  const found = options.find(
    (option) => option.value === raw.trim() || option.label.toLocaleLowerCase("tr") === text,
  );
  return found?.value ?? null;
}

export function bodyMassIndex(heightCm: string, weightKg: string) {
  const height = Number(heightCm) / 100;
  const weight = Number(weightKg);
  if (!height || !weight) {
    return null;
  }
  return Math.round((weight / (height * height)) * 10) / 10;
}

export type AnamnesisFormState = {
  errors: {
    age?: string;
    sex?: string;
    height?: string;
    weight?: string;
    goal?: string;
    activity?: string;
  };
  values: {
    age: string;
    sex: string;
    height: string;
    weight: string;
    goal: string;
    activity: string;
    conditions: string;
    allergies: string;
    medications: string;
    notes: string;
  };
};

export const emptyAnamnesisForm: AnamnesisFormState = {
  errors: {},
  values: {
    age: "",
    sex: "",
    height: "",
    weight: "",
    goal: "",
    activity: "",
    conditions: "",
    allergies: "",
    medications: "",
    notes: "",
  },
};

export function bodyMassLabel(index: number) {
  if (index < 18.5) return "Zayıf";
  if (index < 25) return "Normal";
  if (index < 30) return "Fazla kilolu";
  return "Obez";
}
