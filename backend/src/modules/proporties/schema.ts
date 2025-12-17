// =============================================================
// FILE: src/modules/properties/schema.ts
// Pattern: slider/schema.ts stili + Sahibinden benzeri alanlar
// =============================================================
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

/**
 * properties — ilan modülü
 * - image_url (legacy) + image_asset_id (yeni ilişki) + alt
 * - Sahibinden benzeri: fiyat, m2, oda, kat, ısınma, eşya, site içi vb.
 * - ✅ min_price_admin: sadece admin görecek (public mapper’da dönme)
 */
export const properties = mysqlTable(
  "properties",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),

    // Başlık / slug
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),

    // Tip / Durum (senin mevcut alanların)
    type: varchar("type", { length: 255 }).notNull(), // örn: daire/villa/arsa
    status: varchar("status", { length: 64 }).notNull(), // örn: satilik/kiralik

    // Adres / konum
    address: varchar("address", { length: 500 }).notNull(),
    district: varchar("district", { length: 255 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    neighborhood: varchar("neighborhood", { length: 255 }), // ops

    // Koordinatlar (DECIMAL -> string)
    lat: decimal("lat", { precision: 10, scale: 6 }).$type<string>().notNull(),
    lng: decimal("lng", { precision: 10, scale: 6 }).$type<string>().notNull(),

    // Metin
    description: text("description"),

    // =========================================================
    // ✅ Sahibinden benzeri detaylar
    // =========================================================

    // Fiyat (public)
    price: decimal("price", { precision: 12, scale: 2 }).$type<string>(), // ops: bazı ilanlarda fiyat gizli olabilir
    currency: varchar("currency", { length: 8 }).notNull().default("TRY"),

    // ✅ Admin-only min fiyat (ör: yönetim için taban maliyet / minimum satış)
    min_price_admin: decimal("min_price_admin", { precision: 12, scale: 2 }).$type<string>(),

    // Kart metası
    listing_no: varchar("listing_no", { length: 32 }), // ilan no (ops)
    badge_text: varchar("badge_text", { length: 40 }), // "Fırsat" vs
    featured: tinyint("featured", { unsigned: true }).notNull().default(0),

    // Emlak detay
    gross_m2: int("gross_m2", { unsigned: true }),
    net_m2: int("net_m2", { unsigned: true }),
    rooms: varchar("rooms", { length: 16 }), // "2+1"
    building_age: varchar("building_age", { length: 32 }), // "0", "5-10"
    floor: varchar("floor", { length: 32 }), // "3", "Zemin"
    total_floors: int("total_floors", { unsigned: true }),

    // Isınma / eşya / site vb.
    heating: varchar("heating", { length: 64 }), // "kombi"
    furnished: tinyint("furnished", { unsigned: true }).notNull().default(0),
    in_site: tinyint("in_site", { unsigned: true }).notNull().default(0),
    has_balcony: tinyint("has_balcony", { unsigned: true }).notNull().default(0),
    has_parking: tinyint("has_parking", { unsigned: true }).notNull().default(0),
    has_elevator: tinyint("has_elevator", { unsigned: true }).notNull().default(0),

    // =========================================================
    // ✅ Görsel (Slider ile aynı pattern)
    // =========================================================
    image_url: text("image_url"), // legacy public url
    image_asset_id: char("image_asset_id", { length: 36 }), // storage relation
    alt: varchar("alt", { length: 255 }),

    // Yayın / sıralama (senin mevcut)
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
    index("properties_featured_idx").on(t.featured),
    index("properties_display_order_idx").on(t.display_order),

    index("properties_district_idx").on(t.district),
    index("properties_city_idx").on(t.city),
    index("properties_type_idx").on(t.type),
    index("properties_status_idx").on(t.status),

    index("properties_price_idx").on(t.price),
    index("properties_image_asset_idx").on(t.image_asset_id),
  ],
);

export type PropertyRow = typeof properties.$inferSelect;      // DECIMAL: string
export type NewPropertyRow = typeof properties.$inferInsert;   // DECIMAL: string

const toNum = (v: unknown): number => {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : 0;
};
const toBool = (v: unknown): boolean => v === true || v === 1 || v === "1" || v === "true";

/** ✅ Public view: admin-only alan dönmez */
export function rowToPublicView(r: PropertyRow) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,

    type: r.type,
    status: r.status,

    address: r.address,
    district: r.district,
    city: r.city,
    neighborhood: r.neighborhood ?? null,

    coordinates: { lat: toNum(r.lat), lng: toNum(r.lng) },

    description: r.description ?? null,

    price: r.price ?? null,
    currency: r.currency,

    listing_no: r.listing_no ?? null,
    badge_text: r.badge_text ?? null,
    featured: toBool(r.featured),

    gross_m2: r.gross_m2 ?? null,
    net_m2: r.net_m2 ?? null,
    rooms: r.rooms ?? null,
    building_age: r.building_age ?? null,
    floor: r.floor ?? null,
    total_floors: r.total_floors ?? null,

    heating: r.heating ?? null,
    furnished: toBool(r.furnished),
    in_site: toBool(r.in_site),
    has_balcony: toBool(r.has_balcony),
    has_parking: toBool(r.has_parking),
    has_elevator: toBool(r.has_elevator),

    image_url: r.image_url ?? null,
    image_asset_id: r.image_asset_id ?? null,
    alt: r.alt ?? null,

    is_active: r.is_active === 1,
    display_order: r.display_order,

    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

/** ✅ Admin view: min_price_admin dahil */
export function rowToAdminView(r: PropertyRow) {
  return {
    ...rowToPublicView(r),
    min_price_admin: r.min_price_admin ?? null,
  };
}

export type PropertyPublicView = ReturnType<typeof rowToPublicView>;
export type PropertyAdminView = ReturnType<typeof rowToAdminView>;
