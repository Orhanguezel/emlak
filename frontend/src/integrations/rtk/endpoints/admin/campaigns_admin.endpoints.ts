import { baseApi } from "../../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type {
  SimpleCampaignRow,
  SimpleCampaignView,
  AdminListParams,
  UpsertSimpleCampaignBody,
  PatchSimpleCampaignBody,
  AttachCampaignImageBody,
} from "@/integrations/rtk/types/campaigns";

/* helpers */
const toBool = (x: any) => x === true || x === 1 || x === "1" || x === "true";
const parseArr = (s?: string) => { try { return s ? (JSON.parse(s) as string[]) : []; } catch { return []; } };

// Row → View
const toView = (r: SimpleCampaignRow | any): SimpleCampaignView => {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    seo_keywords: parseArr(r.seo_keywords),
    is_active: toBool(r.is_active),
    image_url: r.image_url ?? null,
    storage_asset_id: r.storage_asset_id ?? null,
    alt: r.alt ?? null,
    image_effective_url: r.image_effective_url ?? null,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
};

// undefined olan anahtarları at
function sanitizeParams(p?: AdminListParams): Record<string, any> | undefined {
  if (!p) return undefined;
  const out: Record<string, any> = {};
  if (typeof p.q === "string" && p.q.trim()) out.q = p.q.trim();
  if (typeof p.is_active === "boolean") out.is_active = p.is_active;
  if (typeof p.limit === "number") out.limit = p.limit;
  if (typeof p.offset === "number") out.offset = p.offset;
  if (p.sort) out.sort = p.sort;
  if (p.order) out.order = p.order;
  return out;
}

export const campaignsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({

    listCampaignsAdmin: b.query<SimpleCampaignView[], AdminListParams | void>({
      query: (params) => {
        const fa: FetchArgs = { url: "/admin/campaigns" };
        const clean = sanitizeParams(params as AdminListParams | undefined);
        if (clean) fa.params = clean;
        return fa;
      },
      transformResponse: (res: unknown): SimpleCampaignView[] => {
        const rows = Array.isArray(res) ? res : (Array.isArray((res as any)?.items) ? (res as any).items : []);
        return rows.map((r: any) => toView(r));
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((c) => ({ type: "Campaigns" as const, id: c.id })),
            { type: "Campaigns" as const, id: "LIST" },
          ]
          : [{ type: "Campaigns" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    getCampaignAdminById: b.query<SimpleCampaignView, string>({
      query: (id) => ({ url: `/admin/campaigns/${encodeURIComponent(id)}` }),
      transformResponse: (res: unknown): SimpleCampaignView => toView(res as any),
      providesTags: (_r, _e, id) => [{ type: "Campaigns", id }],
    }),

    createCampaignAdmin: b.mutation<SimpleCampaignView, UpsertSimpleCampaignBody>({
      query: (body) => ({ url: `/admin/campaigns`, method: "POST", body }),
      transformResponse: (res: unknown): SimpleCampaignView => toView(res as any),
      invalidatesTags: [{ type: "Campaigns", id: "LIST" }],
    }),

    updateCampaignAdmin: b.mutation<SimpleCampaignView, { id: string; body: PatchSimpleCampaignBody }>({
      query: ({ id, body }) => ({ url: `/admin/campaigns/${encodeURIComponent(id)}`, method: "PATCH", body }),
      transformResponse: (res: unknown): SimpleCampaignView => toView(res as any),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Campaigns", id: arg.id },
        { type: "Campaigns", id: "LIST" },
      ],
    }),

    deleteCampaignAdmin: b.mutation<{ success: true }, string>({
      query: (id) => ({ url: `/admin/campaigns/${encodeURIComponent(id)}`, method: "DELETE" }),
      transformResponse: () => ({ success: true as const }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Campaigns", id },
        { type: "Campaigns", id: "LIST" },
      ],
    }),

    // 🔗 Tek görsel attach
    attachCampaignImageAdmin: b.mutation<SimpleCampaignView, { id: string; body: AttachCampaignImageBody }>({
      query: ({ id, body }) => ({
        url: `/admin/campaigns/${encodeURIComponent(id)}/image`,
        method: "POST",
        body,
      }),
      transformResponse: (res: unknown): SimpleCampaignView => toView(res as any),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Campaigns", id: arg.id },
        { type: "Campaigns", id: "LIST" },
      ],
    }),

    // 🔗 Tek görsel detach
    detachCampaignImageAdmin: b.mutation<SimpleCampaignView, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/campaigns/${encodeURIComponent(id)}/image`,
        method: "DELETE",
      }),
      transformResponse: (res: unknown): SimpleCampaignView => toView(res as any),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Campaigns", id: arg.id },
        { type: "Campaigns", id: "LIST" },
      ],
    }),

  }),
  overrideExisting: true,
});

export const {
  useListCampaignsAdminQuery,
  useGetCampaignAdminByIdQuery,
  useCreateCampaignAdminMutation,
  useUpdateCampaignAdminMutation,
  useDeleteCampaignAdminMutation,
  useAttachCampaignImageAdminMutation,
  useDetachCampaignImageAdminMutation,
} = campaignsAdminApi;
