// FILE: src/integrations/rtk/endpoints/admin/properties_admin.endpoints.ts
import { baseApi } from "../../baseApi";
import type {
  AdminProperty as PropertyAdminView,
  PropertyAsset,
  Coordinates,
  AdminListParams,
  PropertyUpsertBody,
  PropertyPatchBody,
} from "@/integrations/rtk/types/properties";

const buildParams = (q?: AdminListParams): Record<string, any> => {
  if (!q) return {};
  const out: Record<string, any> = {};

  const keys: Array<keyof AdminListParams> = [
    "q",
    "slug",
    "district",
    "city",
    "neighborhood",
    "type",
    "status",
    "featured",
    "is_active",
    "price_min",
    "price_max",
    "gross_m2_min",
    "gross_m2_max",
    "net_m2_min",
    "net_m2_max",
    "rooms",
    "rooms_multi",
    "bedrooms_min",
    "bedrooms_max",
    "building_age",
    "floor",
    "floor_no_min",
    "floor_no_max",
    "total_floors_min",
    "total_floors_max",
    "heating",
    "heating_multi",
    "usage_status",
    "usage_status_multi",
    "furnished",
    "in_site",
    "has_elevator",
    "has_parking",
    "has_balcony",
    "has_garden",
    "has_terrace",
    "credit_eligible",
    "swap",
    "has_video",
    "has_clip",
    "has_virtual_tour",
    "has_map",
    "accessible",
    "created_from",
    "created_to",
    "sort",
    "orderDir",
    "limit",
    "offset",
    "select",
  ];

  for (const k of keys) {
    const v = q[k];
    if (typeof v !== "undefined") out[k] = v;
  }

  return out;
};

const toBool = (v: unknown): boolean => v === true || v === 1 || v === "1" || v === "true";

const toStrOrNull = (v: unknown): string | null => {
  if (v == null) return null;
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return String(v);
};

const toIntOrNull = (v: unknown): number | null => {
  if (v == null) return null;
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  }
  return null;
};

const toNumOrNull = (v: unknown): number | null => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const toArrayOrNull = (v: unknown): string[] | null => {
  if (v == null) return null;
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;

    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map(String).map((x) => x.trim()).filter(Boolean);
    } catch {
      if (s.includes(",")) return s.split(",").map((x) => x.trim()).filter(Boolean);
      return [s];
    }
  }
  return null;
};

const normalizeCoordinates = (r: any): Coordinates | null => {
  const lat = toNumOrNull(r?.coordinates?.lat) ?? toNumOrNull(r?.lat);
  const lng = toNumOrNull(r?.coordinates?.lng) ?? toNumOrNull(r?.lng);
  if (lat == null && lng == null) return null;
  return { lat: lat ?? null, lng: lng ?? null };
};

/**
 * ✅ exactOptionalPropertyTypes uyumlu asset normalize:
 * - property_id / created_at / updated_at gibi optional alanlar
 *   "undefined" set edilmez; alan tamamen omit edilir.
 */
const toAsset = (a: any): PropertyAsset => {
  const id = String(a?.id ?? "");

  const propertyIdRaw = a?.property_id;
  const property_id =
    typeof propertyIdRaw === "string" && propertyIdRaw.trim()
      ? propertyIdRaw.trim()
      : typeof propertyIdRaw === "number" && Number.isFinite(propertyIdRaw)
        ? String(propertyIdRaw)
        : undefined;

  const createdAtRaw = a?.created_at;
  const created_at = typeof createdAtRaw !== "undefined" && createdAtRaw != null ? String(createdAtRaw) : undefined;

  const updatedAtRaw = a?.updated_at;
  const updated_at = typeof updatedAtRaw !== "undefined" && updatedAtRaw != null ? String(updatedAtRaw) : undefined;

  const asset: PropertyAsset = {
    id,

    asset_id: typeof a?.asset_id !== "undefined" ? (a?.asset_id ?? null) : null,
    url: typeof a?.url !== "undefined" ? (a?.url ?? null) : null,
    alt: typeof a?.alt !== "undefined" ? (a?.alt ?? null) : null,

    kind: (a?.kind ?? "image") as any,
    mime: typeof a?.mime !== "undefined" ? (a?.mime ?? null) : null,

    is_cover: typeof a?.is_cover === "boolean" ? a.is_cover : toBool(a?.is_cover),
    display_order: typeof a?.display_order === "number" ? a.display_order : Number(a?.display_order ?? 0),

    // optional alanları sadece varsa ekle
    ...(property_id ? { property_id } : {}),
    ...(created_at ? { created_at } : {}),
    ...(updated_at ? { updated_at } : {}),
  };

  return asset;
};

function toView(r: any): PropertyAdminView {
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

    coordinates: normalizeCoordinates(r),

    description: typeof r.description !== "undefined" ? (r.description ?? null) : null,

    price: typeof r.price !== "undefined" ? toStrOrNull(r.price) : null,
    currency: String(r.currency ?? "TRY"),

    min_price_admin: typeof r.min_price_admin !== "undefined" ? toStrOrNull(r.min_price_admin) : null,

    listing_no: typeof r.listing_no !== "undefined" ? (r.listing_no ?? null) : null,
    badge_text: typeof r.badge_text !== "undefined" ? (r.badge_text ?? null) : null,
    featured: toBool(r.featured),

    gross_m2: typeof r.gross_m2 !== "undefined" ? toIntOrNull(r.gross_m2) : null,
    net_m2: typeof r.net_m2 !== "undefined" ? toIntOrNull(r.net_m2) : null,

    rooms: typeof r.rooms !== "undefined" ? (r.rooms ?? null) : null,
    rooms_multi: typeof r.rooms_multi !== "undefined" ? toArrayOrNull(r.rooms_multi) : null,

    bedrooms: typeof r.bedrooms !== "undefined" ? toIntOrNull(r.bedrooms) : null,
    building_age: typeof r.building_age !== "undefined" ? (r.building_age ?? null) : null,

    floor: typeof r.floor !== "undefined" ? (r.floor ?? null) : null,
    floor_no: typeof r.floor_no !== "undefined" ? toIntOrNull(r.floor_no) : null,
    total_floors: typeof r.total_floors !== "undefined" ? toIntOrNull(r.total_floors) : null,

    heating: typeof r.heating !== "undefined" ? (r.heating ?? null) : null,
    heating_multi: typeof r.heating_multi !== "undefined" ? toArrayOrNull(r.heating_multi) : null,

    usage_status: typeof r.usage_status !== "undefined" ? (r.usage_status ?? null) : null,
    usage_status_multi: typeof r.usage_status_multi !== "undefined" ? toArrayOrNull(r.usage_status_multi) : null,

    furnished: toBool(r.furnished),
    in_site: toBool(r.in_site),

    has_elevator: toBool(r.has_elevator),
    has_parking: toBool(r.has_parking),
    has_balcony: toBool(r.has_balcony),

    has_garden: toBool(r.has_garden),
    has_terrace: toBool(r.has_terrace),

    credit_eligible: toBool(r.credit_eligible),
    swap: toBool(r.swap),

    has_video: toBool(r.has_video),
    has_clip: toBool(r.has_clip),
    has_virtual_tour: toBool(r.has_virtual_tour),
    has_map: toBool(r.has_map),
    accessible: toBool(r.accessible),

    image_url: typeof r.image_url !== "undefined" ? (r.image_url ?? null) : null,
    image_asset_id: typeof r.image_asset_id !== "undefined" ? (r.image_asset_id ?? null) : null,
    alt: typeof r.alt !== "undefined" ? (r.alt ?? null) : null,

    image_effective_url: typeof r.image_effective_url !== "undefined" ? (r.image_effective_url ?? null) : null,

    is_active: typeof r.is_active === "boolean" ? r.is_active : toBool(r.is_active),
    display_order: typeof r.display_order === "number" ? r.display_order : Number(r.display_order ?? 0),

    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? ""),

    assets: Array.isArray(r.assets) ? r.assets.map(toAsset) : undefined,
  };
}

export const propertiesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listPropertiesAdmin: b.query<PropertyAdminView[], AdminListParams | void>({
      query: (q) => (q ? { url: "/admin/properties", params: buildParams(q) } : "/admin/properties"),
      transformResponse: (res: unknown): PropertyAdminView[] =>
        Array.isArray(res) ? (res as any[]).map(toView) : [],
      providesTags: () => [{ type: "Properties" as const, id: "LIST" }],
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

    updatePropertyAdmin: b.mutation<PropertyAdminView, { id: string; patch: PropertyPatchBody }>({
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
