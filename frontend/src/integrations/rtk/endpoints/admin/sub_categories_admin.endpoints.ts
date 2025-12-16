// -------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/admin/sub_categories_admin.endpoints.ts
// -------------------------------------------------------------
import { baseApi } from "../../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { SubCategory } from "@/integrations/rtk/types/sub_categories.rows";

const toNumber = (x: unknown): number => (typeof x === "number" ? x : Number(x as any));
const toBool = (x: unknown): boolean => {
  if (typeof x === "boolean") return x;
  if (typeof x === "number") return x !== 0;
  const s = String(x).toLowerCase();
  return s === "true" || s === "1";
};

export type ApiSubCategory = Omit<
  SubCategory,
  "is_active" | "is_featured" | "display_order" | "description" | "image_url" | "icon"
> & {
  is_active: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  is_featured: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  display_order: number | string;
  description?: string | null;
  image_url?: string | null;
  icon?: string | null;
};

const normalize = (c: ApiSubCategory): SubCategory => ({
  id: c.id,
  category_id: (c as any).category_id,
  name: (c as any).name,
  slug: c.slug,
  description: (c.description ?? null) as string | null,
  image_url: (c.image_url ?? null) as string | null,
  icon: (c.icon ?? null) as string | null,
  alt: (c as any).alt ?? null,
  is_active: toBool(c.is_active),
  is_featured: toBool(c.is_featured),
  display_order: toNumber(c.display_order),
  created_at: (c as any).created_at,
  updated_at: (c as any).updated_at,
});

export type AdminSubListParams = {
  q?: string;
  category_id?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
  sort?: "display_order" | "name" | "created_at" | "updated_at";
  order?: "asc" | "desc";
};

const buildParams = (params?: AdminSubListParams):
  | Record<string, string | number | boolean>
  | undefined => {
  if (!params) return undefined;
  const p: Record<string, string | number | boolean> = {};
  if (params.q !== undefined) p.q = params.q;
  if (params.category_id !== undefined && params.category_id !== null) p.category_id = params.category_id;
  if (params.is_active !== undefined) p.is_active = params.is_active;
  if (params.is_featured !== undefined) p.is_featured = params.is_featured;
  if (params.limit !== undefined) p.limit = params.limit;
  if (params.offset !== undefined) p.offset = params.offset;
  if (params.sort) p.sort = params.sort;
  if (params.order) p.order = params.order;
  return Object.keys(p).length ? p : undefined;
};

export type UpsertSubCategoryBody = {
  category_id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  alt?: string | null;          // 🔹 eklendi – validation ve DB ile uyumlu
  icon?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  display_order?: number;
};

export type SetSubCategoryImageBody = {
  asset_id?: string | null; // BE ile birebir
  alt?: string | null;
};

const BASE = "/admin/sub-categories";
const BASE_LIST = `${BASE}/list`;

export const subCategoriesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listSubCategoriesAdmin: b.query<SubCategory[], AdminSubListParams | void>({
      query: (params): FetchArgs | string => {
        const p = buildParams(params as AdminSubListParams | undefined);
        return p ? { url: BASE_LIST, params: p, method: "GET" } : BASE_LIST;
      },
      transformResponse: (res: unknown): SubCategory[] =>
        Array.isArray(res) ? (res as ApiSubCategory[]).map(normalize) : [],
      providesTags: (result) =>
        result && result.length
          ? [
            ...result.map((sc) => ({ type: "SubCategories" as const, id: sc.id })),
            { type: "SubCategories" as const, id: "LIST" },
          ]
          : [{ type: "SubCategories" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    getSubCategoryAdminById: b.query<SubCategory, string>({
      query: (id): FetchArgs | string => `${BASE}/${id}`,
      transformResponse: (res: unknown): SubCategory => normalize(res as ApiSubCategory),
      providesTags: (_r, _e, id) => [{ type: "SubCategories" as const, id }],
    }),

    getSubCategoryAdminBySlug: b.query<SubCategory | null, { slug: string; category_id?: string }>({
      query: ({ slug, category_id }): FetchArgs | string => {
        const url = `${BASE}/by-slug/${encodeURIComponent(slug)}`;
        return category_id ? { url, params: { category_id } } : url;
      },
      transformResponse: (res: unknown): SubCategory | null =>
        res ? normalize(res as ApiSubCategory) : null,
      providesTags: (_r, _e, arg) => [{ type: "SubCategories" as const, id: `SLUG_${arg.slug}` }],
    }),

    createSubCategoryAdmin: b.mutation<SubCategory, UpsertSubCategoryBody>({
      query: (body): FetchArgs => ({ url: `${BASE}`, method: "POST", body }),
      transformResponse: (res: unknown): SubCategory => normalize(res as ApiSubCategory),
      invalidatesTags: [{ type: "SubCategories" as const, id: "LIST" }],
    }),

    updateSubCategoryAdmin: b.mutation<SubCategory, { id: string; body: UpsertSubCategoryBody }>({
      query: ({ id, body }): FetchArgs => ({
        url: `${BASE}/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: unknown): SubCategory => normalize(res as ApiSubCategory),
      invalidatesTags: (_r, _e, arg) => [
        { type: "SubCategories" as const, id: arg.id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),

    patchSubCategoryAdmin: b.mutation<SubCategory, { id: string; body: Partial<UpsertSubCategoryBody> }>({
      query: ({ id, body }): FetchArgs => ({
        url: `${BASE}/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): SubCategory => normalize(res as ApiSubCategory),
      invalidatesTags: (_r, _e, arg) => [
        { type: "SubCategories" as const, id: arg.id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),

    deleteSubCategoryAdmin: b.mutation<{ ok: true }, string>({
      query: (id): FetchArgs => ({ url: `${BASE}/${id}`, method: "DELETE" }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, id) => [
        { type: "SubCategories" as const, id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),

    reorderSubCategoriesAdmin: b.mutation<{ ok: true }, Array<{ id: string; display_order: number }>>({
      query: (items): FetchArgs => ({
        url: `${BASE}/reorder`,
        method: "POST",
        body: { items },
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: [{ type: "SubCategories" as const, id: "LIST" }],
    }),

    toggleSubActiveAdmin: b.mutation<SubCategory, { id: string; is_active: boolean }>({
      query: ({ id, is_active }): FetchArgs => ({
        url: `${BASE}/${id}/active`,
        method: "PATCH",
        body: { is_active },
      }),
      transformResponse: (res: unknown): SubCategory => normalize(res as ApiSubCategory),
      invalidatesTags: (_r, _e, arg) => [
        { type: "SubCategories" as const, id: arg.id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),

    toggleSubFeaturedAdmin: b.mutation<SubCategory, { id: string; is_featured: boolean }>({
      query: ({ id, is_featured }): FetchArgs => ({
        url: `${BASE}/${id}/featured`,
        method: "PATCH",
        body: { is_featured },
      }),
      transformResponse: (res: unknown): SubCategory => normalize(res as ApiSubCategory),
      invalidatesTags: (_r, _e, arg) => [
        { type: "SubCategories" as const, id: arg.id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),

    // ✅ Görsel set/kaldır (asset_id + alt)
    setSubCategoryImageAdmin: b.mutation<SubCategory, { id: string; body: SetSubCategoryImageBody }>({
      query: ({ id, body }): FetchArgs => ({
        url: `${BASE}/${id}/image`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): SubCategory => normalize(res as ApiSubCategory),
      invalidatesTags: (_r, _e, arg) => [
        { type: "SubCategories" as const, id: arg.id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListSubCategoriesAdminQuery,
  useGetSubCategoryAdminByIdQuery,
  useGetSubCategoryAdminBySlugQuery,
  useCreateSubCategoryAdminMutation,
  useUpdateSubCategoryAdminMutation,
  usePatchSubCategoryAdminMutation,
  useDeleteSubCategoryAdminMutation,
  useReorderSubCategoriesAdminMutation,
  useToggleSubActiveAdminMutation,
  useToggleSubFeaturedAdminMutation,
  useSetSubCategoryImageAdminMutation,
} = subCategoriesAdminApi;
