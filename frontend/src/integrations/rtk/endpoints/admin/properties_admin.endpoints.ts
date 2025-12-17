// -----------------------------------------------------------------------------
// FILE: src/integrations/rtk/endpoints/admin/properties_admin.endpoints.ts
// -----------------------------------------------------------------------------
import { baseApi } from "../../baseApi";
import type {
  AdminProperty as PropertyAdminView,
  BoolLike,
  PropertyAsset,
} from "@/integrations/rtk/types/properties";

export type AdminListParams = {
  q?: string; // ✅ BE: propertyListQuerySchema.q
  slug?: string;

  district?: string;
  city?: string;
  neighborhood?: string;

  type?: string;
  status?: string;

  featured?: BoolLike;
  is_active?: BoolLike;

  // price/m2/room filters (opsiyonel ama BE destekliyor)
  price_min?: number;
  price_max?: number;

  gross_m2_min?: number;
  gross_m2_max?: number;

  net_m2_min?: number;
  net_m2_max?: number;

  rooms?: string;

  bedrooms_min?: number;
  bedrooms_max?: number;

  building_age?: string;

  floor?: string;
  floor_no_min?: number;
  floor_no_max?: number;

  total_floors_min?: number;
  total_floors_max?: number;

  heating?: string;
  usage_status?: string;

  furnished?: BoolLike;
  in_site?: BoolLike;

  has_elevator?: BoolLike;
  has_parking?: BoolLike;

  has_balcony?: BoolLike;
  has_garden?: BoolLike;
  has_terrace?: BoolLike;

  credit_eligible?: BoolLike;
  swap?: BoolLike;

  has_video?: BoolLike;
  has_clip?: BoolLike;
  has_virtual_tour?: BoolLike;
  has_map?: BoolLike;
  accessible?: BoolLike;

  created_from?: string; // ISO datetime
  created_to?: string;   // ISO datetime

  sort?: "created_at" | "updated_at" | "price" | "gross_m2" | "net_m2";
  orderDir?: "asc" | "desc";

  limit?: number;
  offset?: number;

  // BE: select passthrough (opsiyonel)
  select?: string;
};

/**
 * ✅ BE Upsert ile uyumlu (upsertPropertyBodySchema)
 * - coordinates zorunlu
 * - assets opsiyonel
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
  price?: number | null;
  currency?: string;

  // admin-only
  min_price_admin?: number | null;

  // meta
  listing_no?: string | null;
  badge_text?: string | null;
  featured?: BoolLike;

  // m2
  gross_m2?: number | null;
  net_m2?: number | null;

  // filtre çekirdek
  rooms?: string | null;
  bedrooms?: number | null;
  building_age?: string | null;

  floor?: string | null;
  floor_no?: number | null;
  total_floors?: number | null;

  heating?: string | null;
  usage_status?: string | null;

  // bool filtreler
  furnished?: BoolLike;
  in_site?: BoolLike;

  has_elevator?: BoolLike;
  has_parking?: BoolLike;
  has_balcony?: BoolLike;

  has_garden?: BoolLike;
  has_terrace?: BoolLike;

  credit_eligible?: BoolLike;
  swap?: BoolLike;

  has_video?: BoolLike;
  has_clip?: BoolLike;
  has_virtual_tour?: BoolLike;
  has_map?: BoolLike;
  accessible?: BoolLike;

  // cover
  image_url?: string | null;
  image_asset_id?: string | null;
  alt?: string | null;

  is_active?: BoolLike;
  display_order?: number;

  // gallery
  assets?: PropertyAsset[];
};

/**
 * ✅ BE Patch ile uyumlu (patchPropertyBodySchema)
 * - coordinates partial
 */
export type PropertyPatchBody = Partial<Omit<PropertyUpsertBody, "coordinates">> & {
  coordinates?: { lat?: number; lng?: number };
};

const buildParams = (q?: AdminListParams): Record<string, any> => {
  if (!q) return {};
  const out: Record<string, any> = {};

  // birebir pass-through (BE schema ile aynı isimler)
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
    "bedrooms_min",
    "bedrooms_max",
    "building_age",
    "floor",
    "floor_no_min",
    "floor_no_max",
    "total_floors_min",
    "total_floors_max",
    "heating",
    "usage_status",
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
    ? {
        lat: toNum(r.coordinates?.lat ?? r.lat),
        lng: toNum(r.coordinates?.lng ?? r.lng),
      }
    : { lat: toNum(r.lat), lng: toNum(r.lng) };

  return {
    id: String(r.id ?? ""),

    title: String(r.title ?? ""),
    slug: String(r.slug ?? ""),

    type: String(r.type ?? ""),
    status: String(r.status ?? ""),

    address: String(r.address ?? ""),
    district: String(r.district ?? ""),
    city: String(r.city ?? ""),
    neighborhood:
      typeof r.neighborhood !== "undefined" ? (r.neighborhood ?? null) : null,

    coordinates: coords,

    description:
      typeof r.description !== "undefined" ? (r.description ?? null) : null,

    price: typeof r.price !== "undefined" ? toStrOrNull(r.price) : null,
    currency: String(r.currency ?? "TRY"),

    min_price_admin:
      typeof r.min_price_admin !== "undefined"
        ? toStrOrNull(r.min_price_admin)
        : null,

    listing_no:
      typeof r.listing_no !== "undefined" ? (r.listing_no ?? null) : null,
    badge_text:
      typeof r.badge_text !== "undefined" ? (r.badge_text ?? null) : null,
    featured: toBool(r.featured),

    gross_m2: typeof r.gross_m2 !== "undefined" ? toIntOrNull(r.gross_m2) : null,
    net_m2: typeof r.net_m2 !== "undefined" ? toIntOrNull(r.net_m2) : null,

    rooms: typeof r.rooms !== "undefined" ? (r.rooms ?? null) : null,
    bedrooms:
      typeof r.bedrooms !== "undefined" ? toIntOrNull(r.bedrooms) : null,
    building_age:
      typeof r.building_age !== "undefined" ? (r.building_age ?? null) : null,

    floor: typeof r.floor !== "undefined" ? (r.floor ?? null) : null,
    floor_no:
      typeof r.floor_no !== "undefined" ? toIntOrNull(r.floor_no) : null,
    total_floors:
      typeof r.total_floors !== "undefined"
        ? toIntOrNull(r.total_floors)
        : null,

    heating: typeof r.heating !== "undefined" ? (r.heating ?? null) : null,
    usage_status:
      typeof r.usage_status !== "undefined" ? (r.usage_status ?? null) : null,

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

    image_url:
      typeof r.image_url !== "undefined" ? (r.image_url ?? null) : null,
    image_asset_id:
      typeof r.image_asset_id !== "undefined" ? (r.image_asset_id ?? null) : null,
    alt: typeof r.alt !== "undefined" ? (r.alt ?? null) : null,

    image_effective_url:
      typeof r.image_effective_url !== "undefined"
        ? (r.image_effective_url ?? null)
        : null,

    is_active:
      typeof r.is_active === "boolean" ? r.is_active : toBool(r.is_active),
    display_order:
      typeof r.display_order === "number"
        ? r.display_order
        : Number(r.display_order ?? 0),

    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? ""),

    // NOTE: admin detail endpoint assets döndürüyorsa map’le
    assets: Array.isArray(r.assets)
      ? r.assets.map((a: any) => ({
          id: String(a.id ?? ""),
          property_id: typeof a.property_id !== "undefined" ? String(a.property_id) : undefined,
          asset_id: typeof a.asset_id !== "undefined" ? (a.asset_id ?? null) : null,
          url: typeof a.url !== "undefined" ? (a.url ?? null) : null,
          alt: typeof a.alt !== "undefined" ? (a.alt ?? null) : null,
          kind: (a.kind ?? "image") as any,
          mime: typeof a.mime !== "undefined" ? (a.mime ?? null) : null,
          is_cover: typeof a.is_cover === "boolean" ? a.is_cover : toBool(a.is_cover),
          display_order: typeof a.display_order === "number" ? a.display_order : Number(a.display_order ?? 0),
          created_at: typeof a.created_at !== "undefined" ? String(a.created_at) : undefined,
          updated_at: typeof a.updated_at !== "undefined" ? String(a.updated_at) : undefined,
        }))
      : undefined,
  };
}

export const propertiesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listPropertiesAdmin: b.query<PropertyAdminView[], AdminListParams | void>({
      query: (q) =>
        q
          ? { url: "/admin/properties", params: buildParams(q) }
          : "/admin/properties",
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
      providesTags: (_res, _e, slug) => [
        { type: "Properties" as const, id: `slug:${slug}` },
      ],
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

    updatePropertyAdmin: b.mutation<
      PropertyAdminView,
      { id: string; patch: PropertyPatchBody }
    >({
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
