// =============================================================
// FILE: src/integrations/rtk/endpoints/properties.endpoints.ts
// =============================================================
import { baseApi } from "../baseApi";
import type {
  Properties as PropertyPublicView,
  Coordinates,
  PropertiesListParams as ListParams,
  BoolLike,
  PropertyType,
  PropertyStatus,
  
} from "@/integrations/rtk/types/properties";

const to01 = (v: unknown): 0 | 1 | undefined => {
  if (v === true || v === 1 || v === "1" || v === "true") return 1;
  if (v === false || v === 0 || v === "0" || v === "false") return 0;
  return undefined;
};

const buildParams = (q?: ListParams): Record<string, any> => {
  if (!q) return {};
  const out: Record<string, any> = {};

  if (typeof q.order !== "undefined") out.order = q.order;
  if (typeof q.sort !== "undefined") out.sort = q.sort;
  if (typeof q.orderDir !== "undefined") out.orderDir = q.orderDir;

  if (typeof q.limit !== "undefined") out.limit = q.limit;
  if (typeof q.offset !== "undefined") out.offset = q.offset;

  if (typeof q.active !== "undefined") out.is_active = q.active ? 1 : 0;
  if (typeof q.featured !== "undefined") out.featured = q.featured ? 1 : 0;

  if (typeof q.search !== "undefined") out.q = q.search;
  if (typeof q.slug !== "undefined") out.slug = q.slug;

  if (typeof q.district !== "undefined") out.district = q.district;
  if (typeof q.city !== "undefined") out.city = q.city;
  if (typeof q.neighborhood !== "undefined") out.neighborhood = q.neighborhood;

  if (typeof q.type !== "undefined") out.type = q.type;
  if (typeof q.status !== "undefined") out.status = q.status;

  if (typeof q.price_min !== "undefined") out.price_min = q.price_min;
  if (typeof q.price_max !== "undefined") out.price_max = q.price_max;

  if (typeof q.gross_m2_min !== "undefined") out.gross_m2_min = q.gross_m2_min;
  if (typeof q.gross_m2_max !== "undefined") out.gross_m2_max = q.gross_m2_max;

  if (typeof q.net_m2_min !== "undefined") out.net_m2_min = q.net_m2_min;
  if (typeof q.net_m2_max !== "undefined") out.net_m2_max = q.net_m2_max;

  if (typeof q.rooms !== "undefined") out.rooms = q.rooms;
  if (typeof q.rooms_multi !== "undefined") out.rooms_multi = q.rooms_multi;

  if (typeof q.bedrooms_min !== "undefined") out.bedrooms_min = q.bedrooms_min;
  if (typeof q.bedrooms_max !== "undefined") out.bedrooms_max = q.bedrooms_max;

  if (typeof q.building_age !== "undefined") out.building_age = q.building_age;

  if (typeof q.floor !== "undefined") out.floor = q.floor;
  if (typeof q.floor_no_min !== "undefined") out.floor_no_min = q.floor_no_min;
  if (typeof q.floor_no_max !== "undefined") out.floor_no_max = q.floor_no_max;

  if (typeof q.total_floors_min !== "undefined") out.total_floors_min = q.total_floors_min;
  if (typeof q.total_floors_max !== "undefined") out.total_floors_max = q.total_floors_max;

  if (typeof q.heating !== "undefined") out.heating = q.heating;
  if (typeof q.heating_multi !== "undefined") out.heating_multi = q.heating_multi;

  if (typeof q.usage_status !== "undefined") out.usage_status = q.usage_status;
  if (typeof q.usage_status_multi !== "undefined") out.usage_status_multi = q.usage_status_multi;

  const pushBool = (k: keyof ListParams, outKey: string) => {
    if (typeof q[k] === "undefined") return;
    const n = to01(q[k] as BoolLike);
    if (typeof n !== "undefined") out[outKey] = n;
  };

  pushBool("furnished", "furnished");
  pushBool("in_site", "in_site");
  pushBool("has_elevator", "has_elevator");
  pushBool("has_parking", "has_parking");
  pushBool("has_balcony", "has_balcony");
  pushBool("has_garden", "has_garden");
  pushBool("has_terrace", "has_terrace");
  pushBool("credit_eligible", "credit_eligible");
  pushBool("swap", "swap");
  pushBool("has_video", "has_video");
  pushBool("has_clip", "has_clip");
  pushBool("has_virtual_tour", "has_virtual_tour");
  pushBool("has_map", "has_map");
  pushBool("accessible", "accessible");

  if (typeof q.created_from !== "undefined") out.created_from = q.created_from;
  if (typeof q.created_to !== "undefined") out.created_to = q.created_to;

  if (typeof q.select !== "undefined") out.select = q.select;

  return out;
};

const toNumOrNull = (v: unknown): number | null => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const normalizeCoordinates = (r: any): Coordinates | null => {
  const lat = toNumOrNull(r?.coordinates?.lat) ?? toNumOrNull(r?.lat);
  const lng = toNumOrNull(r?.coordinates?.lng) ?? toNumOrNull(r?.lng);
  if (lat == null && lng == null) return null;
  return { lat: lat ?? null, lng: lng ?? null };
};

const toPublicView = (r: any): PropertyPublicView => ({
  ...(r as PropertyPublicView),
  coordinates: normalizeCoordinates(r),
});

export const propertiesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listProperties: b.query<PropertyPublicView[], ListParams | void>({
      query: (q) => (q ? { url: "/properties", params: buildParams(q) } : "/properties"),
      transformResponse: (res: unknown): PropertyPublicView[] =>
        Array.isArray(res) ? (res as any[]).map(toPublicView) : [],
      providesTags: () => [{ type: "Properties" as const, id: "LIST" }],
    }),

    getProperty: b.query<PropertyPublicView, string>({
      query: (id) => ({ url: `/properties/${id}` }),
      transformResponse: (r: unknown) => toPublicView(r as any),
      providesTags: (_res, _e, id) => [{ type: "Properties" as const, id }],
    }),

    getPropertyBySlug: b.query<PropertyPublicView, string>({
      query: (slug) => ({ url: `/properties/by-slug/${slug}` }),
      transformResponse: (r: unknown) => toPublicView(r as any),
      providesTags: (_res, _e, slug) => [{ type: "Properties" as const, id: `slug:${slug}` }],
    }),

    listPropertyDistricts: b.query<string[], void>({
      query: () => ({ url: "/properties/_meta/districts" }),
    }),
    listPropertyCities: b.query<string[], void>({
      query: () => ({ url: "/properties/_meta/cities" }),
    }),
    listPropertyNeighborhoods: b.query<string[], void>({
      query: () => ({ url: "/properties/_meta/neighborhoods" }),
    }),

    // ✅ UI enum ile kullanacağız; API yine string döndürebilir
    listPropertyTypes: b.query<(PropertyType | string)[], void>({
      query: () => ({ url: "/properties/_meta/types" }),
    }),
    listPropertyStatuses: b.query<(PropertyStatus | string)[], void>({
      query: () => ({ url: "/properties/_meta/statuses" }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useListPropertiesQuery,
  useGetPropertyQuery,
  useGetPropertyBySlugQuery,
  useListPropertyDistrictsQuery,
  useListPropertyCitiesQuery,
  useListPropertyNeighborhoodsQuery,
  useListPropertyTypesQuery,
  useListPropertyStatusesQuery,
} = propertiesApi;
