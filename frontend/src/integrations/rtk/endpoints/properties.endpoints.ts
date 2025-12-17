// -------------------------------------------------------------
// FILE: src/integrations/rtk/endpoints/properties.endpoints.ts
// -------------------------------------------------------------
import { baseApi } from "../baseApi";
import type { Properties as PropertyPublicView } from "@/integrations/rtk/types/properties";

export type ListParams = {
  search?: string;
  district?: string;
  city?: string;
  type?: string;
  status?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
};

// FE -> BE map:
//   search -> q
//   active -> is_active (0/1)
const buildParams = (q?: ListParams): Record<string, any> => {
  if (!q) return {};
  const out: Record<string, any> = {};

  if (typeof q.search !== "undefined") out.q = q.search;
  if (typeof q.district !== "undefined") out.district = q.district;
  if (typeof q.city !== "undefined") out.city = q.city;
  if (typeof q.type !== "undefined") out.type = q.type;
  if (typeof q.status !== "undefined") out.status = q.status;

  if (typeof q.active !== "undefined") out.is_active = q.active ? 1 : 0;

  if (typeof q.limit !== "undefined") out.limit = q.limit;
  if (typeof q.offset !== "undefined") out.offset = q.offset;

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

    listPropertyDistricts: b.query<string[], void>({
      query: () => ({ url: "/properties/_meta/districts" }),
    }),
    listPropertyCities: b.query<string[], void>({
      query: () => ({ url: "/properties/_meta/cities" }),
    }),
    listPropertyTypes: b.query<string[], void>({
      query: () => ({ url: "/properties/_meta/types" }),
    }),
    listPropertyStatuses: b.query<string[], void>({
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
  useListPropertyTypesQuery,
  useListPropertyStatusesQuery,
} = propertiesApi;
