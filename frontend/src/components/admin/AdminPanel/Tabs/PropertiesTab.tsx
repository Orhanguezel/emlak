"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  useListPropertiesAdminQuery,
  useRemovePropertyAdminMutation,
  useUpdatePropertyAdminMutation,
} from "@/integrations/rtk/endpoints/admin/properties_admin.endpoints";


// ✅ TİPLER TEK KAYNAK: types/properties.ts
import type {
  AdminListParams,
  PropertyPatchBody,
  AdminProperty as PropertyAdminView,
} from "@/integrations/rtk/types/properties";

import {
  getPropertyTypeLabel,
  getPropertyStatusLabel,
} from "@/integrations/rtk/types/properties";

import { Plus, Pencil, Trash2, RefreshCw, Image as ImageIcon } from "lucide-react";

// public components reused
import { PropertiesFiltersPanel } from "@/components/public/properties/PropertiesFiltersPanel";
import { unwrapList } from "@/components/public/properties/properties.selectors";

// admin wrapper hook
import { useAdminPropertiesFilters } from "@/components/admin/AdminPanel/Tabs/properties/useAdminPropertiesFilters";

type LocalRow = {
  id: string;
  title: string;
  slug: string;

  type: string;
  status: string;

  city: string;
  district: string;
  neighborhood?: string | null;

  price?: string | null;
  currency?: string | null;

  image_url?: string | null;
  image_effective_url?: string | null;

  is_active: boolean;
  updated_at?: string | null;
};

function uniqStrings(arr: string[]): string[] {
  const set = new Set(arr.map((x) => (x || "").trim()).filter(Boolean));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
}

export default function PropertiesTab() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const limit = 20;
  const offset = page * limit;

  const {
    filters,
    setFilters,
    showAdvanced,
    setShowAdvanced,
    clearLocalFilters,
    queryParams,
    onlyActive,
    setOnlyActive,
  } = useAdminPropertiesFilters({ limit, offset });

  React.useEffect(() => {
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.search,
    filters.city,
    filters.district,
    filters.neighborhood,
    filters.type,
    filters.status,
    filters.price_min,
    filters.price_max,
    filters.gross_m2_min,
    filters.gross_m2_max,
    filters.rooms,
    filters.rooms_multi.join("|"),
    filters.bedrooms_min,
    filters.bedrooms_max,
    filters.building_age,
    filters.heating,
    filters.heating_multi.join("|"),
    filters.usage_status,
    filters.usage_status_multi.join("|"),
    filters.featured,
    filters.furnished,
    filters.in_site,
    filters.has_elevator,
    filters.has_parking,
    filters.has_balcony,
    filters.has_garden,
    filters.has_terrace,
    filters.credit_eligible,
    filters.swap,
    filters.has_virtual_tour,
    filters.accessible,
    onlyActive,
  ]);

  const queryArgs = useMemo<AdminListParams>(() => {
    return queryParams as AdminListParams;
  }, [queryParams]);

  const { data, isFetching, isError, refetch } = useListPropertiesAdminQuery(queryArgs, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [rows, setRows] = useState<LocalRow[]>([]);
  const [removeOne, { isLoading: removing }] = useRemovePropertyAdminMutation();
  const [patchOne, { isLoading: updating }] = useUpdatePropertyAdminMutation();

  React.useEffect(() => {
    const list = unwrapList<PropertyAdminView>(data);
    setRows(
      list.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: String(p.type ?? ""),
        status: String(p.status ?? ""),
        city: p.city,
        district: p.district,
        neighborhood: (p as any).neighborhood ?? null,
        price: typeof p.price === "string" ? p.price : p.price ?? null,
        currency: p.currency ?? null,
        image_url: p.image_url ?? null,
        image_effective_url: (p as any).image_effective_url ?? null,
        is_active: !!p.is_active,
        updated_at: p.updated_at ?? null,
      })),
    );
  }, [data]);

  const options = useMemo(() => {
    const cities = uniqStrings(rows.map((r) => r.city));
    const districts = uniqStrings(rows.map((r) => r.district));
    const neighborhoods = uniqStrings(rows.map((r) => r.neighborhood || "").filter(Boolean));
    const types = uniqStrings(rows.map((r) => r.type));
    const statuses = uniqStrings(rows.map((r) => r.status));
    return { cities, districts, neighborhoods, types, statuses };
  }, [rows]);

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

    // ✅ doğru patch tipi
    const patch: PropertyPatchBody = { is_active: v };

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
      <div className="space-y-3">
        <PropertiesFiltersPanel
          filters={filters}
          setFilters={setFilters}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          clearLocalFilters={clearLocalFilters}
          options={options}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Label className="text-sm">Yalnızca Aktif</Label>
            <Switch
              checked={onlyActive}
              onCheckedChange={(v) => setOnlyActive(Boolean(v))}
              className="data-[state=checked]:bg-emerald-600"
            />
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
      </div>

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
              const typeLabel = getPropertyTypeLabel(r.type);
              const statusLabel = getPropertyStatusLabel(r.status);

              return (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 rounded border bg-white overflow-hidden flex items-center justify-center">
                        {thumb ? (
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
                    <div className="text-gray-900">{typeLabel}</div>
                    <div className="text-xs text-gray-500">{statusLabel}</div>
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
                    {r.updated_at ? new Date(r.updated_at).toLocaleString("tr-TR") : "—"}
                  </td>

                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" onClick={() => onEdit(r.id)} title="Düzenle">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => doDelete(r)}
                        disabled={removing}
                        title="Sil"
                      >
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
