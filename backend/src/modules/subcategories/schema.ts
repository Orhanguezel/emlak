// =============================================================
// FILE: src/modules/subcategories/schema.ts
// =============================================================
import {
  mysqlTable, char, varchar, longtext, text, int, tinyint, datetime,
  index, uniqueIndex, foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { categories } from "../categories/schema";

export const subCategories = mysqlTable(
  "sub_categories",
  {
    id: char("id", { length: 36 }).notNull().primaryKey(),
    category_id: char("category_id", { length: 36 }).notNull(),

    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),

    description: text("description"),

    image_url: longtext("image_url"),
    storage_asset_id: char("storage_asset_id", { length: 36 }),
    alt: varchar("alt", { length: 255 }),
    icon: varchar("icon", { length: 100 }),

    is_active: tinyint("is_active").notNull().default(1).$type<boolean>(),
    is_featured: tinyint("is_featured").notNull().default(0).$type<boolean>(),
    display_order: int("display_order").notNull().default(0),

    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("sub_categories_parent_slug_uq").on(t.category_id, t.slug),
    index("sub_categories_category_id_idx").on(t.category_id),
    index("sub_categories_active_idx").on(t.is_active),
    index("sub_categories_order_idx").on(t.display_order),
    index("sub_categories_storage_asset_idx").on(t.storage_asset_id),
    foreignKey({
      columns: [t.category_id],
      foreignColumns: [categories.id],
      name: "fk_sub_categories_category",
    }).onDelete("restrict").onUpdate("cascade"),
  ]
);

export type SubCategoryRow = typeof subCategories.$inferSelect;
export type NewSubCategoryRow = typeof subCategories.$inferInsert;
