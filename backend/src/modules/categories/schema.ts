// =============================================================
// FILE: src/modules/categories/schema.ts
// =============================================================
import {
  mysqlTable,
  char,
  varchar,
  longtext,
  text,
  int,
  tinyint,
  datetime,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const categories = mysqlTable(
  "categories",
  {
    id: char("id", { length: 36 }).notNull().primaryKey(),

    /** FE Category.label */
    name: varchar("name", { length: 255 }).notNull(),
    /** FE Category.value — slug’ı value olarak kullanacağız */
    slug: varchar("slug", { length: 255 }).notNull(),

    description: text("description"),

    // ✅ TEKİL STORAGE PATTERN (birebir)
    image_url: longtext("image_url"),
    storage_asset_id: char("storage_asset_id", { length: 36 }),
    alt: varchar("alt", { length: 255 }),

    icon: varchar("icon", { length: 100 }),

    /** aktif/öne çıkarılmış ve sıralama */
    is_active: tinyint("is_active").notNull().default(1).$type<boolean>(),
    is_featured: tinyint("is_featured").notNull().default(0).$type<boolean>(),
    display_order: int("display_order").notNull().default(0),

    created_at: datetime("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => ({
    ux_slug: uniqueIndex("categories_slug_uq").on(t.slug),
    categories_active_idx: index("categories_active_idx").on(t.is_active),
    categories_order_idx: index("categories_order_idx").on(t.display_order),
    categories_storage_asset_idx: index("categories_storage_asset_idx").on(t.storage_asset_id),
  })
);

export type CategoryRow = typeof categories.$inferSelect;
export type NewCategoryRow = typeof categories.$inferInsert;
