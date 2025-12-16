// =============================================================
// FILE: src/integrations/metahub/rtk/endpoints/email.endpoints.ts
// =============================================================
import { baseApi as baseApi_m5 } from "../baseApi";
import type { EmailRow, EmailView, BoolLike } from "../types/email";

// küçük yardımcılar (admin dosyasındakilerle eş)
const toBool = (x: BoolLike | undefined): boolean =>
  x === true || x === 1 || x === "1" || x === "true";

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const toArrayOfStrings = (v: unknown): string[] => {
  if (Array.isArray(v)) {
    return v.filter((x): x is string => typeof x === "string");
  }
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((x): x is string => typeof x === "string");
      }
    } catch {
      /* ignored */
    }
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const extractHtml = (raw: unknown): string => {
  if (typeof raw === "string") return raw;
  if (isObj(raw) && typeof raw["html"] === "string") {
    return raw["html"] as string;
  }
  return "";
};

const toView = (row: unknown): EmailView => {
  const r = (row ?? {}) as Partial<EmailRow>;
  const html = r.body_html ?? r.content;

  const created_at =
    typeof r.created_at === "string" ? r.created_at : null;
  const updated_at =
    typeof r.updated_at === "string" ? r.updated_at : null;

  const locale =
    typeof r.locale === "string" || r.locale === null
      ? (r.locale ?? null)
      : null;

  return {
    id: String(r.id ?? ""),
    key: String(r.template_key ?? ""),
    name: String(r.template_name ?? ""),
    subject: String(r.subject ?? ""),
    content_html: extractHtml(html),
    variables: toArrayOfStrings(r.variables),
    is_active: toBool(r.is_active),
    locale,
    created_at,
    updated_at,
  };
};

export const emailTemplatesApi = baseApi_m5.injectEndpoints({
  endpoints: (b) => ({
    // NOT: backend endpoint’in /email olduğuna göre burada böyle bırakıyorum
    listEmailTemplates: b.query<
      EmailView[],
      { locale?: string; is_active?: BoolLike } | void
    >({
      query: () => ({ url: "/email" }),
      transformResponse: (res: unknown): EmailView[] =>
        Array.isArray(res) ? (res as unknown[]).map(toView) : [],
      providesTags: (result) =>
        result
          ? [
            ...result.map((t) => ({
              type: "EmailTemplate" as const,
              id: t.id,
            })),
            { type: "EmailTemplate" as const, id: "LIST" },
          ]
          : [{ type: "EmailTemplate" as const, id: "LIST" }],
    }),

    getEmailTemplateByKey: b.query<
      EmailView,
      { key: string; locale?: string }
    >({
      query: ({ key, locale }) => ({
        url: `/email/by-key/${key}`,
        params: { locale },
      }),
      transformResponse: (res: unknown): EmailView => toView(res),
      providesTags: (_r, _e, { key }) => [
        { type: "EmailTemplate", id: `KEY_${key}` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListEmailTemplatesQuery,
  useGetEmailTemplateByKeyQuery,
} = emailTemplatesApi;
