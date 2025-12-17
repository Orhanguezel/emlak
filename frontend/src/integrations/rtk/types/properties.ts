// FILE: src/integrations/rtk/types/properties.ts

export type Coordinates = { lat: number; lng: number };

export type PropertyAssetKind = "image" | "video" | "plan";

export interface PropertyAssetPublic {
  id: string;
  asset_id?: string | null; // storage relation
  url?: string | null;      // legacy/external OR resolved url (BE resolve ediyorsa)
  alt?: string | null;
  kind: PropertyAssetKind;
  mime?: string | null;
  is_cover: boolean;
  display_order: number;
}

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

  // fiyat (public)
  price?: string | null;    // DECIMAL -> çoğu BE string döner
  currency?: string;

  // kart metası
  listing_no?: string | null;
  badge_text?: string | null;
  featured?: boolean;

  // m2 / çekirdek filtre alanları (publicte gösterilebilir)
  gross_m2?: number | null;
  net_m2?: number | null;

  rooms?: string | null;
  bedrooms?: number | null;

  building_age?: string | null;

  floor?: string | null;
  floor_no?: number | null;
  total_floors?: number | null;

  heating?: string | null;
  usage_status?: string | null;

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

  // opsiyonel effective url (asset resolve eden BE’ler için)
  image_effective_url?: string | null;

  // ✅ çoklu medya (BE eklediyse)
  assets?: PropertyAssetPublic[];

  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

/** ✅ Public view */
export type Properties = PropertyBasePublic;

/** ✅ Admin view ayrı dosyada olmalı; publicte min_price_admin yok */
export interface AdminProperty extends PropertyBasePublic {
  min_price_admin?: string | null;
}

export type BoolLike = boolean | "0" | "1" | 0 | 1;

export type PropertyAsset = PropertyAssetPublic;

export type Property = Properties;
