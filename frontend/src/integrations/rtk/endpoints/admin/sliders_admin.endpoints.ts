// src/integrations/metahub/rtk/endpoints/admin/sliders_admin.endpoints.ts

import { baseApi } from "../../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type {
  SliderAdminView,
  SliderAdminRow,
  SliderRow,
  SliderAdminListParams,
  SliderCreateInput,
  SliderUpdateInput,
  SliderStatusBody,
  SliderReorderBody,
  SliderSetImageBody,
} from "@/integrations/rtk/types/slider";

const ADMIN_BASE = "/admin/sliders";

const buildParams = (p?: SliderAdminListParams) => {
  if (!p) return undefined;
  const o: Record<string, string | number | boolean> = {};
  if (p.q) o.q = p.q;
  if (p.limit != null) o.limit = p.limit;
  if (p.offset != null) o.offset = p.offset;
  if (p.sort) o.sort = p.sort;
  if (p.order) o.order = p.order;
  if (p.is_active !== undefined) o.is_active = p.is_active;
  return o;
};

const toBool = (v: unknown) => (typeof v === "number" ? v !== 0 : typeof v === "string" ? Number(v) !== 0 : !!v);

const toAdminView = (r: SliderAdminRow): SliderAdminView => ({
  id: r.id,
  uuid: r.uuid,
  name: r.name,
  slug: r.slug,
  description: r.description,
  image_url: r.image_url,
  image_asset_id: r.image_asset_id,
  image_effective_url: r.image_effective_url,
  alt: r.alt,
  buttonText: r.buttonText,
  buttonLink: r.buttonLink,
  featured: toBool(r.featured),
  is_active: toBool(r.is_active),
  display_order: r.display_order,
  created_at: r.created_at,
  updated_at: r.updated_at,
});

export const slidersAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    adminListSlides: b.query<SliderAdminView[], void | SliderAdminListParams>({
      query: (params): FetchArgs | string => {
        const qp = buildParams(params as SliderAdminListParams | undefined);
        return qp ? { url: ADMIN_BASE, params: qp } : ADMIN_BASE;
      },
      transformResponse: (res: unknown): SliderAdminView[] => {
        const arr = Array.isArray(res) ? (res as SliderAdminRow[]) : [];
        return arr.map(toAdminView);
      },
      providesTags: (result) =>
        result
          ? [{ type: "Slider" as const, id: "LIST" }, ...result.map((x) => ({ type: "Slider" as const, id: x.id }))]
          : [{ type: "Slider" as const, id: "LIST" }],
    }),

    adminGetSlide: b.query<SliderAdminView, string | number>({
      query: (id): FetchArgs | string => `${ADMIN_BASE}/${encodeURIComponent(String(id))}`,
      transformResponse: (res: unknown): SliderAdminView => toAdminView(res as SliderAdminRow),
      providesTags: (_r, _e, id) => [{ type: "Slider" as const, id: String(id) }],
    }),

    adminCreateSlide: b.mutation<SliderAdminView, SliderCreateInput>({
      query: (body): FetchArgs => ({ url: ADMIN_BASE, method: "POST", body }),
      transformResponse: (res: unknown): SliderAdminView => {
        const row = res as SliderRow & { image_effective_url?: string | null };
        const withUrl: SliderAdminRow = {
          ...(row as SliderRow),
          image_effective_url: (row as any).image_effective_url ?? (row as any).asset_url ?? row.image_url ?? null,
        };
        return toAdminView(withUrl);
      },
      invalidatesTags: [{ type: "Slider" as const, id: "LIST" }],
    }),

    adminUpdateSlide: b.mutation<SliderAdminView, { id: string | number; body: SliderUpdateInput }>({
      query: ({ id, body }): FetchArgs => ({ url: `${ADMIN_BASE}/${encodeURIComponent(String(id))}`, method: "PATCH", body }),
      transformResponse: (res: unknown): SliderAdminView => {
        const row = res as SliderRow & { image_effective_url?: string | null };
        const withUrl: SliderAdminRow = {
          ...(row as SliderRow),
          image_effective_url: (row as any).image_effective_url ?? (row as any).asset_url ?? row.image_url ?? null,
        };
        return toAdminView(withUrl);
      },
      invalidatesTags: (_r, _e, arg) => [{ type: "Slider" as const, id: String(arg.id) }, { type: "Slider" as const, id: "LIST" }],
    }),

    adminDeleteSlide: b.mutation<{ ok: true }, string | number>({
      query: (id): FetchArgs => ({ url: `${ADMIN_BASE}/${encodeURIComponent(String(id))}`, method: "DELETE" }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, id) => [{ type: "Slider" as const, id: String(id) }, { type: "Slider" as const, id: "LIST" }],
    }),

    adminReorderSlides: b.mutation<{ ok: true }, SliderReorderBody>({
      query: (body): FetchArgs => ({ url: `${ADMIN_BASE}/reorder`, method: "POST", body }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: [{ type: "Slider" as const, id: "LIST" }],
    }),

    adminSetSlideStatus: b.mutation<SliderAdminView, { id: string | number; body: SliderStatusBody }>({
      query: ({ id, body }): FetchArgs => ({ url: `${ADMIN_BASE}/${encodeURIComponent(String(id))}/status`, method: "POST", body }),
      transformResponse: (res: unknown): SliderAdminView => toAdminView(res as SliderAdminRow),
      invalidatesTags: (_r, _e, arg) => [{ type: "Slider" as const, id: String(arg.id) }, { type: "Slider" as const, id: "LIST" }],
    }),

    /** ✅ Tek uç: PATCH /admin/sliders/:id/image { asset_id?: string | null } */
    adminSetSlideImage: b.mutation<SliderAdminView, { id: string | number; body: SliderSetImageBody }>({
      query: ({ id, body }): FetchArgs => ({ url: `${ADMIN_BASE}/${encodeURIComponent(String(id))}/image`, method: "PATCH", body }),
      transformResponse: (res: unknown): SliderAdminView => toAdminView(res as SliderAdminRow),
      invalidatesTags: (_r, _e, arg) => [{ type: "Slider" as const, id: String(arg.id) }, { type: "Slider" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAdminListSlidesQuery,
  useAdminGetSlideQuery,
  useAdminCreateSlideMutation,
  useAdminUpdateSlideMutation,
  useAdminDeleteSlideMutation,
  useAdminReorderSlidesMutation,
  useAdminSetSlideStatusMutation,
  useAdminSetSlideImageMutation,
} = slidersAdminApi;
