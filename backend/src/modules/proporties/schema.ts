// src/modules/proporties/schema.ts
import {
  mysqlTable,
  char,
  varchar,
  tinyint,
  datetime,
  uniqueIndex,
  index,
  int,
  decimal,
  text,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const properties = mysqlTable(
  "properties",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),

    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),

    type: varchar("type", { length: 255 }).notNull(),
    status: varchar("status", { length: 64 }).notNull(),

    address: varchar("address", { length: 500 }).notNull(),
    district: varchar("district", { length: 255 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),

    // DECIMAL varsayılanı string; TS’de açıkça belirt
    lat: decimal("lat", { precision: 10, scale: 6 }).$type<string>().notNull(),
    lng: decimal("lng", { precision: 10, scale: 6 }).$type<string>().notNull(),

    description: text("description"), // nullable

    is_active: tinyint("is_active").notNull().default(1),
    display_order: int("display_order").notNull().default(0),

    created_at: datetime("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("ux_properties_slug").on(t.slug),
    index("properties_created_idx").on(t.created_at),
    index("properties_updated_idx").on(t.updated_at),
    index("properties_is_active_idx").on(t.is_active),
    index("properties_district_idx").on(t.district),
    index("properties_city_idx").on(t.city),
    index("properties_type_idx").on(t.type),
    index("properties_status_idx").on(t.status),
    index("properties_display_order_idx").on(t.display_order),
  ],
);

export type PropertyRow = typeof properties.$inferSelect;      // lat/lng: string
export type NewPropertyRow = typeof properties.$inferInsert;   // lat/lng: string

const toNum = (v: unknown): number =>
  typeof v === "string" ? Number(v) : (v as number);

export function rowToView(r: PropertyRow) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    type: r.type,
    status: r.status,

    address: r.address,
    district: r.district,
    city: r.city,

    coordinates: { lat: toNum(r.lat), lng: toNum(r.lng) },

    description: r.description ?? null,

    is_active: r.is_active === 1,
    display_order: r.display_order,

    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export type PropertyView = ReturnType<typeof rowToView>;
