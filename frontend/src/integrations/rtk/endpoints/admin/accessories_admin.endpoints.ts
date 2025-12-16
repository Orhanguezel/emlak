import { baseApi } from "../../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type {
  AccessoryRow, AccessoryAdminRow, AccessoryAdminView,
  AccessoryCreateInput, AccessoryUpdateInput, AccessoriesAdminListParams,
} from "@/integrations/rtk/types/accessories";

const ADMIN_BASE = "/admin/accessories";
const ADMIN_LIST = `${ADMIN_BASE}/list`;

const buildParams = (params?: AccessoriesAdminListParams) => {
  if (!params) return undefined;
  const p: Record<string, string | number | boolean> = {};
  if (params.q) p.q = params.q;
  if (params.category) p.category = params.category;
  if (params.limit !== undefined) p.limit = params.limit;
  if (params.offset !== undefined) p.offset = params.offset;
  if (params.sort) p.sort = params.sort;
  if (params.order) p.order = params.order;
  if (params.is_active !== undefined) p.is_active = params.is_active ? 1 : 0;
  return Object.keys(p).length ? p : undefined;
};

const toBool = (v: unknown) => {
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return Number(v) !== 0;
  return !!v;
};

const toAdminView = (r: AccessoryAdminRow): AccessoryAdminView => ({
  id: r.id,
  uuid: r.uuid,
  name: r.name,
  slug: r.slug,
  category: r.category,
  material: r.material,
  price: r.price,
  description: r.description,
  image_url: r.image_url,
  storage_asset_id: r.storage_asset_id,
  alt: r.alt, // ✅
  image_effective_url: r.image_effective_url,
  featured: toBool(r.featured),
  is_active: toBool(r.is_active),
  dimensions: r.dimensions,
  weight: r.weight,
  thickness: r.thickness,
  finish: r.finish,
  warranty: r.warranty,
  installation_time: r.installation_time,
  display_order: r.display_order,
  created_at: r.created_at,
  updated_at: r.updated_at,
});

export const accessoriesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    adminListAccessories: b.query<AccessoryAdminView[], void | AccessoriesAdminListParams>({
      query: (params): FetchArgs | string => {
        const p = buildParams(params as AccessoriesAdminListParams | undefined);
        return p ? { url: ADMIN_LIST, params: p } : ADMIN_LIST;
      },
      transformResponse: (res: unknown): AccessoryAdminView[] => {
        const arr = Array.isArray(res) ? (res as AccessoryAdminRow[]) : [];
        return arr.map(toAdminView);
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((a) => ({ type: "Accessory" as const, id: a.id })),
            { type: "Accessories" as const, id: "ADMIN_LIST" },
          ]
          : [{ type: "Accessories" as const, id: "ADMIN_LIST" }],
      keepUnusedDataFor: 60,
    }),

    adminGetAccessory: b.query<AccessoryAdminView, string>({
      query: (id): FetchArgs | string => `${ADMIN_BASE}/${encodeURIComponent(id)}`,
      transformResponse: (res: unknown): AccessoryAdminView => {
        const row = res as AccessoryRow | (AccessoryAdminRow & Partial<Pick<AccessoryAdminRow, "image_effective_url">>);
        const withUrl: AccessoryAdminRow = {
          ...(row as AccessoryRow),
          image_effective_url: (row as any).image_effective_url ?? (row as any).image_url ?? null,
        } as AccessoryAdminRow;
        return toAdminView(withUrl);
      },
      providesTags: (_r, _e, id) => [{ type: "Accessory" as const, id }],
      keepUnusedDataFor: 60,
    }),

    adminCreateAccessory: b.mutation<AccessoryAdminView, AccessoryCreateInput>({
      query: (body): FetchArgs => ({ url: ADMIN_BASE, method: "POST", body }),
      transformResponse: (res: unknown): AccessoryAdminView => {
        const row = res as AccessoryRow | (AccessoryAdminRow & Partial<Pick<AccessoryAdminRow, "image_effective_url">>);
        const withUrl: AccessoryAdminRow = {
          ...(row as AccessoryRow),
          image_effective_url: (row as any).image_effective_url ?? (row as any).image_url ?? null,
        } as AccessoryAdminRow;
        return toAdminView(withUrl);
      },
      invalidatesTags: [{ type: "Accessories" as const, id: "ADMIN_LIST" }],
    }),

    adminUpdateAccessory: b.mutation<AccessoryAdminView, { id: string; body: AccessoryUpdateInput }>({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): AccessoryAdminView => {
        const row = res as AccessoryRow | (AccessoryAdminRow & Partial<Pick<AccessoryAdminRow, "image_effective_url">>);
        const withUrl: AccessoryAdminRow = {
          ...(row as AccessoryRow),
          image_effective_url: (row as any).image_effective_url ?? (row as any).image_url ?? null,
        } as AccessoryAdminRow;
        return toAdminView(withUrl);
      },
      invalidatesTags: (_r, _e, arg) => [
        { type: "Accessory" as const, id: arg.id },
        { type: "Accessories" as const, id: "ADMIN_LIST" },
      ],
    }),

    adminDeleteAccessory: b.mutation<{ ok: true }, string>({
      query: (id): FetchArgs => ({ url: `${ADMIN_BASE}/${encodeURIComponent(id)}`, method: "DELETE" }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Accessory" as const, id },
        { type: "Accessories" as const, id: "ADMIN_LIST" },
      ],
    }),

    // ✅ Kapak görseli set/kaldır (asset_id + alt)
    adminSetAccessoryImage: b.mutation<
      AccessoryAdminView,
      { id: string; body: { asset_id?: string | null; alt?: string | null } }
    >({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/image`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): AccessoryAdminView =>
        toAdminView(res as AccessoryAdminRow),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Accessory" as const, id: arg.id },
        { type: "Accessories" as const, id: "ADMIN_LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAdminListAccessoriesQuery,
  useAdminGetAccessoryQuery,
  useAdminCreateAccessoryMutation,
  useAdminUpdateAccessoryMutation,
  useAdminDeleteAccessoryMutation,
  useAdminSetAccessoryImageMutation,  // ✅
} = accessoriesAdminApi;
