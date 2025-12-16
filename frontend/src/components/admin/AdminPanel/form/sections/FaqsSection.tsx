// =============================================================
// FILE: src/components/admin/products/sections/FaqsSection.tsx
// =============================================================
"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Section } from "./shared/Section";
import type { ProductFaqRow } from "@/integrations/rtk/types/products.rows";

/* admin hooks */
import {
  useAdminListProductFaqsQuery,
  useAdminCreateProductFaqMutation,
  useAdminUpdateProductFaqMutation,
  useAdminDeleteProductFaqMutation,
  useAdminToggleFaqActiveMutation,
  useAdminReplaceFaqsMutation, // toplu kaydet
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";

/** FE-local tip */
type FaqItem = {
  id?: string;
  question: string;
  answer: string;
  display_order?: number;
  is_active: boolean;
};

type Props = {
  productId?: string | undefined;
  faqs?: ProductFaqRow[] | undefined;
};

export function FaqsSection({ productId, faqs }: Props) {
  const [replaceFaqs, { isLoading: savingAll }] = useAdminReplaceFaqsMutation();
  const [createFaq, { isLoading: creating }] = useAdminCreateProductFaqMutation();
  const [updateFaq, { isLoading: updating }] = useAdminUpdateProductFaqMutation();
  const [deleteFaq, { isLoading: deleting }] = useAdminDeleteProductFaqMutation();
  const [toggleFaqActive, { isLoading: toggling }] = useAdminToggleFaqActiveMutation();

  /* Admin listeleme (productId varsa) */
  const {
    data: adminFaqs,
    refetch,
    isFetching,
    isError,
    error,
  } = useAdminListProductFaqsQuery({ id: productId! }, { skip: !productId });

  /* ---- state ---- */
  const [items, setItems] = React.useState<FaqItem[]>(() => {
    const src = faqs ?? [];
    return src.map((f) => ({
      ...(f.id ? { id: f.id } : {}),
      question: f.question,
      answer: f.answer,
      ...(typeof f.display_order === "number" ? { display_order: f.display_order } : {}),
      is_active: !!f.is_active,
    }));
  });

  /* Admin listesinden geldiğinde state’i yenile */
  React.useEffect(() => {
    if (!adminFaqs) return;
    setItems(
      adminFaqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        ...(typeof f.display_order === "number" ? { display_order: f.display_order } : {}),
        is_active: !!f.is_active,
      }))
    );
  }, [adminFaqs]);

  /* Dışarıdan faqs prop geldiyse (admin yoksa) onu da dinle */
  React.useEffect(() => {
    if (adminFaqs || !faqs) return;
    setItems(
      (faqs ?? []).map((f) => ({
        ...(f.id ? { id: f.id } : {}),
        question: f.question,
        answer: f.answer,
        ...(typeof f.display_order === "number" ? { display_order: f.display_order } : {}),
        is_active: !!f.is_active,
      }))
    );
  }, [faqs, adminFaqs]);

  const addRow = () =>
    setItems((arr) => [
      ...arr,
      { question: "", answer: "", display_order: (arr?.length ?? 0) + 1, is_active: true },
    ]);

  const removeRowLocal = (idx: number) =>
    setItems((arr) => arr.filter((_, i) => i !== idx));

  const validateRow = (f: FaqItem) => {
    if (!f.question?.trim()) {
      toast.error("Soru boş olamaz");
      return false;
    }
    if (!f.answer?.trim()) {
      toast.error("Cevap boş olamaz");
      return false;
    }
    return true;
  };

  const saveAll = async (): Promise<void> => {
    if (!productId) {
      toast.info("Önce ürünü kaydedin");
      return;
    }
    for (const f of items) {
      if (!validateRow(f)) return;
    }
    try {
      await replaceFaqs({
        id: productId,
        items: items.map((f) => ({
          ...(f.id ? { id: f.id } : {}),
          question: f.question,
          answer: f.answer,
          display_order: f.display_order ?? 0,
          is_active: f.is_active ? 1 : 0,
        })),
      }).unwrap();
      await refetch();
      toast.success("SSS toplu güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "SSS güncellenemedi");
    }
  };

  const saveOne = async (idx: number): Promise<void> => {
    if (!productId) {
      toast.info("Önce ürünü kaydedin");
      return;
    }
    const f = items[idx] as FaqItem;
    if (!validateRow(f)) return;

    try {
      if (f.id) {
        // UPDATE
        const updated = await updateFaq({
          id: productId,
          faqId: f.id,
          body: {
            question: f.question,
            answer: f.answer,
            display_order: f.display_order ?? 0,
            is_active: f.is_active ? 1 : 0,
          },
        }).unwrap();

        setItems((arr) =>
          arr.map((x, i) =>
            i === idx
              ? {
                id: updated.id,
                question: updated.question,
                answer: updated.answer,
                display_order: updated.display_order,
                is_active: !!updated.is_active,
              }
              : x
          )
        );
        await refetch();
        toast.success("SSS güncellendi");
      } else {
        // CREATE
        const created = await createFaq({
          id: productId,
          body: {
            question: f.question,
            answer: f.answer,
            display_order: f.display_order ?? 0,
            is_active: f.is_active ? 1 : 0,
          },
        }).unwrap();

        setItems((arr) =>
          arr.map((x, i) =>
            i === idx
              ? {
                id: created.id,
                question: created.question,
                answer: created.answer,
                display_order: created.display_order,
                is_active: !!created.is_active,
              }
              : x
          )
        );
        await refetch();
        toast.success("SSS eklendi");
      }
    } catch (e: any) {
      toast.error(e?.data?.message || "Kaydetme başarısız");
    }
  };

  const deleteOne = async (idx: number): Promise<void> => {
    const f = items[idx] as FaqItem;
    if (!productId) {
      toast.info("Önce ürünü kaydedin");
      return;
    }
    if (!f.id) {
      removeRowLocal(idx);
      return;
    }
    try {
      await deleteFaq({ id: productId, faqId: f.id }).unwrap();
      removeRowLocal(idx);
      await refetch();
      toast.success("SSS silindi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Silme başarısız");
    }
  };

  const toggleActive = async (idx: number, v: boolean): Promise<void> => {
    const rowId = items[idx]?.id;
    setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, is_active: v } : x)));
    if (!productId || !rowId) return;
    try {
      await toggleFaqActive({ id: productId, faqId: rowId, is_active: v ? 1 : 0 }).unwrap();
      await refetch();
    } catch {
      setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, is_active: !v } : x)));
      toast.error("Aktif/pasif güncellenemedi");
    }
  };

  const busy = savingAll || creating || updating || deleting || toggling || isFetching;

  return (
    <Section
      title="SSS (Sık Sorulan Sorular)"
      action={
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={addRow}
            disabled={busy}
            className="gap-2 bg-amber-600 text-white hover:bg-amber-700"
          >
            <Plus className="h-4 w-4" /> SSS Ekle
          </Button>
          <Button
            size="sm"
            onClick={saveAll}
            disabled={!productId || busy || items.length === 0}
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Check className="h-4 w-4" /> Toplu Kaydet
          </Button>
        </div>
      }
    >
      {isError && (
        <div className="mb-2 rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">
          FAQ listesi alınamadı. {String((error as any)?.data?.message ?? "")}
        </div>
      )}

      <div className="space-y-3">
        {items.map((f, idx) => (
          <div key={f.id ?? `new-${idx}`} className="space-y-2 rounded-md border p-3">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-9">
                <Label className="text-xs text-gray-500">Soru</Label>
                <Input
                  value={f.question}
                  onChange={(e) =>
                    setItems((arr) =>
                      arr.map((x, i) => (i === idx ? { ...x, question: e.target.value } : x))
                    )
                  }
                  placeholder="Soru..."
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-gray-500">Sıra</Label>
                <Input
                  value={String(f.display_order ?? 0)}
                  onChange={(e) =>
                    setItems((arr) =>
                      arr.map((x, i) =>
                        i === idx ? { ...x, display_order: Number(e.target.value) || 0 } : x
                      )
                    )
                  }
                  placeholder="#"
                />
              </div>
              <div className="col-span-1">
                <Label className="text-xs text-gray-500">Aktif</Label>
                <div className="flex h-10 items-center">
                  <Switch
                    checked={!!f.is_active}
                    onCheckedChange={(v) => toggleActive(idx, v)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">Cevap</Label>
              <Textarea
                rows={3}
                value={f.answer}
                onChange={(e) =>
                  setItems((arr) =>
                    arr.map((x, i) => (i === idx ? { ...x, answer: e.target.value } : x))
                  )
                }
                placeholder="Cevap..."
              />
            </div>

            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                onClick={() => deleteOne(idx)}
                disabled={busy}
                title="Sil"
                aria-label="Sil"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => saveOne(idx)}
                disabled={!productId || busy}
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                title="Satırı Kaydet"
                aria-label="Satırı Kaydet"
              >
                <Check className="h-4 w-4" /> Kaydet
              </Button>
            </div>
          </div>
        ))}

        {!items.length && (
          <div className="text-sm text-gray-500">Henüz SSS yok. “SSS Ekle” ile başlayın.</div>
        )}
      </div>
    </Section>
  );
}
