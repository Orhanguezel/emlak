// -----------------------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/admin/properties_admin.endpoints.ts
// -----------------------------------------------------------------------------
import { baseApi } from "../../baseApi";
import type { AdminProperty as PropertyAdminView } from "@/integrations/rtk/types/properties";

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

/**
 * ✅ BE Upsert/Patch ile uyumlu (yeni schema)
 * - Admin-only: min_price_admin
 * - Görsel alanları: image_url, image_asset_id, alt
 * - Sahibinden alanları: price/currency, m2, rooms, vb.
 */
export type PropertyUpsertBody = {
  title: string;
  slug: string;

  type: string;
  status: string;

  address: string;
  district: string;
  city: string;
  neighborhood?: string | null;

  coordinates: { lat: number; lng: number };

  description?: string | null;

  // fiyat
  price?: string | number | null;
  currency?: string | null;

  // admin-only
  min_price_admin?: string | number | null;

  // meta
  listing_no?: string | null;
  badge_text?: string | null;
  featured?: boolean | 0 | 1 | "0" | "1" | "true" | "false";

  // detay
  gross_m2?: number | null;
  net_m2?: number | null;
  rooms?: string | null;
  building_age?: string | null;
  floor?: string | null;
  total_floors?: number | null;

  heating?: string | null;
  furnished?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  in_site?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  has_balcony?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  has_parking?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  has_elevator?: boolean | 0 | 1 | "0" | "1" | "true" | "false";

  // cover image
  image_url?: string | null;
  image_asset_id?: string | null;
  alt?: string | null;

  is_active?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  display_order?: number;
};

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

const toNum = (v: unknown): number => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const toIntOrNull = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  }
  return null;
};

const toBool = (v: unknown): boolean =>
  v === true || v === 1 || v === "1" || v === "true";

const toStrOrNull = (v: unknown): string | null => {
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return v == null ? null : String(v);
};

function toView(r: any): PropertyAdminView {
  const coords = r?.coordinates
    ? { lat: toNum(r.coordinates?.lat ?? r.lat), lng: toNum(r.coordinates?.lng ?? r.lng) }
    : { lat: toNum(r.lat ?? r.coordinates?.lat), lng: toNum(r.lng ?? r.coordinates?.lng) };

  const imageEffective = r.image_effective_url ?? null;

  return {
    id: String(r.id ?? ""),
    title: String(r.title ?? ""),
    slug: String(r.slug ?? ""),

    type: String(r.type ?? ""),
    status: String(r.status ?? ""),

    address: String(r.address ?? ""),
    district: String(r.district ?? ""),
    city: String(r.city ?? ""),
    neighborhood: typeof r.neighborhood !== "undefined" ? (r.neighborhood ?? null) : null,

    coordinates: coords,

    description: typeof r.description !== "undefined" ? (r.description ?? null) : null,

    price: typeof r.price !== "undefined" ? (toStrOrNull(r.price) ?? null) : null,
    currency: String(r.currency ?? "TRY"),

    min_price_admin: typeof r.min_price_admin !== "undefined" ? (toStrOrNull(r.min_price_admin) ?? null) : null,

    listing_no: typeof r.listing_no !== "undefined" ? (r.listing_no ?? null) : null,
    badge_text: typeof r.badge_text !== "undefined" ? (r.badge_text ?? null) : null,
    featured: toBool(r.featured),

    gross_m2: typeof r.gross_m2 !== "undefined" ? toIntOrNull(r.gross_m2) : null,
    net_m2: typeof r.net_m2 !== "undefined" ? toIntOrNull(r.net_m2) : null,
    rooms: typeof r.rooms !== "undefined" ? (r.rooms ?? null) : null,
    building_age: typeof r.building_age !== "undefined" ? (r.building_age ?? null) : null,
    floor: typeof r.floor !== "undefined" ? (r.floor ?? null) : null,
    total_floors: typeof r.total_floors !== "undefined" ? toIntOrNull(r.total_floors) : null,

    heating: typeof r.heating !== "undefined" ? (r.heating ?? null) : null,
    furnished: toBool(r.furnished),
    in_site: toBool(r.in_site),
    has_balcony: toBool(r.has_balcony),
    has_parking: toBool(r.has_parking),
    has_elevator: toBool(r.has_elevator),

    image_url: typeof r.image_url !== "undefined" ? (r.image_url ?? null) : null,
    image_asset_id: typeof r.image_asset_id !== "undefined" ? (r.image_asset_id ?? null) : null,
    alt: typeof r.alt !== "undefined" ? (r.alt ?? null) : null,
    image_effective_url: imageEffective,

    is_active: typeof r.is_active === "boolean" ? r.is_active : toBool(r.is_active),
    display_order: typeof r.display_order === "number" ? r.display_order : Number(r.display_order ?? 0),

    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? ""),
  };
}

export const propertiesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listPropertiesAdmin: b.query<PropertyAdminView[], AdminListParams | void>({
      query: (q) => (q ? { url: "/admin/properties", params: buildParams(q) } : "/admin/properties"),
      transformResponse: (res: unknown): PropertyAdminView[] =>
        Array.isArray(res) ? (res as any[]).map(toView) : [],
      providesTags: (_res) => [{ type: "Properties" as const, id: "LIST" }],
    }),

    getPropertyAdmin: b.query<PropertyAdminView, string>({
      query: (id) => ({ url: `/admin/properties/${id}` }),
      transformResponse: (r: unknown) => toView(r),
      providesTags: (_res, _e, id) => [{ type: "Properties" as const, id }],
    }),

    getPropertyBySlugAdmin: b.query<PropertyAdminView, string>({
      query: (slug) => ({ url: `/admin/properties/by-slug/${slug}` }),
      transformResponse: (r: unknown) => toView(r),
      providesTags: (_res, _e, slug) => [{ type: "Properties" as const, id: `slug:${slug}` }],
    }),

    createPropertyAdmin: b.mutation<PropertyAdminView, PropertyUpsertBody>({
      query: (body) => ({
        url: `/admin/properties`,
        method: "POST",
        body,
      }),
      transformResponse: (r: unknown) => toView(r),
      invalidatesTags: [{ type: "Properties", id: "LIST" }],
    }),

    updatePropertyAdmin: b.mutation<PropertyAdminView, { id: string; patch: Partial<PropertyUpsertBody> }>({
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
