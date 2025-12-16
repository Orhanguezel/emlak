// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/site_settings.endpoints.ts (PUBLIC)
// =============================================================
import { baseApi } from "../baseApi";

/** Public JSON-like */
export type JsonLike =
  | string
  | number
  | boolean
  | null
  | { [k: string]: JsonLike }
  | JsonLike[];

export type SiteSetting = {
  key: string;
  value: JsonLike;
  updated_at?: string;
};

const PUBLIC_BASE = "/site_settings";

const tryParse = <T = unknown>(x: unknown): T => {
  if (typeof x === "string") {
    const s = x.trim();
    if (
      (s.startsWith("{") && s.endsWith("}")) ||
      (s.startsWith("[") && s.endsWith("]"))
    ) {
      try {
        return JSON.parse(s) as T;
      } catch {
        // swallow
      }
    }
    if (s === "true") return true as unknown as T;
    if (s === "false") return false as unknown as T;
    if (!Number.isNaN(Number(s)) && s !== "") {
      return Number(s) as unknown as T;
    }
  }
  return x as T;
};

type ListArg =
  | {
      prefix?: string;
      keys?: string[];
      order?:
        | "key.asc"
        | "key.desc"
        | "updated_at.asc"
        | "updated_at.desc"
        | "created_at.asc"
        | "created_at.desc";
      limit?: number;
      offset?: number;
    }
  | undefined;

// SiteSettings tag'i ekliyoruz
const extendedApi = baseApi.enhanceEndpoints({
  addTagTypes: ["SiteSettings"] as const,
});

export const siteSettingsApi = extendedApi.injectEndpoints({
  endpoints: (b) => ({
    /** GET /site_settings */
    listSiteSettings: b.query<SiteSetting[], ListArg>({
      query: (arg) => {
        const params: Record<string, string | number> = {};
        if (arg?.prefix) params.prefix = arg.prefix;
        if (arg?.keys?.length) params.keys = arg.keys.join(",");
        if (arg?.order) params.order = arg.order;
        if (typeof arg?.limit === "number") params.limit = arg.limit;
        if (typeof arg?.offset === "number") params.offset = arg.offset;

        return Object.keys(params).length
          ? { url: PUBLIC_BASE, params }
          : { url: PUBLIC_BASE };
      },
      transformResponse: (res: unknown): SiteSetting[] => {
        const arr = Array.isArray(res)
          ? (res as Array<{ key: string; value: unknown; updated_at?: string }>)
          : [];
        return arr.map((r) => ({
          key: r.key,
          value: tryParse<JsonLike>(r.value),
          ...(r.updated_at ? { updated_at: r.updated_at } : {}),
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({
                type: "SiteSettings" as const,
                id: s.key,
              })),
              { type: "SiteSettings" as const, id: "LIST" },
            ]
          : [{ type: "SiteSettings" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    /** GET /site_settings/:key */
    getSiteSettingByKey: b.query<SiteSetting | null, string>({
      query: (key) => ({
        url: `${PUBLIC_BASE}/${encodeURIComponent(key)}`,
      }),
      transformResponse: (res: unknown): SiteSetting | null => {
        if (!res || typeof res !== "object") return null;
        const r = res as { key?: string; value?: unknown; updated_at?: string };
        if (!r.key) return null;
        return {
          key: r.key,
          value: tryParse<JsonLike>(r.value),
          ...(r.updated_at ? { updated_at: r.updated_at } : {}),
        };
      },
      providesTags: (_r, _e, key) => [{ type: "SiteSettings", id: key }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListSiteSettingsQuery,
  useGetSiteSettingByKeyQuery,
} = siteSettingsApi;
