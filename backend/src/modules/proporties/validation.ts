// src/modules/proporties/validation.ts
import { z } from "zod";

export const boolLike = z.union([
  z.boolean(),
  z.literal(0), z.literal(1),
  z.literal("0"), z.literal("1"),
  z.literal("true"), z.literal("false"),
]);

/** LIST query (admin/public aynı) */
export const propertyListQuerySchema = z.object({
  // sıralama: "created_at.asc" gibi
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
  type: z.string().optional(),
  status: z.string().optional(),

  /** kolon seçimi (şimdilik yoksayılacak) */
  select: z.string().optional(),
});
export type PropertyListQuery = z.infer<typeof propertyListQuerySchema>;

/** CREATE / UPSERT body */
export const upsertPropertyBodySchema = z.object({
  title: z.string().min(2).max(255).trim(),
  slug: z
    .string()
    .min(1).max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug sadece küçük harf, rakam ve tire içermelidir")
    .trim(),

  type: z.string().min(2).max(255).trim(),   // örn: "Daire", "Arsa"
  status: z.string().min(1).max(64).trim(),  // örn: "new", "in_progress", "sold"

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
});
export type UpsertPropertyBody = z.infer<typeof upsertPropertyBodySchema>;

/** PATCH body (hepsi opsiyonel) */
export const patchPropertyBodySchema = upsertPropertyBodySchema.partial();
export type PatchPropertyBody = z.infer<typeof patchPropertyBodySchema>;
