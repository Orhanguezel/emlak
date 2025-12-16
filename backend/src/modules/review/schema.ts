// =============================================================
// FILE: src/modules/review/schema.ts
// =============================================================
import {
  mysqlTable,
  char,
  varchar,
  text,
  boolean,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

export const reviews = mysqlTable("reviews", {
  id: char("id", { length: 36 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  rating: int("rating").notNull().default(5), // 1..5
  comment: text("comment").notNull(),

  is_active: boolean("is_active").notNull().default(true),
  is_approved: boolean("is_approved").notNull().default(false),
  display_order: int("display_order").notNull().default(0),

  created_at: timestamp("created_at", { fsp: 3 }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { fsp: 3 }).notNull().defaultNow().onUpdateNow(),
});

// Önerilen indexler (migration SQL):
// CREATE INDEX reviews_active_idx ON reviews (is_active);
// CREATE INDEX reviews_approved_idx ON reviews (is_approved);
// CREATE INDEX reviews_order_idx ON reviews (display_order);
// CREATE INDEX reviews_created_idx ON reviews (created_at);
// CREATE INDEX reviews_updated_idx ON reviews (updated_at);
// CREATE INDEX reviews_rating_idx  ON reviews (rating);

export type ReviewRow = typeof reviews.$inferSelect;
export type ReviewInsert = typeof reviews.$inferInsert;

/** FE/Public View tipi */
export type ReviewView = ReviewRow & {};
