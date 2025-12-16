// =============================================================
// FILE: src/modules/slider/validation.ts
// =============================================================
import { z } from "zod";

/** Ortak: id param */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/** Ortak: idOrSlug param (public detail istersen) */
export const idOrSlugParamSchema = z.object({
  idOrSlug: z.string().min(1),
});

/** Public list (is_active dışarıdan alınmaz, hep aktifler) */
export const publicListQuerySchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(0).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  sort: z.enum(["display_order", "name", "created_at", "updated_at"]).default("display_order"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

/** Admin list */
export const adminListQuerySchema = publicListQuerySchema.extend({
  is_active: z.coerce.boolean().optional(),
});

/** Create */
export const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),

  image_url: z.string().url().optional().nullable(),
  image_asset_id: z.string().uuid().optional().nullable(),
  alt: z.string().max(255).optional().nullable(),
  buttonText: z.string().max(100).optional().nullable(),
  buttonLink: z.string().max(255).optional().nullable(),

  featured: z.coerce.boolean().optional().default(false),
  is_active: z.coerce.boolean().optional().default(true),

  display_order: z.coerce.number().int().min(0).optional(),
});

/** Update (hepsi opsiyonel) */
export const updateSchema = createSchema.partial();

/** Reorder (verilen id sırasına göre 1..N) */
export const reorderSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1),
});

/** Toggle/set status */
export const setStatusSchema = z.object({
  is_active: z.coerce.boolean(),
});

/** ✅ Görsel bağlama/çıkarma (kategori ve subCategory ile aynı isim) */
export const setImageSchema = z.object({
  /** null/undefined ⇒ görseli kaldır */
  asset_id: z.string().uuid().nullable().optional(),
});

export type PublicListQuery = z.infer<typeof publicListQuerySchema>;
export type AdminListQuery  = z.infer<typeof adminListQuerySchema>;
export type CreateBody      = z.infer<typeof createSchema>;
export type UpdateBody      = z.infer<typeof updateSchema>;
export type SetImageBody    = z.infer<typeof setImageSchema>;
