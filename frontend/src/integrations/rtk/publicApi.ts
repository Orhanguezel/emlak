// =============================================================
// FILE: src/integrations/metahub/rtk/publicApi.ts
// =============================================================
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { rawBaseQuery } from "./baseApi"; // <-- var ve export ediliyor

type RBQ = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, unknown, FetchBaseQueryMeta>;

/** Public isteklerde auth/refresh istemiyoruz: x-skip-auth=1 */
const publicBaseQuery: RBQ = async (args, api, extra) => {
  const arg = typeof args === "string" ? { url: args } : { ...args };
  const hdr = (arg.headers as Record<string, string> | undefined) ?? {};
  arg.headers = { ...hdr, "x-skip-auth": "1" };
  return rawBaseQuery(arg, api, extra);
};

export const publicApi = createApi({
  reducerPath: "metahubPublicApi",
  baseQuery: publicBaseQuery,
  tagTypes: ["Categories", "SubCategories", "Products"], // gerekirse genişlet
  endpoints: () => ({}),
});
