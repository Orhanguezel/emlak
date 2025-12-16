// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/custom_pages.endpoints.ts
// (public FE; slug ile get vs.)
// =============================================================
import { baseApi } from "../baseApi";
import type { CustomPageView } from "../types/customPages";

const toBool = (x: unknown): boolean =>
  x === true || x === 1 || x === "1" || x === "true";

function extractHtml(rawField: unknown): string {
  if (typeof rawField === "string") {
    try {
      const parsed = JSON.parse(rawField) as unknown;
      if (
        parsed &&
        typeof parsed === "object" &&
        typeof (parsed as Record<string, unknown>).html === "string"
      ) {
        return (parsed as Record<string, unknown>).html as string;
      }
      return rawField; // zaten düz HTML string
    } catch {
      return rawField; // parse edilemeyen düz HTML
    }
  }
  if (
    rawField &&
    typeof rawField === "object" &&
    typeof (rawField as Record<string, unknown>).html === "string"
  ) {
    return (rawField as Record<string, unknown>).html as string;
  }
  return "";
}

/** raw→view (exactOptionalPropertyTypes uyumlu) */
const toView = (row: unknown): CustomPageView => {
  const r = (row ?? {}) as Record<string, unknown>;
  const raw = r["content_html"] ?? r["content"];

  return {
    id: String(r["id"] ?? ""),
    title: String(r["title"] ?? ""),
    slug: String(r["slug"] ?? ""),
    content: extractHtml(raw), // <-- DÜZ HTML string

    image_url: (typeof r["image_url"] === "string" ? (r["image_url"] as string) : null) ?? null,
    image_effective_url:
      (typeof r["image_effective_url"] === "string"
        ? (r["image_effective_url"] as string)
        : null) ?? null,
    alt: (typeof r["alt"] === "string" ? (r["alt"] as string) : null) ?? null,


    meta_title:
      (typeof r["meta_title"] === "string"
        ? (r["meta_title"] as string)
        : null) ?? null,
    meta_description:
      (typeof r["meta_description"] === "string"
        ? (r["meta_description"] as string)
        : null) ?? null,
    is_published: toBool(r["is_published"]),

    created_at:
      typeof r["created_at"] === "string" ? (r["created_at"] as string) : "",
    updated_at:
      typeof r["updated_at"] === "string" ? (r["updated_at"] as string) : "",
  };
};

export const customPagesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listCustomPages: b.query<
      CustomPageView[],
      { locale?: string; is_published?: boolean | 0 | 1; limit?: number; offset?: number }
    >({
      query: (params) => ({ url: "/custom_pages", params }),
      transformResponse: (res: unknown): CustomPageView[] =>
        Array.isArray(res) ? (res as unknown[]).map(toView) : [],
      providesTags: (result) =>
        result
          ? [
            ...result.map((p) => ({ type: "CustomPage" as const, id: p.id })),
            { type: "CustomPages" as const, id: "LIST" },
          ]
          : [{ type: "CustomPages" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    getCustomPageBySlug: b.query<CustomPageView, { slug: string; locale?: string }>({
      query: ({ slug, locale }) => ({
        url: `/custom_pages/by-slug/${encodeURIComponent(slug)}`,
        ...(locale ? { params: { locale } } : {}), // <-- locale yoksa params eklenmez
      }),
      transformResponse: (res: unknown): CustomPageView => toView(res),
      providesTags: (_r, _e, { slug }) => [{ type: "CustomPage", id: `SLUG_${slug}` }],
    }),

    getCustomPageById: b.query<CustomPageView, string>({
      query: (id) => ({ url: `/custom_pages/${id}` }),
      transformResponse: (res: unknown): CustomPageView => toView(res),
      providesTags: (_r, _e, id) => [{ type: "CustomPage", id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListCustomPagesQuery,
  useGetCustomPageBySlugQuery,
  useGetCustomPageByIdQuery,
} = customPagesApi;
