// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/PagesTab.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  useListCustomPagesAdminQuery,
  useDeleteCustomPageAdminMutation,
  useUpdateCustomPageAdminMutation,
} from "@/integrations/rtk/endpoints/admin/custom_pages_admin.endpoints";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

type LocalRow = {
  id: string;
  title: string;
  slug: string;
  image_effective_url: string | null;
  image_url: string | null;
  alt: string | null;
  is_published: boolean;
  created_at?: string | undefined;
  updated_at?: string | undefined;
};


export default function PagesTab() {
  const navigate = useNavigate();

  const [q, setQ] = React.useState<string>("");
  const [onlyPublished, setOnlyPublished] = React.useState<boolean>(false);

  // BE limit ≤ 200
  const { data, isFetching, refetch } = useListCustomPagesAdminQuery({ limit: 200 });
  const [rows, setRows] = React.useState<LocalRow[]>([]);

  const [delOne, { isLoading: deleting }] = useDeleteCustomPageAdminMutation();
  const [patchOne] = useUpdateCustomPageAdminMutation(); // PATCH partial

  React.useEffect(() => {
    if (!data) return;
    setRows(
      data.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        image_effective_url: p.image_effective_url ?? null,
        image_url: p.image_url ?? null,
        alt: p.alt ?? null,
        is_published: !!p.is_published,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }))
    );
  }, [data]);

  const onAdd = () => navigate("/admin/pages/new");
  const onEdit = (id: string) => navigate(`/admin/pages/${id}`);

  const doDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await delOne(id).unwrap();
      toast.success("Sayfa silindi");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Silme başarısız");
    }
  };

  const visible = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (onlyPublished && !r.is_published) return false;
      if (!t) return true;
      return (
        r.title.toLowerCase().includes(t) ||
        r.slug.toLowerCase().includes(t) ||
        (r.created_at ?? "").toLowerCase().includes(t) ||
        (r.updated_at ?? "").toLowerCase().includes(t)
      );
    });
  }, [rows, q, onlyPublished]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-end max-w-3xl">
          <div className="space-y-1">
            <Label>Ara</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Başlık/slug ile ara…" />
          </div>

          <div className="space-y-1">
            <Label>Yalnızca Yayında</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={onlyPublished}
                onCheckedChange={setOnlyPublished}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>&nbsp;</Label>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
              <Button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Sayfa
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Görsel</th>
              <th className="px-3 py-2 text-left">Başlık</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Yayında</th>
              <th className="px-3 py-2 text-left">Güncellendi</th>
              <th className="px-3 py-2 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">
                  {(r.image_effective_url ?? r.image_url) ? (
                    <img
                      src={r.image_effective_url ?? (r.image_url as string)}
                      alt={r.alt ?? r.title}
                      className="h-10 w-14 rounded object-cover border"
                    />
                  ) : (
                    <div className="h-10 w-14 rounded border bg-gray-50" />
                  )}
                </td>
                <td className="px-3 py-2">{r.title}</td>
                <td className="px-3 py-2 text-gray-500">{r.slug}</td>
                <td className="px-3 py-2">
                  <Switch
                    checked={!!r.is_published}
                    onCheckedChange={async (v) => {
                      setRows((arr) => arr.map((x) => (x.id === r.id ? { ...x, is_published: v } : x)));
                      try {
                        await patchOne({ id: r.id, body: { is_published: v } }).unwrap();
                      } catch {
                        setRows((arr) =>
                          arr.map((x) => (x.id === r.id ? { ...x, is_published: !v } : x))
                        );
                        toast.error("Yayın durumu güncellenemedi");
                      }
                    }}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </td>
                <td className="px-3 py-2">{r.updated_at ? new Date(r.updated_at).toLocaleString() : "—"}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" onClick={() => onEdit(r.id)} title="Düzenle">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => doDelete(r.id)}
                      disabled={deleting}
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4 text-rose-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {!isFetching && visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFetching && <div className="text-xs text-gray-500">Yükleniyor…</div>}
    </div>
  );
}
