// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/reviews.endpoints.ts
// =============================================================
import { baseApi } from "@/integrations/rtk/baseApi";
import type {
  ReviewView,
  ReviewListParams,
  ReviewCreateInput,
} from "@/integrations/rtk/types/reviews";

// ❗️ void | ReviewListParams kabul et
function buildParams(p: ReviewListParams | void): Record<string, any> | undefined {
  if (!p) return undefined;
  const q: Record<string, any> = {};
  if (p.search) q.search = p.search;
  if (typeof p.approved === "boolean") q.approved = p.approved;
  if (typeof p.active === "boolean") q.active = p.active;
  if (typeof p.minRating === "number") q.minRating = p.minRating;
  if (typeof p.maxRating === "number") q.maxRating = p.maxRating;
  if (typeof p.limit === "number") q.limit = p.limit;
  if (typeof p.offset === "number") q.offset = p.offset;
  if (p.orderBy) q.orderBy = p.orderBy;
  if (p.order) q.order = p.order;
  return Object.keys(q).length ? q : undefined;
}

const extendedApi = baseApi.enhanceEndpoints({ addTagTypes: ["Review"] as const });

export const reviewsApi = extendedApi.injectEndpoints({
  endpoints: (builder) => ({
    listReviews: builder.query<ReviewView[], ReviewListParams | void>({
      query: (params) => {
        const q = buildParams(params);
        return q ? { url: "/reviews", params: q } : { url: "/reviews" };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((r) => ({ type: "Review" as const, id: r.id })),
            { type: "Review" as const, id: "LIST" },
          ]
          : [{ type: "Review" as const, id: "LIST" }],
    }),

    getReviewById: builder.query<ReviewView, string>({
      query: (id) => ({ url: `/reviews/${id}` }),
      providesTags: (_res, _err, id) => [{ type: "Review", id }],
    }),

    // Public create (onay bekler)
    createReview: builder.mutation<ReviewView, ReviewCreateInput>({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
} = reviewsApi;
