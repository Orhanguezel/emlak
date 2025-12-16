// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/ReviewsTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCcw,
  PencilLine,
} from "lucide-react";

import {
  useListReviewsAdminQuery,
  useUpdateReviewAdminMutation,
  useDeleteReviewAdminMutation,
} from "@/integrations/rtk/endpoints/admin/reviews_admin.endpoints";
import type { ReviewListParams, ReviewView } from "@/integrations/rtk/types/reviews";

type OrderByT = NonNullable<ReviewListParams["orderBy"]>;
type OrderT = NonNullable<ReviewListParams["order"]>;
type ApprovedFilter = "all" | "approved" | "pending";

export default function ReviewsTab() {
  // ----------- Filters -----------
  const [search, setSearch] = React.useState("");
  const [approvedFilter, setApprovedFilter] = React.useState<ApprovedFilter>("all");
  const [onlyActive, setOnlyActive] = React.useState<boolean | undefined>(undefined);

  const [minRating, setMinRating] = React.useState<string>("");
  const [maxRating, setMaxRating] = React.useState<string>("");

  const [orderBy, setOrderBy] = React.useState<OrderByT>("display_order");
  const [order, setOrder] = React.useState<OrderT>("asc");

  // ---- ortak paramlar (approved hariç) ----
  const baseParams = React.useMemo<ReviewListParams>(() => {
    const out: ReviewListParams = { limit: 100, offset: 0, orderBy, order };
    const s = search.trim();
    if (s) out.search = s;

    if (onlyActive !== undefined) out.active = onlyActive;

    const min = Number(minRating);
    if (minRating !== "" && Number.isFinite(min) && min >= 1) out.minRating = min;
    const max = Number(maxRating);
    if (maxRating !== "" && Number.isFinite(max) && max >= 1) out.maxRating = max;

    return out;
  }, [search, onlyActive, minRating, maxRating, orderBy, order]);

  // ---- RTK sorguları ----
  // Tümü → iki çağrı: approved true + false, sonra merge & sort
  const paramsApproved: ReviewListParams = React.useMemo(
    () => ({ ...baseParams, approved: true }),
    [baseParams]
  );
  const paramsPending: ReviewListParams = React.useMemo(
    () => ({ ...baseParams, approved: false }),
    [baseParams]
  );

  const singleParams: ReviewListParams = React.useMemo(() => {
    if (approvedFilter === "approved") return paramsApproved;
    if (approvedFilter === "pending") return paramsPending;
    return baseParams; // (skip edilecek, all'da iki çağrıdan gelecek)
  }, [approvedFilter, baseParams, paramsApproved, paramsPending]);

  // Tekli sorgu (approved/pending seçiliyken)
  const {
    data: dataSingle = [],
    isFetching: fetchingSingle,
    refetch: refetchSingle,
  } = useListReviewsAdminQuery(singleParams, {
    refetchOnFocus: true,
    skip: approvedFilter === "all",
  });

  // Çift sorgu (tümü seçiliyken)
  const {
    data: dataApproved = [],
    isFetching: fetchingApproved,
    refetch: refetchApproved,
  } = useListReviewsAdminQuery(paramsApproved, {
    refetchOnFocus: true,
    skip: approvedFilter !== "all",
  });

  const {
    data: dataPending = [],
    isFetching: fetchingPending,
    refetch: refetchPending,
  } = useListReviewsAdminQuery(paramsPending, {
    refetchOnFocus: true,
    skip: approvedFilter !== "all",
  });

  // ---- birleşik veri + client-side sort ----
  const data: ReviewView[] = React.useMemo(() => {
    const list = approvedFilter === "all" ? [...dataApproved, ...dataPending] : dataSingle;

    // id ile dedupe
    const map = new Map<string, ReviewView>();
    for (const r of list) map.set(r.id, r);
    const arr = Array.from(map.values());

    const dir = order === "asc" ? 1 : -1;
    const toNum = (v: any) => (typeof v === "number" ? v : Number(v) || 0);

    arr.sort((a, b) => {
      switch (orderBy) {
        case "display_order":
          return (toNum(a.display_order) - toNum(b.display_order)) * dir;
        case "rating":
          return (toNum(a.rating) - toNum(b.rating)) * dir;
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "updated_at":
          return (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()) * dir;
        case "created_at":
        default:
          return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
      }
    });

    return arr;
  }, [approvedFilter, dataApproved, dataPending, dataSingle, order, orderBy]);

  const isFetching = approvedFilter === "all"
    ? fetchingApproved || fetchingPending
    : fetchingSingle;

  const refetch = () => {
    if (approvedFilter === "all") {
      refetchApproved();
      refetchPending();
    } else {
      refetchSingle();
    }
  };

  const [update, { isLoading: updating }] = useUpdateReviewAdminMutation();
  const [remove, { isLoading: deleting }] = useDeleteReviewAdminMutation();

  // ----------- Edit Modal State -----------
  const [editing, setEditing] = React.useState<ReviewView | null>(null);
  const [editForm, setEditForm] = React.useState<{
    name: string;
    email: string;
    rating: number;
    display_order: number;
    comment: string;
  } | null>(null);

  const openEdit = (row: ReviewView) => {
    setEditing(row);
    setEditForm({
      name: row.name,
      email: row.email,
      rating: row.rating,
      display_order: row.display_order,
      comment: row.comment,
    });
  };

  const saveEdit = async () => {
    if (!editing || !editForm) return;
    try {
      await update({
        id: editing.id,
        body: {
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          rating: Number(editForm.rating),
          display_order: Number(editForm.display_order),
          comment: editForm.comment.trim(),
        },
      }).unwrap();
      toast.success("Yorum güncellendi");
      setEditing(null);
      setEditForm(null);
      refetch();
    } catch {
      toast.error("Güncelleme başarısız");
    }
  };

  const toggleSort = (col: OrderByT) => {
    if (orderBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setOrderBy(col);
      setOrder("asc");
    }
  };

  const onToggleApproved = async (row: ReviewView) => {
    try {
      await update({ id: row.id, body: { is_approved: !row.is_approved } }).unwrap();
    } catch {
      toast.error("Onay güncellenemedi");
      return;
    }
    toast.success(!row.is_approved ? "Onaylandı" : "Onay kaldırıldı");
    refetch();
  };

  const onToggleActive = async (row: ReviewView) => {
    try {
      await update({ id: row.id, body: { is_active: !row.is_active } }).unwrap();
    } catch {
      toast.error("Durum güncellenemedi");
      return;
    }
    toast.success(!row.is_active ? "Aktifleştirildi" : "Pasifleştirildi");
    refetch();
  };

  const onDelete = async (row: ReviewView) => {
    if (!window.confirm(`Silinsin mi?\n\n${row.name} — ${row.comment.slice(0, 80)}`)) return;
    try {
      await remove(row.id).unwrap();
      toast.success("Silindi");
      refetch();
    } catch {
      toast.error("Silme işlemi başarısız");
    }
  };

  const pendingCount = data.filter((r) => !r.is_approved).length;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-600">Ara</label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="isim, email, yorum…"
          />
        </div>

        <div className="w-[200px]">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Onay Filtresi{" "}
            {pendingCount ? (
              <Badge className="ml-1" variant="outline">
                {pendingCount} bekliyor
              </Badge>
            ) : null}
          </label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={approvedFilter}
            onChange={(e) => setApprovedFilter(e.target.value as ApprovedFilter)}
          >
            <option value="all">Tümü (Onaylı + Onaysız)</option>
            <option value="approved">Sadece Onaylı</option>
            <option value="pending">Sadece Onaysız</option>
          </select>
        </div>

        <div className="flex h-9 items-center gap-2">
          <Switch
            checked={onlyActive === true}
            onCheckedChange={(v) => setOnlyActive(v ? true : undefined)}
            id="only-active"
          />
          <label htmlFor="only-active" className="text-sm">
            Sadece Aktifler
          </label>
        </div>

        <div className="w-[120px]">
          <label className="mb-1 block text-xs font-medium text-gray-600">Min</label>
          <Input
            inputMode="numeric"
            min={1}
            max={5}
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            placeholder="1"
          />
        </div>
        <div className="w-[120px]">
          <label className="mb-1 block text-xs font-medium text-gray-600">Max</label>
          <Input
            inputMode="numeric"
            min={1}
            max={5}
            value={maxRating}
            onChange={(e) => setMaxRating(e.target.value)}
            placeholder="5"
          />
        </div>

        <div className="w-[170px]">
          <label className="mb-1 block text-xs font-medium text-gray-600">Sırala</label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value as OrderByT)}
          >
            <option value="display_order">display_order</option>
            <option value="name">name</option>
            <option value="rating">rating</option>
            <option value="updated_at">updated_at</option>
            <option value="created_at">created_at</option>
          </select>
        </div>

        <div className="w-[140px]">
          <label className="mb-1 block text-xs font-medium text-gray-600">Yön</label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={order}
            onChange={(e) => setOrder(e.target.value as OrderT)}
          >
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={refetch} disabled={isFetching}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Yenile
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2">Sıra</th>
              <th className="px-3 py-2 text-left">Kişi</th>
              <th className="px-3 py-2">Puan</th>
              <th className="px-3 py-2 text-left">Yorum</th>
              <th className="px-3 py-2">Onay</th>
              <th className="px-3 py-2">Aktif</th>
              <th className="px-3 py-2">
                <button
                  className="inline-flex items-center gap-1"
                  onClick={() => toggleSort("created_at")}
                >
                  Tarih <ArrowUp className="h-3 w-3 opacity-60" />
                </button>
              </th>
              <th className="px-3 py-2 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className={"border-t " + (r.is_active ? "" : "opacity-60")}>
                <td className="px-3 py-2 tabular-nums">{r.display_order}</td>
                <td className="px-3 py-2 text-left">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.email}</div>
                </td>
                <td className="px-3 py-2 text-center">{r.rating}</td>
                <td className="px-3 py-2">
                  <div className="max-w-[520px] truncate" title={r.comment}>
                    {r.comment}
                  </div>
                </td>
                <td className="px-3 py-2 text-center">
                  {r.is_approved ? (
                    <Badge className="bg-green-100 text-green-700 border-green-300">Onaylı</Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-300 text-amber-700">Bekliyor</Badge>
                  )}
                </td>

                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <Switch
                      checked={r.is_active}
                      disabled={updating}
                      onCheckedChange={() => onToggleActive(r)}
                    />
                    <span className={r.is_active ? "text-emerald-600 font-medium" : "text-gray-400 font-medium"}>
                      {r.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-2 text-center text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleString()}
                </td>

                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(r)}
                      title="Düzenle"
                      className="border-slate-300"
                    >
                      <PencilLine className="mr-2 h-4 w-4" />
                      Düzenle
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => onToggleApproved(r)}
                      disabled={updating}
                      className={
                        r.is_approved
                          ? "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }
                      title={r.is_approved ? "Onayı kaldır" : "Onayla"}
                    >
                      {r.is_approved ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                      {r.is_approved ? "Onayı Kaldır" : "Onayla"}
                    </Button>

                    <Button variant="destructive" size="sm" onClick={() => onDelete(r)} disabled={deleting}>
                      <Trash2 className="mr-2 h-4 w-4" /> Sil
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && !isFetching && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Basit Edit Modal */}
      {editing && editForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Yorum Düzenle</h3>
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setEditing(null);
                  setEditForm(null);
                }}
              >
                Kapat
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="grid gap-1">
                <label className="text-xs text-gray-600">Ad Soyad</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-gray-600">E-posta</label>
                <Input
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="text-xs text-gray-600">Puan (1-5)</label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={editForm.rating}
                    onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-xs text-gray-600">Sıra</label>
                  <Input
                    type="number"
                    value={editForm.display_order}
                    onChange={(e) =>
                      setEditForm({ ...editForm, display_order: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-gray-600">Yorum</label>
                <Textarea
                  rows={4}
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(null);
                  setEditForm(null);
                }}
              >
                İptal
              </Button>
              <Button onClick={saveEdit} disabled={updating}>
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
