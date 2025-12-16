// =============================================================
// FILE: src/components/admin/AdminPanel/form/ReviewFormPage.tsx
// =============================================================
"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  useGetReviewAdminQuery,
  useCreateReviewAdminMutation,
  useUpdateReviewAdminMutation,
  useDeleteReviewAdminMutation,
} from "@/integrations/rtk/endpoints/admin/reviews_admin.endpoints";
import type { ReviewCreateInput } from "@/integrations/rtk/types/reviews";

export default function ReviewFormPage() {
  const navigate = useNavigate();
  const params = useParams();

  const paramId = (params as Record<string, string | undefined>)["id"] ?? params["*"] ?? "";
  const isNew = paramId === "new";
  const id = isNew ? "" : paramId;

  const { data, isFetching } = useGetReviewAdminQuery(id, { skip: isNew || !id });

  const [create, { isLoading: creating }] = useCreateReviewAdminMutation();
  const [update, { isLoading: updating }] = useUpdateReviewAdminMutation();
  const [removeRow, { isLoading: deleting }] = useDeleteReviewAdminMutation();

  const [form, setForm] = React.useState<ReviewCreateInput>({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    is_active: true,
    is_approved: false,
    display_order: 1,
  });

  React.useEffect(() => {
    if (!isNew && data) {
      setForm({
        name: data.name,
        email: data.email,
        rating: data.rating,
        comment: data.comment,
        is_active: data.is_active,
        is_approved: data.is_approved,
        display_order: data.display_order,
      });
    }
  }, [isNew, data]);

  const set =
    (k: keyof ReviewCreateInput) =>
      (e: any) => {
        const t = e?.target;
        let v = t?.value ?? e;
        if (k === "rating" || k === "display_order") v = Number(v);
        setForm((s) => ({ ...s, [k]: v }));
      };
  const setToggle = (k: keyof ReviewCreateInput) => (v: boolean) =>
    setForm((s) => ({ ...s, [k]: v }));

  const clampRating = (n: number) => Math.min(5, Math.max(1, Math.round(n || 0)));

  const onSave = async () => {
    const body: ReviewCreateInput = {
      ...form,
      rating: clampRating(Number(form.rating)),
      display_order: Number(form.display_order || 1),
    };
    try {
      if (isNew) {
        await create(body).unwrap();
        toast.success("Yorum oluşturuldu");
      } else {
        await update({ id, body }).unwrap();
        toast.success("Yorum güncellendi");
      }
      navigate("/admin/reviews", { replace: true });
    } catch (e: any) {
      toast.error(e?.data?.error || "Kaydetme hatası");
    }
  };

  const onDelete = async () => {
    if (!id) return;
    if (!window.confirm("Bu yorum silinsin mi?")) return;
    try {
      await removeRow(id).unwrap();
      toast.success("Silindi");
      navigate("/admin/reviews", { replace: true });
    } catch {
      toast.error("Silme işlemi başarısız");
    }
  };

  const saving = creating || updating || isFetching;

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="border-b border-gray-200 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">
            {isNew ? "Yeni Yorum" : "Yorum Düzenle"}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/admin/reviews")} disabled={saving}>
              Listeye Dön
            </Button>
            {!isNew && (
              <Button variant="destructive" onClick={onDelete} disabled={saving || deleting}>
                Sil
              </Button>
            )}
            <Button onClick={onSave} disabled={saving}>
              Kaydet
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Ad *</Label>
              <Input value={form.name || ""} onChange={set("name")} placeholder="Ad Soyad" />
            </div>

            <div className="grid gap-2">
              <Label>E-posta *</Label>
              <Input value={form.email || ""} onChange={set("email")} placeholder="email@site.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Puan (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating ?? 5}
                  onChange={set("rating")}
                />
              </div>
              <div className="grid gap-2">
                <Label>Sıra</Label>
                <Input
                  type="number"
                  value={form.display_order ?? 1}
                  onChange={set("display_order")}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Yorum</Label>
              <Textarea
                value={form.comment || ""}
                onChange={set("comment")}
                placeholder="Görüşünüz…"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2">
                <Switch checked={!!form.is_approved} onCheckedChange={setToggle("is_approved")} />
                <span>Onaylı</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={!!form.is_active} onCheckedChange={setToggle("is_active")} />
                <span>Aktif</span>
              </label>
            </div>
          </div>

          {/* RIGHT — Bilgi */}
          <div className="space-y-4">
            {!isNew && data && (
              <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
                <div>
                  <b>Oluşturma:</b> {new Date(data.created_at).toLocaleString()}
                </div>
                <div>
                  <b>Güncelleme:</b> {new Date(data.updated_at).toLocaleString()}
                </div>
              </div>
            )}
            <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-600">
              Not: Puan 1 ile 5 arasında olmalıdır. Kaydetme sırasında otomatik sınırlandırılır.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
