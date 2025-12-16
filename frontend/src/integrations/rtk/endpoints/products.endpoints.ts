// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/products.endpoints.ts
// =============================================================
import { baseApi } from "../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type {
  Product as ProductRow,
  Faq,
  Review,
  ProductOption,
  Stock,
  Spec as ProductSpecRow,
} from "@/integrations/rtk/types/products.rows";

const BASE = "/products";

/* --------- helpers --------- */
type NumericLike = number | string | null | undefined;
const asNumber = (v: NumericLike, fallback = 0): number => {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  if (typeof v === "string") {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
};
const toInt = (v: NumericLike, fallback = 0): number => Math.trunc(asNumber(v, fallback));
const parseArr = (v: unknown): string[] | null => {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch { /* CSV */ }
    return s.split(",").map((x) => x.trim()).filter(Boolean);
  }
  return null;
};

/* --------- Public tip: join alanları dahil --------- */
export type CategoryMini = { id: string; name: string; slug: string };
export type SubCategoryMini = { id: string; name: string; slug: string; category_id: string };

export type PublicProduct = ProductRow & {
  category?: CategoryMini | null;
  sub_category?: (SubCategoryMini | (CategoryMini & { category_id?: string })) | null;
};

/* ---- gevşek giriş ---- */
type ApiProductInput = Omit<
  ProductRow,
  "price" | "rating" | "review_count" | "stock_quantity" | "images" | "tags" | "storage_image_ids"
> & {
  price: NumericLike;
  rating?: NumericLike;
  review_count?: NumericLike;
  stock_quantity?: NumericLike;
  images?: unknown;
  storage_image_ids?: unknown;
  tags?: unknown;
  specifications?: unknown;
  category?: CategoryMini | null;
  sub_category?: SubCategoryMini | (CategoryMini & { category_id?: string }) | null;
};

const normalizeProduct = (p: ApiProductInput): ProductRow => {
  // 1) Galeri ID'leri (öncelik: storage_image_ids → image_ids → gallery_ids)
  const rawGalleryIds =
    p.storage_image_ids ??
    (p as any).image_ids ??
    (p as any).gallery_ids ??
    null;

  const galleryIds = parseArr(rawGalleryIds) ?? [];

  // 2) Görsel URL listesi (BE array gönderiyor ama string gelebilirse de normalize et)
  let imageUrls: string[] = [];

  if (Array.isArray(p.images)) {
    imageUrls = p.images.map(String).filter(Boolean);
  } else if (p.images != null) {
    imageUrls = parseArr(p.images) ?? [];
  }

  // 3) Kapak alias’ları + images fallback
  const storageAssetId: string | null =
    (p as any).storage_asset_id ?? (p as any).cover_id ?? null;

  let imageUrl: string | null =
    (p as any).image_url ?? (p as any).cover_url ?? null;

  if (!imageUrl && imageUrls.length > 0) {
    // kapak yoksa ilk görseli kapak olarak kullan
    imageUrl = String(imageUrls[0]);
  }

  // 4) Etiketler
  const tagsArr = parseArr(p.tags ?? null) ?? [];

  const product: ProductRow = {
    // base alanlar (id, title, slug, category_id vs.)
    ...(p as ProductRow),

    // alias normalizasyonu — kesinlikle string | null
    image_url: imageUrl,
    storage_asset_id: storageAssetId,

    // FE tipiyle birebir uyumlu alanlar
    storage_image_ids: galleryIds,
    images: imageUrls,

    // sayısal alanlar
    price: asNumber(p.price, 0),
    rating: asNumber(p.rating, 0),        // istersen 5 yapabilirsin
    review_count: toInt(p.review_count, 0),
    stock_quantity: toInt(p.stock_quantity, 0),

    tags: tagsArr,
    specifications: (p as any).specifications ?? null,
  };

  return product;
};



/* =============================================================
   RTK endpoints
============================================================= */
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------- LIST ----------------
    listProducts: builder.query<
      PublicProduct[],
      {
        category_id?: string;
        sub_category_id?: string;
        is_active?: boolean | 0 | 1;
        q?: string;
        limit?: number;
        offset?: number;
        sort?: "price" | "rating" | "created_at";
        order?: "asc" | "desc";
        slug?: string;
      } | void
    >({
      query: (params): FetchArgs => {
        const p = params ?? {};
        return {
          url: BASE,
          params: {
            ...p,
            is_active: p.is_active === undefined ? undefined : (p.is_active ? 1 : 0),
          } as Record<string, any>,
        };
      },
      transformResponse: (res: unknown): PublicProduct[] => {
        if (Array.isArray(res)) return (res as ApiProductInput[]).map(normalizeProduct);
        if (res && typeof res === "object") return [normalizeProduct(res as ApiProductInput)];
        return [];
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((p) => ({ type: "Product" as const, id: p.id })),
            { type: "Products" as const, id: "LIST" },
          ]
          : [{ type: "Products" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    // ------------- GET /products/:idOrSlug -------------
    getProduct: builder.query<PublicProduct, string>({
      query: (idOrSlug): FetchArgs => ({ url: `${BASE}/${encodeURIComponent(idOrSlug)}` }),
      transformResponse: (res: unknown): PublicProduct => normalizeProduct(res as ApiProductInput),
      providesTags: (r) => (r ? [{ type: "Product", id: r.id }] : [{ type: "Products", id: "LIST" }]),
    }),

    // ------------- GET /products/id/:id -------------
    getProductById: builder.query<PublicProduct, string>({
      query: (id): FetchArgs => ({ url: `${BASE}/id/${encodeURIComponent(id)}` }),
      transformResponse: (res: unknown): PublicProduct => normalizeProduct(res as ApiProductInput),
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),

    // ------------- GET /products/by-slug/:slug -------------
    getProductBySlug: builder.query<PublicProduct, string>({
      query: (slug): FetchArgs => ({ url: `${BASE}/by-slug/${encodeURIComponent(slug)}` }),
      transformResponse: (res: unknown): PublicProduct => normalizeProduct(res as ApiProductInput),
      providesTags: (r) => (r ? [{ type: "Product", id: r.id }] : [{ type: "Products", id: "LIST" }]),
    }),

    // ---------------- Public lists ----------------
    listProductFaqs: builder.query<Faq[], { product_id: string; only_active?: boolean | 0 | 1 }>({
      query: ({ product_id, only_active = true }): FetchArgs => ({
        url: "/product_faqs",
        params: { product_id, only_active: only_active ? 1 : 0 },
      }),
      providesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.product_id }],
    }),

    listProductSpecs: builder.query<ProductSpecRow[], { product_id: string }>({
      query: ({ product_id }): FetchArgs => ({ url: "/product_specs", params: { product_id } }),
      transformResponse: (res: unknown): ProductSpecRow[] => {
        const arr = Array.isArray(res) ? (res as ProductSpecRow[]) : [];
        return arr.slice().sort((a, b) => a.order_num - b.order_num);
      },
      providesTags: (_r, _e, arg) => [{ type: "Specs", id: arg.product_id }],
    }),

    listProductReviews: builder.query<Review[], { product_id: string; only_active?: boolean | 0 | 1 }>({
      query: ({ product_id, only_active = true }): FetchArgs => ({
        url: "/product_reviews",
        params: { product_id, only_active: only_active ? 1 : 0 },
      }),
      providesTags: (_r, _e, arg) => [{ type: "Reviews", id: arg.product_id }],
    }),

    // Not: Bu ikisi projede başka modül/rota ile servis ediliyorsa kalsın; yoksa kaldırabilirsiniz.
    listProductOptions: builder.query<ProductOption[], { product_id: string }>({
      query: ({ product_id }): FetchArgs => ({ url: "/product_options", params: { product_id } }),
      transformResponse: (res: unknown): ProductOption[] => {
        const arr = Array.isArray(res) ? (res as ProductOption[]) : [];
        return arr.map((o) => ({
          ...o,
          option_values: Array.isArray(o.option_values)
            ? o.option_values.map(String)
            : parseArr((o as any).option_values)?.filter(Boolean) ?? [],
        }));
      },
      providesTags: (_r, _e, arg) => [{ type: "Options", id: arg.product_id }],
    }),

    listProductStock: builder.query<Stock[], { product_id: string; is_used?: boolean | 0 | 1 }>({
      query: ({ product_id, is_used }): FetchArgs => ({
        url: "/product_stock",
        params: { product_id, ...(is_used === undefined ? {} : { is_used: is_used ? 1 : 0 }) },
      }),
      providesTags: (_r, _e, arg) => [{ type: "Stock", id: arg.product_id }],
    }),

    /* -------- Optional product CRUD (auth) -------- */
    createProduct: builder.mutation<PublicProduct, Partial<ProductRow>>({
      query: (body): FetchArgs => ({ url: BASE, method: "POST", body }),
      transformResponse: (res: unknown): PublicProduct => normalizeProduct(res as ApiProductInput),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateProduct: builder.mutation<PublicProduct, { id: string; body: Partial<ProductRow> }>({
      query: ({ id, body }): FetchArgs => ({ url: `${BASE}/${encodeURIComponent(id)}`, method: "PATCH", body }),
      transformResponse: (res: unknown): PublicProduct => normalizeProduct(res as ApiProductInput),
      invalidatesTags: (_r, _e, arg) => [{ type: "Product", id: arg.id }, { type: "Products", id: "LIST" }],
    }),

    deleteProduct: builder.mutation<{ ok: true }, string>({
      query: (id): FetchArgs => ({ url: `${BASE}/${encodeURIComponent(id)}`, method: "DELETE" }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, id) => [{ type: "Product", id }, { type: "Products", id: "LIST" }],
    }),

    /* -------- Optional FAQ CRUD (auth) -------- */
    createProductFaq: builder.mutation<Faq, Omit<Faq, "id" | "created_at" | "updated_at">>({
      query: (body): FetchArgs => ({ url: "/product_faqs", method: "POST", body }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.product_id }],
    }),
    updateProductFaq: builder.mutation<Faq, { id: string; body: Partial<Faq> }>({
      query: ({ id, body }): FetchArgs => ({ url: `/product_faqs/${encodeURIComponent(id)}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.body.product_id ?? "LIST" }],
    }),
    deleteProductFaq: builder.mutation<{ ok: true }, { id: string; product_id: string }>({
      query: ({ id }): FetchArgs => ({ url: `/product_faqs/${encodeURIComponent(id)}`, method: "DELETE" }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Faqs", id: arg.product_id }],
    }),

    /* -------- Optional Spec CRUD (auth) -------- */
    createProductSpec: builder.mutation<ProductSpecRow, Omit<ProductSpecRow, "id" | "created_at" | "updated_at">>({
      query: (body): FetchArgs => ({ url: "/product_specs", method: "POST", body }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Specs", id: arg.product_id }],
    }),
    updateProductSpec: builder.mutation<ProductSpecRow, { id: string; body: Partial<ProductSpecRow> }>({
      query: ({ id, body }): FetchArgs => ({ url: `/product_specs/${encodeURIComponent(id)}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Specs", id: arg.body.product_id ?? "LIST" }],
    }),
    deleteProductSpec: builder.mutation<{ ok: true }, { id: string; product_id: string }>({
      query: ({ id }): FetchArgs => ({ url: `/product_specs/${encodeURIComponent(id)}`, method: "DELETE" }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Specs", id: arg.product_id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  // Queries
  useListProductsQuery,
  useGetProductQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useListProductFaqsQuery,
  useListProductSpecsQuery,
  useListProductReviewsQuery,
  useListProductOptionsQuery,
  useListProductStockQuery,
  // Mutations
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductFaqMutation,
  useUpdateProductFaqMutation,
  useDeleteProductFaqMutation,
  useCreateProductSpecMutation,
  useUpdateProductSpecMutation,
  useDeleteProductSpecMutation,
} = productsApi;
