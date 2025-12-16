import { baseApi } from "../../baseApi";
import type { InfoCardRow, InfoCardView } from "../../types/infoCards";

const toBool = (x: any) => x === true || x === 1 || x === "1" || x === "true";
const toView = (r: InfoCardRow): InfoCardView => ({ ...r, is_active: toBool(r.is_active) });

export type AdminInfoCardsListQuery = Partial<{
  q: string;
  is_active: boolean | 0 | 1 | "0" | "1" | "true" | "false";
  limit: number;
  offset: number;
  sort: "display_order" | "created_at" | "updated_at" | "title";
  order: "asc" | "desc";
}>;

export type InfoCardAdminUpsertInput = Partial<Pick<
  InfoCardRow,
  | "title" | "description" | "icon" | "icon_type" | "lucide_icon" | "link"
  | "bg_color" | "hover_color" | "icon_color" | "text_color" | "border_color"
  | "display_order" | "created_at" | "updated_at"
>> & {
  is_active?: boolean | 0 | 1 | "0" | "1" | "true" | "false";
};

export const adminInfoCardsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listInfoCardsAdmin: b.query<InfoCardView[], AdminInfoCardsListQuery | void>({
      query: (args) => ({ url: "/admin/info_cards", params: args ?? {} }),
      transformResponse: (res: unknown): InfoCardView[] =>
        Array.isArray(res) ? (res as InfoCardRow[]).map(toView) : [],
      providesTags: () => [{ type: "InfoCards" as const, id: "ADMIN_LIST" }],
    }),

    getInfoCardAdminById: b.query<InfoCardView, string>({
      query: (id) => ({ url: `/admin/info_cards/${id}` }),
      transformResponse: (res: unknown): InfoCardView => toView(res as InfoCardRow),
      providesTags: (_r, _e, id) => [{ type: "InfoCard" as const, id }],
    }),

    createInfoCardAdmin: b.mutation<InfoCardView, InfoCardAdminUpsertInput>({
      query: (body) => ({ url: "/admin/info_cards", method: "POST", body }),
      transformResponse: (res: unknown): InfoCardView => toView(res as InfoCardRow),
      invalidatesTags: [{ type: "InfoCards" as const, id: "ADMIN_LIST" }],
    }),

    updateInfoCardAdmin: b.mutation<InfoCardView, { id: string; patch: InfoCardAdminUpsertInput }>({
      query: ({ id, patch }) => ({ url: `/admin/info_cards/${id}`, method: "PATCH", body: patch }),
      transformResponse: (res: unknown): InfoCardView => toView(res as InfoCardRow),
      invalidatesTags: (r, e, args) => [
        { type: "InfoCards" as const, id: "ADMIN_LIST" },
        { type: "InfoCard" as const, id: args.id },
      ],
    }),

    deleteInfoCardAdmin: b.mutation<{ ok: true }, string>({
      query: (id) => ({ url: `/admin/info_cards/${id}`, method: "DELETE" }),
      transformResponse: () => ({ ok: true }),
      invalidatesTags: [{ type: "InfoCards" as const, id: "ADMIN_LIST" }],
    }),

    reorderInfoCardsAdmin: b.mutation<{ ok: true }, { ids: string[] }>({
      query: (body) => ({ url: "/admin/info_cards/reorder", method: "POST", body }),
      transformResponse: () => ({ ok: true }),
      invalidatesTags: [{ type: "InfoCards" as const, id: "ADMIN_LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListInfoCardsAdminQuery,
  useGetInfoCardAdminByIdQuery,
  useCreateInfoCardAdminMutation,
  useUpdateInfoCardAdminMutation,
  useDeleteInfoCardAdminMutation,
  useReorderInfoCardsAdminMutation,
} = adminInfoCardsApi;
