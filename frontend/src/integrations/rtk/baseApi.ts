// =============================================================
// FILE: src/integrations/rtk/baseApi.ts
// =============================================================
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { metahubTags } from "./tags";
import { tokenStore } from "@/integrations/core/token";

/* ---------- URL helpers ---------- */
function trimSlash(x: string) {
  return x.replace(/\/+$/, "");
}
function ensureLeadingSlash(x: string) {
  return x.startsWith("/") ? x : `/${x}`;
}
function isAbsUrl(x: string) {
  return /^https?:\/\//i.test(x);
}
function joinOriginAndBase(origin?: string, base?: string) {
  if (!origin) return "";
  const o = trimSlash(origin);
  if (!base) return o;
  const b = trimSlash(base);
  return o + ensureLeadingSlash(b);
}

function guessDevBackend(): string {
  try {
    const loc = typeof window !== "undefined" ? window.location : null;
    const host = loc?.hostname || "localhost";
    const proto = loc?.protocol || "http:";
    return `${proto}//${host}:8083`;
  } catch {
    return "http://localhost:8083";
  }
}

/* ---------- Base URL resolve ---------- */
function resolveBaseUrl(): string {
  const env: any = import.meta.env || {};
  const apiUrl = (env.VITE_API_URL ?? env.NEXT_PUBLIC_API_URL ?? "") as string;
  const apiBase = (env.VITE_API_BASE ?? env.NEXT_PUBLIC_API_BASE ?? "") as string;
  const publicOrigin = (env.VITE_PUBLIC_API_ORIGIN ?? env.NEXT_PUBLIC_PUBLIC_API_ORIGIN ?? "") as string;

  // 1) Tam URL öncelikli
  if (typeof apiUrl === "string" && apiUrl.trim() && isAbsUrl(apiUrl)) {
    return trimSlash(apiUrl.trim());
  }
  // 2) Origin + Base birlikte verildiyse
  if (publicOrigin && apiBase) {
    return joinOriginAndBase(publicOrigin, apiBase);
  }
  // 3) Sadece base verilmişse
  if (apiBase && apiBase.trim()) {
    const val = apiBase.trim();
    if (isAbsUrl(val)) return trimSlash(val);
    return ensureLeadingSlash(trimSlash(val));
  }
  // 4) Dev → 8083, Prod → /api
  if ((import.meta as any).env?.DEV) return guessDevBackend();
  return "/api";
}

export const BASE_URL = resolveBaseUrl();

const DEBUG_API = String((import.meta.env as any)?.VITE_DEBUG_API ?? "") === "1";
if (DEBUG_API) {
  // eslint-disable-next-line no-console
  console.info("[metahub] BASE_URL =", BASE_URL);
}

/* ---------- guards ---------- */
type AnyArgs = string | FetchArgs;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Cross-realm FormData guard
function isProbablyFormData(b: unknown): boolean {
  return !!b && typeof b === "object" && typeof (b as any).append === "function";
}

// JSON body tespiti (FormData/Blob/ArrayBuffer hariç)
function isJsonLikeBody(b: unknown): b is Record<string, unknown> {
  if (typeof FormData !== "undefined" && b instanceof FormData) return false;
  if (typeof Blob !== "undefined" && b instanceof Blob) return false;
  if (typeof ArrayBuffer !== "undefined" && b instanceof ArrayBuffer) return false;
  if (isProbablyFormData(b)) return false;
  return isRecord(b);
}

const AUTH_SKIP_REAUTH = new Set<string>([
  "/auth/token",
  "/auth/signup",
  "/auth/google",
  "/auth/google/start",
  "/auth/token/refresh",
  "/auth/logout",
]);

function extractPath(u: string): string {
  try {
    if (isAbsUrl(u)) {
      const url = new URL(u);
      return url.pathname.replace(/\/+$/, "");
    }
    return u.replace(/^https?:\/\/[^/]+/i, "").replace(/\/+$/, "");
  } catch {
    return u.replace(/\/+$/, "");
  }
}

/** Göreli url'leri '/foo' formatına normalize et */
function normalizeUrlArg(arg: AnyArgs): AnyArgs {
  if (typeof arg === "string") {
    if (isAbsUrl(arg) || arg.startsWith("/")) return arg;
    return `/${arg}`;
  }
  const url = arg.url ?? "";
  if (url && !isAbsUrl(url) && !url.startsWith("/")) {
    return { ...arg, url: `/${url}` };
  }
  return arg;
}

/* ---------- Base Query ---------- */
type RBQ = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, unknown, FetchBaseQueryMeta>;

const rawBaseQuery: RBQ = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    // x-skip-auth → Authorization ekleme
    if (headers.get("x-skip-auth") === "1") {
      headers.delete("x-skip-auth");
      if (!headers.has("Accept")) headers.set("Accept", "application/json");
      if (!headers.has("Accept-Language")) {
        const lang =
          ((import.meta.env as any).VITE_DEFAULT_LOCALE as string | undefined) ??
          (typeof navigator !== "undefined" ? navigator.language : "tr");
        headers.set("Accept-Language", lang || "tr");
      }
      return headers;
    }

    // Bearer token
    const token =
      tokenStore.get() ||
      (typeof window !== "undefined"
        ? localStorage.getItem("mh_access_token") || ""
        : "");
    if (token && !headers.has("authorization")) {
      headers.set("authorization", `Bearer ${token}`);
    }

    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (!headers.has("Accept-Language")) {
      const lang =
        ((import.meta.env as any).VITE_DEFAULT_LOCALE as string | undefined) ??
        (typeof navigator !== "undefined" ? navigator.language : "tr");
      headers.set("Accept-Language", lang || "tr");
    }
    return headers;
  },
  responseHandler: async (response) => {
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) return response.json();
    if (ct.includes("text/")) return response.text();
    // Binary/unknown tipte bile text dene (çoğu hata body’si text)
    try {
      const t = await response.text();
      return t || null;
    } catch {
      return null;
    }
  },
  validateStatus: (res) => res.ok,
}) as RBQ;

/* ---------- Hata gövdesini serileştir ---------- */
async function coerceSerializableError(
  result: Awaited<ReturnType<typeof rawBaseQuery>>
) {
  const err = (result as any)?.error as FetchBaseQueryError | undefined;
  if (!err) return result;

  const d: any = (err as any).data;
  try {
    // Blob → string
    if (typeof Blob !== "undefined" && d instanceof Blob) {
      let text = "";
      try { text = await d.text(); } catch {}
      (err as any).data = text || `[binary ${d.type || "unknown"} ${d.size ?? ""}B]`;
    }
    // ArrayBuffer → string
    else if (d instanceof ArrayBuffer) {
      const dec = new TextDecoder();
      (err as any).data = dec.decode(new Uint8Array(d));
    }
  } catch {
    (err as any).data = String(d ?? "");
  }
  return result;
}

/* ---------- Body tipine göre doğru Content-Type ---------- */
function ensureProperHeaders(fa: FetchArgs): FetchArgs {
  const next: FetchArgs = { ...fa };
  const hdr = (next.headers as Record<string, string>) ?? {};

  if (isJsonLikeBody(next.body)) {
    next.headers = { ...hdr, "Content-Type": "application/json" };
  } else {
    // FormData/Blob ise boundary'yi fetch ayarlasın
    if (hdr["Content-Type"]) {
      const { ["Content-Type"]: _omit, ...rest } = hdr;
      next.headers = rest;
    }
  }
  return next;
}

/* ---------- 401 → refresh → retry ---------- */
const baseQueryWithReauth: RBQ = async (args, _api, extra) => {
  let req: AnyArgs = normalizeUrlArg(args);
  const path = typeof req === "string" ? req : req.url || "";
  const cleanPath = extractPath(path);

  if (typeof req !== "string") {
    if (AUTH_SKIP_REAUTH.has(cleanPath)) {
      const orig = (req.headers as Record<string, string> | undefined) ?? {};
      req.headers = { ...orig, "x-skip-auth": "1" };
    }
    req = ensureProperHeaders(req);
  }

  // İlk istek
  let result = await rawBaseQuery(req, _api, extra);
  result = await coerceSerializableError(result);

  // 401 → refresh → retry
  if (result.error?.status === 401 && !AUTH_SKIP_REAUTH.has(cleanPath)) {
    const refreshRes = await rawBaseQuery(
      {
        url: "/auth/token/refresh",
        method: "POST",
        headers: { "x-skip-auth": "1", Accept: "application/json" },
      },
      _api,
      extra
    );

    if (!refreshRes.error) {
      const access_token = (refreshRes.data as { access_token?: string } | undefined)?.access_token;

      if (access_token) {
        tokenStore.set(access_token);
        try {
          localStorage.setItem("mh_access_token", access_token);
        } catch {}

        let retry: AnyArgs = normalizeUrlArg(args);
        if (typeof retry !== "string") {
          if (AUTH_SKIP_REAUTH.has(cleanPath)) {
            const orig = (retry.headers as Record<string, string> | undefined) ?? {};
            retry.headers = { ...orig, "x-skip-auth": "1" };
          }
          retry = ensureProperHeaders(retry);
        }
        result = await rawBaseQuery(retry, _api, extra);
        result = await coerceSerializableError(result);
      } else {
        tokenStore.set(null);
        try {
          localStorage.removeItem("mh_access_token");
          localStorage.removeItem("mh_refresh_token");
        } catch {}
      }
    } else {
      tokenStore.set(null);
      try {
        localStorage.removeItem("mh_access_token");
        localStorage.removeItem("mh_refresh_token");
      } catch {}
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "metahubApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: metahubTags,
});

export { rawBaseQuery };
