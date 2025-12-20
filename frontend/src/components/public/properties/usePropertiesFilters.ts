// =============================================================
// FILE: src/components/public/properties/usePropertiesFilters.ts
// =============================================================
"use client";

import { useMemo, useState } from "react";
import type { Rooms, Heating, UsageStatus, PropertyType, PropertyStatus } from "@/integrations/rtk/types/properties";

export type Filters = {
  search: string;
  city: string;
  district: string;
  neighborhood: string;

  type: PropertyType | "";
  status: PropertyStatus | "";

  price_min: string;
  price_max: string;

  gross_m2_min: string;
  gross_m2_max: string;

  rooms: Rooms | "";
  rooms_multi: Rooms[];
  bedrooms_min: string;
  bedrooms_max: string;

  building_age: string;

  heating: Heating | "";
  heating_multi: Heating[];
  usage_status: UsageStatus | "";
  usage_status_multi: UsageStatus[];

  featured: boolean;
  furnished: boolean;
  in_site: boolean;
  has_elevator: boolean;
  has_parking: boolean;
  has_balcony: boolean;
  has_garden: boolean;
  has_terrace: boolean;
  credit_eligible: boolean;
  swap: boolean;
  has_virtual_tour: boolean;
  accessible: boolean;
};

export const DEFAULT_FILTERS: Filters = {
  search: "",
  city: "",
  district: "",
  neighborhood: "",
  type: "",
  status: "",

  price_min: "",
  price_max: "",
  gross_m2_min: "",
  gross_m2_max: "",

  rooms: "",
  rooms_multi: [],

  bedrooms_min: "",
  bedrooms_max: "",
  building_age: "",

  heating: "",
  heating_multi: [],
  usage_status: "",
  usage_status_multi: [],

  featured: false,
  furnished: false,
  in_site: false,
  has_elevator: false,
  has_parking: false,
  has_balcony: false,
  has_garden: false,
  has_terrace: false,
  credit_eligible: false,
  swap: false,
  has_virtual_tour: false,
  accessible: false,
};

const toNumOrUndef = (s: string): number | undefined => {
  const t = (s || "").trim();
  if (!t) return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};

export function usePropertiesFilters(args: { showSearchResults: boolean; searchTerm: string }) {
  const { showSearchResults, searchTerm } = args;

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const clearLocalFilters = () => setFilters(DEFAULT_FILTERS);

  const queryParams = useMemo(() => {
    const q: any = { active: true, limit: 200, offset: 0 };

    // Arama modunda: sadece search gönder
    if (showSearchResults && searchTerm.trim()) {
      q.search = searchTerm.trim();
      return q;
    }

    if (filters.search.trim()) q.search = filters.search.trim();
    if (filters.city) q.city = filters.city;
    if (filters.district) q.district = filters.district;
    if (filters.neighborhood) q.neighborhood = filters.neighborhood;

    if (filters.type) q.type = filters.type;
    if (filters.status) q.status = filters.status;

    if (filters.featured) q.featured = true;

    const priceMin = toNumOrUndef(filters.price_min);
    const priceMax = toNumOrUndef(filters.price_max);
    if (priceMin !== undefined) q.price_min = priceMin;
    if (priceMax !== undefined) q.price_max = priceMax;

    const gm2Min = toNumOrUndef(filters.gross_m2_min);
    const gm2Max = toNumOrUndef(filters.gross_m2_max);
    if (gm2Min !== undefined) q.gross_m2_min = Math.trunc(gm2Min);
    if (gm2Max !== undefined) q.gross_m2_max = Math.trunc(gm2Max);

    if (filters.rooms) q.rooms = filters.rooms;
    if (filters.rooms_multi.length) q.rooms_multi = filters.rooms_multi;

    const bdMin = toNumOrUndef(filters.bedrooms_min);
    const bdMax = toNumOrUndef(filters.bedrooms_max);
    if (bdMin !== undefined) q.bedrooms_min = Math.trunc(bdMin);
    if (bdMax !== undefined) q.bedrooms_max = Math.trunc(bdMax);

    if (filters.building_age.trim()) q.building_age = filters.building_age.trim();

    if (filters.heating) q.heating = filters.heating;
    if (filters.heating_multi.length) q.heating_multi = filters.heating_multi;

    if (filters.usage_status) q.usage_status = filters.usage_status;
    if (filters.usage_status_multi.length) q.usage_status_multi = filters.usage_status_multi;

    const pushTrue = (key: string, v: boolean) => {
      if (v) q[key] = true;
    };
    pushTrue("furnished", filters.furnished);
    pushTrue("in_site", filters.in_site);
    pushTrue("has_elevator", filters.has_elevator);
    pushTrue("has_parking", filters.has_parking);
    pushTrue("has_balcony", filters.has_balcony);
    pushTrue("has_garden", filters.has_garden);
    pushTrue("has_terrace", filters.has_terrace);
    pushTrue("credit_eligible", filters.credit_eligible);
    pushTrue("swap", filters.swap);
    pushTrue("has_virtual_tour", filters.has_virtual_tour);
    pushTrue("accessible", filters.accessible);

    return q;
  }, [filters, showSearchResults, searchTerm]);

  return {
    filters,
    setFilters,
    showAdvanced,
    setShowAdvanced,
    clearLocalFilters,
    queryParams,
  };
}
