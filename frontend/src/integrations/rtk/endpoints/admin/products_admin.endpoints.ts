// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/admin/products_admin.endpoints.ts
// =============================================================
import { baseApi } from "../../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type {
  Product as ProductRow,
  Faq,
  Spec as ProductSpecRow,
  Review,
} from "@/integrations/rtk/types/products.rows";

/* ---------------- Helpers ---------------- */
type NumericLike = number | string | null | undefined;

const asNumber = (v: NumericLike, fallback = 0): number => {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  if (typeof v === "string") {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
};
const toInt = (v: NumericLike, fallback = 0): number =>
  Math.trunc(asNumber(v, fallback));

const parseArr = (v: unknown): string[] | null => {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      /* CSV fallback */
    }
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return null;
};

function takeRows(payload: any): any[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.rows)) return payload.rows;
  if (payload.data) return takeRows(payload.data);
  if (payload.result) return takeRows(payload.result);
  return [];
}

/* ---- list params -> FetchArgs ---- */
export type AdminProductListParams = {
  q?: string;
  is_active?: boolean | 0 | 1;
  category_id?: string;
  sub_category_id?: string;
  limit?: number;
  offset?: number;
  sort?: "price" | "rating" | "created_at" | "title" | "review_count";
  order?: "asc" | "desc";
};

function buildAdminListParams(params?: AdminProductListParams) {
  if (!params) return undefined as
    | undefined
    | Record<string, string | number>;
  const p: Record<string, string | number> = {};
  if (params.q) p.q = params.q;
  if (params.category_id) p.category_id = params.category_id;
  if (params.sub_category_id) p.sub_category_id = params.sub_category_id;
  if (typeof params.limit === "number") p.limit = params.limit;
  if (typeof params.offset === "number") p.offset = params.offset;
  if (params.sort) p.sort = params.sort;
  if (params.order) p.order = params.order;
  if (typeof params.is_active !== "undefined")
    p.is_active = params.is_active ? 1 : 0;
  return p;
}

function args(url: string, params?: AdminProductListParams): FetchArgs {
  const p = buildAdminListParams(params);
  return p ? ({ url, params: p as Record<string, any> }) : ({ url });
}

/* ---------------- Types ---------------- */
export type AdminProductUpsert = Partial<
  Pick<
    ProductRow,
    | "title"
    | "slug"
    | "price"
    | "description"
    | "category_id"
    | "sub_category_id"
    | "image_url"
    | "storage_asset_id"
    | "alt"
    | "images"
    | "storage_image_ids"
    | "is_active"
    | "is_featured"
    | "tags"
    | "specifications"
    | "product_code"
    | "stock_quantity"
    | "meta_title"
    | "meta_description"
  >
> & { id?: string };

export type AdminFaqReplaceBody = Array<
  Pick<Faq, "question" | "answer" | "display_order"> & {
    is_active?: boolean | 0 | 1;
    id?: string;
  }
>;

export type AdminSpecReplaceBody = Array<
  Pick<ProductSpecRow, "name" | "value" | "category" | "order_num"> & {
    id?: string;
  }
>;

export type AdminReviewCreateBody = {
  rating: number;
  comment?: string | null;
  customer_name?: string | null;
  is_active?: boolean | 0 | 1;
  review_date?: string | null;
  user_id?: string | null;
  tags?: string[] | null;
};
export type AdminReviewUpdateBody = Partial<AdminReviewCreateBody>;

/* ---- Admin list DTOs ---- */
export type AdminCategoryListItem = {
  id: string;
  name: string;
  is_featured: boolean | 0 | 1;
  // BE büyük ihtimal slug da döndürüyor, ama burada opsiyonel bırakabiliriz
  slug?: string;
};
export type AdminSubcategoryListItem = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
};

/* ---- gevşek giriş ---- */
type ApiProductInput = Omit<
  ProductRow,
  | "price"
  | "rating"
  | "review_count"
  | "stock_quantity"
  | "images"
  | "tags"
  | "storage_image_ids"
> & {
  price: NumericLike;
  rating?: NumericLike;
  review_count?: NumericLike;
  stock_quantity?: NumericLike;
  images?: unknown; // string[] | CSV | JSON
  storage_image_ids?: unknown; // string[] | CSV | JSON
  /** 🔽 BE alias'ları destekle */
  image_ids?: unknown; // alias
  gallery_ids?: unknown; // alias
  tags?: string[] | null;

  /** Kapak alias'ları */
  cover_id?: string | null; // alias
  cover_url?: string | null; // alias
};

const normalizeProduct = (p: ApiProductInput): ProductRow => {
  // 1) Galeri ID'leri
  const galleryIds =
    parseArr(p.storage_image_ids ?? null) ??
    parseArr((p as any).image_ids ?? null) ??
    parseArr((p as any).gallery_ids ?? null) ??
    [];

  // 2) Görsel URL listesi
  const imageUrls = Array.isArray(p.images)
    ? p.images.map(String)
    : parseArr(p.images ?? null) ?? [];

  // 3) Kapak alias’ları
  const storageAssetId = p.storage_asset_id ?? (p as any).cover_id ?? null;
  const imageUrl = p.image_url ?? (p as any).cover_url ?? null;

  // 4) Etiketler
  const tagsArr = parseArr(p.tags ?? null) ?? [];

  return {
    ...p,
    image_url: imageUrl,
    storage_asset_id: storageAssetId,
    storage_image_ids: galleryIds,
    images: imageUrls,
    price: asNumber(p.price, 0),
    rating: asNumber(p.rating, 5),
    review_count: toInt(p.review_count, 0),
    stock_quantity: toInt(p.stock_quantity, 0),
    tags: tagsArr,
  };
};

const ADMIN_BASE = "/admin/products";

type AdminSetProductImagesBody = {
  cover_id?: string | null;
  image_ids: string[];
};

/* ---- Specs CRUD bodies ---- */
export type AdminSpecCreateBody = Pick<
  ProductSpecRow,
  "name" | "value" | "category" | "order_num"
>;
export type AdminSpecUpdateBody = Partial<AdminSpecCreateBody>;

export const productsAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ===================== LIST ===================== */
    adminListProducts: builder.query<
      ProductRow[],
      AdminProductListParams | undefined
    >({
      query: (params): FetchArgs => args(ADMIN_BASE, params),
      transformResponse: (res: unknown): ProductRow[] =>
        (takeRows(res) as ApiProductInput[]).map(normalizeProduct),
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({
                type: "Product" as const,
                id: p.id,
              })),
              { type: "Products" as const, id: "ADMIN_LIST" },
            ]
          : [{ type: "Products" as const, id: "ADMIN_LIST" }],
      keepUnusedDataFor: 60,
    }),

    /* ===================== DETAIL ===================== */
    adminGetProduct: builder.query<ProductRow, string>({
      query: (id): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}`,
      }),
      transformResponse: (res: unknown): ProductRow =>
        normalizeProduct(res as ApiProductInput),
      providesTags: (r) =>
        r
          ? [{ type: "Product", id: r.id }]
          : [{ type: "Products", id: "ADMIN_LIST" }],
    }),

    /* ========== CREATE / UPDATE / DELETE ========== */
    adminCreateProduct: builder.mutation<ProductRow, AdminProductUpsert>({
      query: (body): FetchArgs => ({
        url: ADMIN_BASE,
        method: "POST",
        body,
      }),
      transformResponse: (res: unknown): ProductRow =>
        normalizeProduct(res as ApiProductInput),
      invalidatesTags: (r) =>
        r
          ? [
              { type: "Products", id: "ADMIN_LIST" },
              { type: "Product", id: r.id },
            ]
          : [{ type: "Products", id: "ADMIN_LIST" }],
    }),

    adminUpdateProduct: builder.mutation<
      ProductRow,
      { id: string; body: AdminProductUpsert }
    >({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): ProductRow =>
        normalizeProduct(res as ApiProductInput),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Product", id: arg.id },
        { type: "Products", id: "ADMIN_LIST" },
      ],
    }),

    adminDeleteProduct: builder.mutation<{ ok: true }, string>({
      query: (id): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Product", id },
        { type: "Products", id: "ADMIN_LIST" },
      ],
    }),

    /* ========== BULK / TOGGLES / REORDER ========== */
    adminBulkSetActive: builder.mutation<
      { ok: true },
      { ids: string[]; is_active: boolean | 0 | 1 }
    >({
      query: ({ ids, is_active }): FetchArgs => ({
        url: `${ADMIN_BASE}/bulk/active`,
        method: "POST",
        body: { ids, is_active: !!is_active },
      }),
      invalidatesTags: (_r, _e, arg) => [
        ...arg.ids.map((id) => ({ type: "Product" as const, id })),
        { type: "Products", id: "ADMIN_LIST" },
      ],
    }),

    adminReorderProducts: builder.mutation<
      { ok: true },
      { orders: Array<{ id: string; display_order: number }> }
    >({
      query: (body): FetchArgs => ({
        url: `${ADMIN_BASE}/bulk/reorder`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "ADMIN_LIST" }],
    }),

    adminToggleActive: builder.mutation<
      { ok: true },
      { id: string; is_active: boolean | 0 | 1 }
    >({
      query: ({ id, is_active }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/active`,
        method: "PATCH",
        body: { is_active: !!is_active },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Product", id: arg.id },
        { type: "Products", id: "ADMIN_LIST" },
      ],
    }),

    adminToggleHomepage: builder.mutation<
      { ok: true },
      { id: string; show_on_homepage: boolean | 0 | 1 }
    >({
      query: ({ id, show_on_homepage }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/homepage`,
        method: "PATCH",
        body: { show_on_homepage: !!show_on_homepage },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Product", id: arg.id },
        { type: "Products", id: "ADMIN_LIST" },
      ],
    }),

    /* ========== FAQ REPLACE ========== */
    adminReplaceFaqs: builder.mutation<
      { ok?: true },
      { id: string; items: AdminFaqReplaceBody }
    >({
      query: ({ id, items }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/faqs`,
        method: "PUT",
        body: { faqs: items },
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.id }],
    }),

    /* ========== SPECS REPLACE ========== */
    adminReplaceSpecs: builder.mutation<
      { ok?: true },
      { id: string; items: AdminSpecReplaceBody }
    >({
      query: ({ id, items }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/specs`,
        method: "PUT",
        body: { specs: items },
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Specs", id: arg.id }],
    }),

    /* ========== IMAGES ========== */
    adminSetProductImages: builder.mutation<
      ProductRow,
      { id: string; body: AdminSetProductImagesBody }
    >({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/images`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: unknown): ProductRow =>
        normalizeProduct(res as ApiProductInput),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Product", id: arg.id },
        { type: "Products", id: "ADMIN_LIST" },
      ],
    }),

    /* ===================== REVIEWS ===================== */
    adminCreateProductReview: builder.mutation<
      Review,
      { id: string; body: AdminReviewCreateBody }
    >({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/reviews`,
        method: "POST",
        body,
      }),
      transformResponse: (res: unknown): Review => res as Review,
      invalidatesTags: (_r, _e, arg) => [
        { type: "Reviews", id: arg.id },
        { type: "Product", id: arg.id },
      ],
    }),

    adminUpdateProductReview: builder.mutation<
      Review,
      { id: string; reviewId: string; body: AdminReviewUpdateBody }
    >({
      query: ({ id, reviewId, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(
          id,
        )}/reviews/${encodeURIComponent(reviewId)}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): Review => res as Review,
      invalidatesTags: (_r, _e, arg) => [
        { type: "Reviews", id: arg.id },
        { type: "Product", id: arg.id },
      ],
    }),

    adminToggleReviewActive: builder.mutation<
      { ok: true },
      { id: string; reviewId: string; is_active: boolean | 0 | 1 }
    >({
      query: ({ id, reviewId, is_active }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(
          id,
        )}/reviews/${encodeURIComponent(reviewId)}/active`,
        method: "PATCH",
        body: { is_active: !!is_active },
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Reviews", id: arg.id },
        { type: "Product", id: arg.id },
      ],
    }),

    adminDeleteProductReview: builder.mutation<
      { ok: true },
      { id: string; reviewId: string }
    >({
      query: ({ id, reviewId }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(
          id,
        )}/reviews/${encodeURIComponent(reviewId)}`,
        method: "DELETE",
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Reviews", id: arg.id },
        { type: "Product", id: arg.id },
      ],
    }),

    /* ===================== FAQS (CRUD + LIST) ===================== */
    adminListProductFaqs: builder.query<
      Faq[],
      { id: string; only_active?: boolean | 0 | 1 }
    >({
      query: ({ id, only_active }): FetchArgs => {
        const url = `${ADMIN_BASE}/${encodeURIComponent(id)}/faqs`;
        const p =
          typeof only_active === "undefined"
            ? undefined
            : { only_active: !!only_active ? 1 : 0 };
        return p ? { url, params: p as Record<string, any> } : { url };
      },
      transformResponse: (res: unknown): Faq[] => {
        const rows = takeRows(res);
        return (Array.isArray(rows) ? rows : []) as Faq[];
      },
      providesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.id }],
    }),

    adminCreateProductFaq: builder.mutation<
      Faq,
      {
        id: string;
        body: Pick<Faq, "question" | "answer" | "display_order"> & {
          is_active?: boolean | 0 | 1;
        };
      }
    >({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/faqs`,
        method: "POST",
        body,
      }),
      transformResponse: (res: unknown): Faq => res as Faq,
      invalidatesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.id }],
    }),

    adminUpdateProductFaq: builder.mutation<
      Faq,
      {
        id: string;
        faqId: string;
        body: Partial<
          Pick<Faq, "question" | "answer" | "display_order"> & {
            is_active?: boolean | 0 | 1;
          }
        >;
      }
    >({
      query: ({ id, faqId, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(
          id,
        )}/faqs/${encodeURIComponent(faqId)}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): Faq => res as Faq,
      invalidatesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.id }],
    }),

    adminToggleFaqActive: builder.mutation<
      { ok: true },
      { id: string; faqId: string; is_active: boolean | 0 | 1 }
    >({
      query: ({ id, faqId, is_active }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(
          id,
        )}/faqs/${encodeURIComponent(faqId)}/active`,
        method: "PATCH",
        body: { is_active: !!is_active },
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.id }],
    }),

    adminDeleteProductFaq: builder.mutation<
      { ok: true },
      { id: string; faqId: string }
    >({
      query: ({ id, faqId }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(
          id,
        )}/faqs/${encodeURIComponent(faqId)}`,
        method: "DELETE",
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.id }],
    }),

    /* ===================== SPECS (CRUD + LIST) ===================== */
    adminListProductSpecs: builder.query<ProductSpecRow[], { id: string }>({
      query: ({ id }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/specs`,
      }),
      transformResponse: (res: unknown): ProductSpecRow[] => {
        const rows = takeRows(res);
        return (Array.isArray(rows) ? rows : []) as ProductSpecRow[];
      },
      providesTags: (_r, _e, arg) => [{ type: "Specs", id: arg.id }],
    }),

    adminCreateProductSpec: builder.mutation<
      ProductSpecRow,
      { id: string; body: AdminSpecCreateBody }
    >({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/specs`,
        method: "POST",
        body,
      }),
      transformResponse: (res: unknown): ProductSpecRow =>
        res as ProductSpecRow,
      invalidatesTags: (_r, _e, arg) => [{ type: "Specs", id: arg.id }],
    }),

    adminUpdateProductSpec: builder.mutation<
      ProductSpecRow,
      { id: string; specId: string; body: AdminSpecUpdateBody }
    >({
      query: ({ id, specId, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(
          id,
        )}/specs/${encodeURIComponent(specId)}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): ProductSpecRow =>
        res as ProductSpecRow,
      invalidatesTags: (_r, _e, arg) => [{ type: "Specs", id: arg.id }],
    }),

    adminDeleteProductSpec: builder.mutation<
      { ok: true },
      { id: string; specId: string }
    >({
      query: ({ id, specId }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(
          id,
        )}/specs/${encodeURIComponent(specId)}`,
        method: "DELETE",
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Specs", id: arg.id }],
    }),

    /* ===================== ADMIN LISTS ===================== */
    adminListCategories: builder.query<AdminCategoryListItem[], void>({
      query: (): FetchArgs => ({ url: "/admin/categories" }),
      transformResponse: (res: unknown): AdminCategoryListItem[] => {
        const rows = takeRows(res);
        return Array.isArray(rows)
          ? (rows as AdminCategoryListItem[])
          : [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({
                type: "Category" as const,
                id: c.id,
              })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),

    adminListSubcategories: builder.query<
      AdminSubcategoryListItem[],
      { category_id?: string } | void
    >({
      query: (p): FetchArgs => {
        const url = "/admin/subcategories";
        const params = p?.category_id
          ? { category_id: p.category_id }
          : undefined;
        return params ? { url, params: params as Record<string, any> } : { url };
      },
      transformResponse: (res: unknown): AdminSubcategoryListItem[] => {
        const rows = takeRows(res);
        return Array.isArray(rows)
          ? (rows as AdminSubcategoryListItem[])
          : [];
      },
      providesTags: (_r, _e, arg) => [
        { type: "Subcategories", id: (arg as any)?.category_id ?? "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAdminListProductsQuery,
  useAdminGetProductQuery,
  useAdminCreateProductMutation,
  useAdminUpdateProductMutation,
  useAdminDeleteProductMutation,
  useAdminBulkSetActiveMutation,
  useAdminReorderProductsMutation,
  useAdminToggleActiveMutation,
  useAdminToggleHomepageMutation,

  // FAQs
  useAdminReplaceFaqsMutation,
  useAdminListProductFaqsQuery,
  useAdminCreateProductFaqMutation,
  useAdminUpdateProductFaqMutation,
  useAdminDeleteProductFaqMutation,
  useAdminToggleFaqActiveMutation,

  // SPECS
  useAdminReplaceSpecsMutation,
  useAdminListProductSpecsQuery,
  useAdminCreateProductSpecMutation,
  useAdminUpdateProductSpecMutation,
  useAdminDeleteProductSpecMutation,

  // IMAGES
  useAdminSetProductImagesMutation,

  // ADMIN LISTS
  useAdminListCategoriesQuery,
  useAdminListSubcategoriesQuery,

  // REVIEWS
  useAdminCreateProductReviewMutation,
  useAdminUpdateProductReviewMutation,
  useAdminToggleReviewActiveMutation,
  useAdminDeleteProductReviewMutation,
} = productsAdminApi;
