import { baseApi } from "../../baseApi";
import type { AnnouncementRow, AnnouncementView } from "../../types/announcements";

const toBool = (x: any) => x === true || x === 1 || x === "1" || x === "true";

function extractHtmlAdmin(content?: unknown): string {
  if (typeof content === "string") {
    try {
      const maybe = JSON.parse(content);
      if (maybe && typeof (maybe as any).html === "string") return (maybe as any).html;
    } catch { }
    return content;
  }
  if (content && typeof content === "object" && typeof (content as any).html === "string") {
    return (content as any).html;
  }
  return "";
}

const toView = (r: AnnouncementRow): AnnouncementView => ({
  ...r,
  is_active: toBool(r.is_active),
  is_published: toBool(r.is_published),
  html: extractHtmlAdmin(r.content),
});

export type AdminAnnouncementsListQuery = Partial<{
  q: string;
  is_active: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  is_published: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  include_expired: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  limit: number;
  offset: number;
  sort: "display_order" | "created_at" | "updated_at";
  order: "asc" | "desc";
}>;

export type AnnouncementAdminUpsertInput = Partial<
  Pick<
    AnnouncementRow,
    | "title"
    | "description"
    | "link"
    | "bg_color"
    | "hover_color"
    | "icon_color"
    | "text_color"
    | "border_color"
    | "badge_text"
    | "badge_color"
    | "button_text"
    | "button_color"
    | "display_order"
    | "meta_title"
    | "meta_description"
  >
> & {
  content?: string;
  is_active?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  is_published?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  published_at?: string | null;
  expires_at?: string | null;

  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;
};

export const adminAnnouncementsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listAnnouncementsAdmin: b.query<AnnouncementView[], AdminAnnouncementsListQuery | void>({
      query: (args) => ({ url: "/admin/announcements", params: args ?? {} }),
      transformResponse: (res: unknown): AnnouncementView[] =>
        Array.isArray(res) ? (res as AnnouncementRow[]).map(toView) : [],
      providesTags: () => [{ type: "Announcements" as const, id: "ADMIN_LIST" }],
      keepUnusedDataFor: 60,
    }),

    getAnnouncementAdminById: b.query<AnnouncementView, string>({
      query: (id) => ({ url: `/admin/announcements/${id}` }),
      transformResponse: (res: unknown): AnnouncementView => toView(res as AnnouncementRow),
      providesTags: (_r, _e, id) => [{ type: "Announcement" as const, id }],
    }),

    createAnnouncementAdmin: b.mutation<AnnouncementView, AnnouncementAdminUpsertInput>({
      query: (payload) => ({ url: "/admin/announcements", method: "POST", body: payload }),
      transformResponse: (res: unknown): AnnouncementView => toView(res as AnnouncementRow),
      invalidatesTags: [{ type: "Announcements" as const, id: "ADMIN_LIST" }],
    }),

    updateAnnouncementAdmin: b.mutation<AnnouncementView, { id: string; patch: AnnouncementAdminUpsertInput }>({
      query: ({ id, patch }) => ({ url: `/admin/announcements/${id}`, method: "PATCH", body: patch }),
      transformResponse: (res: unknown): AnnouncementView => toView(res as AnnouncementRow),
      invalidatesTags: (r, e, args) => [
        { type: "Announcements" as const, id: "ADMIN_LIST" },
        { type: "Announcement" as const, id: args.id },
      ],
    }),

    deleteAnnouncementAdmin: b.mutation<{ ok: true }, string>({
      query: (id) => ({ url: `/admin/announcements/${id}`, method: "DELETE" }),
      transformResponse: () => ({ ok: true }),
      invalidatesTags: [{ type: "Announcements" as const, id: "ADMIN_LIST" }],
    }),

    reorderAnnouncementsAdmin: b.mutation<{ ok: true }, { ids: string[] }>({
      query: (body) => ({ url: "/admin/announcements/reorder", method: "POST", body }),
      transformResponse: () => ({ ok: true }),
      invalidatesTags: [{ type: "Announcements" as const, id: "ADMIN_LIST" }],
    }),

    setAnnouncementImageAdmin: b.mutation<
      AnnouncementView,
      { id: string; body: { storage_asset_id?: string | null; image_url?: string | null; alt?: string | null } }
    >({
      query: ({ id, body }) => ({
        url: `/admin/announcements/${id}/image`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: unknown): AnnouncementView => toView(res as AnnouncementRow),
      invalidatesTags: (r, e, arg) => [
        { type: "Announcements" as const, id: "ADMIN_LIST" },
        { type: "Announcement" as const, id: arg.id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListAnnouncementsAdminQuery,
  useGetAnnouncementAdminByIdQuery,
  useCreateAnnouncementAdminMutation,
  useUpdateAnnouncementAdminMutation,
  useDeleteAnnouncementAdminMutation,
  useReorderAnnouncementsAdminMutation,
  useSetAnnouncementImageAdminMutation,
} = adminAnnouncementsApi;
