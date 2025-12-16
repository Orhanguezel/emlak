// -------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/sub_categories.endpoints.ts
// -------------------------------------------------------------
import { publicApi } from "../publicApi"; // <-- baseApi DEĞİL
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { SubCategory } from "@/integrations/rtk/types/sub_categories.rows";

const BASE = "/sub-categories";

export type SubListParams = {
  q?: string;
  category_id?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
  sort?: "display_order" | "name" | "created_at" | "updated_at";
  order?: "asc" | "desc";
};

const buildParams = (
  params?: SubListParams
): Record<string, string | number | boolean> | undefined => {
  if (!params) return undefined;
  const p: Record<string, string | number | boolean> = {};
  if (params.q !== undefined) p.q = params.q;
  if (params.category_id !== undefined && params.category_id !== null) {
    p.category_id = params.category_id;
  }
  if (params.is_active !== undefined) p.is_active = params.is_active;        // gerekirse 0/1'e çevir
  if (params.is_featured !== undefined) p.is_featured = params.is_featured;  // gerekirse 0/1'e çevir
  if (params.limit !== undefined) p.limit = params.limit;
  if (params.offset !== undefined) p.offset = params.offset;
  if (params.sort) p.sort = params.sort;
  if (params.order) p.order = params.order;
  return Object.keys(p).length ? p : undefined;
};

export const subCategoriesApi = publicApi.injectEndpoints({
  endpoints: (b) => ({
    listSubCategories: b.query<SubCategory[], void | SubListParams>({
      query: (params): FetchArgs | string => {
        const p = buildParams(params as SubListParams | undefined);
        return p ? { url: BASE, params: p } : BASE;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((sc) => ({ type: "SubCategories" as const, id: sc.id })),
            { type: "SubCategories" as const, id: "LIST" },
          ]
          : [{ type: "SubCategories" as const, id: "LIST" }],
    }),

    getSubCategoryById: b.query<SubCategory, string>({
      query: (id): FetchArgs | string => `${BASE}/${id}`,
      providesTags: (_r, _e, id) => [{ type: "SubCategories", id }],
    }),

    getSubCategoryBySlug: b.query<SubCategory, { slug: string; category_id?: string }>({
      query: ({ slug, category_id }): FetchArgs | string => {
        const url = `${BASE}/by-slug/${encodeURIComponent(slug)}`;
        return category_id ? { url, params: { category_id } } : url;
      },
      providesTags: (_r, _e, arg) => [{ type: "SubCategories", id: `SLUG_${arg.slug}` }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useGetSubCategoryBySlugQuery,
} = subCategoriesApi;
