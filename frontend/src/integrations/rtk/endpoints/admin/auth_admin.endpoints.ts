// ===================================================================
// FILE: src/integrations/rtk/endpoints/admin/auth_admin.endpoints.ts
// ADMIN USER MANAGEMENT ( /admin/users..., /auth/admin/... )
// ===================================================================
import { baseApi } from "../../baseApi";
import type {
  AdminUserRaw,
  AdminUserView,
  UserRoleName,
} from "@/integrations/rtk/types/users";

const asRole = (v: unknown): UserRoleName | null => {
  const s = String(v ?? "").toLowerCase();
  return s === "admin" || s === "moderator" || s === "user"
    ? (s as UserRoleName)
    : null;
};

const coerceRoles = (raw: AdminUserRaw): UserRoleName[] => {
  // 1) Tekil role geldiyse
  if ((raw as any).role) {
    const r = asRole((raw as any).role);
    return r ? [r] : [];
  }

  // 2) roles dizi/string geldiyse
  const src = (raw as any).roles;
  if (Array.isArray(src)) {
    return src.map(asRole).filter(Boolean) as UserRoleName[];
  }
  if (typeof src === "string" && src.trim()) {
    try {
      const parsed = JSON.parse(src);
      if (Array.isArray(parsed)) {
        return parsed.map(asRole).filter(Boolean) as UserRoleName[];
      }
      const single = asRole(parsed);
      if (single) return [single];
    } catch {
      const single = asRole(src);
      if (single) return [single];
    }
  }
  return [];
};

const toBool = (v: unknown): boolean =>
  typeof v === "boolean" ? v : Number(v ?? 0) === 1;

const toNum = (v: unknown): number => {
  if (v == null || v === "") return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

const normalizeAdminUser = (u: AdminUserRaw): AdminUserView => ({
  id: String((u as any).id),
  email: (u as any).email ?? null,
  full_name: (u as any).full_name ?? null,
  phone: (u as any).phone ?? null,

  is_active: toBool((u as any).is_active),

  created_at: (u as any).created_at ?? null,
  last_login_at: (u as any).last_login_at ?? null,

  wallet_balance: toNum((u as any).wallet_balance),

  roles: coerceRoles(u),
});

// ---- Liste query tipleri (/admin/users) ----
export interface AdminUsersListParams {
  q?: string;
  role?: UserRoleName;
  is_active?: boolean;
  limit?: number;
  offset?: number;
  sort?: "created_at" | "email" | "last_login_at";
  order?: "asc" | "desc";
}

// ---- Update / action body tipleri ----
export interface AdminUpdateUserBody {
  id: string;
  full_name?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
}

export interface AdminSetActiveBody {
  id: string;
  is_active: boolean;
}

export interface AdminSetRolesBody {
  id: string;
  roles: UserRoleName[];
}

export interface AdminSetPasswordBody {
  id: string;
  password: string;
}

export interface AdminRemoveUserBody {
  id: string;
}

// /auth/admin/roles ve /auth/admin/make-admin için
export interface AdminRoleByUserOrEmailBody {
  user_id?: string;
  email?: string;
  role: UserRoleName;
}

export interface AdminMakeByEmailBody {
  email: string;
}

const ADMIN_USERS_BASE = "/admin/users";

export const authAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /* -----------------------------------------------------------------
     * /admin/users... uçları
     * ---------------------------------------------------------------- */

    /** GET /admin/users */
    adminList: b.query<AdminUserView[], AdminUsersListParams | void>({
      query: (params) => {
        const p = params ?? {};
        const searchParams = new URLSearchParams();

        if (p.q) searchParams.set("q", p.q);
        if (p.role) searchParams.set("role", p.role);
        if (typeof p.is_active === "boolean")
          searchParams.set("is_active", p.is_active ? "1" : "0");
        if (p.limit != null) searchParams.set("limit", String(p.limit));
        if (p.offset != null) searchParams.set("offset", String(p.offset));
        if (p.sort) searchParams.set("sort", p.sort);
        if (p.order) searchParams.set("order", p.order);

        const qs = searchParams.toString();
        return {
          url: qs ? `${ADMIN_USERS_BASE}?${qs}` : ADMIN_USERS_BASE,
          method: "GET",
        };
      },
      transformResponse: (res: unknown): AdminUserView[] => {
        if (!Array.isArray(res)) return [];
        return (res as AdminUserRaw[]).map(normalizeAdminUser);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({
                type: "AdminUsers" as const,
                id: u.id,
              })),
              "AdminUsers",
            ]
          : ["AdminUsers"],
    }),

    /** GET /admin/users/:id */
    adminGet: b.query<AdminUserView, { id: string }>({
      query: ({ id }) => ({
        url: `${ADMIN_USERS_BASE}/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      transformResponse: (res: unknown): AdminUserView =>
        normalizeAdminUser(res as AdminUserRaw),
      providesTags: (_r, _e, arg) => [
        { type: "AdminUsers", id: arg.id },
        "AdminUsers",
      ],
    }),

    /** PATCH /admin/users/:id */
    adminUpdateUser: b.mutation<AdminUserView, AdminUpdateUserBody>({
      query: ({ id, ...patch }) => ({
        url: `${ADMIN_USERS_BASE}/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (res: unknown): AdminUserView =>
        normalizeAdminUser(res as AdminUserRaw),
      invalidatesTags: (_r, _e, arg) => [
        { type: "AdminUsers", id: arg.id },
        "AdminUsers",
      ],
    }),

    /** POST /admin/users/:id/active */
    adminSetActive: b.mutation<{ ok: true }, AdminSetActiveBody>({
      query: ({ id, is_active }) => ({
        url: `${ADMIN_USERS_BASE}/${encodeURIComponent(id)}/active`,
        method: "POST",
        body: { is_active },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "AdminUsers", id: arg.id },
        "AdminUsers",
      ],
    }),

    /** POST /admin/users/:id/roles  (tam set) */
    adminSetRoles: b.mutation<{ ok: true }, AdminSetRolesBody>({
      query: ({ id, roles }) => ({
        url: `${ADMIN_USERS_BASE}/${encodeURIComponent(id)}/roles`,
        method: "POST",
        body: { roles },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "AdminUsers", id: arg.id },
        "AdminUsers",
        "UserRoles",
      ],
    }),

    /** POST /admin/users/:id/password */
    adminSetPassword: b.mutation<{ ok: true }, AdminSetPasswordBody>({
      query: ({ id, password }) => ({
        url: `${ADMIN_USERS_BASE}/${encodeURIComponent(id)}/password`,
        method: "POST",
        body: { password },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "AdminUsers", id: arg.id },
        "AdminUsers",
      ],
    }),

    /** DELETE /admin/users/:id */
    adminRemoveUser: b.mutation<{ ok: true }, AdminRemoveUserBody>({
      query: ({ id }) => ({
        url: `${ADMIN_USERS_BASE}/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "AdminUsers", id: arg.id },
        "AdminUsers",
      ],
    }),

    /* -----------------------------------------------------------------
     * /auth/admin/... uçları (email ile role yönetimi)
     * ---------------------------------------------------------------- */

    /** POST /auth/admin/roles  { user_id|email, role } */
    adminGrantRole: b.mutation<{ ok: true }, AdminRoleByUserOrEmailBody>({
      query: (body) => ({
        url: "/auth/admin/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminUsers", "UserRoles"],
    }),

    /** DELETE /auth/admin/roles  { user_id|email, role } */
    adminRevokeRole: b.mutation<{ ok: true }, AdminRoleByUserOrEmailBody>({
      query: (body) => ({
        url: "/auth/admin/roles",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["AdminUsers", "UserRoles"],
    }),

    /** POST /auth/admin/make-admin { email } */
    adminMakeByEmail: b.mutation<{ ok: true }, AdminMakeByEmailBody>({
      query: (body) => ({
        url: "/auth/admin/make-admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminUsers", "UserRoles"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAdminListQuery,
  useAdminGetQuery,
  useAdminUpdateUserMutation,
  useAdminSetActiveMutation,
  useAdminSetRolesMutation,
  useAdminSetPasswordMutation,
  useAdminRemoveUserMutation,
  useAdminGrantRoleMutation,
  useAdminRevokeRoleMutation,
  useAdminMakeByEmailMutation,
} = authAdminApi;
