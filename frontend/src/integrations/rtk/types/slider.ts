// -------------------------------------------------------------
// FILE: src/integrations/metahub/db/types/slider.ts
// -------------------------------------------------------------

/** Public model (FE) */
export interface SliderPublic {
  id: number;
  title: string;
  description: string;
  image: string;                // effective url
  alt?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;

  featured?: boolean;
  isActive?: boolean;
  order?: number;
}

/** DB satırı tipini yansıtan raw model (admin controller {...sl}) */
export interface SliderRow {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;

  image_url: string | null;
  /** ✅ backend ile aynı isim */
  image_asset_id: string | null;
  alt: string | null;
  buttonText: string | null;
  buttonLink: string | null;

  featured: number;     // 0 | 1
  is_active: number;    // 0 | 1
  display_order: number;

  created_at: string;
  updated_at: string;
}

/** Admin yanıtında ek alan */
export interface SliderAdminRow extends SliderRow {
  image_effective_url: string | null;
}

/** Admin UI görünümü */
export interface SliderAdminView {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;

  image_url: string | null;
  image_asset_id: string | null;
  image_effective_url: string | null;

  alt: string | null;
  buttonText: string | null;
  buttonLink: string | null;

  featured: boolean;
  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

/** Public list query */
export interface SliderListParams {
  q?: string;
  limit?: number;
  offset?: number;
  sort?: "display_order" | "name" | "created_at" | "updated_at";
  order?: "asc" | "desc";
}

/** Admin list query */
export interface SliderAdminListParams extends SliderListParams {
  is_active?: boolean;
}

/** Create / Update inputları (backend zod ile parse ediyor) */
export interface SliderCreateInput {
  name: string;
  slug?: string;
  description?: string | null;

  image_url?: string | null;
  /** ✅ backend ile aynı isim */
  image_asset_id?: string | null;
  alt?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;

  featured?: boolean;
  is_active?: boolean;
  display_order?: number;
}

export interface SliderUpdateInput {
  name?: string;
  slug?: string;
  description?: string | null;

  image_url?: string | null;
  /** ✅ backend ile aynı isim */
  image_asset_id?: string | null;
  alt?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;

  featured?: boolean;
  is_active?: boolean;
  display_order?: number;
}

/** Yardımcı body’ler */
export interface SliderStatusBody { is_active: boolean; }
export interface SliderReorderBody { ids: number[]; }

/** ✅ Yeni: tek uç sözleşmesi */
export interface SliderSetImageBody { asset_id?: string | null; }
