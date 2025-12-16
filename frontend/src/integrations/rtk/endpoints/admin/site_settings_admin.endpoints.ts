// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/admin/site_settings_admin.endpoints.ts
// =============================================================
import { baseApi } from "@/integrations/rtk/baseApi";
import type {
  SiteSettingRow,
  SettingValue,
  ValueType,
} from "@/integrations/rtk/types/site";

/* ---------- helpers ---------- */
const toNum = (x: unknown): number =>
  typeof x === "number" ? x : Number(String(x).replace(",", "."));

const toBool = (x: unknown): boolean => {
  if (typeof x === "boolean") return x;
  if (typeof x === "number") return x !== 0;
  const s = String(x).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
};

const tryParseJson = (s: string): SettingValue => {
  try { return JSON.parse(s) as SettingValue; } catch { return s; }
};

export type SiteSetting = SiteSettingRow;

export type ListParams = {
  q?: string;
  group?: string;
  keys?: string[];            // "a,b,c" olarak gönderilecek
  prefix?: string;
  limit?: number;
  offset?: number;
  sort?: "key" | "updated_at" | "created_at"; // BE: order="col.dir"
  order?: "asc" | "desc";
};

export type UpsertSettingBody = {
  key: string;
  value: SettingValue;
  value_type?: ValueType | null;
  group?: string | null;
  description?: string | null;
};

/** BE value zaten JSON parse'lı gelebilir; yine de normalize güvenli kalsın */
export function normalizeSettingValue(
  value: unknown,
  value_type?: ValueType | null
): SettingValue {
  if (value_type === "boolean") return toBool(value);
  if (value_type === "number") return value == null ? null : toNum(value);
  if (value_type === "json") {
    if (typeof value === "string") return tryParseJson(value);
    if (value && typeof value === "object") return value as SettingValue;
    return null;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (s === "true" || s === "false" || s === "1" || s === "0" || s === "yes" || s === "no")
      return toBool(s);
    if (!Number.isNaN(Number(s))) return toNum(s);
    if ((s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]")))
      return tryParseJson(s);
    return s;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (value == null) return null;
  return value as SettingValue;
}

export type BulkUpsertBody = { items: UpsertSettingBody[] };

const ADMIN_BASE = "/admin/site_settings";

const norm = (s: SiteSettingRow): SiteSettingRow => ({
  ...s,
  value: normalizeSettingValue(s.value, s.value_type ?? null),
});

/** BE beklediği query: q, group, keys, prefix, order, limit, offset */
const buildListParams = (p?: ListParams): Record<string, string | number> | undefined => {
  if (!p) return undefined;
  const q: Record<string, string | number> = {};
  if (p.q) q.q = p.q;
  if (p.group) q.group = p.group;
  if (p.keys?.length) q.keys = p.keys.join(",");
  if (p.prefix) q.prefix = p.prefix;

  // "order" = "col.dir" (default: key.asc)
  const col = p.sort ?? "key";
  const dir = p.order ?? "asc";
  q.order = `${col}.${dir}`;

  if (typeof p.limit === "number") q.limit = p.limit;
  if (typeof p.offset === "number") q.offset = p.offset;
  return q;
};

const extendedApi = baseApi.enhanceEndpoints({ addTagTypes: ["SiteSettings"] as const });

export const siteSettingsAdminApi = extendedApi.injectEndpoints({
  endpoints: (b) => ({
    /** GET /admin/site_settings */
    listSiteSettingsAdmin: b.query<SiteSetting[], ListParams | undefined>({
      query: (params) => {
        const q = buildListParams(params);
        return q ? { url: ADMIN_BASE, params: q } : { url: ADMIN_BASE };
      },
      transformResponse: (res: unknown): SiteSetting[] =>
        Array.isArray(res) ? (res as SiteSettingRow[]).map(norm) : [],
      providesTags: (result) =>
        result
          ? [
            ...result.map((s) => ({ type: "SiteSettings" as const, id: s.key })),
            { type: "SiteSettings" as const, id: "LIST" },
          ]
          : [{ type: "SiteSettings" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    /** GET /admin/site_settings/:key */
    getSiteSettingAdminByKey: b.query<SiteSetting | null, string>({
      query: (key) => ({ url: `${ADMIN_BASE}/${encodeURIComponent(key)}` }),
      transformResponse: (res: unknown): SiteSetting | null =>
        res ? norm(res as SiteSettingRow) : null,
      providesTags: (_r, _e, key) => [{ type: "SiteSettings", id: key }],
    }),

    /** POST /admin/site_settings  (upsert key,value) */
    createSiteSettingAdmin: b.mutation<SiteSetting, UpsertSettingBody>({
      query: (body) => ({
        url: ADMIN_BASE,
        method: "POST",
        body: { key: body.key, value: body.value }, // fazlalıkları göndermiyoruz
      }),
      transformResponse: (res: unknown): SiteSetting => norm(res as SiteSettingRow),
      invalidatesTags: [{ type: "SiteSettings", id: "LIST" }],
    }),

    /** PUT /admin/site_settings/:key  (upsert by key) */
    updateSiteSettingAdmin: b.mutation<SiteSetting, { key: string; value: SettingValue }>({
      query: ({ key, value }) => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(key)}`,
        method: "PUT",
        body: { value }, // BE sadece { value } bekliyor
      }),
      transformResponse: (res: unknown): SiteSetting => norm(res as SiteSettingRow),
      invalidatesTags: (_r, _e, arg) => [
        { type: "SiteSettings", id: arg.key },
        { type: "SiteSettings", id: "LIST" },
      ],
    }),

    /** POST /admin/site_settings/bulk-upsert  → rows döner */
    bulkUpsertSiteSettingsAdmin: b.mutation<SiteSetting[], { items: UpsertSettingBody[] }>({
      query: ({ items }) => ({
        url: `${ADMIN_BASE}/bulk-upsert`,
        method: "POST",
        body: { items: items.map(i => ({ key: i.key, value: i.value })) },
      }),
      transformResponse: (res: unknown): SiteSetting[] =>
        Array.isArray(res) ? (res as SiteSettingRow[]).map(norm) : [],
      invalidatesTags: [{ type: "SiteSettings", id: "LIST" }],
    }),

    /** DELETE /admin/site_settings/:key */
    deleteSiteSettingAdmin: b.mutation<{ ok: true }, string>({
      query: (key) => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(key)}`,
        method: "DELETE",
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, key) => [
        { type: "SiteSettings", id: key },
        { type: "SiteSettings", id: "LIST" },
      ],
    }),

    /** DELETE /admin/site_settings  (filtreli toplu silme) */
    deleteManySiteSettingsAdmin: b.mutation<{ ok: true }, {
      idNe?: string; key?: string; keyNe?: string; keys?: string[]; prefix?: string;
    }>({
      query: (p) => {
        const params: Record<string, string> = {};
        if (p.idNe) params["id!"] = p.idNe;
        if (p.key) params["key"] = p.key;
        if (p.keyNe) params["key!"] = p.keyNe;
        if (p.keys?.length) params["keys"] = p.keys.join(",");
        if (p.prefix) params["prefix"] = p.prefix;
        return { url: ADMIN_BASE, method: "DELETE", params };
      },
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: [{ type: "SiteSettings", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListSiteSettingsAdminQuery,
  useGetSiteSettingAdminByKeyQuery,
  useCreateSiteSettingAdminMutation,
  useUpdateSiteSettingAdminMutation,
  useDeleteSiteSettingAdminMutation,
  useBulkUpsertSiteSettingsAdminMutation,
  useDeleteManySiteSettingsAdminMutation,
} = siteSettingsAdminApi;
