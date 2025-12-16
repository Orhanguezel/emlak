// ---------------------------------------------------------------------
// ADMIN recent_works RTK endpoints (backend ile uyumlu)
// ---------------------------------------------------------------------
import { baseApi } from "../../baseApi";
import type {
  RecentWorkView,
  RecentWorkAdminListParams,
  UpsertRecentWorkBody,
  PatchRecentWorkBody,
  AttachRecentWorkImageBody,
} from "@/integrations/rtk/types/recent_works";

const BASE = "/admin/recent_works";

// params temizleyici (void/undefined güvenli)
const defParams = (o?: unknown): Record<string, any> | undefined => {
  if (!o || typeof o !== "object") return undefined;
  const r: Record<string, any> = {};
  for (const [k, v] of Object.entries(o as Record<string, any>)) {
    if (v !== undefined && v !== null && v !== "") r[k] = v;
  }
  return Object.keys(r).length ? r : undefined;
};

export const recentWorksAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /** GET /recent_works (admin) */
    listRecentWorksAdmin: b.query<RecentWorkView[], RecentWorkAdminListParams | void>({
      query: (params) => {
        const qp = defParams(params);
        return qp ? { url: `${BASE}`, params: qp } : { url: `${BASE}` };
      },
      providesTags: [{ type: "RecentWorks" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    /** GET /recent_works/:id */
    getRecentWorkAdmin: b.query<RecentWorkView, string>({
      query: (id) => ({ url: `${BASE}/${encodeURIComponent(id)}` }),
      providesTags: (_r, _e, id) => [{ type: "RecentWorks" as const, id }],
      keepUnusedDataFor: 300,
    }),

    /** GET /recent_works/by-slug/:slug */
    getRecentWorkBySlugAdmin: b.query<RecentWorkView, string>({
      query: (slug) => ({ url: `${BASE}/by-slug/${encodeURIComponent(slug)}` }),
      providesTags: (_r, _e, slug) => [{ type: "RecentWorks" as const, id: `slug:${slug}` }],
      keepUnusedDataFor: 300,
    }),

    /** POST /recent_works */
    createRecentWorkAdmin: b.mutation<RecentWorkView, UpsertRecentWorkBody>({
      query: (body) => ({ url: `${BASE}`, method: "POST", body }),
      invalidatesTags: [{ type: "RecentWorks" as const, id: "LIST" }],
    }),

    /** PATCH /recent_works/:id */
    updateRecentWorkAdmin: b.mutation<RecentWorkView, { id: string; body: PatchRecentWorkBody }>({
      query: ({ id, body }) => ({ url: `${BASE}/${encodeURIComponent(id)}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "RecentWorks" as const, id: arg.id },
        { type: "RecentWorks" as const, id: "LIST" },
      ],
    }),

    /** DELETE /recent_works/:id */
    removeRecentWorkAdmin: b.mutation<void, string>({
      query: (id) => ({ url: `${BASE}/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "RecentWorks" as const, id },
        { type: "RecentWorks" as const, id: "LIST" },
      ],
    }),

    /* ==================== IMAGE (tek görsel) ==================== */

    /** POST /recent_works/:id/image → RecentWorkView */
    attachRecentWorkImageAdmin: b.mutation<
      RecentWorkView,
      { id: string; body: AttachRecentWorkImageBody }
    >({
      query: ({ id, body }) => ({
        url: `${BASE}/${encodeURIComponent(id)}/image`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "RecentWorks" as const, id: arg.id },
        { type: "RecentWorks" as const, id: "LIST" },
      ],
    }),

    /** DELETE /recent_works/:id/image → RecentWorkView */
    detachRecentWorkImageAdmin: b.mutation<RecentWorkView, string>({
      query: (id) => ({ url: `${BASE}/${encodeURIComponent(id)}/image`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "RecentWorks" as const, id },
        { type: "RecentWorks" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListRecentWorksAdminQuery,
  useGetRecentWorkAdminQuery,
  useGetRecentWorkBySlugAdminQuery,
  useCreateRecentWorkAdminMutation,
  useUpdateRecentWorkAdminMutation,
  useRemoveRecentWorkAdminMutation,
  useAttachRecentWorkImageAdminMutation,
  useDetachRecentWorkImageAdminMutation,
} = recentWorksAdminApi;
