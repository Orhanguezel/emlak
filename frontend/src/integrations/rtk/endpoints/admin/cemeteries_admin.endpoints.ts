// -----------------------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/admin/cemeteries_admin.endpoints.ts
// -----------------------------------------------------------------------------
import { baseApi } from "../../baseApi";
import type { Cemeteries as CemeteryView } from "@/integrations/rtk/types/cemeteries";

// Liste filtreleri (public ile aynı)
export type AdminListParams = {
  search?: string;
  district?: string;
  type?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
};

// Admin create/update body (BE validation ile uyumlu alan adları)
export type CemeteryUpsertBody = {
  name: string;
  slug: string;
  type: string;
  address: string;
  district: string;
  phone: string;
  fax?: string | null;

  coordinates: { lat: number; lng: number }; // BE dec6 ile normalize ediyor
  services: string[];

  working_hours: string; // DİKKAT: admin body'de snake_case
  description: string;

  accessibility?: string | null;
  transportation?: string | null;

  is_active?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  display_order?: number;
};

// exactOptionalPropertyTypes ile uyumlu param builder
const buildParams = (q?: AdminListParams): Record<string, any> => {
  if (!q) return {};
  const out: Record<string, any> = {};
  if (typeof q.search !== "undefined") out.search = q.search;
  if (typeof q.district !== "undefined") out.district = q.district;
  if (typeof q.type !== "undefined") out.type = q.type;
  if (typeof q.active !== "undefined") out.active = q.active ? 1 : 0;
  if (typeof q.limit !== "undefined") out.limit = q.limit;
  if (typeof q.offset !== "undefined") out.offset = q.offset;
  return out;
};

// Admin tarafı bazı controller'larda DB row dönebilir.
// Gelen cevabı her ihtimale karşı CemeteryView'e normalize edelim.
const toNum = (v: unknown): number =>
  typeof v === "number" ? v : typeof v === "string" ? Number(v) : 0;

function toView(r: any): CemeteryView {
  // Eğer zaten view ise direkt dön
  if (r && r.coordinates && typeof r.workingHours === "string") return r as CemeteryView;

  return {
    id: r.id,
    name: r.name,
    type: r.type,
    address: r.address,
    district: r.district,
    phone: r.phone,
    fax: r.fax ?? undefined,
    coordinates: { lat: toNum(r.lat ?? r.coordinates?.lat), lng: toNum(r.lng ?? r.coordinates?.lng) },
    services: Array.isArray(r.services) ? r.services : [],
    workingHours: r.workingHours ?? r.working_hours ?? "",
    description: r.description ?? "",
    accessibility: r.accessibility ?? undefined,
    transportation: r.transportation ?? undefined,
  };
}

export const cemeteriesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listCemeteriesAdmin: b.query<CemeteryView[], AdminListParams | void>({
      query: (q) =>
        q ? { url: "/admin/cemeteries", params: buildParams(q) } : "/admin/cemeteries",
      transformResponse: (res: unknown): CemeteryView[] =>
        Array.isArray(res) ? (res as any[]).map(toView) : [],
      providesTags: (_res) => [{ type: "Cemeteries" as const, id: "LIST" }],
    }),

    getCemeteryAdmin: b.query<CemeteryView, string>({
      query: (id) => ({ url: `/admin/cemeteries/${id}` }),
      transformResponse: (r: unknown) => toView(r),
      providesTags: (_res, _e, id) => [{ type: "Cemeteries" as const, id }],
    }),

    getCemeteryBySlugAdmin: b.query<CemeteryView, string>({
      query: (slug) => ({ url: `/admin/cemeteries/by-slug/${slug}` }),
      transformResponse: (r: unknown) => toView(r),
      providesTags: (_res, _e, slug) => [{ type: "Cemeteries" as const, id: `slug:${slug}` }],
    }),

    createCemeteryAdmin: b.mutation<CemeteryView, CemeteryUpsertBody>({
      query: (body) => ({
        url: `/admin/cemeteries`,
        method: "POST",
        body,
      }),
      transformResponse: (r: unknown) => toView(r),
      invalidatesTags: [{ type: "Cemeteries", id: "LIST" }],
    }),

    updateCemeteryAdmin: b.mutation<CemeteryView, { id: string; patch: Partial<CemeteryUpsertBody> }>({
      query: ({ id, patch }) => ({
        url: `/admin/cemeteries/${id}`,
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (r: unknown) => toView(r),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Cemeteries", id: "LIST" },
        { type: "Cemeteries", id },
      ],
    }),

    removeCemeteryAdmin: b.mutation<void, string>({
      query: (id) => ({
        url: `/admin/cemeteries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Cemeteries", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListCemeteriesAdminQuery,
  useGetCemeteryAdminQuery,
  useGetCemeteryBySlugAdminQuery,
  useCreateCemeteryAdminMutation,
  useUpdateCemeteryAdminMutation,
  useRemoveCemeteryAdminMutation,
} = cemeteriesAdminApi;
