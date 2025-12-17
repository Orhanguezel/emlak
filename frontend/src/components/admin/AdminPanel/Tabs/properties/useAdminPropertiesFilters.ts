"use client";

import { useMemo, useState } from "react";
import type { Filters } from "@/components/public/properties/usePropertiesFilters";
import { DEFAULT_FILTERS } from "@/components/public/properties/usePropertiesFilters";

type AdminFiltersExtra = {
  onlyActive: boolean;
};

const toNumOrUndef = (s: string): number | undefined => {
  const t = (s || "").trim();
  if (!t) return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};

export function useAdminPropertiesFilters(args: { limit: number; offset: number }) {
  const { limit, offset } = args;

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [onlyActive, setOnlyActive] = useState<AdminFiltersExtra["onlyActive"]>(false);

  const clearLocalFilters = () => setFilters(DEFAULT_FILTERS);

  const queryParams = useMemo(() => {
    const q: any = { limit, offset };

    // active (admin kontrolü)
    if (onlyActive) q.active = true;

    // base
    if (filters.search.trim()) q.search = filters.search.trim();
    if (filters.city) q.city = filters.city;
    if (filters.district) q.district = filters.district;
    if (filters.neighborhood) q.neighborhood = filters.neighborhood;
    if (filters.type) q.type = filters.type;
    if (filters.status) q.status = filters.status;

    if (filters.featured) q.featured = true;

    // ranges
    const priceMin = toNumOrUndef(filters.price_min);
    const priceMax = toNumOrUndef(filters.price_max);
    if (priceMin !== undefined) q.price_min = priceMin;
    if (priceMax !== undefined) q.price_max = priceMax;

    const gm2Min = toNumOrUndef(filters.gross_m2_min);
    const gm2Max = toNumOrUndef(filters.gross_m2_max);
    if (gm2Min !== undefined) q.gross_m2_min = Math.trunc(gm2Min);
    if (gm2Max !== undefined) q.gross_m2_max = Math.trunc(gm2Max);

    // rooms: single + multi
    if (filters.rooms) q.rooms = filters.rooms;
    if (filters.rooms_multi.length) q.rooms_multi = filters.rooms_multi;

    const bdMin = toNumOrUndef(filters.bedrooms_min);
    const bdMax = toNumOrUndef(filters.bedrooms_max);
    if (bdMin !== undefined) q.bedrooms_min = Math.trunc(bdMin);
    if (bdMax !== undefined) q.bedrooms_max = Math.trunc(bdMax);

    if (filters.building_age.trim()) q.building_age = filters.building_age.trim();

    // heating/usage: single + multi
    if (filters.heating) q.heating = filters.heating;
    if (filters.heating_multi.length) q.heating_multi = filters.heating_multi;

    if (filters.usage_status) q.usage_status = filters.usage_status;
    if (filters.usage_status_multi.length) q.usage_status_multi = filters.usage_status_multi;

    // bool toggles (only send when true)
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
  }, [filters, onlyActive, limit, offset]);

  return {
    filters,
    setFilters,
    showAdvanced,
    setShowAdvanced,
    clearLocalFilters,
    queryParams,
    onlyActive,
    setOnlyActive,
  };
}
