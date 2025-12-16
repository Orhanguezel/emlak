// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/admin/dashboard_admin.endpoints.ts
// =============================================================
import { baseApi } from "../../baseApi";
import type { FetchArgs, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";

// ---- Helpers -------------------------------------------------
function getTotalFromMeta(meta?: FetchBaseQueryMeta, fallback = 0) {
  const h = meta?.response?.headers;
  if (!h) return fallback;
  const v = h.get("x-total-count") || h.get("X-Total-Count");
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function toCountQuery(url: string, params?: Record<string, any>): FetchArgs {
  return {
    url,
    params: { limit: 1, offset: 0, ...params },
    // admin uçları yetki ister; x-skip-auth KULLANMA
  };
}

function toListQuery(url: string, params?: Record<string, any>): FetchArgs {
  return {
    url,
    params: {
      limit: 10,
      offset: 0,
      orderBy: "created_at",
      order: "desc",
      ...params,
    },
  };
}

/** JSON gövdesi { total } veya { meta: { total } } dönerse de destekle */
function coerceCount(data: unknown, meta?: FetchBaseQueryMeta) {
  const totalFromHeader = getTotalFromMeta(meta, 0);
  if (totalFromHeader) return totalFromHeader;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const any = data as any;
    if (typeof any.total === "number") return any.total;
    if (typeof any.count === "number") return any.count;                 // 👈 eklendi
    if (any.meta && typeof any.meta.total === "number") return any.meta.total;
    if (any.pagination && typeof any.pagination.total === "number") return any.pagination.total; // 👈 eklendi
    if (Array.isArray(any.items) && typeof any.items_total === "number") return any.items_total;
  }
  if (Array.isArray(data)) return data.length;
  return 0;
}


/** Body { items: T[] } / { data: T[] } / T[] -> T[] */
function coerceItems<T = any>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const any = data as any;
    if (Array.isArray(any.items)) return any.items as T[];
    if (Array.isArray(any.data)) return any.data as T[];
    if (Array.isArray(any.results)) return any.results as T[];
  }
  return [];
}

// ---- Light types (dashboard özet tabloları için) -------------
export type ProductLite = {
  id: string | number;
  title?: string;
  price?: number | string | null;
  created_at?: string | Date | null;
  sub_category_id?: string | number | null;
};

export type UserLite = {
  id: string | number;
  email?: string;
  full_name?: string | null;
  roles?: string[] | string | null;
  created_at?: string | Date | null;
};

// ---- API -----------------------------------------------------
export const dashboardAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // Counts
    countProducts: b.query<number, void>({
      query: () => toCountQuery("/admin/products/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Products", id: "COUNT" }],
    }),
    countCategories: b.query<number, void>({
      query: () => toCountQuery("/admin/categories/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Categories", id: "COUNT" }],
    }),
    countSubCategories: b.query<number, void>({
      query: () => toCountQuery("/admin/sub-categories/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "SubCategories", id: "COUNT" }],
    }),
    countUsers: b.query<number, void>({
      query: () => toCountQuery("/admin/users/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Users", id: "COUNT" }],
    }),

    countPages: b.query<number, void>({
      query: () => toCountQuery("/admin/custom-pages/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Pages", id: "COUNT" }],
    }),
    countServices: b.query<number, void>({
      query: () => toCountQuery("/admin/services/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Services", id: "COUNT" }],
    }),
    countContacts: b.query<number, void>({
      query: () => toCountQuery("/admin/contacts/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Contacts", id: "COUNT" }],
    }),
    countSliders: b.query<number, void>({
      query: () => toCountQuery("/admin/sliders/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Sliders", id: "COUNT" }],
    }),
    countAccessories: b.query<number, void>({
      query: () => toCountQuery("/admin/accessories/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Accessories", id: "COUNT" }],
    }),
    countCampaigns: b.query<number, void>({
      query: () => toCountQuery("/admin/campaigns/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Campaigns", id: "COUNT" }],
    }),
    countAnnouncements: b.query<number, void>({
      query: () => toCountQuery("/admin/announcements/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Announcements", id: "COUNT" }],
    }),
    countReviews: b.query<number, void>({
      query: () => toCountQuery("/admin/product-reviews/list"),
      transformResponse: (res, meta) => coerceCount(res, meta),
      providesTags: [{ type: "Reviews", id: "COUNT" }],
    }),

    // Latest lists (Dashboard tabloları)
    latestProducts: b.query<ProductLite[], number | void>({
      query: (limit = 10) =>
        toListQuery("/admin/products/list", { limit }),
      transformResponse: (res) => coerceItems<ProductLite>(res),
      providesTags: (res) =>
        Array.isArray(res)
          ? [
              ...res.map((x) => ({ type: "Products" as const, id: x.id })),
              { type: "Products" as const, id: "LATEST" },
            ]
          : [{ type: "Products" as const, id: "LATEST" }],
    }),

    latestUsers: b.query<UserLite[], number | void>({
      query: (limit = 10) =>
        toListQuery("/admin/users/list", { limit }),
      transformResponse: (res) => coerceItems<UserLite>(res),
      providesTags: (res) =>
        Array.isArray(res)
          ? [
              ...res.map((x) => ({ type: "Users" as const, id: x.id })),
              { type: "Users" as const, id: "LATEST" },
            ]
          : [{ type: "Users" as const, id: "LATEST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  // counts
  useCountProductsQuery,
  useCountCategoriesQuery,
  useCountSubCategoriesQuery,
  useCountUsersQuery,
  useCountPagesQuery,
  useCountServicesQuery,
  useCountContactsQuery,
  useCountSlidersQuery,
  useCountAccessoriesQuery,
  useCountCampaignsQuery,
  useCountAnnouncementsQuery,
  useCountReviewsQuery,
  // latest
  useLatestProductsQuery,
  useLatestUsersQuery,
} = dashboardAdminApi;
