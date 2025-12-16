// =============================================================
// FILE: src/integrations/metahub/db/types/customPages.ts
// =============================================================

/** ───── Custom Pages (RAW + VIEW) ───── */

// BE ham satır (JOIN’siz/ JOIN’li dönebilir)
export type CustomPageRow = {
  id: string;
  title: string;
  slug: string;
  content: string | { html: string };

  // ✅ Görsel alanları (BE ile birebir)
  image_url: string | null;
  storage_asset_id: string | null;
  alt: string | null;

  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  created_at?: string;
  updated_at?: string;

  /** JOIN’li cevaplarda bulunabilir */
  image_effective_url?: string | null;
};

// FE normalize görünüm
export type CustomPageView = {
  id: string;
  title: string;
  slug: string;
  content: string; // düz HTML

  image_url: string | null;
  image_effective_url: string | null;
  alt: string | null;

  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

/** create body (FE → BE) — düz HTML verin */
export type UpsertCustomPageBody = {
  title: string;
  slug: string;
  content: string; // düz HTML

  // ✅ Görsel alanları (opsiyonel)
  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;

  meta_title?: string | null;
  meta_description?: string | null;
  is_published?: boolean;
  locale?: string | null; // BE yok sayar
};

/** PATCH (partial) */
export type PatchCustomPageBody = Partial<UpsertCustomPageBody>;
