"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  useListFaqsAdminQuery,
  useRemoveFaqAdminMutation,
  useUpdateFaqAdminMutation,
} from "@/integrations/rtk/endpoints/admin/faqs_admin.endpoints";
import type { FaqListParams, Faq } from "@/integrations/rtk/types/faqs";

export default function TabsFAQ() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [activeOnly, setActiveOnly] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState<FaqListParams["orderBy"]>("display_order");
  const [order, setOrder] = React.useState<FaqListParams["order"]>("asc");

  const debouncedSearch = useDebounce(search, 350);

  const listParams: FaqListParams = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(category ? { category } : {}),
    ...(typeof activeOnly === "boolean" ? { active: activeOnly } : {}),
    ...(orderBy ? { orderBy } : {}),
    ...(order ? { order } : {}),
  };

  const { data: faqs = [], isFetching, refetch } = useListFaqsAdminQuery(listParams);
  const [removeFaq, { isLoading: deleting }] = useRemoveFaqAdminMutation();
  const [updateFaq, { isLoading: updating }] = useUpdateFaqAdminMutation();

  const handleNew = () => navigate("/admin/faqs/new");
  const handleEdit = (id: string) => navigate(`/admin/faqs/${id}`);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu SSS kaydını silmek istediğinize emin misiniz?")) return;
    try {
      await removeFaq(id).unwrap();
      toast.success("Silindi");
      refetch();
    } catch {
      toast.error("Silme işleminde hata");
    }
  };

  const toggleActive = async (row: Faq) => {
    try {
      await updateFaq({ id: row.id, patch: { is_active: !row.is_active } }).unwrap();
      refetch();
    } catch {
      toast.error("Güncelleme başarısız");
    }
  };

  const bumpOrder = async (row: Faq, delta: number) => {
    try {
      const next = Math.max(0, (row.display_order ?? 0) + delta);
      await updateFaq({ id: row.id, patch: { display_order: next } }).unwrap();
      refetch();
    } catch {
      toast.error("Sıra güncelleme başarısız");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
          <div className="sm:col-span-2">
            <Label htmlFor="faq-search">Ara</Label>
            <Input
              id="faq-search"
              placeholder="Soru, slug, kategori, cevap içinde ara…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="faq-category">Kategori</Label>
            <Input
              id="faq-category"
              placeholder="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch
              id="faq-active-only"
              checked={activeOnly}
              onCheckedChange={(v) => setActiveOnly(!!v)}
            />
            <Label htmlFor="faq-active-only">Yalnızca aktif</Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <select
              className="h-9 rounded-md border px-2 text-sm"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value as any)}
            >
              <option value="display_order">Sıra</option>
              <option value="created_at">Oluşturma</option>
              <option value="updated_at">Güncelleme</option>
            </select>
            <select
              className="h-9 rounded-md border px-2 text-sm"
              value={order}
              onChange={(e) => setOrder(e.target.value as any)}
            >
              <option value="asc">Artan</option>
              <option value="desc">Azalan</option>
            </select>
          </div>
          <Button onClick={handleNew} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Yeni SSS
          </Button>
        </div>
      </div>

      {/* Liste */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="border-b p-2">Sıra</th>
              <th className="border-b p-2">Soru</th>
              <th className="border-b p-2">Slug</th>
              <th className="border-b p-2">Kategori</th>
              <th className="border-b p-2">Aktif</th>
              <th className="border-b p-2 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr><td colSpan={6} className="p-4 text-center">Yükleniyor…</td></tr>
            ) : faqs.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center">Kayıt yok</td></tr>
            ) : (
              faqs.map((row) => (
                <tr key={row.id} className="odd:bg-gray-50/40">
                  <td className="border-b p-2">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => bumpOrder(row, -1)}>-</Button>
                      <span className="min-w-[2ch] text-center">{row.display_order ?? 0}</span>
                      <Button size="sm" variant="outline" onClick={() => bumpOrder(row, +1)}>+</Button>
                    </div>
                  </td>
                  <td className="border-b p-2">
                    <div className="line-clamp-2">{row.question}</div>
                  </td>
                  <td className="border-b p-2">{row.slug}</td>
                  <td className="border-b p-2">{row.category ?? "-"}</td>
                  <td className="border-b p-2">
                    <Switch checked={row.is_active} onCheckedChange={() => toggleActive(row)} />
                  </td>
                  <td className="border-b p-2">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(row.id)}>Düzenle</Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(row.id)}
                        disabled={deleting || updating}
                      >
                        Sil
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
