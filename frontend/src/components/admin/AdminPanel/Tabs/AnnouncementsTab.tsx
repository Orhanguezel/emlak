// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/AnnouncementsTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, RefreshCw, ArrowUp, ArrowDown, Save as SaveIcon } from "lucide-react";

import {
  useListAnnouncementsAdminQuery,
  useDeleteAnnouncementAdminMutation,
  useUpdateAnnouncementAdminMutation,
  useReorderAnnouncementsAdminMutation,
} from "@/integrations/rtk/endpoints/admin/announcements_admin.endpoints";

type Row = {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  is_published: boolean;
  display_order: number;
  image_url: string | null;
  updated_at: string | null;
  created_at: string | null;
};

export default function AnnouncementsTab() {
  const navigate = useNavigate();

  const [q, setQ] = React.useState("");
  const [onlyActive, setOnlyActive] = React.useState(false);
  const [onlyPublished, setOnlyPublished] = React.useState(false);

  const { data, isFetching, refetch } = useListAnnouncementsAdminQuery({ limit: 200, sort: "display_order", order: "asc" });
  const [rows, setRows] = React.useState<Row[]>([]);

  const [delOne, { isLoading: deleting }] = useDeleteAnnouncementAdminMutation();
  const [patchOne] = useUpdateAnnouncementAdminMutation();
  const [reorder, { isLoading: reordering }] = useReorderAnnouncementsAdminMutation();

  React.useEffect(() => {
    if (!data) return;
    // map to strict Row (nulls explicit) — exactOptionalPropertyTypes dostu
    const mapped: Row[] = data.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description ?? "",
      is_active: !!a.is_active,
      is_published: !!a.is_published,
      display_order: Number((a as any).display_order ?? 1),
      image_url: (a as any).image_url ?? null,
      updated_at: (a as any).updated_at ?? null,
      created_at: (a as any).created_at ?? null,
    }));
    // list endpoint zaten display_order ile geliyor; yine de sort’layalım
    mapped.sort((x, y) => x.display_order - y.display_order);
    setRows(mapped);
  }, [data]);

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (onlyActive && !r.is_active) return false;
      if (onlyPublished && !r.is_published) return false;
      if (!t) return true;
      return (
        r.title.toLowerCase().includes(t) ||
        r.description.toLowerCase().includes(t) ||
        (r.updated_at ?? "").toLowerCase().includes(t) ||
        (r.created_at ?? "").toLowerCase().includes(t)
      );
    });
  }, [rows, q, onlyActive, onlyPublished]);

  const onAdd = () => navigate("/admin/announcements/new");
  const onEdit = (id: string) => navigate(`/admin/announcements/${id}`);

  const doDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await delOne(id).unwrap();
      toast.success("Duyuru silindi");
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
      const ids = rows.map((r) => r.id);
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
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Başlık/açıklama ile ara…" />
          </div>

          <div className="space-y-1">
            <Label>Yalnız Aktif</Label>
            <div className="flex h-10 items-center">
              <Switch checked={onlyActive} onCheckedChange={setOnlyActive} className="data-[state=checked]:bg-emerald-600" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Yalnız Yayında</Label>
            <div className="flex h-10 items-center">
              <Switch checked={onlyPublished} onCheckedChange={setOnlyPublished} className="data-[state=checked]:bg-indigo-600" />
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
            Yeni Duyuru
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
              <th className="px-3 py-2 text-left">Açıklama</th>
              <th className="px-3 py-2 text-left">Aktif</th>
              <th className="px-3 py-2 text-left">Yayında</th>
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
                <td className="px-3 py-2 text-gray-600 truncate max-w-[320px]">{r.description}</td>
                <td className="px-3 py-2">
                  <Switch
                    checked={!!r.is_active}
                    onCheckedChange={async (v) => {
                      setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, is_active: v } : x)));
                      try {
                        await patchOne({ id: r.id, patch: { is_active: v } }).unwrap();
                      } catch {
                        setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, is_active: !v } : x)));
                        toast.error("Aktiflik güncellenemedi");
                      }
                    }}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </td>
                <td className="px-3 py-2">
                  <Switch
                    checked={!!r.is_published}
                    onCheckedChange={async (v) => {
                      setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, is_published: v } : x)));
                      try {
                        await patchOne({ id: r.id, patch: { is_published: v } }).unwrap();
                      } catch {
                        setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, is_published: !v } : x)));
                        toast.error("Yayın durumu güncellenemedi");
                      }
                    }}
                    className="data-[state=checked]:bg-indigo-600"
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
        <Button onClick={saveOrder} disabled={reordering} className="gap-2">
          <SaveIcon className="h-4 w-4" />
          Sırayı Kaydet
        </Button>
      </div>

      {isFetching && <div className="text-xs text-gray-500">Yükleniyor…</div>}
    </div>
  );
}
