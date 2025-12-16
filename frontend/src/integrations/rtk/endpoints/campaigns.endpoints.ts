// src/integrations/metahub/rtk/endpoints/.../campaigns.public.ts (senin dosya yolu her neyse)

import { baseApi } from "../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import {
  SimpleCampaignRow,
  SimpleCampaignView,
  PublicListParams,
} from "@/integrations/rtk/types/campaigns";

const toBool = (x: any) => x === true || x === 1 || x === "1" || x === "true";
const parseArr = (s?: string): string[] => {
  try { return s ? (JSON.parse(s) as string[]) : []; } catch { return []; }
};

const toView = (row: SimpleCampaignRow): SimpleCampaignView => {
  const image_effective_url =
    (row as any).image_effective_url ?? row.image_url ?? null;

  const base: Omit<SimpleCampaignView, "created_at" | "updated_at"> = {
    id: row.id,
    title: row.title,
    description: row.description,
    seo_keywords: parseArr(row.seo_keywords),
    is_active: toBool(row.is_active),
    image_url: row.image_url ?? null,
    storage_asset_id: row.storage_asset_id ?? null,
    alt: row.alt ?? null,
    image_effective_url,
    images:
      row.image_url || row.storage_asset_id
        ? [
          {
            id: "cover",
            image_url: row.image_url ?? null,
            storage_asset_id: row.storage_asset_id ?? null,
            alt: row.alt ?? null,
            image_effective_url,
          },
        ]
        : [],
  };

  // exactOptionalPropertyTypes: undefined set etme, varsa ekle
  const extras: Partial<Pick<SimpleCampaignView, "created_at" | "updated_at">> = {};
  if (row.created_at) extras.created_at = row.created_at;
  if (row.updated_at) extras.updated_at = row.updated_at;

  return { ...base, ...extras };
};

// undefined paramları at
function sanitizeParams(p?: PublicListParams): Record<string, any> | undefined {
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

const BASE = "/campaigns";

export const simpleCampaignsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listSimpleCampaigns: b.query<SimpleCampaignView[], PublicListParams | void>({
      query: (params) => {
        const args: FetchArgs = { url: `${BASE}` };
        const clean = sanitizeParams(params as PublicListParams | undefined);
        if (clean) args.params = clean;
        return args;
      },
      transformResponse: (res: unknown): SimpleCampaignView[] =>
        Array.isArray(res) ? (res as SimpleCampaignRow[]).map(toView) : [],
      providesTags: [{ type: "SimpleCampaignsPublic" as const, id: "LIST" }],
      keepUnusedDataFor: 120,
    }),

    getSimpleCampaignById: b.query<SimpleCampaignView, string>({
      query: (id) => ({ url: `${BASE}/${encodeURIComponent(id)}` }),
      transformResponse: (res: unknown): SimpleCampaignView =>
        toView(res as SimpleCampaignRow),
      providesTags: (_r, _e, id) => [{ type: "SimpleCampaignPublic" as const, id }],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: true,
});

export const {
  useListSimpleCampaignsQuery,
  useGetSimpleCampaignByIdQuery,
} = simpleCampaignsApi;
