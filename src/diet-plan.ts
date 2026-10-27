export const weekDays = [
  { id: "monday", label: "Pazartesi", short: "Pzt" },
  { id: "tuesday", label: "Salı", short: "Sal" },
  { id: "wednesday", label: "Çarşamba", short: "Çar" },
  { id: "thursday", label: "Perşembe", short: "Per" },
  { id: "friday", label: "Cuma", short: "Cum" },
  { id: "saturday", label: "Cumartesi", short: "Cmt" },
  { id: "sunday", label: "Pazar", short: "Paz" },
] as const;

export const meals = [
  { id: "morning", label: "Sabah" },
  { id: "noon", label: "Öğle" },
  { id: "evening", label: "Akşam" },
  { id: "snack", label: "Ara öğün" },
] as const;

export type DayId = (typeof weekDays)[number]["id"];
export type MealId = (typeof meals)[number]["id"];

export type DietPlan = {
  version: 1;
  days: Record<DayId, Record<MealId, string>>;
};

export function emptyPlan(): DietPlan {
  const days = {} as DietPlan["days"];
  for (const day of weekDays) {
    days[day.id] = { morning: "", noon: "", evening: "", snack: "" };
  }
  return { version: 1, days };
}

export function parsePlan(body: string): DietPlan | null {
  try {
    const value = JSON.parse(body) as Partial<DietPlan>;
    if (value.version !== 1 || !value.days) {
      return null;
    }
    const plan = emptyPlan();
    for (const day of weekDays) {
      for (const meal of meals) {
        const text = value.days[day.id]?.[meal.id];
        plan.days[day.id][meal.id] = typeof text === "string" ? text : "";
      }
    }
    return plan;
  } catch {
    return null;
  }
}

export function dayHasText(plan: DietPlan, day: DayId) {
  return meals.some((meal) => plan.days[day][meal.id].trim().length > 0);
}
