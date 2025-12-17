// -------------------------------------------------------------
// FILE: src/integrations/rtk/endpoints/faqs.endpoints.ts
// -------------------------------------------------------------
import { baseApi } from "../baseApi";
import type { Faq, FaqListParams } from "@/integrations/rtk/types/faqs";

const toPublicQuery = (p?: FaqListParams | void | null) => {
  const q: Record<string, any> = {};

  // Public default: aktifler
  q.is_active = true;

  if (!p) return q;

  if (p.search) q.q = p.search;
  if (typeof p.active === "boolean") q.is_active = p.active;
  if (p.category) q.category = p.category;

  if (typeof p.limit === "number") q.limit = p.limit;
  if (typeof p.offset === "number") q.offset = p.offset;

  // Backend’in beklediği format: "display_order.asc" gibi
  if (p.orderBy && p.order) q.order = `${p.orderBy}.${p.order}`;

  return q;
};

export const faqsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listFaqs: b.query<Faq[], FaqListParams | void>({
      query: (p) => ({ url: "/faqs", params: toPublicQuery(p) }),
      providesTags: () => [{ type: "Faqs" as const, id: "LIST" }],
    }),

    getFaq: b.query<Faq, string>({
      query: (id) => ({ url: `/faqs/${id}` }),
      providesTags: (_res, _e, id) => [{ type: "Faqs" as const, id }],
    }),

    getFaqBySlug: b.query<Faq, string>({
      query: (slug) => ({ url: `/faqs/by-slug/${slug}` }),
      providesTags: (_res, _e, slug) => [{ type: "Faqs" as const, id: `slug:${slug}` }],
    }),
  }),
  overrideExisting: true,
});

export const { useListFaqsQuery, useGetFaqQuery, useGetFaqBySlugQuery } = faqsApi;
