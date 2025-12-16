// -------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/properties.endpoints.ts
// -------------------------------------------------------------
import { baseApi } from "../baseApi";
import type { Properties as PropertyView } from "@/integrations/rtk/types/properties";

// FE filtreleri
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

// sadece dolu olan paramları gönder (exactOptionalPropertyTypes uyumlu)
// FE -> BE map:
//   search  -> q
//   active  -> is_active (0/1)
//   district/city/type/status -> aynı
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
        // q yoksa string döndür (RTK: string | FetchArgs)
        listProperties: b.query<PropertyView[], ListParams | void>({
            query: (q) => (q ? { url: "/properties", params: buildParams(q) } : "/properties"),
            providesTags: (_res) => [{ type: "Properties" as const, id: "LIST" }],
        }),

        // ID ile getir
        getProperty: b.query<PropertyView, string>({
            query: (id) => ({ url: `/properties/${id}` }),
            providesTags: (_res, _e, id) => [{ type: "Properties" as const, id }],
        }),

        // Slug ile getir
        getPropertyBySlug: b.query<PropertyView, string>({
            query: (slug) => ({ url: `/properties/by-slug/${slug}` }),
            providesTags: (_res, _e, slug) => [{ type: "Properties" as const, id: `slug:${slug}` }],
        }),

        // Meta listeler
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
