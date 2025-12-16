// =============================================================
// FILE: src/modules/categories/validation.ts
// =============================================================
import { z } from "zod";

const emptyToNull = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? null : v), schema);

export const boolLike = z.union([
  z.boolean(),
  z.literal(0),
  z.literal(1),
  z.literal("0"),
  z.literal("1"),
  z.literal("true"),
  z.literal("false"),
]);

const baseCategorySchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),

    description: emptyToNull(z.string().optional().nullable()),
    image_url: emptyToNull(z.string().url().optional().nullable()), // LONGTEXT, limit yok
    alt: emptyToNull(z.string().max(255).optional().nullable()),

    icon: emptyToNull(z.string().max(100).optional().nullable()),

    is_active: boolLike.optional(),
    is_featured: boolLike.optional(),
    display_order: z.coerce.number().int().min(0).optional(),

    // FE’den gelebilecek ama DB’de olmayan alanları tolere et
    seo_title: emptyToNull(z.string().max(255).optional().nullable()),
    seo_description: emptyToNull(z.string().max(500).optional().nullable()),
  })
  .passthrough();

export const categoryCreateSchema = baseCategorySchema.superRefine(
  (data, ctx) => {
    if ("parent_id" in (data as Record<string, unknown>)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "parent_id_not_supported_on_categories",
        path: ["parent_id"],
      });
    }
  }
);

export const categoryUpdateSchema = baseCategorySchema
  .partial()
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "no_fields_to_update",
      });
    }
    if ("parent_id" in (data as Record<string, unknown>)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "parent_id_not_supported_on_categories",
        path: ["parent_id"],
      });
    }
  });

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

/** ✅ Storage asset ile kategori görselini ayarlama/silme (+ alt) */
export const categorySetImageSchema = z
  .object({
    /** null/undefined ⇒ görseli kaldır */
    asset_id: z.string().uuid().nullable().optional(),
    /** alt gelirse güncellenir; null/"" ⇒ alt temizlenir */
    alt: emptyToNull(z.string().max(255).optional().nullable()),
  })
  .strict();

export type CategorySetImageInput = z.infer<typeof categorySetImageSchema>;
