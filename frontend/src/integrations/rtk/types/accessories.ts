// -------------------------------------------------------------
// FILE: src/integrations/metahub/db/types/accessories.ts
// -------------------------------------------------------------
// FE geriye dönük uyumluluk için:
export type AccessoryModel = AccessoryPublic;

/** FE ve BE'de ortak kategori anahtarı */
export type AccessoryKey = "suluk" | "sutun" | "vazo" | "aksesuar";

/** Public API'nin döndüğü minimal model (FE sayfasının beklediği) */
export interface AccessoryPublic {
  id: number;
  name: string;
  category: AccessoryKey;
  material: string;
  price: string;
  image: string;
  description: string;
  featured?: boolean;
  dimensions?: string;
  weight?: string;
  thickness?: string;
  finish?: string;
  warranty?: string;
  installationTime?: string;
}

/** DB satırı tipini yansıtan raw model (admin controller {...acc} döndürüyor) */
export interface AccessoryRow {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  category: AccessoryKey; // şema kısıtlı
  material: string;
  price: string;

  description: string | null;

  image_url: string | null;
  storage_asset_id: string | null;
  alt: string | null; 

  // drizzle: tinyint(1) → number (0/1)
  featured: number;   // 0 | 1
  is_active: number;  // 0 | 1

  dimensions: string | null;
  weight: string | null;
  thickness: string | null;
  finish: string | null;
  warranty: string | null;
  installation_time: string | null;

  display_order: number;

  created_at: string; // DATETIME(3) → string
  updated_at: string;
}

/** Admin list/get yanıtında eklenen alan */
export interface AccessoryAdminRow extends AccessoryRow {
  image_effective_url: string | null;
}

/** Admin UI için normalize edilmiş görünüm (booleans) */
export interface AccessoryAdminView {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  category: AccessoryKey;
  material: string;
  price: string;

  description: string | null;

  image_url: string | null;
  storage_asset_id: string | null;
  image_effective_url: string | null;
  alt: string | null; 

  featured: boolean;
  is_active: boolean;

  dimensions: string | null;
  weight: string | null;
  thickness: string | null;
  finish: string | null;
  warranty: string | null;
  installation_time: string | null;

  display_order: number;

  created_at: string;
  updated_at: string;
}

/** Public list query */
export interface AccessoriesListParams {
  q?: string;
  category?: AccessoryKey;
  featured?: boolean;
  is_active?: boolean;
  limit?: number;
  offset?: number;
  sort?: "display_order" | "name" | "created_at" | "updated_at";
  order?: "asc" | "desc";
}

/** Admin list query (is_active opsiyonel) */
export interface AccessoriesAdminListParams extends AccessoriesListParams {
  is_active?: boolean;
}
// -------------------------------------------------------------
// FILE: src/integrations/metahub/db/types/accessories.ts
// -------------------------------------------------------------
// ... üst kısımlar aynı

export interface AccessoryCreateInput {
  name: string;
  category: AccessoryKey;
  material: string;
  price: string;

  description?: string;
  image_url?: string | null;
  alt?: string | null;
  storage_asset_id?: string | null;

  featured?: boolean;
  dimensions?: string;
  weight?: string;
  thickness?: string;
  finish?: string;
  warranty?: string;
  installation_time?: string;

  display_order?: number;
  is_active?: boolean;
}

export interface AccessoryUpdateInput {
  name?: string;
  category?: AccessoryKey;
  material?: string;
  price?: string;

  description?: string | null;
  image_url?: string | null;
  alt?: string | null;
  storage_asset_id?: string | null;

  featured?: boolean;
  dimensions?: string | null;
  weight?: string | null;
  thickness?: string | null;
  finish?: string | null;
  warranty?: string | null;
  installation_time?: string | null;

  display_order?: number;
  is_active?: boolean;
}
