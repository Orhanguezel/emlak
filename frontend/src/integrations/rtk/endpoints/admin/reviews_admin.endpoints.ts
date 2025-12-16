// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/admin/reviews_admin.endpoints.ts
// =============================================================
import { baseApi } from "@/integrations/rtk/baseApi";
import type {
  ReviewView,
  ReviewListParams,
  ReviewCreateInput,
  ReviewUpdateInput,
} from "@/integrations/rtk/types/reviews";

// src/integrations/metahub/rtk/endpoints/admin/reviews_admin.endpoints.ts
function buildParams(p: ReviewListParams | void): Record<string, any> | undefined {
  if (!p) return undefined;
  const q: Record<string, any> = {};
  if (p.search) q.search = p.search;
  if (typeof p.approved === "boolean") q.approved = p.approved;
  if (typeof p.active === "boolean") q.active = p.active;
  if (typeof p.minRating === "number" && Number.isFinite(p.minRating) && p.minRating >= 1) q.minRating = p.minRating;
  if (typeof p.maxRating === "number" && Number.isFinite(p.maxRating) && p.maxRating >= 1) q.maxRating = p.maxRating;
  if (typeof p.limit === "number") q.limit = p.limit;
  if (typeof p.offset === "number") q.offset = p.offset;
  if (p.orderBy) q.orderBy = p.orderBy;
  if (p.order) q.order = p.order;
  return Object.keys(q).length ? q : undefined;
}



const extendedApi = baseApi.enhanceEndpoints({ addTagTypes: ["Review"] as const });

export const reviewsAdminApi = extendedApi.injectEndpoints({
  endpoints: (builder) => ({
    listReviewsAdmin: builder.query<ReviewView[], ReviewListParams | void>({
      query: (params) => {
        const q = buildParams(params);
        return q ? { url: "/admin/reviews", params: q } : { url: "/admin/reviews" };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((r) => ({ type: "Review" as const, id: r.id })),
            { type: "Review" as const, id: "LIST" },
          ]
          : [{ type: "Review" as const, id: "LIST" }],
    }),

    getReviewAdmin: builder.query<ReviewView, string>({
      query: (id) => ({ url: `/admin/reviews/${id}` }),
      providesTags: (_res, _err, id) => [{ type: "Review", id }],
    }),

    createReviewAdmin: builder.mutation<ReviewView, ReviewCreateInput>({
      query: (body) => ({
        url: "/admin/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),

    updateReviewAdmin: builder.mutation<ReviewView, { id: string; body: ReviewUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/admin/reviews/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "Review" as const, id: result.id }, { type: "Review" as const, id: "LIST" }]
          : [{ type: "Review" as const, id: "LIST" }],
    }),

    deleteReviewAdmin: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({
        url: `/admin/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListReviewsAdminQuery,
  useGetReviewAdminQuery,
  useCreateReviewAdminMutation,
  useUpdateReviewAdminMutation,
  useDeleteReviewAdminMutation,
} = reviewsAdminApi;
