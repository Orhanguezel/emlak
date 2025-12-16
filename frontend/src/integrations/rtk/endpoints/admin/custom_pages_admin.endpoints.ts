// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/admin/custom_pages_admin.endpoints.ts
// =============================================================
import { baseApi } from "../../baseApi";
import type {
  CustomPageRow,
  CustomPageView,
  UpsertCustomPageBody,
  PatchCustomPageBody,
} from "@/integrations/rtk/types/customPages";

const toBool = (x: unknown): boolean =>
  x === true || x === 1 || x === "1" || x === "true";

function extractHtml(rawField: unknown): string {
  if (typeof rawField === "string") {
    try {
      const parsed = JSON.parse(rawField) as any;
      if (parsed && typeof parsed === "object" && typeof parsed.html === "string") {
        return parsed.html as string;
      }
      return rawField;
    } catch {
      return rawField;
    }
  }
  if (rawField && typeof rawField === "object" && typeof (rawField as any).html === "string") {
    return (rawField as any).html as string;
  }
  return "";
}

/** row→view */
const toView = (row: unknown): CustomPageView => {
  const r = (row ?? {}) as Record<string, unknown>;
  const base: Omit<CustomPageView, "created_at" | "updated_at"> = {
    id: String(r["id"] ?? ""),
    title: String(r["title"] ?? ""),
    slug: String(r["slug"] ?? ""),
    content: extractHtml(r["content"]),

    image_url: (typeof r["image_url"] === "string" ? (r["image_url"] as string) : null) ?? null,
    image_effective_url:
      (typeof r["image_effective_url"] === "string"
        ? (r["image_effective_url"] as string)
        : null) ?? null,
    alt: (typeof r["alt"] === "string" ? (r["alt"] as string) : null) ?? null,

    meta_title: (typeof r["meta_title"] === "string" ? (r["meta_title"] as string) : null) ?? null,
    meta_description:
      (typeof r["meta_description"] === "string" ? (r["meta_description"] as string) : null) ?? null,
    is_published: toBool(r["is_published"]),
  };

  return {
    ...base,
    ...(typeof r["created_at"] === "string" ? { created_at: r["created_at"] as string } : {}),
    ...(typeof r["updated_at"] === "string" ? { updated_at: r["updated_at"] as string } : {}),
  };
};

/** Body’yi BE şemasına çevirir (create) */
const toApiBody = (b: UpsertCustomPageBody) => {
  const title = (b.title ?? "").trim();
  const slug = (b.slug ?? "").trim();
  const html = b.content ?? "";
  const is_published = toBool(b.is_published);

  return {
    title,
    slug,
    // BE string bekliyor: JSON.stringify({ html })
    content: JSON.stringify({ html }),

    // Görsel alanları
    image_url: typeof b.image_url !== "undefined" ? b.image_url : undefined,
    storage_asset_id:
      typeof b.storage_asset_id !== "undefined" ? b.storage_asset_id : undefined,
    alt: typeof b.alt !== "undefined" ? b.alt : undefined,

    meta_title: typeof b.meta_title !== "undefined" ? b.meta_title : undefined,
    meta_description:
      typeof b.meta_description !== "undefined" ? b.meta_description : undefined,
    is_published,

    locale: typeof b.locale !== "undefined" ? b.locale : undefined,
  };
};

/** Partial PATCH çevirici – SADECE verilen alanları yollar */
const toApiPatchBody = (b: PatchCustomPageBody) => {
  const out: Record<string, unknown> = {};

  if (typeof b.title !== "undefined") out.title = (b.title ?? "").trim();
  if (typeof b.slug !== "undefined") out.slug = (b.slug ?? "").trim();
  if (typeof b.content !== "undefined") {
    out.content = JSON.stringify({ html: b.content ?? "" });
  }

  if (typeof b.image_url !== "undefined") out.image_url = b.image_url;
  if (typeof b.storage_asset_id !== "undefined") out.storage_asset_id = b.storage_asset_id;
  if (typeof b.alt !== "undefined") out.alt = b.alt;

  if (typeof b.meta_title !== "undefined") out.meta_title = b.meta_title;
  if (typeof b.meta_description !== "undefined") out.meta_description = b.meta_description;
  if (typeof b.is_published !== "undefined") out.is_published = toBool(b.is_published);
  if (typeof b.locale !== "undefined") out.locale = b.locale;

  return out;
};

const BASE = "/admin/custom_pages";

export const customPagesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listCustomPagesAdmin: b.query<
      CustomPageView[],
      { limit?: number; offset?: number; q?: string; slug?: string; sort?: "created_at" | "updated_at"; orderDir?: "asc" | "desc"; is_published?: boolean } | void
    >({
      query: (params) => (params
        ? { url: `${BASE}`, params }
        : { url: `${BASE}` }),
      transformResponse: (res: unknown): CustomPageView[] =>
        Array.isArray(res) ? (res as CustomPageRow[]).map(toView) : [],
      providesTags: (result) =>
        result
          ? [
            ...result.map((p) => ({ type: "CustomPages" as const, id: p.id })),
            { type: "CustomPages" as const, id: "LIST" },
          ]
          : [{ type: "CustomPages" as const, id: "LIST" }],
    }),

    getCustomPageAdminById: b.query<CustomPageView, string>({
      query: (id) => ({ url: `${BASE}/${id}` }),
      transformResponse: (res: unknown): CustomPageView => toView(res),
      providesTags: (_r, _e, id) => [{ type: "CustomPages", id }],
    }),

    createCustomPageAdmin: b.mutation<CustomPageView, UpsertCustomPageBody>({
      query: (body) => ({ url: `${BASE}`, method: "POST", body: toApiBody(body) }),
      transformResponse: (res: unknown): CustomPageView => toView(res),
      invalidatesTags: [{ type: "CustomPages", id: "LIST" }],
    }),

    // ✅ PATCH (partial) — TS2739 hatasını çözer
    updateCustomPageAdmin: b.mutation<CustomPageView, { id: string; body: PatchCustomPageBody }>({
      query: ({ id, body }) => ({ url: `${BASE}/${id}`, method: "PATCH", body: toApiPatchBody(body) }),
      transformResponse: (res: unknown): CustomPageView => toView(res),
      invalidatesTags: (_r, _e, arg) => [
        { type: "CustomPages", id: arg.id },
        { type: "CustomPages", id: "LIST" },
      ],
    }),

    deleteCustomPageAdmin: b.mutation<{ ok: true }, string>({
      query: (id) => ({ url: `${BASE}/${id}`, method: "DELETE" }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, id) => [
        { type: "CustomPages", id },
        { type: "CustomPages", id: "LIST" },
      ],
    }),

    /** ✅ Görsel set/kaldır (asset_id + opsiyonel url/alt) */
    setCustomPageImageAdmin: b.mutation<
      CustomPageView,
      { id: string; body: { asset_id?: string | null; image_url?: string | null; alt?: string | null } }
    >({
      query: ({ id, body }) => ({
        url: `${BASE}/${id}/image`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): CustomPageView => toView(res),
      invalidatesTags: (_r, _e, arg) => [
        { type: "CustomPages", id: arg.id },
        { type: "CustomPages", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListCustomPagesAdminQuery,
  useGetCustomPageAdminByIdQuery,
  useCreateCustomPageAdminMutation,
  useUpdateCustomPageAdminMutation,     // PATCH (partial)
  useDeleteCustomPageAdminMutation,
  useSetCustomPageImageAdminMutation,   // 👈 isim standardı
} = customPagesAdminApi;
