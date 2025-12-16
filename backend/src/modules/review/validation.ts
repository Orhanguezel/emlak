// src/modules/review/validation.ts
import { z } from "zod";

export const IdParam = z.object({
  id: z.string().min(1, "id gereklidir"),
});

/** Query boolean'ı güvenle çöz: "0"/"1"/"false"/"true"/0/1/boolean */
const boolQuery = z.preprocess((v) => {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "1" || s === "true") return true;
    if (s === "0" || s === "false") return false;
  }
  // tanınmayan değer → filtre uygulama
  return undefined;
}, z.boolean().optional());

export const ReviewListParams = z.object({
  search: z.string().trim().optional(),
  approved: boolQuery, // <-- değişti
  active: boolQuery,   // <-- değişti
  minRating: z.coerce.number().int().min(1).max(5).optional(),
  maxRating: z.coerce.number().int().min(1).max(5).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
  offset: z.coerce.number().int().min(0).default(0),
  orderBy: z.enum(["created_at", "updated_at", "display_order", "rating", "name"]).default("display_order"),
  order: z.enum(["asc", "desc"]).default("asc"),
}).refine(
  (o) => o.minRating === undefined || o.maxRating === undefined || o.minRating <= o.maxRating,
  { message: "minRating maxRating'den büyük olamaz", path: ["minRating"] }
);

export const ReviewCreateInput = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5),
  is_active: z.boolean().optional(),
  is_approved: z.boolean().optional(),
  display_order: z.number().int().min(0).optional(),
});

export const ReviewUpdateInput = ReviewCreateInput.partial();

export type ReviewListParams = z.infer<typeof ReviewListParams>;
export type ReviewCreateInput = z.infer<typeof ReviewCreateInput>;
export type ReviewUpdateInput = z.infer<typeof ReviewUpdateInput>;
