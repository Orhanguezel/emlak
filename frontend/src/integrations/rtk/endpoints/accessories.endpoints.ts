import { baseApi } from "../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { AccessoryPublic, AccessoriesListParams } from "@/integrations/rtk/types/accessories";

const BASE = "/accessories";

const buildParams = (params?: AccessoriesListParams) => {
  if (!params) return undefined;
  const p: Record<string, string | number | boolean> = {};
  if (params.q) p.q = params.q;
  if (params.category) p.category = params.category;
  if (params.limit !== undefined) p.limit = params.limit;
  if (params.offset !== undefined) p.offset = params.offset;
  if (params.sort) p.sort = params.sort;
  if (params.order) p.order = params.order;
  if (params.featured !== undefined) p.featured = params.featured ? 1 : 0;
  if (params.is_active !== undefined) p.is_active = params.is_active ? 1 : 0;
  return Object.keys(p).length ? p : undefined;
};

export const accessoriesPublicApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listAccessoriesPublic: b.query<AccessoryPublic[], void | AccessoriesListParams>({
      query: (params): FetchArgs | string => {
        // ⬇️ TS: void | T  →  T | undefined
        const p = buildParams(params as AccessoriesListParams | undefined);
        return p
          ? { url: BASE, params: p, headers: { "x-skip-auth": "1" } }
          : { url: BASE, headers: { "x-skip-auth": "1" } };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((a) => ({ type: "Accessories" as const, id: a.id })),
            { type: "Accessories" as const, id: "PUBLIC_LIST" },
          ]
          : [{ type: "Accessories" as const, id: "PUBLIC_LIST" }],
      keepUnusedDataFor: 60,
    }),

    getAccessoryPublic: b.query<AccessoryPublic, string>({
      query: (idOrSlug): FetchArgs => ({
        url: `${BASE}/${encodeURIComponent(idOrSlug)}`,
        headers: { "x-skip-auth": "1" },
      }),
      providesTags: (r) =>
        r ? [{ type: "Accessories" as const, id: r.id }] : [{ type: "Accessories" as const, id: "PUBLIC_LIST" }],
      keepUnusedDataFor: 60,
    }),
  }),
  overrideExisting: false,
});

export const {
  useListAccessoriesPublicQuery,
  useGetAccessoryPublicQuery,
} = accessoriesPublicApi;
