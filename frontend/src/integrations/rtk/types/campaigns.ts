// src/integrations/metahub/db/types/campaigns.ts

// === Shared primitives ===
export type BoolLike = boolean | 0 | 1 | "0" | "1" | "true" | "false";

// Opsiyonel: kampanya görsel item tipi (galeri uyumluluğu için)
export type CampaignImageView = {
  id?: string;
  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;
  image_effective_url?: string | null;
};

// === Rows (DB) & Views (FE) ===
export type SimpleCampaignRow = {
  id: string;
  title: string;
  description: string;
  seo_keywords: string;  // JSON-string: string[]
  is_active: BoolLike;

  // Tek görsel pattern
  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;

  // Opsiyonel ekstra (repo/CTRL döndürebilir)
  image_effective_url?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type SimpleCampaignView = {
  id: string;
  title: string;
  description: string;
  seo_keywords: string[];   // parsed
  is_active: boolean;

  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;
  image_effective_url?: string | null;

  // 🔹 Galeri uyumluluğu (opsiyonel). Tek görsel varsa buraya 1 elemanlı array de koyabilirsin.
  images?: CampaignImageView[];

  created_at?: string;
  updated_at?: string;
};

// === List params (admin & public) ===
export type AdminListParams = {
  q?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
  sort?: "updated_at" | "created_at" | "title";
  order?: "asc" | "desc";
};

export type PublicListParams = {
  q?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
  sort?: "updated_at" | "created_at" | "title";
  order?: "asc" | "desc";
};

// === Upsert/Patch bodies (admin) ===
export type UpsertSimpleCampaignBody = {
  title: string;
  description: string;
  seoKeywords: string[];
  is_active?: BoolLike;
 
  // Tek görsel alanları opsiyonel
  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;
};

export type PatchSimpleCampaignBody = Partial<UpsertSimpleCampaignBody>;

// === Image management (admin) — tek görsel attach/detach
export type AttachCampaignImageBody = {
  // XOR: FE doğrulaması sende; backend zaten zod refine ile kontrol ediyor
  storage_asset_id?: string;
  image_url?: string;
  alt?: string | null;
};
