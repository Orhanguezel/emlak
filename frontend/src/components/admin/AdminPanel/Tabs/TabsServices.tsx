// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/TabsServices.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, RefreshCw, ArrowUp, ArrowDown, Save as SaveIcon } from "lucide-react";

import {
  useListServicesAdminQuery,
  useDeleteServiceAdminMutation,
  useUpdateServiceAdminMutation,
  useReorderServicesAdminMutation,
  useSetServiceStatusAdminMutation,
} from "@/integrations/rtk/endpoints/admin/services_admin.endpoints";
import type { ServiceListParams } from "@/integrations/rtk/types/services.types";

type Row = {
  id: string;
  name: string;
  slug: string;
  type: "gardening" | "soil" | "other";
  category: string;
  price: string | null;
  is_active: boolean;
  featured: boolean;
  display_order: number;
  image_url: string | null;
  updated_at?: string | null;
};

export default function TabsServices() {
  const navigate = useNavigate();

  // filters
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState<"all" | "gardening" | "soil" | "other">("all");
  const [onlyActive, setOnlyActive] = React.useState(false);
  const [onlyFeatured, setOnlyFeatured] = React.useState(false);

  // ❗ exactOptionalPropertyTypes ile uyumlu param oluşturma (undefined key yok)
  const params = React.useMemo<ServiceListParams | undefined>(() => {
    const p: ServiceListParams = {
      orderBy: "display_order",
      order: "asc",
      limit: 200,
    };
    const s = q.trim();
    if (s) p.search = s;
    if (type !== "all") p.type = type; // tek değer; gerekirse array de verilebilir
    if (onlyActive) p.active = true;
    if (onlyFeatured) p.featured = true;
    return p;
  }, [q, type, onlyActive, onlyFeatured]);

  const { data, isFetching, refetch } = useListServicesAdminQuery(params);
  const [rows, setRows] = React.useState<Row[]>([]);
  const [delOne, { isLoading: deleting }] = useDeleteServiceAdminMutation();
  const [patchOne] = useUpdateServiceAdminMutation();
  const [setStatus] = useSetServiceStatusAdminMutation();
  const [reorder] = useReorderServicesAdminMutation();

  React.useEffect(() => {
    if (!data) return;
    const mapped: Row[] = data.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      type: s.type,
      category: s.category,
      price: s.price,
      is_active: !!s.is_active,
      featured: !!s.featured,
      display_order: Number(s.display_order ?? 0),
      image_url: (s.image_effective_url ?? s.image_url) ?? null,
      updated_at: s.updated_at ?? null,
    }));
    mapped.sort((a, b) => a.display_order - b.display_order);
    setRows(mapped);
  }, [data]);

  const filtered = React.useMemo(() => {
    return rows.filter((r) => {
      if (type !== "all" && r.type !== type) return false;
      if (onlyActive && !r.is_active) return false;
      if (onlyFeatured && !r.featured) return false;
      const t = q.trim().toLowerCase();
      if (!t) return true;
      return (
        r.name.toLowerCase().includes(t) ||
        r.slug.toLowerCase().includes(t) ||
        r.category.toLowerCase().includes(t) ||
        (r.price || "").toLowerCase().includes(t)
      );
    });
  }, [rows, q, type, onlyActive, onlyFeatured]);

  const onAdd = () => navigate("/admin/services/new");
  const onEdit = (id: string) => navigate(`/admin/services/${id}`);

  const doDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await delOne(id).unwrap();
      toast.success("Servis silindi");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Silme başarısız");
    }
  };

  // ❗ id artık string (Row.id string) — TS2367 fix
  const move = (id: string, dir: "up" | "down") => {
    setRows((arr: Row[]) => {
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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:items-end max-w-5xl">
          <div className="space-y-1 sm:col-span-2">
            <Label>Ara</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Servis adı, slug, kategori, fiyat…" />
          </div>

          <div className="space-y-1">
            <Label>Tür</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as "all" | "gardening" | "soil" | "other")}
            >
              <SelectTrigger><SelectValue placeholder="Tür" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="gardening">Gardening</SelectItem>
                <SelectItem value="soil">Soil</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <Switch checked={onlyActive} onCheckedChange={setOnlyActive} className="data-[state=checked]:bg-emerald-600" />
              Aktif
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <Switch checked={onlyFeatured} onCheckedChange={setOnlyFeatured} className="data-[state=checked]:bg-amber-500" />
              Öne Çıkan
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
            Yeni Servis
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
              <th className="px-3 py-2 text-left">Tür</th>
              <th className="px-3 py-2 text-left">Kategori</th>
              <th className="px-3 py-2 text-left">Fiyat</th>
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
                  {r.image_url ? (
                    <img src={r.image_url} alt={r.name} className="h-10 w-14 rounded object-cover border" />
                  ) : (
                    <div className="h-10 w-14 rounded border bg-gray-50" />
                  )}
                </td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.type}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2">{r.price ?? "—"}</td>
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
                    <Button variant="ghost" onClick={() => move(r.id, "up")} disabled={i === 0} title="Yukarı">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => move(r.id, "down")}
                      disabled={i === filtered.length - 1}
                      title="Aşağı"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <span className="ml-1 text-xs text-gray-500">#{r.display_order}</span>
                  </div>
                </td>
                <td className="px-3 py-2">{r.updated_at ? new Date(r.updated_at).toLocaleString() : "—"}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" onClick={() => onEdit(r.id)} title="Düzenle">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => doDelete(r.id)} disabled={deleting} title="Sil">
                      <Trash2 className="h-4 w-4 text-rose-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!isFetching && filtered.length === 0 && (
              <tr><td colSpan={10} className="px-3 py-8 text-center text-sm text-gray-500">Kayıt yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button onClick={saveOrder} className="gap-2">
          <SaveIcon className="h-4 w-4" />
          Sırayı Kaydet
        </Button>
      </div>

      {isFetching && <div className="text-xs text-gray-500">Yükleniyor…</div>}
    </div>
  );
}
