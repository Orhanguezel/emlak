// -----------------------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/admin/properties_admin.endpoints.ts
// -----------------------------------------------------------------------------
import { baseApi } from "../../baseApi";
import type { Properties as PropertyView } from "@/integrations/rtk/types/properties";

// Liste filtreleri (public ile aynı mantık)
export type AdminListParams = {
  search?: string;
  district?: string;
  city?: string;
  type?: string;
  status?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
};

// Admin create/update body (BE validation ile uyumlu alan adları)
// Not: BE body alanları snake_case değil; burada BE ile aynı camelCase kullanıyoruz.
export type PropertyUpsertBody = {
  title: string;
  slug: string;

  type: string;
  status: string;

  address: string;
  district: string;
  city: string;

  coordinates: { lat: number; lng: number }; // BE dec6 ile normalize ediyor
  description?: string | null;

  is_active?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  display_order?: number;
};

// exactOptionalPropertyTypes ile uyumlu param builder
// FE -> BE map:
//   search -> q
//   active -> is_active (0/1)
//   diğerleri aynı
const buildParams = (q?: AdminListParams): Record<string, any> => {
  if (!q) return {};
  const out: Record<string, any> = {};

  if (typeof q.search !== "undefined") out.q = q.search;
  if (typeof q.district !== "undefined") out.district = q.district;
  if (typeof q.city !== "undefined") out.city = q.city;
  if (typeof q.type !== "undefined") out.type = q.type;
  if (typeof q.status !== "undefined") out.status = q.status;

  if (typeof q.active !== "undefined") out.is_active = q.active ? 1 : 0;

  if (typeof q.limit !== "undefined") out.limit = q.limit;
  if (typeof q.offset !== "undefined") out.offset = q.offset;

  return out;
};

// Admin tarafı bazı controller'larda DB row dönebilir.
// Gelen cevabı her ihtimale karşı PropertyView'e normalize edelim.
const toNum = (v: unknown): number =>
  typeof v === "number" ? v : typeof v === "string" ? Number(v) : 0;

const toBool = (v: unknown): boolean =>
  v === true || v === 1 || v === "1" || v === "true";

function toView(r: any): PropertyView {
  // Eğer zaten view ise direkt dön (coordinates + created/updated gibi alanlara göre)
  if (r && r.coordinates && typeof r.title === "string") {
    return {
      id: r.id,
      title: r.title,
      slug: r.slug,

      type: r.type,
      status: r.status,

      address: r.address,
      district: r.district,
      city: r.city,

      coordinates: {
        lat: toNum(r.coordinates?.lat ?? r.lat),
        lng: toNum(r.coordinates?.lng ?? r.lng),
      },

      description: typeof r.description !== "undefined" ? r.description : null,

      is_active: typeof r.is_active === "boolean" ? r.is_active : toBool(r.is_active),

      display_order: typeof r.display_order === "number" ? r.display_order : Number(r.display_order ?? 0),

      created_at: String(r.created_at ?? ""),
      updated_at: String(r.updated_at ?? ""),
    };
  }

  // DB row fallback
  return {
    id: r.id,
    title: r.title ?? "",
    slug: r.slug ?? "",

    type: r.type ?? "",
    status: r.status ?? "",

    address: r.address ?? "",
    district: r.district ?? "",
    city: r.city ?? "",

    coordinates: {
      lat: toNum(r.lat ?? r.coordinates?.lat),
      lng: toNum(r.lng ?? r.coordinates?.lng),
    },

    description: typeof r.description !== "undefined" ? r.description : null,

    is_active: typeof r.is_active === "boolean" ? r.is_active : toBool(r.is_active),

    display_order: typeof r.display_order === "number" ? r.display_order : Number(r.display_order ?? 0),

    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? ""),
  };
}

export const propertiesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listPropertiesAdmin: b.query<PropertyView[], AdminListParams | void>({
      query: (q) =>
        q ? { url: "/admin/properties", params: buildParams(q) } : "/admin/properties",
      transformResponse: (res: unknown): PropertyView[] =>
        Array.isArray(res) ? (res as any[]).map(toView) : [],
      providesTags: (_res) => [{ type: "Properties" as const, id: "LIST" }],
    }),

    getPropertyAdmin: b.query<PropertyView, string>({
      query: (id) => ({ url: `/admin/properties/${id}` }),
      transformResponse: (r: unknown) => toView(r),
      providesTags: (_res, _e, id) => [{ type: "Properties" as const, id }],
    }),

    getPropertyBySlugAdmin: b.query<PropertyView, string>({
      query: (slug) => ({ url: `/admin/properties/by-slug/${slug}` }),
      transformResponse: (r: unknown) => toView(r),
      providesTags: (_res, _e, slug) => [{ type: "Properties" as const, id: `slug:${slug}` }],
    }),

    createPropertyAdmin: b.mutation<PropertyView, PropertyUpsertBody>({
      query: (body) => ({
        url: `/admin/properties`,
        method: "POST",
        body,
      }),
      transformResponse: (r: unknown) => toView(r),
      invalidatesTags: [{ type: "Properties", id: "LIST" }],
    }),

    updatePropertyAdmin: b.mutation<PropertyView, { id: string; patch: Partial<PropertyUpsertBody> }>({
      query: ({ id, patch }) => ({
        url: `/admin/properties/${id}`,
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (r: unknown) => toView(r),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Properties", id: "LIST" },
        { type: "Properties", id },
      ],
    }),

    removePropertyAdmin: b.mutation<void, string>({
      query: (id) => ({
        url: `/admin/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Properties", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListPropertiesAdminQuery,
  useGetPropertyAdminQuery,
  useGetPropertyBySlugAdminQuery,
  useCreatePropertyAdminMutation,
  useUpdatePropertyAdminMutation,
  useRemovePropertyAdminMutation,
} = propertiesAdminApi;
