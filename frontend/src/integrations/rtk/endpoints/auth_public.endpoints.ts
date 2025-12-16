// ===================================================================
// FILE: src/integrations/rtk/endpoints/auth_public.endpoints.ts
// PUBLIC AUTH ( /auth/... )
// ===================================================================
import { baseApi } from "../baseApi";

export type UserRoleName = "admin" | "moderator" | "user";

export interface AuthUser {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  email_verified: number | boolean;
  is_active: number | boolean;
  role: UserRoleName;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  is_admin: boolean;
  user?: {
    id: string;
    email: string | null;
    role: UserRoleName;
  };
}

export interface AuthMeResponse {
  user: {
    id: string;
    email: string | null;
    role: UserRoleName;
  };
}

export interface PasswordResetRequestResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export interface PasswordResetConfirmResponse {
  success: boolean;
  message: string;
}

export interface AuthTokenRefreshResponse {
  access_token: string;
  token_type: string;
}

// ---- Body tipleri ----
export interface AuthSignupBody {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  options?: {
    data?: Record<string, unknown>;
  };
}

// 🔹 grant_type eklendi
export interface AuthTokenBody {
  email: string;
  password: string;
  grant_type?: "password";
}

export interface AuthUpdateBody {
  email?: string;
  password?: string;
}

export interface PasswordResetRequestBody {
  email: string;
}

export interface PasswordResetConfirmBody {
  token: string;
  password: string;
}

export const authPublicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** POST /auth/signup */
    authSignup: build.mutation<AuthTokenResponse, AuthSignupBody>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /** POST /auth/token (login) */
    authToken: build.mutation<AuthTokenResponse, AuthTokenBody>({
      query: (body) => ({
        url: "/auth/token",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /** POST /auth/token/refresh */
    authRefresh: build.mutation<AuthTokenRefreshResponse, void>({
      query: () => ({
        url: "/auth/token/refresh",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    /** GET /auth/user */
    authMe: build.query<AuthMeResponse, void>({
      query: () => ({
        url: "/auth/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    /** GET /auth/status */
    authStatus: build.query<AuthStatusResponse, void>({
      query: () => ({
        url: "/auth/status",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    /** PUT /auth/user */
    authUpdate: build.mutation<AuthMeResponse, AuthUpdateBody>({
      query: (body) => ({
        url: "/auth/user",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /** POST /auth/password-reset/request */
    authPasswordResetRequest: build.mutation<
      PasswordResetRequestResponse,
      PasswordResetRequestBody
    >({
      query: (body) => ({
        url: "/auth/password-reset/request",
        method: "POST",
        body,
      }),
    }),

    /** POST /auth/password-reset/confirm */
    authPasswordResetConfirm: build.mutation<
      PasswordResetConfirmResponse,
      PasswordResetConfirmBody
    >({
      query: (body) => ({
        url: "/auth/password-reset/confirm",
        method: "POST",
        body,
      }),
    }),

    /** POST /auth/logout */
    authLogout: build.mutation<{ ok: true }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // BE 204 dönüyor; FE tarafında sabit ok:true döndürüyoruz
      transformResponse: () => ({ ok: true as const }),
      invalidatesTags: ["User", "AdminUsers", "UserRoles"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAuthSignupMutation,
  useAuthTokenMutation,
  useAuthRefreshMutation,
  useAuthMeQuery,
  useAuthStatusQuery,
  useAuthUpdateMutation,
  useAuthPasswordResetRequestMutation,
  useAuthPasswordResetConfirmMutation,
  useAuthLogoutMutation,
} = authPublicApi;
