// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/admin/simple_campaigns_admin.endpoints.ts
// =============================================================
import { baseApi } from "../../baseApi";
import type {
  SimpleCampaignRow,
  SimpleCampaignView,
} from "../../types/campaigns";

export type SimpleCampaignUpsert = {
  title: string;
  description: string;
  images: string[];        // -> BE: images_json (JSON)
  seo_keywords: string[];  // -> BE: seo_keywords (JSON)
  is_active?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
};

const toBool = (x: any) =>
  x === true || x === 1 || x === "1" || x === "true";

const parseArr = (s?: string) => {
  try {
    return s ? (JSON.parse(s) as string[]) : [];
  } catch {
    return [];
  }
};

const toView = (r: SimpleCampaignRow): SimpleCampaignView => {
  const v: SimpleCampaignView = {
    id: r.id,
    title: r.title,
    description: r.description,
    images: parseArr(r.images_json),
    seo_keywords: parseArr(r.seo_keywords),
    is_active: toBool(r.is_active),
    meta_title: r.meta_title ?? null,
    meta_description: r.meta_description ?? null,
  };
  if (r.created_at) v.created_at = r.created_at;
  if (r.updated_at) v.updated_at = r.updated_at;
  return v;
};

export const simpleCampaignsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listSimpleCampaignsAdmin: b.query<SimpleCampaignView[], void>({
      query: () => ({ url: "/admin/simple_campaigns" }),
      transformResponse: (res: unknown): SimpleCampaignView[] =>
        Array.isArray(res) ? (res as SimpleCampaignRow[]).map(toView) : [],
      providesTags: (result) =>
        result
          ? [
            ...result.map((x) => ({
              type: "SimpleCampaignAdmin" as const,
              id: x.id,
            })),
            { type: "SimpleCampaignAdmin" as const, id: "LIST" },
          ]
          : [{ type: "SimpleCampaignAdmin" as const, id: "LIST" }],
    }),

    getSimpleCampaignAdmin: b.query<SimpleCampaignView, string>({
      query: (id) => ({ url: `/admin/simple_campaigns/${id}` }),
      transformResponse: (res: unknown): SimpleCampaignView =>
        toView(res as SimpleCampaignRow),
      providesTags: (_r, _e, id) => [
        { type: "SimpleCampaignAdmin" as const, id },
      ],
    }),

    createSimpleCampaignAdmin: b.mutation<
      SimpleCampaignView,
      SimpleCampaignUpsert
    >({
      query: (body) => ({
        url: "/admin/simple_campaigns",
        method: "POST",
        body,
      }),
      transformResponse: (res: unknown): SimpleCampaignView =>
        toView(res as SimpleCampaignRow),
      invalidatesTags: [{ type: "SimpleCampaignAdmin", id: "LIST" }],
    }),

    updateSimpleCampaignAdmin: b.mutation<
      SimpleCampaignView,
      { id: string; body: SimpleCampaignUpsert }
    >({
      query: ({ id, body }) => ({
        url: `/admin/simple_campaigns/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): SimpleCampaignView =>
        toView(res as SimpleCampaignRow),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "SimpleCampaignAdmin", id },
        { type: "SimpleCampaignAdmin", id: "LIST" },
      ],
    }),

    deleteSimpleCampaignAdmin: b.mutation<{ ok: true }, string>({
      query: (id) => ({
        url: `/admin/simple_campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "SimpleCampaignAdmin", id },
        { type: "SimpleCampaignAdmin", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListSimpleCampaignsAdminQuery,
  useGetSimpleCampaignAdminQuery,
  useCreateSimpleCampaignAdminMutation,
  useUpdateSimpleCampaignAdminMutation,
  useDeleteSimpleCampaignAdminMutation,
} = simpleCampaignsAdminApi;
