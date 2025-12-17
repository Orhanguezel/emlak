// -------------------------------------------------------------
// FILE: src/integrations/rtk/endpoints/properties.endpoints.ts
// -------------------------------------------------------------
import { baseApi } from "../baseApi";
import type { Properties as PropertyPublicView } from "@/integrations/rtk/types/properties";

type BoolLike = boolean | 0 | 1 | "0" | "1" | "true" | "false";

export type ListParams = {
  // sorting/paging
  order?: string;
  sort?: "created_at" | "updated_at" | "price" | "gross_m2" | "net_m2";
  orderDir?: "asc" | "desc";
  limit?: number;
  offset?: number;

  // base
  active?: boolean; // FE -> is_active
  featured?: boolean;

  search?: string; // FE -> q
  slug?: string;

  district?: string;
  city?: string;
  neighborhood?: string;

  type?: string;
  status?: string;

  // ranges
  price_min?: number;
  price_max?: number;

  gross_m2_min?: number;
  gross_m2_max?: number;

  net_m2_min?: number;
  net_m2_max?: number;

  // rooms
  rooms?: string;
  bedrooms_min?: number;
  bedrooms_max?: number;

  building_age?: string;

  // floors
  floor?: string;
  floor_no_min?: number;
  floor_no_max?: number;

  total_floors_min?: number;
  total_floors_max?: number;

  // heating/usage
  heating?: string;
  usage_status?: string;

  // bool filters
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

  // date range
  created_from?: string; // ISO datetime
  created_to?: string;   // ISO datetime

  // select (ops)
  select?: string;
};

const to01 = (v: unknown): 0 | 1 | undefined => {
  if (v === true || v === 1 || v === "1" || v === "true") return 1;
  if (v === false || v === 0 || v === "0" || v === "false") return 0;
  return undefined;
};

const buildParams = (q?: ListParams): Record<string, any> => {
  if (!q) return {};
  const out: Record<string, any> = {};

  // sorting/paging
  if (typeof q.order !== "undefined") out.order = q.order;
  if (typeof q.sort !== "undefined") out.sort = q.sort;
  if (typeof q.orderDir !== "undefined") out.orderDir = q.orderDir;

  if (typeof q.limit !== "undefined") out.limit = q.limit;
  if (typeof q.offset !== "undefined") out.offset = q.offset;

  // base
  if (typeof q.active !== "undefined") out.is_active = q.active ? 1 : 0;
  if (typeof q.featured !== "undefined") out.featured = q.featured ? 1 : 0;

  if (typeof q.search !== "undefined") out.q = q.search;
  if (typeof q.slug !== "undefined") out.slug = q.slug;

  if (typeof q.district !== "undefined") out.district = q.district;
  if (typeof q.city !== "undefined") out.city = q.city;
  if (typeof q.neighborhood !== "undefined") out.neighborhood = q.neighborhood;

  if (typeof q.type !== "undefined") out.type = q.type;
  if (typeof q.status !== "undefined") out.status = q.status;

  // ranges
  if (typeof q.price_min !== "undefined") out.price_min = q.price_min;
  if (typeof q.price_max !== "undefined") out.price_max = q.price_max;

  if (typeof q.gross_m2_min !== "undefined") out.gross_m2_min = q.gross_m2_min;
  if (typeof q.gross_m2_max !== "undefined") out.gross_m2_max = q.gross_m2_max;

  if (typeof q.net_m2_min !== "undefined") out.net_m2_min = q.net_m2_min;
  if (typeof q.net_m2_max !== "undefined") out.net_m2_max = q.net_m2_max;

  // rooms
  if (typeof q.rooms !== "undefined") out.rooms = q.rooms;
  if (typeof q.bedrooms_min !== "undefined") out.bedrooms_min = q.bedrooms_min;
  if (typeof q.bedrooms_max !== "undefined") out.bedrooms_max = q.bedrooms_max;

  if (typeof q.building_age !== "undefined") out.building_age = q.building_age;

  // floors
  if (typeof q.floor !== "undefined") out.floor = q.floor;
  if (typeof q.floor_no_min !== "undefined") out.floor_no_min = q.floor_no_min;
  if (typeof q.floor_no_max !== "undefined") out.floor_no_max = q.floor_no_max;

  if (typeof q.total_floors_min !== "undefined") out.total_floors_min = q.total_floors_min;
  if (typeof q.total_floors_max !== "undefined") out.total_floors_max = q.total_floors_max;

  // heating/usage
  if (typeof q.heating !== "undefined") out.heating = q.heating;
  if (typeof q.usage_status !== "undefined") out.usage_status = q.usage_status;

  // bool filters (normalize to 0/1 when provided)
  const pushBool = (k: keyof ListParams, outKey: string) => {
    if (typeof q[k] === "undefined") return;
    const n = to01(q[k]);
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

  // dates
  if (typeof q.created_from !== "undefined") out.created_from = q.created_from;
  if (typeof q.created_to !== "undefined") out.created_to = q.created_to;

  // select
  if (typeof q.select !== "undefined") out.select = q.select;

  return out;
};

export const propertiesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listProperties: b.query<PropertyPublicView[], ListParams | void>({
      query: (q) => (q ? { url: "/properties", params: buildParams(q) } : "/properties"),
      providesTags: (_res) => [{ type: "Properties" as const, id: "LIST" }],
    }),

    getProperty: b.query<PropertyPublicView, string>({
      query: (id) => ({ url: `/properties/${id}` }),
      providesTags: (_res, _e, id) => [{ type: "Properties" as const, id }],
    }),

    getPropertyBySlug: b.query<PropertyPublicView, string>({
      query: (slug) => ({ url: `/properties/by-slug/${slug}` }),
      providesTags: (_res, _e, slug) => [{ type: "Properties" as const, id: `slug:${slug}` }],
    }),

    listPropertyDistricts: b.query<string[], void>({ query: () => ({ url: "/properties/_meta/districts" }) }),
    listPropertyCities: b.query<string[], void>({ query: () => ({ url: "/properties/_meta/cities" }) }),
    listPropertyNeighborhoods: b.query<string[], void>({ query: () => ({ url: "/properties/_meta/neighborhoods" }) }),
    listPropertyTypes: b.query<string[], void>({ query: () => ({ url: "/properties/_meta/types" }) }),
    listPropertyStatuses: b.query<string[], void>({ query: () => ({ url: "/properties/_meta/statuses" }) }),
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
