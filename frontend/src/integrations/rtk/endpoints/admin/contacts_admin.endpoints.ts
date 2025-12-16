// ---------------------------------------------------------------------
// FILE: src/integrations/metahub/rtk/endpoints/admin/contacts_admin.endpoints.ts
// ---------------------------------------------------------------------
import { baseApi } from "../../baseApi";
import type {
  ContactView,
  ContactListParams,
  ContactUpdateInput,
} from "@/integrations/rtk/types/contacts";

/**
 * Admin liste sorgu eşlemesi: backend aşağıdaki alanları bekliyor:
 * search, status, resolved, limit, offset, orderBy, order
 */
function toAdminQuery(p?: ContactListParams) {
  if (!p) return undefined;
  const q: Record<string, any> = {};
  if (p.search) q.search = p.search;
  if (typeof p.status !== "undefined") q.status = p.status;
  if (typeof p.resolved === "boolean") q.resolved = p.resolved;
  if (typeof p.limit === "number") q.limit = p.limit;
  if (typeof p.offset === "number") q.offset = p.offset;
  if (p.orderBy) q.orderBy = p.orderBy;
  if (p.order) q.order = p.order;
  return q;
}

export const contactsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // GET /admin/contacts
    listContactsAdmin: b.query<ContactView[], ContactListParams | void>({
      query: (p) =>
        p
          ? ({ url: "/admin/contacts", params: toAdminQuery(p) as Record<string, any> })
          : ({ url: "/admin/contacts" }),
      providesTags: (res) =>
        res?.length
          ? [
            { type: "Contacts" as const, id: "LIST" },
            ...res.map((r) => ({ type: "Contacts" as const, id: r.id })),
          ]
          : [{ type: "Contacts" as const, id: "LIST" }],
    }),

    // GET /admin/contacts/:id
    getContactAdmin: b.query<ContactView, string>({
      query: (id) => ({ url: `/admin/contacts/${id}` }),
      providesTags: (_res, _e, id) => [{ type: "Contacts" as const, id }],
    }),

    // PATCH /admin/contacts/:id
    updateContactAdmin: b.mutation<ContactView, { id: string; patch: ContactUpdateInput }>({
      query: ({ id, patch }) => ({
        url: `/admin/contacts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (res) =>
        res?.id
          ? [{ type: "Contacts" as const, id: res.id }, { type: "Contacts" as const, id: "LIST" }]
          : [{ type: "Contacts" as const, id: "LIST" }],
    }),

    // DELETE /admin/contacts/:id
    removeContactAdmin: b.mutation<{ ok: boolean }, string>({
      query: (id) => ({
        url: `/admin/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _e, id) => [
        { type: "Contacts" as const, id },
        { type: "Contacts" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListContactsAdminQuery,
  useGetContactAdminQuery,
  useUpdateContactAdminMutation,
  useRemoveContactAdminMutation,
} = contactsAdminApi;
