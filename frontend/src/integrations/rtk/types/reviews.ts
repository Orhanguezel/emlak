// =============================================================
// FILE: src/integrations/metahub/db/types/reviews.ts
// =============================================================

/** DB/BE görünümü */
export interface ReviewView {
  id: string;
  name: string;
  email: string;
  rating: number;        // 1..5
  comment: string;

  is_active: boolean;
  is_approved: boolean;
  display_order: number;

  created_at: string;    // ISO/Date string
  updated_at: string;
}

export type ReviewOrderBy =
  | "created_at"
  | "updated_at"
  | "display_order"
  | "rating"
  | "name";

export type SortOrder = "asc" | "desc";

/** Liste sorgu parametreleri (hepsi opsiyonel) */
export interface ReviewListParams {
  search?: string;
  approved?: boolean;
  active?: boolean;
  minRating?: number;
  maxRating?: number;
  limit?: number;
  offset?: number;
  orderBy?: ReviewOrderBy;
  order?: SortOrder;
}

/** Create payload (public/admin) */
export interface ReviewCreateInput {
  name: string;
  email: string;
  rating: number; // 1..5
  comment: string;

  // opsiyoneller (BE default’ları var)
  is_active?: boolean;   // default true
  is_approved?: boolean; // public default false
  display_order?: number;
}

/** Update payload (admin) */
export type ReviewUpdateInput = Partial<ReviewCreateInput>;
