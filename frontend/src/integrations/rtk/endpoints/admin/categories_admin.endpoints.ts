// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/admin/categories_admin.endpoints.ts
// =============================================================
import { baseApi } from "../../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { Category } from "@/integrations/rtk/types/categories.rows";

// --- helpers ---
const toNumber = (x: unknown): number =>
  typeof x === "number" ? x : Number(x as any);

const toBool = (x: unknown): boolean => {
  if (typeof x === "boolean") return x;
  if (typeof x === "number") return x !== 0;
  const s = String(x).toLowerCase();
  return s === "true" || s === "1";
};

// BE bool/number alanları 0/1/"0"/"1"/"true"/"false" gelebilir.
// null-olabilir alanlar normalize edilir.
export type ApiCategory = Omit<
  Category,
  "is_active" | "is_featured" | "display_order" | "description" | "image_url" | "icon"
> & {
  is_active: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  is_featured: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  display_order: number | string;
  description?: string | null;
  image_url?: string | null;
  icon?: string | null;
};

const normalizeCategory = (c: ApiCategory): Category => ({
  id: c.id,
  name: (c as any).name,
  slug: c.slug,
  description: (c.description ?? null) as string | null,
  image_url: (c.image_url ?? null) as string | null,
  alt: (c as any).alt ?? null,
  icon: (c.icon ?? null) as string | null,
  is_active: toBool(c.is_active),
  is_featured: toBool(c.is_featured),
  display_order: toNumber(c.display_order),
  created_at: (c as any).created_at,
  updated_at: (c as any).updated_at,
});


export type ListParams = {
  q?: string;
  is_active?: boolean;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
  sort?: "display_order" | "name" | "created_at" | "updated_at";
  order?: "asc" | "desc";
};

export type UpsertCategoryBody = {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  alt?: string | null;
  icon?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  display_order?: number;
};


// ✅ Görsel ayarla/kaldırma: BE controller `alt` da destekliyor
export type SetCategoryImageBody = {
  /** asset_id verilirse set; null/undefined verilirse sil */
  asset_id?: string | null;
  /** alt gelirse güncellenir; null/"" ⇒ temizlenir */
  alt?: string | null;
};

const buildParams = (
  params?: ListParams
): Record<string, string | number | boolean> | undefined => {
  if (!params) return undefined;
  const p: Record<string, string | number | boolean> = {};
  if (params.q !== undefined) p.q = params.q;
  if (params.is_active !== undefined) p.is_active = params.is_active;
  if (params.is_featured !== undefined) p.is_featured = params.is_featured;
  if (params.limit !== undefined) p.limit = params.limit;
  if (params.offset !== undefined) p.offset = params.offset;
  if (params.sort) p.sort = params.sort;
  if (params.order) p.order = params.order;
  return Object.keys(p).length ? p : undefined;
};

const BASE = "/admin/categories";
const BASE_LIST = `${BASE}/list`;

export const categoriesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listCategoriesAdmin: b.query<Category[], ListParams | void>({
      query: (params): FetchArgs | string => {
        const p = buildParams(params as ListParams | undefined);
        return p ? { url: BASE_LIST, params: p, method: "GET" } : BASE_LIST;
      },
      transformResponse: (res: unknown): Category[] =>
        Array.isArray(res) ? (res as ApiCategory[]).map(normalizeCategory) : [],
      providesTags: (result) =>
        result && result.length
          ? [
            ...result.map((c) => ({ type: "Categories" as const, id: c.id })),
            { type: "Categories" as const, id: "LIST" },
          ]
          : [{ type: "Categories" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    getCategoryAdminById: b.query<Category, string>({
      query: (id): FetchArgs | string => `${BASE}/${id}`,
      transformResponse: (res: unknown): Category => normalizeCategory(res as ApiCategory),
      providesTags: (_r, _e, id) => [{ type: "Categories" as const, id }],
    }),

    getCategoryAdminBySlug: b.query<Category | null, string>({
      query: (slug): FetchArgs | string => `${BASE}/by-slug/${encodeURIComponent(slug)}`,
      transformResponse: (res: unknown): Category | null =>
        res ? normalizeCategory(res as ApiCategory) : null,
      providesTags: (_r, _e, slug) => [{ type: "Categories" as const, id: `SLUG_${slug}` }],
    }),

    createCategoryAdmin: b.mutation<Category, UpsertCategoryBody>({
      query: (body): FetchArgs => ({ url: `${BASE}`, method: "POST", body }),
      transformResponse: (res: unknown): Category => normalizeCategory(res as ApiCategory),
      invalidatesTags: [{ type: "Categories" as const, id: "LIST" }],
    }),

    updateCategoryAdmin: b.mutation<Category, { id: string; body: UpsertCategoryBody }>({
      query: ({ id, body }): FetchArgs => ({
        url: `${BASE}/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: unknown): Category => normalizeCategory(res as ApiCategory),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Categories" as const, id: arg.id },
        { type: "Categories" as const, id: "LIST" },
      ],
    }),

    deleteCategoryAdmin: b.mutation<{ ok: true }, string>({
      query: (id): FetchArgs => ({ url: `${BASE}/${id}`, method: "DELETE" }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Categories" as const, id },
        { type: "Categories" as const, id: "LIST" },
      ],
    }),

    reorderCategoriesAdmin: b.mutation<{ ok: true }, Array<{ id: string; display_order: number }>>({
      query: (items): FetchArgs => ({
        url: `${BASE}/reorder`,
        method: "POST",
        body: { items },
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: [{ type: "Categories" as const, id: "LIST" }],
    }),

    toggleActiveCategoryAdmin: b.mutation<Category, { id: string; is_active: boolean }>({
      query: ({ id, is_active }): FetchArgs => ({
        url: `${BASE}/${id}/active`,
        method: "PATCH",
        body: { is_active },
      }),
      transformResponse: (res: unknown): Category => normalizeCategory(res as ApiCategory),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Categories" as const, id: arg.id },
        { type: "Categories" as const, id: "LIST" },
      ],
    }),

    toggleFeaturedCategoryAdmin: b.mutation<Category, { id: string; is_featured: boolean }>({
      query: ({ id, is_featured }): FetchArgs => ({
        url: `${BASE}/${id}/featured`,
        method: "PATCH",
        body: { is_featured },
      }),
      transformResponse: (res: unknown): Category => normalizeCategory(res as ApiCategory),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Categories" as const, id: arg.id },
        { type: "Categories" as const, id: "LIST" },
      ],
    }),

    setCategoryImageAdmin: b.mutation<Category, { id: string; body: SetCategoryImageBody }>({
      query: ({ id, body }): FetchArgs => ({
        url: `${BASE}/${id}/image`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): Category => normalizeCategory(res as ApiCategory),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Categories" as const, id: arg.id },
        { type: "Categories" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListCategoriesAdminQuery,
  useGetCategoryAdminByIdQuery,
  useGetCategoryAdminBySlugQuery,
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
  useDeleteCategoryAdminMutation,
  useReorderCategoriesAdminMutation,
  useToggleActiveCategoryAdminMutation,
  useToggleFeaturedCategoryAdminMutation,
  useSetCategoryImageAdminMutation,
} = categoriesAdminApi;
