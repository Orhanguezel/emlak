// /src/integrations/metahub/rtk/endpoints/recent_works.endpoints.ts

// -------------------------------------------------------------
// PUBLIC recent_works RTK endpoints (backend ile uyumlu)
// -------------------------------------------------------------
import { baseApi } from "../baseApi";
import type {
  RecentWorkView,
  RecentWorkPublicListParams,
} from "@/integrations/rtk/types/recent_works";

// params temizleyici: void/undefined/null/object dışı her şeyi reddet
const defParams = (o?: unknown): Record<string, any> | undefined => {
  if (!o || typeof o !== "object") return undefined;
  const r: Record<string, any> = {};
  for (const [k, v] of Object.entries(o as Record<string, any>)) {
    if (v !== undefined && v !== null && v !== "") r[k] = v;
  }
  return Object.keys(r).length ? r : undefined;
};

export const recentWorksApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /** GET /recent_works */
    listRecentWorks: b.query<RecentWorkView[], RecentWorkPublicListParams | void>({
      query: (params) => {
        const qp = defParams(params);
        return qp
          ? { url: "/recent_works", params: qp }
          : { url: "/recent_works" };
      },
      providesTags: [{ type: "RecentWorks" as const, id: "LIST" }],
      keepUnusedDataFor: 120,
    }),

    /** GET /recent_works/:id */
    getRecentWork: b.query<RecentWorkView, string>({
      query: (id) => ({ url: `/recent_works/${encodeURIComponent(id)}` }),
      providesTags: (_r, _e, id) => [{ type: "RecentWorks" as const, id }],
      keepUnusedDataFor: 300,
    }),

    /** GET /recent_works/by-slug/:slug */
    getRecentWorkBySlug: b.query<RecentWorkView, string>({
      query: (slug) => ({ url: `/recent_works/by-slug/${encodeURIComponent(slug)}` }),
      providesTags: (_r, _e, slug) => [{ type: "RecentWorks" as const, id: `slug:${slug}` }],
      keepUnusedDataFor: 300,
    }),

    /** GET /recent_works/_meta/categories */
    listRecentWorkCategories: b.query<string[], void>({
      query: () => ({ url: "/recent_works/_meta/categories" }),
    }),

    /** GET /recent_works/_meta/years */
    listRecentWorkYears: b.query<string[], void>({
      query: () => ({ url: "/recent_works/_meta/years" }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useListRecentWorksQuery,
  useGetRecentWorkQuery,
  useGetRecentWorkBySlugQuery,
  useListRecentWorkCategoriesQuery,
  useListRecentWorkYearsQuery,
} = recentWorksApi;
