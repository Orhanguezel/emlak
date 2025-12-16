// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/RecentWorksTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Plus, Pencil, Trash2, RefreshCw, ArrowUp, ArrowDown, Save as SaveIcon,
} from "lucide-react";

import {
  useListRecentWorksAdminQuery,
  useRemoveRecentWorkAdminMutation,
  useUpdateRecentWorkAdminMutation,
} from "@/integrations/rtk/endpoints/admin/recent_works_admin.endpoints";

type Row = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  material: string;

  image_url: string | null;

  is_active: boolean;
  display_order: number;

  updated_at: string | null;
  created_at: string | null;
};

export default function RecentWorksTab() {
  const navigate = useNavigate();

  const [q, setQ] = React.useState("");
  const [onlyActive, setOnlyActive] = React.useState(false);

  const { data, isFetching, refetch } = useListRecentWorksAdminQuery({
    limit: 200,
    sort: "display_order",
    orderDir: "asc",
  });

  const [rows, setRows] = React.useState<Row[]>([]);
  const [delOne, { isLoading: deleting }] = useRemoveRecentWorkAdminMutation();
  const [patchOne] = useUpdateRecentWorkAdminMutation();

  React.useEffect(() => {
    if (!data) return;
    const mapped: Row[] = data.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      description: r.description ?? "",
      category: r.category ?? "",
      location: r.location ?? "",
      material: r.material ?? "",
      image_url: (r.image_effective_url ?? r.image_url) ?? null,
      is_active: !!r.is_active,
      display_order: Number((r.display_order ?? 0)),
      updated_at: r.updated_at ?? null,
      created_at: r.created_at ?? null,
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
        r.title.toLowerCase().includes(t) ||
        r.slug.toLowerCase().includes(t) ||
        r.description.toLowerCase().includes(t) ||
        r.category.toLowerCase().includes(t) ||
        r.location.toLowerCase().includes(t) ||
        r.material.toLowerCase().includes(t) ||
        (r.updated_at ?? "").toLowerCase().includes(t)
      );
    });
  }, [rows, q, onlyActive]);

  const onAdd = () => navigate("/admin/recent_works/new");
  const onEdit = (id: string) => navigate(`/admin/recent_works/${id}`);

  const doDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await delOne(id).unwrap();
      toast.success("Kayıt silindi");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Silme başarısız");
    }
  };

  const move = (id: string, dir: "up" | "down") => {
    setRows((arr) => {
      const idx = arr.findIndex((x) => x.id === id);
      if (idx < 0) return arr;

      const j = dir === "up" ? idx - 1 : idx + 1;
      if (j < 0 || j >= arr.length) return arr;

      const copy = [...arr];
      const a = copy[idx]!; // <-- non-null assertion
      const b = copy[j]!;   // <-- non-null assertion
      copy[idx] = b;
      copy[j] = a;

      copy.forEach((r, i) => { r.display_order = i + 1; });
      return copy;
    });
  };


  const saveOrder = async () => {
    try {
      // basit yaklaşım: her satırı tek tek PATCH et
      for (const [i, r] of rows.entries()) {
        await patchOne({ id: r.id, body: { display_order: i + 1 } }).unwrap();
      }
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
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Başlık, slug, kategori, konum…" />
          </div>
          <div className="space-y-1">
            <Label>Yalnızca Aktif</Label>
            <div className="flex h-10 items-center">
              <Switch checked={onlyActive} onCheckedChange={setOnlyActive} className="data-[state=checked]:bg-emerald-600" />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
          <Button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Çalışma
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Görsel</th>
              <th className="px-3 py-2 text-left">Başlık</th>
              <th className="px-3 py-2 text-left">Kategori</th>
              <th className="px-3 py-2 text-left">Konum / Malzeme</th>
              <th className="px-3 py-2 text-left">Aktif</th>
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
                    <img src={r.image_url} alt={r.title} className="h-10 w-14 rounded object-cover border" />
                  ) : (
                    <div className="h-10 w-14 rounded border bg-gray-50" />
                  )}
                </td>
                <td className="px-3 py-2">{r.title}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2 text-gray-600 truncate max-w-[260px]">
                  {r.location} {r.material ? `· ${r.material}` : ""}
                </td>
                <td className="px-3 py-2">
                  <Switch
                    checked={!!r.is_active}
                    onCheckedChange={async (v) => {
                      setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, is_active: v } : x)));
                      try {
                        await patchOne({ id: r.id, body: { is_active: v } }).unwrap();
                      } catch {
                        setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, is_active: !v } : x)));
                        toast.error("Aktiflik güncellenemedi");
                      }
                    }}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" onClick={() => move(r.id, "up")} disabled={i === 0} title="Yukarı">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => move(r.id, "down")} disabled={i === filtered.length - 1} title="Aşağı">
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
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
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
