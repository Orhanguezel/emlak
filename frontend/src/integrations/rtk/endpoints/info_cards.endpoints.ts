// src/integrations/metahub/rtk/endpoints/info_cards.endpoints.ts
import { baseApi } from "../baseApi";
import type { InfoCardRow, InfoCardView } from "../types/infoCards";

const toBool = (x: any) => x === true || x === 1 || x === "1" || x === "true";
const toView = (r: InfoCardRow): InfoCardView => ({ ...r, is_active: toBool(r.is_active) });

export const infoCardsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listInfoCards: b.query<InfoCardView[], void>({
      query: () => ({ url: "/info_cards" }),
      transformResponse: (res: unknown): InfoCardView[] =>
        Array.isArray(res) ? (res as InfoCardRow[]).map(toView) : [],
      providesTags: (result) =>
        result ? [{ type: "InfoCards" as const, id: "LIST" }] : [{ type: "InfoCards" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});
export const { useListInfoCardsQuery } = infoCardsApi;
