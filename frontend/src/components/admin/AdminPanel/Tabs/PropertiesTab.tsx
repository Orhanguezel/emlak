// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/PropertiesTab.tsx
// Pattern: PagesTab (search + active filter + table + row actions)
// exactOptionalPropertyTypes: undefined alanlar objeye eklenmez
// =============================================================
"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  useListPropertiesAdminQuery,
  useRemovePropertyAdminMutation,
  useUpdatePropertyAdminMutation,
} from "@/integrations/rtk/endpoints/admin/properties_admin.endpoints";

import type {
  AdminListParams,
  PropertyUpsertBody,
} from "@/integrations/rtk/endpoints/admin/properties_admin.endpoints";

import type { AdminProperty as PropertyAdminView } from "@/integrations/rtk/types/properties";

import { Plus, Pencil, Trash2, RefreshCw, Image as ImageIcon } from "lucide-react";

type LocalRow = {
  id: string;
  title: string;
  slug: string;

  type: string;
  status: string;

  city: string;
  district: string;

  price?: string | null;
  currency?: string | null;

  image_url?: string | null;
  image_effective_url?: string | null;

  is_active: boolean;
  updated_at?: string | null;
};

export default function PropertiesTab() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(0);
  const limit = 20;
  const offset = page * limit;

  const queryArgs = useMemo<AdminListParams>(() => {
    const args: AdminListParams = { limit, offset };

    const s = q.trim();
    if (s) args.search = s;

    const c = city.trim();
    if (c) args.city = c;

    const d = district.trim();
    if (d) args.district = d;

    const t = type.trim();
    if (t) args.type = t;

    const st = status.trim();
    if (st) args.status = st;

    if (onlyActive) args.active = true;

    return args;
  }, [q, city, district, type, status, onlyActive, limit, offset]);

  const { data, isFetching, isError, refetch } = useListPropertiesAdminQuery(queryArgs, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [rows, setRows] = useState<LocalRow[]>([]);
  const [removeOne, { isLoading: removing }] = useRemovePropertyAdminMutation();
  const [patchOne, { isLoading: updating }] = useUpdatePropertyAdminMutation();

  React.useEffect(() => {
    const list = Array.isArray(data) ? data : [];
    setRows(
      list.map((p: PropertyAdminView) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: p.type,
        status: p.status,
        city: p.city,
        district: p.district,
        price: typeof p.price === "string" ? p.price : p.price ?? null,
        currency: p.currency ?? null,
        image_url: p.image_url ?? null,
        image_effective_url: (p as any).image_effective_url ?? null,
        is_active: !!p.is_active,
        updated_at: p.updated_at ?? null,
      })),
    );
  }, [data]);

  const onAdd = () => navigate("/admin/properties/new");
  const onEdit = (id: string) => navigate(`/admin/properties/${encodeURIComponent(id)}`);

  const doDelete = async (p: LocalRow) => {
    if (!confirm(`Silmek istediğinize emin misiniz?\n\n${p.title}`)) return;
    try {
      await removeOne(p.id).unwrap();
      toast.success("Emlak silindi");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Silme başarısız");
    }
  };

  const toggleActive = async (p: LocalRow, v: boolean) => {
    setRows((arr) => arr.map((x) => (x.id === p.id ? { ...x, is_active: v } : x)));

    // exactOptionalPropertyTypes: patch objesine sadece gerekeni koy
    const patch: Partial<PropertyUpsertBody> = { is_active: v };

    try {
      await patchOne({ id: p.id, patch }).unwrap();
      toast.success("Durum güncellendi");
    } catch (e: any) {
      setRows((arr) => arr.map((x) => (x.id === p.id ? { ...x, is_active: !v } : x)));
      toast.error(e?.data?.message || "Durum güncellenemedi");
    }
  };

  const canPrev = page > 0;
  const canNext = rows.length === limit;

  const formatPrice = (price?: string | null, currency?: string | null) => {
    const p = (price ?? "").trim();
    if (!p) return "—";
    return currency ? `${p} ${currency}` : p;
  };

  const pickThumb = (r: LocalRow) => r.image_effective_url || r.image_url || "";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7 lg:gap-3 w-full">
          <div className="lg:col-span-2 space-y-1">
            <Label>Ara</Label>
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              placeholder="Başlık/slug ile ara…"
            />
          </div>

          <div className="space-y-1">
            <Label>Şehir</Label>
            <Input
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(0);
              }}
              placeholder="örn: Köln"
            />
          </div>

          <div className="space-y-1">
            <Label>İlçe</Label>
            <Input
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(0);
              }}
              placeholder="örn: Musteri"
            />
          </div>

          <div className="space-y-1">
            <Label>Tip</Label>
            <Input
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(0);
              }}
              placeholder="örn: Daire"
            />
          </div>

          <div className="space-y-1">
            <Label>Durum</Label>
            <Input
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              placeholder="örn: satilik"
            />
          </div>

          <div className="space-y-1">
            <Label>Yalnızca Aktif</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={onlyActive}
                onCheckedChange={(v) => {
                  setOnlyActive(v);
                  setPage(0);
                }}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
          <Button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Emlak
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">İlan</th>
              <th className="px-3 py-2 text-left">Konum</th>
              <th className="px-3 py-2 text-left">Tip / Durum</th>
              <th className="px-3 py-2 text-left">Fiyat</th>
              <th className="px-3 py-2 text-left">Aktif</th>
              <th className="px-3 py-2 text-left">Güncellendi</th>
              <th className="px-3 py-2 text-right">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => {
              const thumb = pickThumb(r);

              return (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 rounded border bg-white overflow-hidden flex items-center justify-center">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </div>

                      <div>
                        <div className="font-medium text-gray-900">{r.title}</div>
                        <div className="text-xs text-gray-500">/{r.slug}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-2">
                    <div className="text-gray-900">{r.city}</div>
                    <div className="text-xs text-gray-500">{r.district}</div>
                  </td>

                  <td className="px-3 py-2">
                    <div className="text-gray-900">{r.type}</div>
                    <div className="text-xs text-gray-500">{r.status}</div>
                  </td>

                  <td className="px-3 py-2">{formatPrice(r.price, r.currency)}</td>

                  <td className="px-3 py-2">
                    <Switch
                      checked={!!r.is_active}
                      onCheckedChange={(v) => toggleActive(r, v)}
                      disabled={updating}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </td>

                  <td className="px-3 py-2">
                    {r.updated_at ? new Date(r.updated_at).toLocaleString() : "—"}
                  </td>

                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" onClick={() => onEdit(r.id)} title="Düzenle">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" onClick={() => doDelete(r)} disabled={removing} title="Sil">
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!isFetching && !isError && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-rose-600">
                  Liste yüklenemedi.{" "}
                  <button className="underline" onClick={() => refetch()}>
                    Tekrar dene
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-gray-500">{isFetching ? "Yükleniyor…" : `Sayfa: ${page + 1}`}</div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={!canPrev || isFetching}
          >
            Önceki
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={!canNext || isFetching}
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}
