// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/admin/services_admin.endpoints.ts
// =============================================================
import { baseApi } from "@/integrations/rtk/baseApi";
import type {
  ServiceListParams,
  ServiceView,
  ServiceCreateInput,
  ServiceUpdateInput,
  ServiceReorderBody,
  ServiceStatusBody,
} from "@/integrations/rtk/types/services.types";

/** QueryString helper — void/undefined güvenli */
function qs(params?: Record<string, unknown>) {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    if (typeof v === "boolean") sp.set(k, v ? "true" : "false");
    else sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** FE -> BE admin list param eşlemesi (void/undefined güvenli) */
function toAdminQuery(
  p: ServiceListParams | void | undefined,
): Record<string, unknown> | undefined {
  if (!p) return undefined;
  const q: Record<string, unknown> = {};
  if (p.search !== undefined) q.q = p.search;
  if (p.type !== undefined) q.type = p.type;
  if (p.category !== undefined) q.category = p.category;
  if (p.featured !== undefined) q.featured = p.featured;
  if (p.active !== undefined) q.is_active = p.active;
  if (p.limit !== undefined) q.limit = p.limit;
  if (p.offset !== undefined) q.offset = p.offset;
  if (p.orderBy !== undefined) q.sort = p.orderBy;
  if (p.order !== undefined) q.order = p.order;
  return q;
}

/* ================= Normalization helpers ================= */
const toStr = (x: unknown): string | null =>
  x === undefined || x === null ? null : String(x);

const toNum = (x: unknown): number | null => {
  if (x === undefined || x === null || x === "") return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
};

const toBool = (x: unknown): boolean | null => {
  if (x === undefined || x === null) return null;
  if (typeof x === "boolean") return x;
  if (typeof x === "number") return x !== 0;
  if (typeof x === "string")
    return ["1", "true", "TRUE", "on", "yes"].includes(x);
  return null;
};

/** BE → FE normalize */
function normalizeService(raw: any): ServiceView {
  const s: any = { ...raw };

  const id = toStr(s.id)!;
  const slug = toStr(s.slug)!;
  const name = toStr(s.name)!;

  const type = (toStr(s.type) ?? "other") as ServiceView["type"];
  const category = toStr(s.category) ?? "general";

  const material = s.material == null ? null : toStr(s.material);
  const price = s.price == null ? null : toStr(s.price);
  const description = s.description == null ? null : toStr(s.description);

  const display_order = toNum(s.display_order) ?? 1;
  const featured = Boolean(toBool(s.featured) ?? s.featured ?? false);
  const is_active = Boolean(toBool(s.is_active) ?? s.is_active ?? true);

  const image_url = toStr(s.image_url);
  const image_asset_id = toStr(s.image_asset_id);
  const alt = toStr(s.alt);
  const image_effective_url =
    toStr(s.image_effective_url) ?? image_url ?? null;

  const area = toStr(s.area);
  const duration = toStr(s.duration);
  const maintenance = toStr(s.maintenance);
  const season = toStr(s.season);

  const soil_type = toStr(s.soil_type);
  const thickness = toStr(s.thickness);
  const equipment = toStr(s.equipment);

  const warranty = toStr(s.warranty);
  const includes = toStr(s.includes);

  const created_at = toStr(s.created_at) ?? new Date().toISOString();
  const updated_at = toStr(s.updated_at) ?? created_at;

  return {
    id,
    slug,
    name,
    type,
    category,
    material,
    price,
    description,
    featured,
    is_active,
    display_order,
    image_url,
    image_asset_id,
    alt,
    image_effective_url,
    area,
    duration,
    maintenance,
    season,
    soil_type,
    thickness,
    equipment,
    warranty,
    includes,
    created_at,
    updated_at,
  };
}

function normalizeList(raw: unknown): ServiceView[] {
  if (!Array.isArray(raw)) return [];
  return (raw as any[]).map(normalizeService);
}

const ADMIN_BASE = "/admin/services";

export const servicesAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** LIST */
    listServicesAdmin: builder.query<ServiceView[], ServiceListParams | void>({
      query: (params) => `${ADMIN_BASE}${qs(toAdminQuery(params))}`,
      transformResponse: (res: unknown): ServiceView[] => {
        if (Array.isArray(res)) return normalizeList(res);
        const maybe = res as { data?: unknown };
        return normalizeList(maybe?.data ?? []);
      },
      providesTags: (result) =>
        result
          ? [
            { type: "Services", id: "LIST" },
            ...result.map((s) => ({
              type: "Services" as const,
              id: s.id,
            })),
          ]
          : [{ type: "Services", id: "LIST" }],
    }),

    /** GET BY ID */
    getServiceAdminById: builder.query<ServiceView, string>({
      query: (id) => `${ADMIN_BASE}/${encodeURIComponent(id)}`,
      transformResponse: (res: unknown): ServiceView => normalizeService(res),
      providesTags: (_res, _err, id) => [{ type: "Services", id }],
    }),

    /** CREATE */
    createServiceAdmin: builder.mutation<ServiceView, ServiceCreateInput>({
      query: (body) => ({
        url: `${ADMIN_BASE}`,
        method: "POST",
        body,
      }),
      transformResponse: (res: unknown): ServiceView => normalizeService(res),
      invalidatesTags: [{ type: "Services", id: "LIST" }],
    }),

    /** UPDATE (partial) */
    updateServiceAdmin: builder.mutation<
      ServiceView,
      { id: string; body: ServiceUpdateInput }
    >({
      query: ({ id, body }) => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): ServiceView => normalizeService(res),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Services", id: arg.id },
        { type: "Services", id: "LIST" },
      ],
    }),

    /** DELETE */
    deleteServiceAdmin: builder.mutation<{ ok: boolean } | boolean, string>({
      query: (id) => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Services", id },
        { type: "Services", id: "LIST" },
      ],
    }),

    /** POST /admin/services/reorder  { ids: string[] } */
    reorderServicesAdmin: builder.mutation<{ ok: true }, ServiceReorderBody>({
      query: (body) => ({
        url: `${ADMIN_BASE}/reorder`,
        method: "POST",
        body,
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: [{ type: "Services", id: "LIST" }],
    }),

    /** POST /admin/services/:id/status  { is_active: boolean } */
    setServiceStatusAdmin: builder.mutation<
      ServiceView,
      { id: string; body: ServiceStatusBody }
    >({
      query: ({ id, body }) => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(id)}/status`,
        method: "POST",
        body,
      }),
      transformResponse: (res: unknown): ServiceView => normalizeService(res),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Services", id: arg.id },
        { type: "Services", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListServicesAdminQuery,
  useGetServiceAdminByIdQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
  useDeleteServiceAdminMutation,
  useReorderServicesAdminMutation,
  useSetServiceStatusAdminMutation,
} = servicesAdminApi;
