// ======================================================================
// FILE: src/components/admin/AdminPanel/Tabs/TabsUsers.tsx
// ======================================================================
"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import {
  useAdminListQuery,
  useAdminSetActiveMutation,
  useAdminRemoveUserMutation,
  type AdminUsersListParams,
} from "@/integrations/rtk/endpoints/admin/auth_admin.endpoints";

const roleOptions = [
  { label: "Tümü", value: "" },
  { label: "admin", value: "admin" },
  { label: "moderator", value: "moderator" },
  { label: "user", value: "user" },
] as const;

export default function TabsUsers() {
  const navigate = useNavigate();

  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState<string>("");
  const [onlyActive, setOnlyActive] = React.useState<boolean | undefined>(
    undefined,
  );

  // ❗ exactOptionalPropertyTypes için NonNullable kullan
  type SortT = NonNullable<AdminUsersListParams["sort"]>;
  type OrderT = NonNullable<AdminUsersListParams["order"]>;
  const [sort, setSort] = React.useState<SortT>("created_at");
  const [order, setOrder] = React.useState<OrderT>("desc");

  const params = React.useMemo<AdminUsersListParams>(() => {
    const out: AdminUsersListParams = {
      limit: 50,
      offset: 0,
      sort, // her zaman tanımlı
      order, // her zaman tanımlı
    };
    const qTrim = q.trim();
    if (qTrim) out.q = qTrim;
    if (role) out.role = role as any;
    if (onlyActive !== undefined) out.is_active = onlyActive;
    return out;
  }, [q, role, onlyActive, sort, order]);

  const { data, isFetching, refetch } = useAdminListQuery(params);
  const [setActive, { isLoading: toggling }] = useAdminSetActiveMutation();
  const [deleteUser, { isLoading: deleting }] = useAdminRemoveUserMutation();

  const onToggleActive = async (id: string, next: boolean) => {
    try {
      await setActive({ id, is_active: next }).unwrap();
      toast.success(
        next ? "Kullanıcı aktifleştirildi" : "Kullanıcı pasifleştirildi",
      );
    } catch {
      toast.error("Durum güncellenemedi");
    }
  };

  const onDelete = async (id: string) => {
    if (
      !window.confirm("Bu kullanıcı silinsin mi? İşlem geri alınamaz.")
    )
      return;
    try {
      await deleteUser({ id }).unwrap();
      toast.success("Kullanıcı silindi");
      refetch();
    } catch {
      toast.error("Silme işlemi başarısız");
    }
  };

  const toggleSort = (col: SortT) => {
    if (sort === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSort(col);
      setOrder("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Ara
          </label>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="email, ad-soyad…"
          />
        </div>

        <div className="w-[180px]">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Rol
          </label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex h-9 items-center gap-2">
          <Switch
            checked={onlyActive === true}
            onCheckedChange={(v) => setOnlyActive(v ? true : undefined)}
            id="only-active"
          />
          <label htmlFor="only-active" className="text-sm">
            Sadece aktifler
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Yenile
          </Button>
          <Button onClick={() => navigate("/admin/users/new")}>
            Yeni Kullanıcı
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Ad Soyad</th>
              <th className="px-3 py-2 text-left">Telefon</th>
              <th className="px-3 py-2">
                <button
                  onClick={() => toggleSort("last_login_at")}
                  className="underline"
                >
                  Son Giriş{" "}
                  {sort === "last_login_at"
                    ? order === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </button>
              </th>
              <th className="px-3 py-2">Roller</th>
              <th className="px-3 py-2">
                <button
                  onClick={() => toggleSort("created_at")}
                  className="underline"
                >
                  Oluşturulma{" "}
                  {sort === "created_at"
                    ? order === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </button>
              </th>
              <th className="px-3 py-2">Aktif</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.full_name ?? "-"}</td>
                <td className="px-3 py-2">{u.phone ?? "-"}</td>
                <td className="px-3 py-2">
                  {u.last_login_at
                    ? new Date(u.last_login_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {u.roles && u.roles.length ? (
                      u.roles.map((r) => (
                        <Badge
                          key={r}
                          variant="outline"
                          className="capitalize"
                        >
                          {r}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-3 py-2">
                  <Switch
                    checked={!!u.is_active}
                    disabled={toggling}
                    onCheckedChange={(v) => onToggleActive(u.id, v)}
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(u.id)}
                      disabled={deleting}
                    >
                      Sil
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {(data ?? []).length === 0 && !isFetching && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-gray-500"
                >
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
