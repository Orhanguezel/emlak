// -------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/faqs.endpoints.ts
// -------------------------------------------------------------
import { baseApi } from "../baseApi";
import type { Faq, FaqListParams } from "@/integrations/rtk/types/faqs";

/** FE -> BE query mapping (public) */
const toPublicQuery = (p: FaqListParams | void | undefined | null) => {
  // Public default: sadece aktifler
  if (!p) return { is_active: true };
  const q: Record<string, any> = { is_active: true }; // zorunlu
  if (p.search) q.q = p.search;
  if (typeof p.active === "boolean") q.is_active = p.active; // override edilebilir
  if (p.category) q.category = p.category;
  if (typeof p.limit === "number") q.limit = p.limit;
  if (typeof p.offset === "number") q.offset = p.offset;
  if (p.orderBy && p.order) q.order = `${p.orderBy}.${p.order}`;
  return q;
};

export const faqsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listFaqs: b.query<Faq[], FaqListParams | void>({
      query: (p) => ({ url: "/faqs", params: toPublicQuery(p) }),
      providesTags: (_res) => [{ type: "Faqs" as const, id: "LIST" }],
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

export const {
  useListFaqsQuery,
  useGetFaqQuery,
  useGetFaqBySlugQuery,
} = faqsApi;
