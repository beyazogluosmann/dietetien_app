import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const dietitian = pgTable("dietitian", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const client = pgTable("client", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  surname: text("surname").notNull().default(""),
  phone: text("phone").notNull(),
  note: text("note").notNull().default(""),
  dietitianId: uuid("dietitian_id")
    .notNull()
    .references(() => dietitian.id),
});

export const clientAccount = pgTable("client_account", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .unique()
    .references(() => client.id),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const clientRequest = pgTable("client_request", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .unique()
    .references(() => client.id),
  dietitianId: uuid("dietitian_id")
    .notNull()
    .references(() => dietitian.id),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const anamnesis = pgTable("anamnesis", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .unique()
    .references(() => client.id),
  age: text("age").notNull(),
  sex: text("sex").notNull(),
  heightCm: text("height_cm").notNull(),
  weightKg: text("weight_kg").notNull(),
  goal: text("goal").notNull(),
  conditions: text("conditions").notNull().default(""),
  allergies: text("allergies").notNull().default(""),
  medications: text("medications").notNull().default(""),
  activity: text("activity").notNull(),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dietList = pgTable("diet_list", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => client.id),
  authorId: uuid("author_id")
    .notNull()
    .references(() => dietitian.id),
  body: text("body").notNull().default(""),
  status: text("status").notNull().default("draft"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const mealNote = pgTable(
  "meal_note",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => client.id),
    listId: uuid("list_id")
      .notNull()
      .references(() => dietList.id),
    day: text("day").notNull(),
    meal: text("meal").notNull(),
    body: text("body").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.listId, table.day, table.meal)],
);