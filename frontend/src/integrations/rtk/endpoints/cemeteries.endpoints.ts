// -------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/cemeteries.endpoints.ts
// -------------------------------------------------------------
import { baseApi } from "../baseApi";
import type { Cemeteries as CemeteryView } from "@/integrations/rtk/types/cemeteries";

// FE filtreleri
export type ListParams = {
  search?: string;
  district?: string;
  type?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
};

// sadece dolu olan paramları gönder (exactOptionalPropertyTypes uyumlu)
const buildParams = (q?: ListParams): Record<string, any> => {
  if (!q) return {};
  const out: Record<string, any> = {};
  if (typeof q.search !== "undefined") out.search = q.search;
  if (typeof q.district !== "undefined") out.district = q.district;
  if (typeof q.type !== "undefined") out.type = q.type;
  if (typeof q.active !== "undefined") out.active = q.active ? 1 : 0;
  if (typeof q.limit !== "undefined") out.limit = q.limit;
  if (typeof q.offset !== "undefined") out.offset = q.offset;
  return out;
};

export const cemeteriesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // q yoksa string döndür (RTK: string | FetchArgs)
    listCemeteries: b.query<CemeteryView[], ListParams | void>({
      query: (q) => (q ? { url: "/cemeteries", params: buildParams(q) } : "/cemeteries"),
      providesTags: (_res) => [{ type: "Cemeteries" as const, id: "LIST" }],
    }),

    // ID ile getir (slug için ayrı endpoint var)
    getCemetery: b.query<CemeteryView, string>({
      query: (id) => ({ url: `/cemeteries/${id}` }),
      providesTags: (_res, _e, id) => [{ type: "Cemeteries" as const, id }],
    }),

    // Slug ile getir
    getCemeteryBySlug: b.query<CemeteryView, string>({
      query: (slug) => ({ url: `/cemeteries/by-slug/${slug}` }),
      providesTags: (_res, _e, slug) => [{ type: "Cemeteries" as const, id: `slug:${slug}` }],
    }),

    listCemeteryDistricts: b.query<string[], void>({
      query: () => ({ url: "/cemeteries/_meta/districts" }),
    }),
    listCemeteryTypes: b.query<string[], void>({
      query: () => ({ url: "/cemeteries/_meta/types" }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useListCemeteriesQuery,
  useGetCemeteryQuery,
  useGetCemeteryBySlugQuery,
  useListCemeteryDistrictsQuery,
  useListCemeteryTypesQuery,
} = cemeteriesApi;
