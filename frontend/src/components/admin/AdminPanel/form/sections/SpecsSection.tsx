// =============================================================
// FILE: src/components/admin/products/sections/SpecsSection.tsx
// =============================================================
"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Section } from "./shared/Section";

/* admin hooks */
import {
  useAdminListProductSpecsQuery,
  useAdminCreateProductSpecMutation,
  useAdminUpdateProductSpecMutation,
  useAdminDeleteProductSpecMutation,
  useAdminReplaceSpecsMutation,
} from "@/integrations/rtk/endpoints/admin/products_admin.endpoints";

import type { ProductSpecRow } from "@/integrations/rtk/types/products.rows";

type Spec = {
  id?: string;
  name: string;
  value: string;
  category: "custom" | "physical" | "material" | "service";
  order_num?: number;
  productId?: string;
  specs?: ProductSpecRow[] | undefined;

};

type Props = {
  productId?: string;
  /** Admin listeleme yoksa fallback olarak kullanılabilir */
  specs?: ProductSpecRow[] | undefined;
};

export function SpecsSection({ productId, specs }: Props) {
  const { data: adminSpecs } = useAdminListProductSpecsQuery(
    { id: productId! },
    { skip: !productId }
  );

  const [createSpec, { isLoading: creating }] = useAdminCreateProductSpecMutation();
  const [updateSpec, { isLoading: updating }] = useAdminUpdateProductSpecMutation();
  const [deleteSpec, { isLoading: deleting }] = useAdminDeleteProductSpecMutation();
  const [replaceSpecs, { isLoading: savingAll }] = useAdminReplaceSpecsMutation();

  const fromRow = (r: ProductSpecRow): Spec => ({
    id: r.id,
    name: r.name,
    value: r.value,
    category: r.category as Spec["category"],
    order_num: r.order_num,
  });

  const initFrom = (src: Array<Spec | ProductSpecRow>): Spec[] =>
    src.map((s: any) => ({
      ...(s.id ? { id: s.id } : {}),
      name: s.name,
      value: s.value,
      category: s.category,
      ...(typeof s.order_num === "number" ? { order_num: s.order_num } : {}),
    }));

  const [items, setItems] = React.useState<Spec[]>(() =>
    initFrom((specs ?? []).map(fromRow))
  );

  // Admin verisi gelirse onu kullan
  React.useEffect(() => {
    if (adminSpecs) setItems(initFrom(adminSpecs));
  }, [adminSpecs]);

  // Admin yoksa dışarıdan verilen props güncellenirse
  React.useEffect(() => {
    if (!adminSpecs && specs) setItems(initFrom(specs.map(fromRow)));
  }, [specs, adminSpecs]);

  const addRow = () =>
    setItems((arr) => [
      ...arr,
      { name: "", value: "", category: "custom", order_num: (arr?.length ?? 0) + 1 },
    ]);

  const removeRowLocal = (idx: number) => setItems((arr) => arr.filter((_, i) => i !== idx));

  const saveAll = async (): Promise<void> => {
    if (!productId) {
      toast.info("Önce ürünü kaydedin");
      return;
    }
    try {
      await replaceSpecs({
        id: productId,
        items: items.map((s) => ({
          ...(s.id ? { id: s.id } : {}),
          name: s.name,
          value: s.value,
          category: s.category,
          order_num: s.order_num ?? 0,
        })),
      }).unwrap();
      toast.success("Özellikler toplu güncellendi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Özellikler güncellenemedi");
    }
  };

  const saveOne = async (idx: number): Promise<void> => {
    if (!productId) {
      toast.info("Önce ürünü kaydedin");
      return;
    }
    const s = items[idx] as Spec;
    try {
      if (s.id) {
        const updated = await updateSpec({
          id: productId,
          specId: s.id,
          body: {
            name: s.name,
            value: s.value,
            category: s.category,
            order_num: s.order_num ?? 0,
          },
        }).unwrap();
        setItems((arr) =>
          arr.map((x, i) =>
            i === idx
              ? {
                id: updated.id,
                name: updated.name,
                value: updated.value,
                category: updated.category as Spec["category"],
                order_num: updated.order_num,
              }
              : x
          )
        );
        toast.success("Özellik güncellendi");
      } else {
        const created = await createSpec({
          id: productId,
          body: {
            name: s.name,
            value: s.value,
            category: s.category,
            order_num: s.order_num ?? 0,
          },
        }).unwrap();
        setItems((arr) =>
          arr.map((x, i) =>
            i === idx
              ? {
                id: created.id,
                name: created.name,
                value: created.value,
                category: created.category as Spec["category"],
                order_num: created.order_num,
              }
              : x
          )
        );
        toast.success("Özellik eklendi");
      }
    } catch (e: any) {
      toast.error(e?.data?.message || "Kaydetme başarısız");
    }
  };

  const deleteOne = async (idx: number): Promise<void> => {
    const s = items[idx] as Spec;
    if (!productId) {
      toast.info("Önce ürünü kaydedin");
      return;
    }
    if (!s.id) {
      removeRowLocal(idx);
      return;
    }
    try {
      await deleteSpec({ id: productId, specId: s.id }).unwrap();
      removeRowLocal(idx);
      toast.success("Özellik silindi");
    } catch (e: any) {
      toast.error(e?.data?.message || "Silme başarısız");
    }
  };

  const busy = creating || updating || deleting || savingAll;

  return (
    <Section
      title="Teknik Özellikler"
      action={
        <div className="flex gap-2">
          <Button size="sm" onClick={addRow} className="gap-2 bg-amber-600 text-white hover:bg-amber-700">
            <Plus className="h-4 w-4" /> Özellik Ekle
          </Button>
          <Button
            size="sm"
            onClick={saveAll}
            disabled={!productId || busy}
            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Check className="h-4 w-4" /> Toplu Kaydet
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {items.map((s, idx) => (
          <div key={s.id ?? `new-${idx}`} className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-3">
              <Label className="text-xs text-gray-500">Ad</Label>
              <Input
                placeholder="Ad (örn: Malzeme)"
                value={s.name}
                onChange={(e) =>
                  setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                }
              />
            </div>
            <div className="col-span-5">
              <Label className="text-xs text-gray-500">Değer</Label>
              <Input
                placeholder="Değer (örn: Siyah granit)"
                value={s.value}
                onChange={(e) =>
                  setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, value: e.target.value } : x)))
                }
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-gray-500">Kategori</Label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                value={s.category}
                onChange={(e) =>
                  setItems((arr) =>
                    arr.map((x, i) =>
                      i === idx ? { ...x, category: e.target.value as Spec["category"] } : x
                    )
                  )
                }
              >
                <option value="custom">custom</option>
                <option value="physical">physical</option>
                <option value="material">material</option>
                <option value="service">service</option>
              </select>
            </div>
            <div className="col-span-1">
              <Label className="text-xs text-gray-500">Sıra</Label>
              <Input
                placeholder="#"
                value={String(s.order_num ?? 0)}
                onChange={(e) =>
                  setItems((arr) =>
                    arr.map((x, i) =>
                      i === idx ? { ...x, order_num: Number(e.target.value) || 0 } : x
                    )
                  )
                }
              />
            </div>
            <div className="col-span-1 flex items-center justify-end gap-1">
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
          <div className="text-sm text-gray-500">
            Henüz özellik yok. “Özellik Ekle” ile başlayın.
          </div>
        )}
      </div>
    </Section>
  );
}
