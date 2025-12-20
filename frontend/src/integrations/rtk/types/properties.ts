// =============================================================
// FILE: src/integrations/rtk/types/properties.ts
// =============================================================

export type Coordinates = { lat: number | null; lng: number | null };

/** Backend/FE bool param normalize için ortak tip */
export type BoolLike = boolean | 0 | 1 | "0" | "1" | "true" | "false";

export type PropertyAssetKind = "image" | "video" | "plan";

/**
 * -------------------------------------------------------
 * ENUMS (Backend validation.ts ile uyumlu olmalı)
 * -------------------------------------------------------
 */

/** Isınma */
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

/** Kullanım durumu */
export const USAGE_STATUS = [
  "bos",
  "kiracili",
  "ev_sahibi",
  "mal_sahibi_oturuyor",
  "bilinmiyor",
] as const;
export type UsageStatus = (typeof USAGE_STATUS)[number];

/** Oda */
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

/**
 * ✅ EMLAK TİPİ (genişletilmiş)
 * Backend şu an string dönüyor; FE enum olarak standardize ediyor.
 * Eğer backend’de validation varsa burada da aynı değerleri kullan.
 */
export const PROPERTY_TYPES = [
  "daire",
  "rezidans",
  "mustakil",
  "villa",
  "dubleks",
  "triplex",
  "penthouse",
  "yazlik",
  "bina",
  "apartman",
  "koy_evi",
  "ciftlik_evi",
  "prefabrik",
  "arsa",
  "tarla",
  "bag_bahce",
  "ticari",
  "dukkan",
  "magaza",
  "ofis",
  "plaza_ofis",
  "depo",
  "atolye",
  "fabrika",
  "sanayi",
  "otel",
  "pansiyon",
  "is_hani",
  "buro",
  "avm_unit",
  "komple_bina",
  "garaj",
  "otopark",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

/**
 * ✅ İLAN DURUMU (genişletilmiş)
 * Not: Bu “satılık/kiralık” karışımını da kapsıyor. İstersen bunu 2 ayrı alan yaparsın.
 */
export const PROPERTY_STATUSES = [
  "satilik",
  "kiralik",
  "gunluk_kiralik",
  "devren",
  "devren_satilik", // ✅ düzeltildi (satilık değil)
  "devren_kiralik",
  "yatirimlik",
  "acil",
  "rezerve",
  "satildi",
  "kiralandi",
  "pasif",
] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

/**
 * -------------------------------------------------------
 * ✅ TR LABEL MAPS (UI için)
 * - DB/API: enum (latin, snake_case)
 * - UI: Türkçe, baş harf büyük
 * -------------------------------------------------------
 */

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  daire: "Daire",
  rezidans: "Rezidans",
  mustakil: "Müstakil",
  villa: "Villa",
  dubleks: "Dubleks",
  triplex: "Triplex",
  penthouse: "Penthouse",
  yazlik: "Yazlık",
  bina: "Bina",
  apartman: "Apartman",
  koy_evi: "Köy Evi",
  ciftlik_evi: "Çiftlik Evi",
  prefabrik: "Prefabrik",
  arsa: "Arsa",
  tarla: "Tarla",
  bag_bahce: "Bağ / Bahçe",
  ticari: "Ticari",
  dukkan: "Dükkan",
  magaza: "Mağaza",
  ofis: "Ofis",
  plaza_ofis: "Plaza Ofis",
  depo: "Depo",
  atolye: "Atölye",
  fabrika: "Fabrika",
  sanayi: "Sanayi",
  otel: "Otel",
  pansiyon: "Pansiyon",
  is_hani: "İş Hanı",
  buro: "Büro",
  avm_unit: "AVM Ünitesi",
  komple_bina: "Komple Bina",
  garaj: "Garaj",
  otopark: "Otopark",
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  satilik: "Satılık",
  kiralik: "Kiralık",
  gunluk_kiralik: "Günlük Kiralık",
  devren: "Devren",
  devren_satilik: "Devren Satılık",
  devren_kiralik: "Devren Kiralık",
  yatirimlik: "Yatırımlık",
  acil: "Acil",
  rezerve: "Rezerve",
  satildi: "Satıldı",
  kiralandi: "Kiralandı",
  pasif: "Pasif",
};

/**
 * -------------------------------------------------------
 * ✅ UI normalize / fallback formatter
 * - Map'te yoksa: snake_case -> "Başlık Case" (TR)
 * -------------------------------------------------------
 */

const toTitleCaseTr = (s: string) => {
  const txt = String(s ?? "").trim();
  if (!txt) return "";
  return txt
    .split(/[\s_-]+/g)
    .filter(Boolean)
    .map((w) => {
      const lower = w.toLocaleLowerCase("tr-TR");
      return lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
    })
    .join(" ");
};

export const getPropertyTypeLabel = (v: PropertyType | string): string => {
  const key = String(v ?? "").trim() as PropertyType;
  return (PROPERTY_TYPE_LABELS as unknown as Record<string, string>)[key] ?? toTitleCaseTr(String(v ?? ""));
};

export const getPropertyStatusLabel = (v: PropertyStatus | string): string => {
  const key = String(v ?? "").trim() as PropertyStatus;
  return (PROPERTY_STATUS_LABELS as unknown as Record<string, string>)[key] ?? toTitleCaseTr(String(v ?? ""));
};

/**
 * -------------------------------------------------------
 * ASSET / VIEW MODELS
 * -------------------------------------------------------
 */

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

  created_at?: string;
  updated_at?: string;
}

/**
 * Public view
 * - price/min_price_admin DECIMAL => çoğunlukla string
 * - coordinates opsiyonel + nullable
 */
export interface PropertyBasePublic {
  id: string;

  title: string;
  slug: string;

  /** FE tarafında enum ile yönetsek de API string; union ile daraltıyoruz */
  type: PropertyType | (string & {});
  status: PropertyStatus | (string & {});

  address: string;
  district: string;
  city: string;
  neighborhood?: string | null;

  coordinates?: Coordinates | null;

  description?: string | null;

  price?: string | null;
  currency?: string;

  listing_no?: string | null;
  badge_text?: string | null;
  featured?: boolean;

  gross_m2?: number | null;
  net_m2?: number | null;

  rooms?: Rooms | string | null;
  rooms_multi?: Rooms[] | string[] | null;

  bedrooms?: number | null;
  building_age?: string | null;

  floor?: string | null;
  floor_no?: number | null;
  total_floors?: number | null;

  heating?: Heating | string | null;
  heating_multi?: Heating[] | string[] | null;

  usage_status?: UsageStatus | string | null;
  usage_status_multi?: UsageStatus[] | string[] | null;

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

  image_url?: string | null;
  image_asset_id?: string | null;
  alt?: string | null;

  image_effective_url?: string | null;

  assets?: PropertyAssetPublic[];

  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

export type Properties = PropertyBasePublic;

export interface AdminProperty extends PropertyBasePublic {
  min_price_admin?: string | null;
}

export type PropertyAsset = PropertyAssetPublic;
export type Property = Properties;

/**
 * -------------------------------------------------------
 * RTK / LIST PARAM TYPES (tek dosyada)
 * -------------------------------------------------------
 */

export type PropertiesSortField = "created_at" | "updated_at" | "price" | "gross_m2" | "net_m2";
export type OrderDir = "asc" | "desc";

export type PropertiesListParams = {
  order?: string;
  sort?: PropertiesSortField;
  orderDir?: OrderDir;
  limit?: number;
  offset?: number;

  active?: boolean; // FE -> is_active
  featured?: boolean;

  search?: string; // FE -> q
  slug?: string;

  district?: string;
  city?: string;
  neighborhood?: string;

  type?: PropertyType | string;
  status?: PropertyStatus | string;

  price_min?: number;
  price_max?: number;

  gross_m2_min?: number;
  gross_m2_max?: number;

  net_m2_min?: number;
  net_m2_max?: number;

  rooms?: Rooms | string;
  rooms_multi?: (Rooms | string)[];

  bedrooms_min?: number;
  bedrooms_max?: number;

  building_age?: string;

  floor?: string;
  floor_no_min?: number;
  floor_no_max?: number;

  total_floors_min?: number;
  total_floors_max?: number;

  heating?: Heating | string;
  heating_multi?: (Heating | string)[];

  usage_status?: UsageStatus | string;
  usage_status_multi?: (UsageStatus | string)[];

  furnished?: BoolLike;
  in_site?: BoolLike;
  has_elevator?: BoolLike;
  has_parking?: BoolLike;

  has_balcony?: BoolLike;
  has_garden?: BoolLike;
  has_terrace?: BoolLike;

  credit_eligible?: BoolLike;
  swap?: BoolLike;

  has_video?: BoolLike;
  has_clip?: BoolLike;
  has_virtual_tour?: BoolLike;
  has_map?: BoolLike;
  accessible?: BoolLike;

  created_from?: string;
  created_to?: string;

  select?: string;
};

export type AdminListParams = {
  q?: string;
  slug?: string;

  district?: string;
  city?: string;
  neighborhood?: string;

  type?: PropertyType | string;
  status?: PropertyStatus | string;

  featured?: BoolLike;
  is_active?: BoolLike;

  price_min?: number;
  price_max?: number;

  gross_m2_min?: number;
  gross_m2_max?: number;

  net_m2_min?: number;
  net_m2_max?: number;

  rooms?: Rooms | string;
  rooms_multi?: (Rooms | string)[];

  bedrooms_min?: number;
  bedrooms_max?: number;

  building_age?: string;

  floor?: string;
  floor_no_min?: number;
  floor_no_max?: number;

  total_floors_min?: number;
  total_floors_max?: number;

  heating?: Heating | string;
  heating_multi?: (Heating | string)[];

  usage_status?: UsageStatus | string;
  usage_status_multi?: (UsageStatus | string)[];

  furnished?: BoolLike;
  in_site?: BoolLike;

  has_elevator?: BoolLike;
  has_parking?: BoolLike;

  has_balcony?: BoolLike;
  has_garden?: BoolLike;
  has_terrace?: BoolLike;

  credit_eligible?: BoolLike;
  swap?: BoolLike;

  has_video?: BoolLike;
  has_clip?: BoolLike;
  has_virtual_tour?: BoolLike;
  has_map?: BoolLike;
  accessible?: BoolLike;

  created_from?: string;
  created_to?: string;

  sort?: PropertiesSortField;
  orderDir?: OrderDir;

  limit?: number;
  offset?: number;

  select?: string;
};

export type PropertyUpsertBody = {
  title: string;
  slug: string;

  type: PropertyType | string;
  status: PropertyStatus | string;

  address: string;
  district: string;
  city: string;

  neighborhood?: string | null;

  coordinates?: { lat?: number | null; lng?: number | null } | null;

  description?: string | null;

  price?: number | null;
  currency?: string;

  min_price_admin?: number | null;

  listing_no?: string | null;
  badge_text?: string | null;
  featured?: BoolLike;

  gross_m2?: number | null;
  net_m2?: number | null;

  rooms?: Rooms | string | null;
  rooms_multi?: (Rooms | string)[] | null;

  bedrooms?: number | null;
  building_age?: string | null;

  floor?: string | null;
  floor_no?: number | null;

  total_floors?: number | null;

  heating?: Heating | string | null;
  heating_multi?: (Heating | string)[] | null;

  usage_status?: UsageStatus | string | null;
  usage_status_multi?: (UsageStatus | string)[] | null;

  furnished?: BoolLike;
  in_site?: BoolLike;

  has_elevator?: BoolLike;
  has_parking?: BoolLike;
  has_balcony?: BoolLike;

  has_garden?: BoolLike;
  has_terrace?: BoolLike;

  credit_eligible?: BoolLike;
  swap?: BoolLike;

  has_video?: BoolLike;
  has_clip?: BoolLike;
  has_virtual_tour?: BoolLike;
  has_map?: BoolLike;
  accessible?: BoolLike;

  image_url?: string | null;
  image_asset_id?: string | null;
  alt?: string | null;

  is_active?: BoolLike;
  display_order?: number;

  assets?: PropertyAsset[];
};

export type PropertyPatchBody = Partial<Omit<PropertyUpsertBody, "coordinates">> & {
  coordinates?: { lat?: number | null; lng?: number | null } | null;
};

/**
 * -------------------------------------------------------
 * ✅ TR LABEL MAPS (UI için) - Heating / Usage
 * -------------------------------------------------------
 */

export const HEATING_LABELS: Record<Heating, string> = {
  kombi: "Kombi",
  merkezi: "Merkezi Sistem",
  klima: "Klima",
  yerden: "Yerden Isıtma",
  soba: "Soba",
  dogalgaz: "Doğalgaz",
  isi_pompasi: "Isı Pompası",
  yok: "Yok",
};

export const USAGE_STATUS_LABELS: Record<UsageStatus, string> = {
  bos: "Boş",
  kiracili: "Kiracılı",
  ev_sahibi: "Ev Sahibi",
  mal_sahibi_oturuyor: "Mal Sahibi Oturuyor",
  bilinmiyor: "Bilinmiyor",
};

export const getHeatingLabel = (v: Heating | string): string => {
  const key = String(v ?? "").trim() as Heating;
  return (HEATING_LABELS as unknown as Record<string, string>)[key] ?? toTitleCaseTr(String(v ?? ""));
};

export const getUsageStatusLabel = (v: UsageStatus | string): string => {
  const key = String(v ?? "").trim() as UsageStatus;
  return (USAGE_STATUS_LABELS as unknown as Record<string, string>)[key] ?? toTitleCaseTr(String(v ?? ""));
};

