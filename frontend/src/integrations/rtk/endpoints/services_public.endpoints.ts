// src/integrations/metahub/rtk/endpoints/services_public.endpoints.ts
import { baseApi } from "@/integrations/rtk/baseApi";
import type { ServiceListParams, ServiceView } from "@/integrations/rtk/types/services.types";

const PUBLIC_SORT_WHITELIST = new Set<NonNullable<ServiceListParams["orderBy"]>>([
  "created_at", "updated_at", "name", "display_order",
]);

/** QS helper: boolean → "true"/"false", array → CSV */
function qs(params?: Record<string, unknown>) {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) sp.set(k, v.join(","));          // ✅ array -> CSV
    else if (typeof v === "boolean") sp.set(k, v ? "true" : "false");
    else sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** FE -> BE public list param eşlemesi (+ type) */
function toPublicQuery(p: ServiceListParams | void | undefined) {
  if (!p) return undefined;
  const q: Record<string, unknown> = {};

  if (p.search !== undefined) q.q = p.search;

  if (typeof p.limit === "number") q.limit = Math.max(1, Math.min(200, p.limit));
  if (p.offset !== undefined) q.offset = p.offset;

  if (p.orderBy && PUBLIC_SORT_WHITELIST.has(p.orderBy)) q.sort = p.orderBy;
  if (p.order && (p.order === "asc" || p.order === "desc")) q.order = p.order;

  // ✅ kritik: type
  if (p.type !== undefined) q.type = p.type;

  return q;
}

const PUBLIC_BASE = "/services";

export const servicesPublicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listServicesPublic: builder.query<ServiceView[], ServiceListParams | void>({
      query: (params) => `${PUBLIC_BASE}${qs(toPublicQuery(params))}`,
      providesTags: (result) =>
        result
          ? [
            { type: "Services", id: "PUBLIC_LIST" },
            ...result.map((s) => ({ type: "Services" as const, id: `pub:${s.id}` })),
          ]
          : [{ type: "Services", id: "PUBLIC_LIST" }],
    }),
    getServicePublicById: builder.query<ServiceView, string>({
      query: (id) => `${PUBLIC_BASE}/${encodeURIComponent(id)}`,
      providesTags: (_res, _err, id) => [{ type: "Services", id: `pub:${id}` }],
    }),
    getServicePublicBySlug: builder.query<ServiceView, string>({
      query: (slug) => `${PUBLIC_BASE}/by-slug/${encodeURIComponent(slug)}`,
      providesTags: (_res, _err, slug) => [{ type: "Services", id: `pub:slug:${slug}` }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListServicesPublicQuery,
  useGetServicePublicByIdQuery,
  useGetServicePublicBySlugQuery,
} = servicesPublicApi;
