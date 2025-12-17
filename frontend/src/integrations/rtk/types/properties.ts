// FILE: src/integrations/metahub/db/types/properties.ts

export type Coordinates = {
  lat: number;
  lng: number;
};

export interface PropertyBase {
  id: string;

  title: string;
  slug: string;

  type: string;
  status: string;

  address: string;
  district: string;
  city: string;
  neighborhood?: string | null;

  coordinates: Coordinates;

  description?: string | null;

  // fiyat
  price?: string | null;       // DECIMAL -> çoğu BE string döner
  currency?: string;           // TRY/EUR...

  // kart metası
  listing_no?: string | null;
  badge_text?: string | null;
  featured?: boolean;

  // emlak detay
  gross_m2?: number | null;
  net_m2?: number | null;
  rooms?: string | null;
  building_age?: string | null;
  floor?: string | null;
  total_floors?: number | null;

  // özellikler
  heating?: string | null;
  furnished?: boolean;
  in_site?: boolean;
  has_balcony?: boolean;
  has_parking?: boolean;
  has_elevator?: boolean;

  // görsel (cover)
  image_url?: string | null;
  image_asset_id?: string | null;
  alt?: string | null;

  // bazı projelerde effective url gelebilir (asset resolve)
  image_effective_url?: string | null;

  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

/** ✅ Public view (BE rowToPublicView) */
export type Properties = PropertyBase;

/** ✅ Admin view (BE rowToAdminView) */
export interface AdminProperty extends PropertyBase {
  min_price_admin?: string | null; // sadece admin
}
