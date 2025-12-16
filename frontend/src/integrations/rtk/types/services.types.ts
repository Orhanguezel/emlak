// =============================================================
// FILE: src/integrations/metahub/db/types/services.types.ts
// =============================================================

export type ServiceType = "gardening" | "soil" | "other";

type NullableString = string | null | undefined;

/** Backend admin.view -> Frontend */
export type ServiceView = {
  id: string;
  slug: string;
  name: string;

  type: ServiceType;
  category: string;

  material: string | null;
  price: string | null;
  description: string | null;

  featured: boolean;
  is_active: boolean;
  display_order: number;

  image_url: string | null;
  image_asset_id: string | null;
  alt: string | null;
  image_effective_url: string | null;

  // Gardening
  area: string | null;
  duration: string | null;
  maintenance: string | null;
  season: string | null;

  // Soil
  soil_type: string | null;
  thickness: string | null;
  equipment: string | null;

  // Common
  warranty: string | null;
  includes: string | null;

  created_at: string;
  updated_at: string;
};

export type ServiceListParams = {
  /** FE → BE: search -> q */
  search?: string;

  /** FE → BE: type (tek değer veya çoklu) */
  type?: ServiceType | ServiceType[];

  /** Admin tarafı filtreler */
  category?: string;
  featured?: boolean;
  /** FE → BE: active -> is_active */
  active?: boolean;

  limit?: number;
  offset?: number;

  /** FE → BE: orderBy -> sort */
  orderBy?: "created_at" | "updated_at" | "display_order" | "name";
  order?: "asc" | "desc";
};

/** CREATE/UPDATE tipleri (serviceCreateSchema ile uyumlu) */
export type ServiceCreateInput = {
  name: string;
  slug?: string;

  type?: ServiceType;
  category?: string;

  material?: NullableString;
  price?: NullableString;
  description?: NullableString;

  image_url?: NullableString;
  image_asset_id?: NullableString;
  alt?: NullableString;

  featured?: boolean;
  is_active?: boolean;
  display_order?: number;

  // gardening
  area?: NullableString;
  duration?: NullableString;
  maintenance?: NullableString;
  season?: NullableString;

  // soil
  soil_type?: NullableString;
  thickness?: NullableString;
  equipment?: NullableString;

  // common
  warranty?: NullableString;
  includes?: NullableString;

  // legacy
  featured_image?: NullableString;
};

export type ServiceUpdateInput = Partial<ServiceCreateInput>;

/** Şu an FE’de kullanmıyoruz ama endpoint tipi dursun */
export interface ServiceAttachImageBody {
  image_asset_id?: string;
  image_url?: string;
}

export interface ServiceReorderBody {
  ids: string[];
}

export interface ServiceStatusBody {
  is_active: boolean;
}
