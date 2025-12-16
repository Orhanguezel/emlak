// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SlidersTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Plus, Pencil, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react";

import {
  useAdminListSlidesQuery,
  useAdminDeleteSlideMutation,
  useAdminUpdateSlideMutation,
  useAdminReorderSlidesMutation,
  useAdminSetSlideStatusMutation,
} from "@/integrations/rtk/endpoints/admin/sliders_admin.endpoints";
import type { SliderAdminListParams } from "@/integrations/rtk/types/slider";

type Row = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  featured: boolean;
  display_order: number;
  image: string | null;
  updated_at?: string | null;
};

export default function SlidersTab() {
  const navigate = useNavigate();

  // filters
  const [q, setQ] = React.useState("");
  const [onlyActive, setOnlyActive] = React.useState(false);

  /** ⚠ exactOptionalPropertyTypes uyumu: undefined atama YOK, alanı hiç koyma */
  const listParams = React.useMemo<SliderAdminListParams>(() => {
    return {
      sort: "display_order",
      order: "asc",
      limit: 200,
      ...(q.trim() ? { q: q.trim() } : {}),
      ...(onlyActive ? { is_active: true } : {}),
    };
  }, [q, onlyActive]);

  const { data, isFetching, refetch } = useAdminListSlidesQuery(listParams);

  const [rows, setRows] = React.useState<Row[]>([]);
  const [delOne] = useAdminDeleteSlideMutation();
  const [patchOne] = useAdminUpdateSlideMutation();
  const [reorder] = useAdminReorderSlidesMutation();
  const [setStatus] = useAdminSetSlideStatusMutation();

  React.useEffect(() => {
    if (!data) return;
    const mapped: Row[] = data.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description ?? null,
      is_active: !!s.is_active,
      featured: !!s.featured,
      display_order: Number(s.display_order ?? 0),
      image: (s.image_effective_url ?? s.image_url) ?? null,
      updated_at: s.updated_at ?? null,
    }));
    mapped.sort((a, b) => a.display_order - b.display_order);
    setRows(mapped);
  }, [data]);

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (onlyActive && !r.is_active) return false;
      if (!t) return true;
      return (
        r.name.toLowerCase().includes(t) ||
        r.slug.toLowerCase().includes(t) ||
        (r.description || "").toLowerCase().includes(t)
      );
    });
  }, [rows, q, onlyActive]);

  const onAdd = () => navigate("/admin/sliders/new");
  const onEdit = (id: number) => navigate(`/admin/sliders/${id}`);

  const doDelete = async (id: number) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await delOne(id).unwrap();
      toast.success("Slider silindi");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Silme başarısız");
    }
  };

  /** ⚠ noUncheckedIndexedAccess uyumu: swap'ta non-null assertion kullan */
  const move = (id: number, dir: "up" | "down") => {
    setRows((arr) => {
      const idx = arr.findIndex((x) => x.id === id);
      if (idx < 0) return arr;
      const j = dir === "up" ? idx - 1 : idx + 1;
      if (j < 0 || j >= arr.length) return arr;

      const copy = [...arr];
      const a = copy[idx]!;
      const b = copy[j]!;
      copy[idx] = b;
      copy[j] = a;

      copy.forEach((r, i) => { r.display_order = i + 1; });
      return copy;
    });
  };

  const saveOrder = async () => {
    try {
      const ids = [...rows].sort((a, b) => a.display_order - b.display_order).map((r) => r.id);
      await reorder({ ids }).unwrap();
      toast.success("Sıra kaydedildi");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Sıra kaydedilemedi");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-end max-w-4xl">
          <div className="space-y-1 sm:col-span-2">
            <Label>Ara</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ad, slug, açıklama…" />
          </div>
          <div className="flex items-center gap-3 pt-6 sm:pt-0">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <Switch checked={onlyActive} onCheckedChange={setOnlyActive} className="data-[state=checked]:bg-emerald-600" />
              Yalnız aktifler
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
          <Button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Slider
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Görsel</th>
              <th className="px-3 py-2 text-left">Ad</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Aktif</th>
              <th className="px-3 py-2 text-left">Öne Çık.</th>
              <th className="px-3 py-2 text-left">Sıra</th>
              <th className="px-3 py-2 text-left">Güncellendi</th>
              <th className="px-3 py-2 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">
                  {r.image ? (
                    <img src={r.image} alt={r.name} className="h-10 w-14 rounded object-cover border" />
                  ) : (
                    <div className="h-10 w-14 rounded border bg-gray-50" />
                  )}
                </td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.slug}</td>
                <td className="px-3 py-2">
                  <Switch
                    checked={!!r.is_active}
                    onCheckedChange={async (v) => {
                      const prev = r.is_active;
                      setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, is_active: v } : x)));
                      try {
                        await setStatus({ id: r.id, body: { is_active: v } }).unwrap();
                      } catch {
                        setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, is_active: prev } : x)));
                        toast.error("Aktiflik güncellenemedi");
                      }
                    }}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </td>
                <td className="px-3 py-2">
                  <Switch
                    checked={!!r.featured}
                    onCheckedChange={async (v) => {
                      const prev = r.featured;
                      setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, featured: v } : x)));
                      try {
                        await patchOne({ id: r.id, body: { featured: v } }).unwrap();
                      } catch {
                        setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, featured: prev } : x)));
                        toast.error("Öne çıkarma güncellenemedi");
                      }
                    }}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" onClick={() => move(r.id, "up")} disabled={i === 0}><ArrowUp className="h-4 w-4" /></Button>
                    <Button variant="ghost" onClick={() => move(r.id, "down")} disabled={i === filtered.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                    <span className="ml-1 text-xs text-gray-500">#{r.display_order}</span>
                  </div>
                </td>
                <td className="px-3 py-2">{r.updated_at ? new Date(r.updated_at).toLocaleString() : "—"}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" onClick={() => onEdit(r.id)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" onClick={() => doDelete(r.id)}><Trash2 className="h-4 w-4 text-rose-600" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {!isFetching && filtered.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-sm text-gray-500">Kayıt yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button onClick={saveOrder} className="gap-2">
          <Save className="h-4 w-4" />
          Sırayı Kaydet
        </Button>
      </div>

      {isFetching && <div className="text-xs text-gray-500">Yükleniyor…</div>}
    </div>
  );
}
