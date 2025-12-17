// =============================================================
// FILE: src/modules/properties/validation.ts
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

export const currencySchema = z
  .string()
  .trim()
  .min(1)
  .max(8)
  .default("TRY");

/** LIST query (admin/public aynı) */
export const propertyListQuerySchema = z.object({
  // "created_at.asc" gibi
  order: z.string().optional(),
  sort: z.enum(["created_at", "updated_at"]).optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),

  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),

  /** filtreler */
  is_active: boolLike.optional(),
  q: z.string().optional(),
  slug: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),

  featured: boolLike.optional(),

  /** kolon seçimi (şimdilik yoksayılacak) */
  select: z.string().optional(),
});

export type PropertyListQuery = z.infer<typeof propertyListQuerySchema>;

/** ortak: sahibinden alanları */
const propertyDetailsSchema = z.object({
  // fiyatlar (decimal string olarak DB’ye yazılacak; burada number alıyoruz)
  price: z.number().finite().nonnegative().nullable().optional(),
  currency: currencySchema.optional(),
  min_price_admin: z.number().finite().nonnegative().nullable().optional(), // ✅ admin-only alandır ama body ile alınabilir (admin)

  listing_no: z.string().trim().max(32).nullable().optional(),
  badge_text: z.string().trim().max(40).nullable().optional(),
  featured: boolLike.optional(),

  gross_m2: z.coerce.number().int().min(0).nullable().optional(),
  net_m2: z.coerce.number().int().min(0).nullable().optional(),
  rooms: z.string().trim().max(16).nullable().optional(),
  building_age: z.string().trim().max(32).nullable().optional(),
  floor: z.string().trim().max(32).nullable().optional(),
  total_floors: z.coerce.number().int().min(0).nullable().optional(),

  heating: z.string().trim().max(64).nullable().optional(),
  furnished: boolLike.optional(),
  in_site: boolLike.optional(),
  has_balcony: boolLike.optional(),
  has_parking: boolLike.optional(),
  has_elevator: boolLike.optional(),

  // görsel (cover)
  image_url: z.string().url().nullable().optional(),
  image_asset_id: z.string().trim().length(36).nullable().optional(),
  alt: z.string().trim().max(255).nullable().optional(),

  neighborhood: z.string().trim().max(255).nullable().optional(),
});

/** CREATE / UPSERT body */
export const upsertPropertyBodySchema = z
  .object({
    title: z.string().min(2).max(255).trim(),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "slug sadece küçük harf, rakam ve tire içermelidir",
      )
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
  })
  .merge(propertyDetailsSchema);

export type UpsertPropertyBody = z.infer<typeof upsertPropertyBodySchema>;

/** PATCH body (hepsi opsiyonel) */
export const patchPropertyBodySchema = upsertPropertyBodySchema.partial();
export type PatchPropertyBody = z.infer<typeof patchPropertyBodySchema>;
