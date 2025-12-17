// src/integrations/rtk/endpoints/slider_public.endpoints.ts

import { baseApi } from "../baseApi";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { SliderPublic, SliderListParams } from "@/integrations/rtk/types/slider";

const BASE = "/sliders";

const buildParams = (p?: SliderListParams) => {
  if (!p) return undefined;
  const o: Record<string, string | number> = {};
  if (p.q) o.q = p.q;
  if (p.limit != null) o.limit = p.limit;
  if (p.offset != null) o.offset = p.offset;
  if (p.sort) o.sort = p.sort;
  if (p.order) o.order = p.order;
  return o;
};

export const sliderPublicApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listSlidesPublic: b.query<SliderPublic[], void | SliderListParams>({
      query: (params): FetchArgs | string => {
        const qp = buildParams(params as SliderListParams | undefined);
        return qp
          ? { url: BASE, params: qp, headers: { "x-skip-auth": "1" } }
          : { url: BASE, headers: { "x-skip-auth": "1" } };
      },
      providesTags: (res) =>
        res
          ? [...res.map((s) => ({ type: "SliderPublic" as const, id: s.id })), { type: "SliderPublic" as const, id: "LIST" }]
          : [{ type: "SliderPublic" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    getSlidePublic: b.query<SliderPublic, string>({
      query: (idOrSlug): FetchArgs => ({ url: `${BASE}/${encodeURIComponent(idOrSlug)}`, headers: { "x-skip-auth": "1" } }),
      providesTags: (r) => (r ? [{ type: "SliderPublic" as const, id: r.id }] : [{ type: "SliderPublic" as const, id: "LIST" }]),
      keepUnusedDataFor: 60,
    }),
  }),
  overrideExisting: true,
});

export const { useListSlidesPublicQuery, useGetSlidePublicQuery } = sliderPublicApi;
