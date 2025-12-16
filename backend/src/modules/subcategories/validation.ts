// =============================================================
// FILE: src/modules/subcategories/validation.ts
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

export const subCategoryCreateSchema = z
  .object({
    id: z.string().uuid().optional(),
    category_id: z.string().uuid(),

    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),

    description: emptyToNull(z.string().optional().nullable()),
    image_url: emptyToNull(z.string().url().optional().nullable()),
    alt: emptyToNull(z.string().max(255).optional().nullable()),
    icon: emptyToNull(z.string().max(100).optional().nullable()),

    is_active: boolLike.optional(),
    is_featured: boolLike.optional(),
    display_order: z.coerce.number().int().min(0).optional(),

    // FE’de olabilir; DB’de yok (göz ardı edilir)
    seo_title: emptyToNull(z.string().max(255).optional().nullable()),
    seo_description: emptyToNull(z.string().max(500).optional().nullable()),
  })
  .passthrough();

export const subCategoryUpdateSchema = subCategoryCreateSchema
  .partial()
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "no_fields_to_update" });
    }
  });

export type SubCategoryCreateInput = z.infer<typeof subCategoryCreateSchema>;
export type SubCategoryUpdateInput = z.infer<typeof subCategoryUpdateSchema>;

export const subCategorySetImageSchema = z
  .object({
    asset_id: z.string().uuid().nullable().optional(), // null/undefined ⇒ kaldır
    alt: emptyToNull(z.string().max(255).optional().nullable()),
  })
  .strict();

export type SubCategorySetImageInput = z.infer<typeof subCategorySetImageSchema>;
