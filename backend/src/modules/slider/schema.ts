// =============================================================
// FILE: src/modules/slider/schema.ts
// =============================================================
import {
  mysqlTable,
  int,
  char,
  varchar,
  text,
  tinyint,
  datetime,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

/**
 * slider — public modül (id: int AI → FE için numeric)
 * image_url (legacy) + image_asset_id (yeni ilişki) birlikte tutulur.
 */
export const slider = mysqlTable(
  "slider",
  {
    id: int("id", { unsigned: true }).autoincrement().notNull().primaryKey(),

    uuid: char("uuid", { length: 36 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),

    image_url: text("image_url"),
    /** ✅ Standart ad: image_asset_id */
    image_asset_id: char("image_asset_id", { length: 36 }),

    alt: varchar("alt", { length: 255 }),
    buttonText: varchar("button_text", { length: 100 }),
    buttonLink: varchar("button_link", { length: 255 }),

    featured: tinyint("featured", { unsigned: true }).notNull().default(0),
    is_active: tinyint("is_active", { unsigned: true }).notNull().default(1),

    display_order: int("display_order", { unsigned: true }).notNull().default(0),

    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
  },
  (t) => ({
    uniq_slug: uniqueIndex("uniq_slider_slug").on(t.slug),
    idx_active: index("idx_slider_active").on(t.is_active),
    idx_order: index("idx_slider_order").on(t.display_order),
    idx_image_asset: index("idx_slider_image_asset").on(t.image_asset_id),
    idx_uuid: uniqueIndex("uniq_slider_uuid").on(t.uuid),
  })
);

export type SliderRow = typeof slider.$inferSelect;
export type NewSliderRow = typeof slider.$inferInsert;
