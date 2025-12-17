// FILE: src/integrations/rtk/types/properties.ts

export type Coordinates = { lat: number; lng: number };

export type BoolLike = boolean | "0" | "1" | 0 | 1;
export type PropertyAssetKind = "image" | "video" | "plan";

/**
 * Backend enums (validation.ts)
 */
export const HEATING = [
  "kombi",
  "merkezi",
  "klima",
  "yerden",
  "soba",
  "dogalgaz",
  "isi_pompasi",
  "yok",
] as const;
export type Heating = (typeof HEATING)[number];

export const USAGE_STATUS = [
  "bos",
  "kiracili",
  "ev_sahibi",
  "mal_sahibi_oturuyor",
  "bilinmiyor",
] as const;
export type UsageStatus = (typeof USAGE_STATUS)[number];

export const ROOMS = [
  "1+0",
  "1+1",
  "2+0",
  "2+1",
  "2+2",
  "3+1",
  "3+2",
  "4+1",
  "4+2",
  "5+1",
  "6+1",
  "7+1",
  "8+1",
  "9+1",
  "10+1",
] as const;
export type Rooms = (typeof ROOMS)[number];

export interface PropertyAssetPublic {
  id: string;
  property_id?: string;
  asset_id?: string | null;
  url?: string | null;
  alt?: string | null;

  kind: PropertyAssetKind;
  mime?: string | null;

  is_cover: boolean;
  display_order: number;

  // Admin/public list endpoint assets döndürmeyebilir; repo düzeyinde değişebilir.
  created_at?: string;
  updated_at?: string;
}

/**
 * Public view (rowToPublicView + repo assets merge olabilir)
 */
export interface PropertyBasePublic {
  id: string;

  title: string;
  slug: string;

  type: string;
  status: string;

  address: string;
  district: string;
  city: string;
  neighborhood?: string | null;

  coordinates?: Coordinates | null;

  description?: string | null;

  // DECIMAL: BE çoğunlukla string döner
  price?: string | null;
  currency?: string;

  // kart metası
  listing_no?: string | null;
  badge_text?: string | null;
  featured?: boolean;

  // m2
  gross_m2?: number | null;
  net_m2?: number | null;

  // legacy tekli + ✅ multi
  rooms?: string | null;
  rooms_multi?: Rooms[] | string[] | null;

  bedrooms?: number | null;
  building_age?: string | null;

  floor?: string | null;
  floor_no?: number | null;
  total_floors?: number | null;

  // legacy tekli + ✅ multi
  heating?: string | null;
  heating_multi?: Heating[] | string[] | null;

  // legacy tekli + ✅ multi
  usage_status?: string | null;
  usage_status_multi?: UsageStatus[] | string[] | null;

  // bool filtreler
  furnished?: boolean;
  in_site?: boolean;

  has_elevator?: boolean;
  has_parking?: boolean;
  has_balcony?: boolean;

  has_garden?: boolean;
  has_terrace?: boolean;

  credit_eligible?: boolean;
  swap?: boolean;

  has_video?: boolean;
  has_clip?: boolean;
  has_virtual_tour?: boolean;
  has_map?: boolean;
  accessible?: boolean;

  // cover (legacy)
  image_url?: string | null;
  image_asset_id?: string | null;
  alt?: string | null;

  // bazı backend’lerde resolve edilip gelebilir (opsiyonel)
  image_effective_url?: string | null;

  // gallery (repo eklediyse)
  assets?: PropertyAssetPublic[];

  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

export type Properties = PropertyBasePublic;

export interface AdminProperty extends PropertyBasePublic {
  // admin-only
  min_price_admin?: string | null;
}

export type PropertyAsset = PropertyAssetPublic;
export type Property = Properties;
