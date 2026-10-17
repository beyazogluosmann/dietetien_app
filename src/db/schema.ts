import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const dietitian = pgTable("dietitian", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const client = pgTable("client", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
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

export const dietList = pgTable("diet_list", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .unique()
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