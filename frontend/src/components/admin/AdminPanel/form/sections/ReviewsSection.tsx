// =============================================================
// FILE: src/components/admin/products/sections/ReviewsSection.tsx
// =============================================================
"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Section } from "./shared/Section";
import { Check } from "lucide-react";
import { useAdminCreateProductReviewMutation } from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";
import type { ProductReviewRow } from "@/integrations/rtk/types/products.rows";

type Props = {
  productId?: string;
  reviews?: ProductReviewRow[] | undefined;
};

export function ReviewsSection({ productId, reviews }: Props) {
  const [createReviewMutation, { isLoading: savingReview }] =
    useAdminCreateProductReviewMutation();

  const [name, setName] = React.useState("");
  const [rating, setRating] = React.useState<number>(5);
  const [comment, setComment] = React.useState("");

  const createReview = async (): Promise<void> => {
    if (!productId) {
      toast.info("Önce ürünü kaydedin");
      return;
    }
    try {
      await createReviewMutation({
        id: productId,
        body: {
          customer_name: name || null,
          rating,
          comment: comment || null,
          is_active: 1,
        },
      }).unwrap();

      toast.success("Yorum eklendi", { description: "Onay bekliyor veya aktif." });
      setName("");
      setRating(5);
      setComment("");
    } catch (e: any) {
      toast.error(e?.data?.message || "Yorum eklenemedi");
    }
  };

  return (
    <Section
      title="Yorumlar"
      action={
        <Button
          onClick={createReview}
          disabled={!productId || savingReview}
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Check className="h-4 w-4" />
          {savingReview ? "Ekleniyor..." : "Yorum Ekle"}
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>İsim (opsiyonel)</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Müşteri adı" />
        </div>
        <div className="space-y-2">
          <Label>Değerlendirme</Label>
          <Input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Math.max(1, Math.min(5, Number(e.target.value) || 5)))}
          />
        </div>
        <div className="sm:col-span-1" />
        <div className="sm:col-span-3 space-y-2">
          <Label>Yorum</Label>
          <Textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Yorum..."
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {!productId ? (
          <div className="text-sm text-gray-500">Önce ürünü oluşturun.</div>
        ) : !reviews?.length ? (
          <div className="text-sm text-gray-500">Henüz yorum yok.</div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">{r.customer_name ?? "Anonim"}</div>
                <div className="text-amber-600">⭐ {r.rating}</div>
              </div>
              {r.comment && <div className="mt-2 text-sm text-gray-700">{r.comment}</div>}
              <div className="mt-2 text-xs text-gray-500">
                {new Date(r.review_date).toLocaleString("tr-TR")} {" • "}
                {r.is_active ? "Onaylı" : "Pasif"}
              </div>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}
