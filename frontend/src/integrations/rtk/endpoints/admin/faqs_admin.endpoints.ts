// ---------------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/admin/faqs_admin.endpoints.ts
// ---------------------------------------------------------------------
import { baseApi } from "../../baseApi";
import type { Faq, FaqListParams } from "@/integrations/rtk/types/faqs";

export type UpsertFaqInput = {
  question: string;
  answer: string;
  slug: string;
  category?: string | null;
  is_active?: boolean;
  display_order?: number;
};

export type PatchFaqInput = Partial<UpsertFaqInput>;

// FE → BE query map (admin)
function toAdminQuery(p?: FaqListParams) {
  if (!p) return undefined;
  const q: Record<string, any> = {};
  if (p.search) q.q = p.search;
  if (typeof p.active === "boolean") q.is_active = p.active;
  if (p.category) q.category = p.category;
  if (typeof p.limit === "number") q.limit = p.limit;
  if (typeof p.offset === "number") q.offset = p.offset;
  if (p.orderBy && p.order) q.order = `${p.orderBy}.${p.order}`; // backend 'order' stringini bekliyor
  return q;
}

export const faqsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // /admin/faqs
    listFaqsAdmin: b.query<Faq[], FaqListParams | void>({
      query: (p) =>
        p
          ? ({ url: "/admin/faqs", params: toAdminQuery(p) as Record<string, any> })
          : ({ url: "/admin/faqs" }),
      providesTags: (_res) => [{ type: "Faqs" as const, id: "LIST" }],
    }),

    // /admin/faqs/:id
    getFaqAdmin: b.query<Faq, string>({
      query: (id) => ({ url: `/admin/faqs/${id}` }),
      providesTags: (_res, _e, id) => [{ type: "Faqs" as const, id }],
    }),

    // /admin/faqs/by-slug/:slug
    getFaqBySlugAdmin: b.query<Faq, string>({
      query: (slug) => ({ url: `/admin/faqs/by-slug/${slug}` }),
      providesTags: (_res, _e, slug) => [{ type: "Faqs" as const, id: `slug:${slug}` }],
    }),

    // POST /admin/faqs
    createFaqAdmin: b.mutation<Faq, UpsertFaqInput>({
      query: (body) => ({
        url: "/admin/faqs",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Faqs" as const, id: "LIST" }],
    }),

    // PATCH /admin/faqs/:id
    updateFaqAdmin: b.mutation<Faq, { id: string; patch: PatchFaqInput }>({
      query: ({ id, patch }) => ({
        url: `/admin/faqs/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (res) =>
        res?.id
          ? [{ type: "Faqs" as const, id: res.id }, { type: "Faqs" as const, id: "LIST" }]
          : [{ type: "Faqs" as const, id: "LIST" }],
    }),

    // DELETE /admin/faqs/:id
    removeFaqAdmin: b.mutation<void, string>({
      query: (id) => ({
        url: `/admin/faqs/${id}`,
        method: "DELETE",
      }),
      // 204 döndüğü için data yok; LIST’i tazele
      invalidatesTags: (_res, _e, id) => [
        { type: "Faqs" as const, id },
        { type: "Faqs" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListFaqsAdminQuery,
  useGetFaqAdminQuery,
  useGetFaqBySlugAdminQuery,
  useCreateFaqAdminMutation,
  useUpdateFaqAdminMutation,
  useRemoveFaqAdminMutation,
} = faqsAdminApi;
