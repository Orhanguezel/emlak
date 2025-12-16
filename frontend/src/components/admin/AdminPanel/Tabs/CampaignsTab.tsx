// =============================================================
// FILE: src/components/admin/AdminPanel/Tabs/CampaignsTab.tsx
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
  useListCampaignsAdminQuery,
  useDeleteCampaignAdminMutation,
  useUpdateCampaignAdminMutation,
} from "@/integrations/rtk/endpoints/admin/campaigns_admin.endpoints";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { ThumbById } from "@/components/admin/AdminPanel/form/sections/shared/ThumbById";

type Row = {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  image_effective_url?: string | null;
  image_url?: string | null;
  storage_asset_id?: string | null; // ✅ eklendi
  alt?: string | null;
  updated_at?: string;
  created_at?: string;
};

export default function CampaignsTab() {
  const navigate = useNavigate();

  const [q, setQ] = React.useState("");
  const [onlyActive, setOnlyActive] = React.useState<boolean>(false);

  const { data, isFetching, refetch } = useListCampaignsAdminQuery({
    limit: 200,
    sort: "updated_at",
    order: "desc",
  });
  const [rows, setRows] = React.useState<Row[]>([]);

  const [delOne, { isLoading: deleting }] = useDeleteCampaignAdminMutation();
  const [patchOne] = useUpdateCampaignAdminMutation();

  React.useEffect(() => {
    if (!data) return;

    setRows(
      data.map((c) => {
        const base: Row = {
          id: c.id,
          title: c.title,
          description: c.description,
          is_active: !!c.is_active,
          image_effective_url: c.image_effective_url ?? null,
          image_url: c.image_url ?? null,
          storage_asset_id: (c as any).storage_asset_id ?? null, // ✅ map’te de eklendi
          alt: c.alt ?? null,
        };

        return {
          ...base,
          ...(c.updated_at ? { updated_at: c.updated_at } : {}),
          ...(c.created_at ? { created_at: c.created_at } : {}),
        };
      })
    );
  }, [data]);

  const visible = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (onlyActive && !r.is_active) return false;
      if (!t) return true;
      return (
        r.title.toLowerCase().includes(t) ||
        r.description.toLowerCase().includes(t) ||
        (r.updated_at ?? "").toLowerCase().includes(t) ||
        (r.created_at ?? "").toLowerCase().includes(t)
      );
    });
  }, [rows, q, onlyActive]);

  const onAdd = () => navigate("/admin/campaigns/new");
  const onEdit = (id: string) => navigate(`/admin/campaigns/${id}`);

  const doDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await delOne(id).unwrap();
      toast.success("Kampanya silindi");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Silme başarısız");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-end max-w-3xl">
          <div className="space-y-1">
            <Label>Ara</Label>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Başlık/açıklama ile ara…"
            />
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
            <Label>&nbsp;</Label>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
              <Button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Kampanya
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
              <th className="px-3 py-2 text-left">Açıklama</th>
              <th className="px-3 py-2 text-left">Aktif</th>
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
                      alt={r.alt || r.title}
                      className="h-10 w-14 rounded object-cover border"
                      loading="lazy"
                    />
                  ) : r.storage_asset_id ? (
                    <div className="h-10 w-14">
                      <ThumbById id={r.storage_asset_id} />
                    </div>
                  ) : (
                    <div className="h-10 w-14 rounded border bg-gray-50" />
                  )}
                </td>

                <td className="px-3 py-2">{r.title}</td>
                <td className="px-3 py-2 text-gray-600 truncate max-w-[280px]">
                  {r.description}
                </td>
                <td className="px-3 py-2">
                  <Switch
                    checked={!!r.is_active}
                    onCheckedChange={async (v) => {
                      setRows((arr) =>
                        arr.map((x) => (x.id === r.id ? { ...x, is_active: v } : x))
                      );
                      try {
                        await patchOne({ id: r.id, body: { is_active: v } }).unwrap();
                      } catch {
                        setRows((arr) =>
                          arr.map((x) => (x.id === r.id ? { ...x, is_active: !v } : x))
                        );
                        toast.error("Aktiflik güncellenemedi");
                      }
                    }}
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
