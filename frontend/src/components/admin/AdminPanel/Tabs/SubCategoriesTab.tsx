// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/SubCategoriesTab.tsx
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
  useListSubCategoriesAdminQuery,
  useDeleteSubCategoryAdminMutation,
  useUpdateSubCategoryAdminMutation,
  usePatchSubCategoryAdminMutation,
  useReorderSubCategoriesAdminMutation,
  useToggleSubActiveAdminMutation,
  useToggleSubFeaturedAdminMutation,
} from "@/integrations/rtk/endpoints/admin/sub_categories_admin.endpoints";

// (Kategori adını göstermek için opsiyonel liste)
import {
  useListCategoriesAdminQuery,
  type ListParams as CatListParams,
} from "@/integrations/rtk/endpoints/admin/categories_admin.endpoints";

import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";

type LocalRow = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
};

export default function SubCategoriesTab() {
  const navigate = useNavigate();

  // filters
  const [q, setQ] = React.useState<string>("");
  const [onlyActive, setOnlyActive] = React.useState<boolean>(false);
  const [onlyFeatured, setOnlyFeatured] = React.useState<boolean>(false);
  const [catId, setCatId] = React.useState<string>("");

  // exactOptionalPropertyTypes → property'yi ekle / hiç ekleme
  const params = React.useMemo(
    () => {
      const base = { sort: "display_order" as const, order: "asc" as const, limit: 200 };
      const p: any = { ...base };
      const trimmed = q.trim();
      if (trimmed) p.q = trimmed;
      if (onlyActive) p.is_active = true;
      if (onlyFeatured) p.is_featured = true;
      if (catId) p.category_id = catId;
      return p;
    },
    [q, onlyActive, onlyFeatured, catId]
  );

  const { data, isFetching, refetch } = useListSubCategoriesAdminQuery(params);
  const [rows, setRows] = React.useState<LocalRow[]>([]);

  // kategori isimleri için (opsiyonel)
  const catParams: CatListParams = { sort: "display_order", order: "asc", limit: 200 };
  const { data: cats } = useListCategoriesAdminQuery(catParams as any);
  const catMap = React.useMemo(() => {
    const m = new Map<string, string>();
    (cats ?? []).forEach((c: any) => m.set(String(c.id), String(c.name ?? c.slug ?? c.id)));
    return m;
  }, [cats]);

  // mutations
  const [delOne, { isLoading: deleting }] = useDeleteSubCategoryAdminMutation();
  const [updateOne, { isLoading: updating }] = useUpdateSubCategoryAdminMutation();
  const [patchOne] = usePatchSubCategoryAdminMutation();
  const [reorderBatch, { isLoading: reordering }] = useReorderSubCategoriesAdminMutation();
  const [toggleActive] = useToggleSubActiveAdminMutation();
  const [toggleFeatured] = useToggleSubFeaturedAdminMutation();

  // hydrate local rows
  React.useEffect(() => {
    if (!data) return;
    setRows(
      data.map((a) => ({
        id: a.id,
        category_id: a.category_id,
        name: a.name,
        slug: a.slug,
        image_url: a.image_url ?? null,
        is_active: !!a.is_active,
        is_featured: !!a.is_featured,
        display_order: Number(a.display_order || 0),
      }))
    );
  }, [data]);

  const onAdd = () => navigate("/admin/subcategories/new");
  const onEdit = (id: string) => navigate(`/admin/subcategories/${id}`);

  const doDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await delOne(id).unwrap();
      toast.success("Alt kategori silindi");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Silme başarısız");
    }
  };

  const move = (idx: number, dir: -1 | 1) => {
    setRows((arr) => {
      const next = [...arr];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return arr;
      [next[idx], next[j]] = [next[j]!, next[idx]!];
      return next.map((r, i) => ({ ...r, display_order: i + 1 }));
    });
  };

  const saveOrder = async () => {
    try {
      const items = rows.map((r, i) => ({
        id: r.id,
        display_order: Number(r.display_order ?? i + 1),
      }));
      await reorderBatch(items).unwrap();
      toast.success("Sıralama güncellendi");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Sıralama kaydedilemedi");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:items-end max-w-5xl">
          <div className="space-y-1">
            <Label>Ara</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ad/slug ile ara…" />
          </div>

          <div className="space-y-1">
            <Label>Kategori</Label>
            <select
              className="h-10 w-full rounded border px-2"
              value={catId}
              onChange={(e) => setCatId(e.target.value)}
            >
              <option value="">Tümü</option>
              {(cats ?? []).map((c: any) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name ?? c.slug ?? c.id}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label>Yalnızca Aktif</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={onlyActive}
                onCheckedChange={setOnlyActive}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Yalnızca Öne Çıkan</Label>
            <div className="flex h-10 items-center">
              <Switch
                checked={onlyFeatured}
                onCheckedChange={setOnlyFeatured}
                className="data-[state=checked]:bg-amber-500"
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
                Yeni Alt Kategori
              </Button>
            </div>
          </div>
        </div>

        <div className="sm:self-end">
          <Button
            onClick={saveOrder}
            disabled={reordering || !rows.length}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Sırayı Kaydet
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Görsel</th>
              <th className="px-3 py-2 text-left">Ad</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Kategori</th>
              <th className="px-3 py-2 text-left">Aktif</th>
              <th className="px-3 py-2 text-left">Öne Çıkan</th>
              <th className="px-3 py-2 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => move(idx, -1)}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => move(idx, +1)}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <input
                      className="w-14 rounded border px-2 py-1 text-center"
                      value={String(r.display_order)}
                      onChange={(e) =>
                        setRows((arr) =>
                          arr.map((x, i) =>
                            i === idx ? { ...x, display_order: Number(e.target.value) || 0 } : x
                          )
                        )
                      }
                    />
                  </div>
                </td>

                <td className="px-3 py-2">
                  {r.image_url ? (
                    <img
                      src={r.image_url}
                      alt={r.name}
                      className="h-10 w-14 rounded object-cover border"
                    />
                  ) : (
                    <div className="h-10 w-14 rounded border bg-gray-50" />
                  )}
                </td>

                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2 text-gray-500">{r.slug}</td>
                <td className="px-3 py-2">{catMap.get(r.category_id) ?? r.category_id}</td>

                <td className="px-3 py-2">
                  <Switch
                    checked={!!r.is_active}
                    onCheckedChange={async (v) => {
                      setRows((arr) => arr.map((x, i) => (i === idx ? { ...x, is_active: v } : x)));
                      try {
                        await toggleActive({ id: r.id, is_active: v }).unwrap();
                      } catch {
                        setRows((arr) =>
                          arr.map((x, i) => (i === idx ? { ...x, is_active: !v } : x))
                        );
                        toast.error("Aktiflik güncellenemedi");
                      }
                    }}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </td>

                <td className="px-3 py-2">
                  <Switch
                    checked={!!r.is_featured}
                    onCheckedChange={async (v) => {
                      setRows((arr) => arr.map((x, i) => (i === idx ? { ...x, is_featured: v } : x)));
                      try {
                        await toggleFeatured({ id: r.id, is_featured: v }).unwrap();
                      } catch {
                        setRows((arr) =>
                          arr.map((x, i) => (i === idx ? { ...x, is_featured: !v } : x))
                        );
                        toast.error("Öne çıkarma durumu güncellenemedi");
                      }
                    }}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </td>

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

            {!isFetching && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-gray-500">
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
