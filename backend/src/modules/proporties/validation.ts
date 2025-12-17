// =============================================================
// FILE: src/modules/properties/validation.ts
// FINAL: enum + multi-select destekli validation + assets tmp id fix
// =============================================================
import { z } from "zod";

export const boolLike = z.union([
  z.boolean(),
  z.literal(0),
  z.literal(1),
  z.literal("0"),
  z.literal("1"),
  z.literal("true"),
  z.literal("false"),
]);

export const currencySchema = z.string().trim().min(1).max(8).default("TRY");

const numInt = z.coerce.number().int();
const num = z.coerce.number();

// =============================================================
// ENUMS (Final)
// =============================================================

// Isıtma enum
export const HEATING = ["kombi", "merkezi", "klima", "yerden", "soba", "dogalgaz", "isi_pompasi", "yok"] as const;

// Kullanım durumu enum
export const USAGE_STATUS = ["bos", "kiracili", "ev_sahibi", "mal_sahibi_oturuyor", "bilinmiyor"] as const;

// Oda enum (istersen genişlet)
export const ROOMS = [
  "1+0",
  "1+1",
  "2+0",
  "2+1",
  "2+2",
  "3+1",
  "3+2",
  "4+1",
  "4+2",
  "5+1",
  "6+1",
  "7+1",
  "8+1",
  "9+1",
  "10+1",
] as const;

// =============================================================
// Helpers: query array normalize (supports: ?x=a&x=b  OR ?x=a,b  OR single string)
// =============================================================
const toArrayFromQuery = (v: unknown): string[] | undefined => {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return undefined;
    // "a,b,c" -> ["a","b","c"]
    if (s.includes(",")) return s.split(",").map((x) => x.trim()).filter(Boolean);
    return [s];
  }
  return undefined;
};

// =============================================================
// LIST QUERY (Final) - multi-select destekli
// =============================================================
export const propertyListQuerySchema = z.object({
  order: z.string().optional(),
  sort: z.enum(["created_at", "updated_at", "price", "gross_m2", "net_m2"]).optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),

  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),

  is_active: boolLike.optional(),
  q: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  district: z.string().trim().optional(),
  city: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  type: z.string().trim().optional(),
  status: z.string().trim().optional(),
  featured: boolLike.optional(),

  price_min: num.nonnegative().optional(),
  price_max: num.nonnegative().optional(),
  gross_m2_min: numInt.min(0).optional(),
  gross_m2_max: numInt.min(0).optional(),
  net_m2_min: numInt.min(0).optional(),
  net_m2_max: numInt.min(0).optional(),

  // legacy tekli
  rooms: z.string().trim().max(16).optional(),
  // ✅ multi rooms filter
  rooms_multi: z.preprocess(toArrayFromQuery, z.array(z.enum(ROOMS)).max(30)).optional(),

  bedrooms_min: numInt.min(0).optional(),
  bedrooms_max: numInt.min(0).optional(),

  building_age: z.string().trim().max(32).optional(),

  floor: z.string().trim().max(32).optional(),
  floor_no_min: numInt.optional(),
  floor_no_max: numInt.optional(),

  total_floors_min: numInt.min(0).optional(),
  total_floors_max: numInt.min(0).optional(),

  // legacy tekli
  heating: z.string().trim().max(64).optional(),
  // ✅ multi heating filter
  heating_multi: z.preprocess(toArrayFromQuery, z.array(z.enum(HEATING)).max(30)).optional(),

  // legacy tekli
  usage_status: z.string().trim().max(32).optional(),
  // ✅ multi usage filter
  usage_status_multi: z.preprocess(toArrayFromQuery, z.array(z.enum(USAGE_STATUS)).max(30)).optional(),

  furnished: boolLike.optional(),
  in_site: boolLike.optional(),
  has_elevator: boolLike.optional(),
  has_parking: boolLike.optional(),

  has_balcony: boolLike.optional(),
  has_garden: boolLike.optional(),
  has_terrace: boolLike.optional(),

  credit_eligible: boolLike.optional(),
  swap: boolLike.optional(),
  has_video: boolLike.optional(),
  has_clip: boolLike.optional(),
  has_virtual_tour: boolLike.optional(),
  has_map: boolLike.optional(),
  accessible: boolLike.optional(),

  created_from: z.string().datetime().optional(),
  created_to: z.string().datetime().optional(),

  select: z.string().optional(),
});

export type PropertyListQuery = z.infer<typeof propertyListQuerySchema>;

// =============================================================
// ortak: detay alanları (create/update body) - enum + multi alanlar final
// =============================================================
const propertyDetailsSchema = z.object({
  price: z.number().finite().nonnegative().nullable().optional(),
  currency: currencySchema.optional(),
  min_price_admin: z.number().finite().nonnegative().nullable().optional(),

  listing_no: z.string().trim().max(32).nullable().optional(),
  badge_text: z.string().trim().max(40).nullable().optional(),
  featured: boolLike.optional(),

  gross_m2: z.coerce.number().int().min(0).nullable().optional(),
  net_m2: z.coerce.number().int().min(0).nullable().optional(),

  // legacy tekli + enum
  rooms: z.enum(ROOMS).nullable().optional(),
  // ✅ multi
  rooms_multi: z.array(z.enum(ROOMS)).max(30).nullable().optional(),

  bedrooms: z.coerce.number().int().min(0).max(50).nullable().optional(),

  building_age: z.string().trim().max(32).nullable().optional(),

  floor: z.string().trim().max(32).nullable().optional(),
  floor_no: z.coerce.number().int().nullable().optional(),

  total_floors: z.coerce.number().int().min(0).nullable().optional(),

  // legacy tekli + enum
  heating: z.enum(HEATING).nullable().optional(),
  // ✅ multi
  heating_multi: z.array(z.enum(HEATING)).max(30).nullable().optional(),

  // legacy tekli + enum
  usage_status: z.enum(USAGE_STATUS).nullable().optional(),
  // ✅ multi
  usage_status_multi: z.array(z.enum(USAGE_STATUS)).max(30).nullable().optional(),

  furnished: boolLike.optional(),
  in_site: boolLike.optional(),
  has_elevator: boolLike.optional(),
  has_parking: boolLike.optional(),
  has_balcony: boolLike.optional(),
  has_garden: boolLike.optional(),
  has_terrace: boolLike.optional(),

  credit_eligible: boolLike.optional(),
  swap: boolLike.optional(),
  has_video: boolLike.optional(),
  has_clip: boolLike.optional(),
  has_virtual_tour: boolLike.optional(),
  has_map: boolLike.optional(),
  accessible: boolLike.optional(),

  image_url: z.string().url().nullable().optional(),
  image_asset_id: z.string().trim().length(36).nullable().optional(),
  alt: z.string().trim().max(255).nullable().optional(),

  neighborhood: z.string().trim().max(255).nullable().optional(),
});

// =============================================================
// assets item schema (✅ asset_id OR url required)
// FIX: tmp_* id accept, DB always generates uuid
// =============================================================
const uuid36 = z.string().trim().length(36);

const assetClientIdSchema = z.string().trim().min(1).max(80).optional(); // tmp_... OK

const assetItemSchema = z
  .object({
    // UI key: tmp_... olabilir, UUID olmak zorunda değil
    id: assetClientIdSchema,

    asset_id: uuid36.nullable().optional(),
    url: z.string().trim().min(1).nullable().optional(), // url() yerine min(1): relative/blob vb. patlamasın
    alt: z.string().trim().max(255).nullable().optional(),
    kind: z.enum(["image", "video", "plan"]).optional().default("image"),
    mime: z.string().trim().max(100).nullable().optional(),
    is_cover: boolLike.optional(),
    display_order: z.coerce.number().int().min(0).optional().default(0),
  })
  .refine(
    (v) =>
      (typeof v.asset_id === "string" && v.asset_id.length === 36) ||
      (typeof v.url === "string" && v.url.trim().length > 0),
    { message: "asset_id_or_url_required" },
  );

// =============================================================
// CREATE / UPSERT body
// =============================================================
export const upsertPropertyBodySchema = z
  .object({
    title: z.string().min(2).max(255).trim(),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug sadece küçük harf, rakam ve tire içermelidir")
      .trim(),

    type: z.string().min(2).max(255).trim(),
    status: z.string().min(1).max(64).trim(),

    address: z.string().min(2).max(500).trim(),
    district: z.string().min(1).max(255).trim(),
    city: z.string().min(1).max(255).trim(),

    coordinates: z.object({
      lat: z.number().finite(),
      lng: z.number().finite(),
    }),

    description: z.string().max(5000).nullable().optional(),

    is_active: boolLike.optional().default(true),
    display_order: z.coerce.number().int().min(0).optional().default(0),

    assets: z.array(assetItemSchema).optional(),
  })
  .merge(propertyDetailsSchema);

export type UpsertPropertyBody = z.infer<typeof upsertPropertyBodySchema>;

// =============================================================
// PATCH body (✅ coordinates partial allowed)
// =============================================================
export const patchPropertyBodySchema = z
  .object({
    title: upsertPropertyBodySchema.shape.title.optional(),
    slug: upsertPropertyBodySchema.shape.slug.optional(),
    type: upsertPropertyBodySchema.shape.type.optional(),
    status: upsertPropertyBodySchema.shape.status.optional(),

    address: upsertPropertyBodySchema.shape.address.optional(),
    district: upsertPropertyBodySchema.shape.district.optional(),
    city: upsertPropertyBodySchema.shape.city.optional(),

    coordinates: z
      .object({
        lat: z.number().finite().optional(),
        lng: z.number().finite().optional(),
      })
      .optional(),

    description: upsertPropertyBodySchema.shape.description.optional(),

    is_active: upsertPropertyBodySchema.shape.is_active.optional(),
    display_order: upsertPropertyBodySchema.shape.display_order.optional(),

    assets: z.array(assetItemSchema).optional(),
  })
  .merge(propertyDetailsSchema.partial());

export type PatchPropertyBody = z.infer<typeof patchPropertyBodySchema>;
