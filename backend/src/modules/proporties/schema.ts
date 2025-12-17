// =============================================================
// FILE: src/modules/properties/schema.ts
// Pattern: slider/schema.ts stili + Sahibinden benzeri alanlar
// FINAL: enum + multi-select JSON kolonları + asset galerisi
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
  json,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// =============================================================
// properties — ilan modülü
// - legacy cover alanları: image_url + image_asset_id + alt
// - filtrelenebilir çekirdek alanlar: oda/bina yaşı/kat/kat sayısı/ısınma/kullanım durumu
// - bool filtreler: asansör/otopark/eşyalı/site içi vb.
// - ✅ min_price_admin: sadece admin görecek
// - ✅ multi-select: *_multi JSON string[] (legacy tekli alanlar korunur)
// =============================================================
export const properties = mysqlTable(
  "properties",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),

    // Başlık / slug
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),

    // Tip / Durum
    type: varchar("type", { length: 255 }).notNull(), // daire/villa/arsa
    status: varchar("status", { length: 64 }).notNull(), // satilik/kiralik

    // Adres / konum
    address: varchar("address", { length: 500 }).notNull(),
    district: varchar("district", { length: 255 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    neighborhood: varchar("neighborhood", { length: 255 }),

    // Koordinatlar (DECIMAL -> string)
    lat: decimal("lat", { precision: 10, scale: 6 }).$type<string>().notNull(),
    lng: decimal("lng", { precision: 10, scale: 6 }).$type<string>().notNull(),

    // Metin
    description: text("description"),

    // =========================================================
    // Fiyat
    // =========================================================
    price: decimal("price", { precision: 12, scale: 2 }).$type<string>(),
    currency: varchar("currency", { length: 8 }).notNull().default("TRY"),
    min_price_admin: decimal("min_price_admin", { precision: 12, scale: 2 }).$type<string>(),

    // Kart metası
    listing_no: varchar("listing_no", { length: 32 }),
    badge_text: varchar("badge_text", { length: 40 }),
    featured: tinyint("featured", { unsigned: true }).notNull().default(0),

    // =========================================================
    // m2
    // =========================================================
    gross_m2: int("gross_m2", { unsigned: true }),
    net_m2: int("net_m2", { unsigned: true }),

    // =========================================================
    // ✅ Filtrelenecek çekirdek alanlar
    // =========================================================
    // Oda sayısı: UI genelde "2+1" gibi ister
    rooms: varchar("rooms", { length: 16 }), // legacy tekli (örn "2+1")
    // ✅ Multi-select (örn ["1+1","2+1"])
    rooms_multi: json("rooms_multi").$type<string[] | null>(),

    // Sayısal filtre kolaylığı için numeric kolon
    bedrooms: tinyint("bedrooms", { unsigned: true }), // 0..50

    // Bina yaşı: "0", "5-10" gibi
    building_age: varchar("building_age", { length: 32 }),

    // Bulunduğu kat: UI'da "Zemin", "Bahçe" vs olabilir
    floor: varchar("floor", { length: 32 }),
    // Range filtre için numeric floor_no
    floor_no: int("floor_no"),

    // Kat sayısı
    total_floors: int("total_floors", { unsigned: true }),

    // Isıtma (legacy tekli)
    heating: varchar("heating", { length: 64 }),
    // ✅ Multi-select (örn ["kombi","merkezi"])
    heating_multi: json("heating_multi").$type<string[] | null>(),

    // Kullanım durumu (legacy tekli)
    usage_status: varchar("usage_status", { length: 32 }), // bos|kiracili|ev_sahibi|...
    // ✅ Multi-select
    usage_status_multi: json("usage_status_multi").$type<string[] | null>(),

    // =========================================================
    // ✅ Bool filtreler (UI’daki toggle/kriterler)
    // =========================================================
    furnished: tinyint("furnished", { unsigned: true }).notNull().default(0), // Eşyalı
    in_site: tinyint("in_site", { unsigned: true }).notNull().default(0), // Site içerisinde

    has_elevator: tinyint("has_elevator", { unsigned: true }).notNull().default(0), // Asansör
    has_parking: tinyint("has_parking", { unsigned: true }).notNull().default(0), // Otopark
    has_balcony: tinyint("has_balcony", { unsigned: true }).notNull().default(0),

    has_garden: tinyint("has_garden", { unsigned: true }).notNull().default(0),
    has_terrace: tinyint("has_terrace", { unsigned: true }).notNull().default(0),

    credit_eligible: tinyint("credit_eligible", { unsigned: true }).notNull().default(0),
    swap: tinyint("swap", { unsigned: true }).notNull().default(0),

    has_video: tinyint("has_video", { unsigned: true }).notNull().default(0),
    has_clip: tinyint("has_clip", { unsigned: true }).notNull().default(0),
    has_virtual_tour: tinyint("has_virtual_tour", { unsigned: true }).notNull().default(0),
    has_map: tinyint("has_map", { unsigned: true }).notNull().default(1),
    accessible: tinyint("accessible", { unsigned: true }).notNull().default(0),

    // =========================================================
    // Legacy cover (Slider ile aynı pattern)
    // =========================================================
    image_url: text("image_url"),
    image_asset_id: char("image_asset_id", { length: 36 }),
    alt: varchar("alt", { length: 255 }),

    // Yayın / sıralama
    is_active: tinyint("is_active").notNull().default(1),
    display_order: int("display_order").notNull().default(0),

    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
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

    // sık kullanılan filtre indexleri
    index("properties_price_idx").on(t.price),
    index("properties_rooms_idx").on(t.rooms),
    index("properties_bedrooms_idx").on(t.bedrooms),
    index("properties_building_age_idx").on(t.building_age),

    index("properties_floor_no_idx").on(t.floor_no),
    index("properties_total_floors_idx").on(t.total_floors),

    index("properties_heating_idx").on(t.heating),
    index("properties_usage_status_idx").on(t.usage_status),

    index("properties_furnished_idx").on(t.furnished),
    index("properties_in_site_idx").on(t.in_site),
    index("properties_has_elevator_idx").on(t.has_elevator),
    index("properties_has_parking_idx").on(t.has_parking),

    index("properties_credit_eligible_idx").on(t.credit_eligible),
    index("properties_swap_idx").on(t.swap),

    index("properties_has_video_idx").on(t.has_video),
    index("properties_has_virtual_tour_idx").on(t.has_virtual_tour),

    index("properties_image_asset_idx").on(t.image_asset_id),
  ],
);

// =============================================================
// property_assets — ilan galerisi (çoklu resim/medya)
// =============================================================
export const property_assets = mysqlTable(
  "property_assets",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    property_id: char("property_id", { length: 36 }).notNull(),

    asset_id: char("asset_id", { length: 36 }), // storage relation
    url: text("url"), // legacy / external
    alt: varchar("alt", { length: 255 }),

    kind: varchar("kind", { length: 24 }).notNull().default("image"), // image|video|plan
    mime: varchar("mime", { length: 100 }),

    is_cover: tinyint("is_cover", { unsigned: true }).notNull().default(0),
    display_order: int("display_order").notNull().default(0),

    created_at: datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    index("property_assets_property_idx").on(t.property_id),
    index("property_assets_asset_idx").on(t.asset_id),
    index("property_assets_cover_idx").on(t.property_id, t.is_cover),
    index("property_assets_order_idx").on(t.property_id, t.display_order),
  ],
);

export type PropertyRow = typeof properties.$inferSelect; // DECIMAL: string
export type NewPropertyRow = typeof properties.$inferInsert;

export type PropertyAssetRow = typeof property_assets.$inferSelect;
export type NewPropertyAssetRow = typeof property_assets.$inferInsert;

// =============================================================
// Helpers
// =============================================================
const toNum = (v: unknown): number => {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : 0;
};
const toBool = (v: unknown): boolean => v === true || v === 1 || v === "1" || v === "true";

// =============================================================
// Public/Admin Views
// NOTE: assets[] burada yok; repo'da property_assets çekip eklemelisin.
// =============================================================
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

    // filtrelenen ana alanlar
    rooms: r.rooms ?? null,
    rooms_multi: (r.rooms_multi ?? null) as string[] | null,

    bedrooms: r.bedrooms ?? null,
    building_age: r.building_age ?? null,

    floor: r.floor ?? null,
    floor_no: r.floor_no ?? null,
    total_floors: r.total_floors ?? null,

    heating: r.heating ?? null,
    heating_multi: (r.heating_multi ?? null) as string[] | null,

    usage_status: r.usage_status ?? null,
    usage_status_multi: (r.usage_status_multi ?? null) as string[] | null,

    // bool filtreler
    furnished: toBool(r.furnished),
    in_site: toBool(r.in_site),
    has_elevator: toBool(r.has_elevator),
    has_parking: toBool(r.has_parking),
    has_balcony: toBool(r.has_balcony),
    has_garden: toBool(r.has_garden),
    has_terrace: toBool(r.has_terrace),

    credit_eligible: toBool(r.credit_eligible),
    swap: toBool(r.swap),

    has_video: toBool(r.has_video),
    has_clip: toBool(r.has_clip),
    has_virtual_tour: toBool(r.has_virtual_tour),
    has_map: toBool(r.has_map),
    accessible: toBool(r.accessible),

    // legacy cover
    image_url: r.image_url ?? null,
    image_asset_id: r.image_asset_id ?? null,
    alt: r.alt ?? null,

    is_active: r.is_active === 1,
    display_order: r.display_order,

    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export function rowToAdminView(r: PropertyRow) {
  return {
    ...rowToPublicView(r),
    min_price_admin: r.min_price_admin ?? null,
  };
}

export type PropertyPublicView = ReturnType<typeof rowToPublicView>;
export type PropertyAdminView = ReturnType<typeof rowToAdminView>;
