// -------------------------------------------------------------
// FILE: src/components/admin/AdminPanel/Tabs/ContactsTab.tsx
// -------------------------------------------------------------
"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useListContactsAdminQuery,
  useRemoveContactAdminMutation,
} from "@/integrations/rtk/endpoints/admin/contacts_admin.endpoints";
import type {
  ContactListParams,
  ContactStatus,
  ContactOrderBy,
  SortOrder,
} from "@/integrations/rtk/types/contacts";

const PAGE_SIZES = [10, 20, 50] as const;

export default function TabsContacts() {
  const navigate = useNavigate();

  // Filtre / sıralama / sayfalama state
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ContactStatus | "">("");
  const [resolved, setResolved] = React.useState<null | boolean>(null);

  // ❗ opsiyonel tipten çıkart
  const [orderBy, setOrderBy] = React.useState<ContactOrderBy>("created_at");
  const [order, setOrder] = React.useState<SortOrder>("desc");

  const [pageSize, setPageSize] = React.useState<(typeof PAGE_SIZES)[number]>(20);
  const [page, setPage] = React.useState(0);

  // ❗ undefined değerli property ekleme — koşullu spread ile kur
  const params: ContactListParams = {
    ...(search ? { search } : {}),
    ...(status ? { status: status as ContactStatus } : {}),
    ...(resolved !== null ? { resolved } : {}),
    ...(orderBy ? { orderBy } : {}),
    ...(order ? { order } : {}),
    limit: pageSize,
    offset: page * pageSize,
  };

  const { data: items, isFetching, refetch } = useListContactsAdminQuery(params);
  const [removeContact, { isLoading: removing }] = useRemoveContactAdminMutation();

  const onDelete = async (id: string) => {
    if (!confirm("Bu iletişim mesajını silmek istiyor musunuz?")) return;
    try {
      await removeContact(id).unwrap();
      toast.success("Kayıt silindi.");
    } catch {
      toast.error("Silme sırasında hata oluştu.");
    }
  };

  const toggleResolved = (v: boolean | null) => {
    setResolved(v);
    setPage(0);
  };

  return (
    <div className="space-y-4">
      {/* Filtreler */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
        <div className="sm:col-span-4">
          <Label htmlFor="search" className="mb-1 block text-sm text-gray-700">
            Ara (ad, email, tel, konu, mesaj)
          </Label>
          <div className="flex gap-2">
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Örn: Ahmet, 0533..."
            />
            <Button
              type="button"
              onClick={() => {
                setPage(0);
                refetch();
              }}
            >
              Ara
            </Button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label className="mb-1 block text-sm text-gray-700">Durum</Label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ContactStatus | "");
              setPage(0);
            }}
          >
            <option value="">Tümü</option>
            <option value="new">Yeni</option>
            <option value="in_progress">İşlemde</option>
            <option value="closed">Kapalı</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <Label className="mb-1 block text-sm text-gray-700">Çözüldü</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant={resolved === null ? "default" : "outline"}
              onClick={() => toggleResolved(null)}
            >
              Tümü
            </Button>
            <Button
              type="button"
              variant={resolved === true ? "default" : "outline"}
              onClick={() => toggleResolved(true)}
            >
              Evet
            </Button>
            <Button
              type="button"
              variant={resolved === false ? "default" : "outline"}
              onClick={() => toggleResolved(false)}
            >
              Hayır
            </Button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label className="mb-1 block text-sm text-gray-700">Sırala</Label>
          <div className="flex gap-2">
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value as ContactOrderBy)}
            >
              <option value="created_at">Oluşturulma</option>
              <option value="updated_at">Güncellenme</option>
              <option value="status">Durum</option>
              <option value="name">Ad</option>
            </select>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              value={order}
              onChange={(e) => setOrder(e.target.value as SortOrder)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label className="mb-1 block text-sm text-gray-700">Sayfa Boyutu</Label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value) as any);
              setPage(0);
            }}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Konu</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Çözüldü</th>
              <th className="px-4 py-3">Oluşturma</th>
              <th className="px-4 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(items || []).map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.phone}</td>
                <td className="px-4 py-3">{r.subject}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {r.status === "new" ? "Yeni" : r.status === "in_progress" ? "İşlemde" : "Kapalı"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Switch checked={r.is_resolved} disabled />
                </td>
                <td className="px-4 py-3">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/contacts/${r.id}`)}
                  >
                    Görüntüle
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={removing}
                    onClick={() => onDelete(r.id)}
                  >
                    Sil
                  </Button>
                </td>
              </tr>
            ))}

            {!isFetching && (!items || items.length === 0) && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">Sayfa: {page + 1}</div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isFetching}
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching || (items?.length ?? 0) < pageSize}
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}
