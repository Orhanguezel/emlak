// src/integrations/metahub/db/types/recent_works.ts

// === Shared primitives ===
export type BoolLike = boolean | 0 | 1 | "0" | "1" | "true" | "false";

// === FE View (backend ile birebir) ===
export type RecentWorkDetails = {
  dimensions: string;
  workTime: string;
  specialFeatures: string[];
  customerReview?: string | null;
};

export type RecentWorkView = {
  id: string;
  title: string;
  slug: string;
  description: string;

  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;
  image_effective_url?: string | null;

  category: string;
  seo_keywords: string[];

  date: string;
  location: string;
  material: string;
  price: string | null;

  details: RecentWorkDetails;

  is_active: boolean;
  display_order: number;

  created_at?: string;
  updated_at?: string;
};

// === List params (validation ile uyumlu) ===
export type RecentWorkAdminListParams = {
  order?: string; // "created_at.asc" gibi tek parametre de destekli
  sort?: "created_at" | "updated_at" | "display_order";
  orderDir?: "asc" | "desc";
  limit?: number;
  offset?: number;
  q?: string;
  category?: string;
  material?: string;
  year?: string;
  keyword?: string;
  is_active?: BoolLike;
  select?: string;
};

export type RecentWorkPublicListParams = Omit<
  RecentWorkAdminListParams,
  "is_active"
> & {
  // public taraf default aktif; yine de opsiyonel bırakılabilir
  is_active?: never;
};

// === Upsert/Patch bodies (admin) ===
// Backend admin.controller → camelCase 'seoKeywords' bekliyor
export type UpsertRecentWorkBody = {
  title: string;
  slug: string;
  description: string;

  // tek görsel (opsiyonel)
  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;

  category: string;
  seoKeywords: string[]; // <-- backend "seo_keywords" kolonunu JSON-string olarak set ediyor

  date: string;
  location: string;
  material: string;
  price?: string | null;

  details: RecentWorkDetails;

  is_active?: BoolLike;
  display_order?: number;
};

export type PatchRecentWorkBody = Partial<UpsertRecentWorkBody> & {
  details?: Partial<RecentWorkDetails>;
};

// === Image endpoints (admin) ===
// Backend attachRecentWorkImageBodySchema → storage_asset_id? / image_url? / alt?
export type AttachRecentWorkImageBody = {
  storage_asset_id?: string;
  image_url?: string;
  alt?: string | null;
};
