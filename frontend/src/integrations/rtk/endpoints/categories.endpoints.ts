// -------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/categories.endpoints.ts
// -------------------------------------------------------------
import { publicApi } from "../publicApi"; // <-- baseApi DEĞİL
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { Category } from "@/integrations/rtk/types/categories.rows";

const BASE = "/categories";

type ListParams = {
  q?: string;
  is_active?: boolean;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
  sort?: "display_order" | "name" | "created_at" | "updated_at";
  order?: "asc" | "desc";
};

const buildParams = (params?: ListParams):
  | Record<string, string | number | boolean>
  | undefined => {
  if (!params) return undefined;
  const p: Record<string, string | number | boolean> = {};
  if (params.q !== undefined) p.q = params.q;
  if (params.is_active !== undefined) p.is_active = params.is_active;        // gerekirse 0/1'e çevir
  if (params.is_featured !== undefined) p.is_featured = params.is_featured;  // gerekirse 0/1'e çevir
  if (params.limit !== undefined) p.limit = params.limit;
  if (params.offset !== undefined) p.offset = params.offset;
  if (params.sort) p.sort = params.sort;
  if (params.order) p.order = params.order;
  return Object.keys(p).length ? p : undefined;
};

export const categoriesApi = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query<Category[], void | ListParams>({
      query: (params): FetchArgs | string => {
        const p = buildParams(params as ListParams | undefined);
        return p ? { url: BASE, params: p } : BASE;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((c) => ({ type: "Categories" as const, id: c.id })),
            { type: "Categories" as const, id: "LIST" },
          ]
          : [{ type: "Categories" as const, id: "LIST" }],
    }),

    getCategoryById: builder.query<Category, string>({
      query: (id): FetchArgs | string => `${BASE}/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Categories", id }],
    }),

    getCategoryBySlug: builder.query<Category, string>({
      query: (slug): FetchArgs | string =>
        `${BASE}/by-slug/${encodeURIComponent(slug)}`,
      providesTags: (_r, _e, slug) => [{ type: "Categories", id: `SLUG_${slug}` }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
} = categoriesApi;
