// =============================================================
// FILE: src/components/admin/products/sections/BasicsSection.tsx
// =============================================================
"use client";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Section } from "./shared/Section";

type CategoryLike = { id: string; name: string };
type SubcategoryLike = { id: string; name: string };

type Props = {
  title: string;
  setTitle: (v: string) => void;

  slug: string;
  setSlug: (v: string) => void;

  autoSlug: boolean;
  setAutoSlug: (v: boolean) => void;

  /** undefined gelebilir -> optional */
  categories?: CategoryLike[] | undefined;
  subcats?: SubcategoryLike[] | undefined;

  /** seçili id’ler undefined olabilir */
  selectedCategory?: string | undefined;
  setSelectedCategory: (v: string | undefined) => void;

  selectedSubCategory?: string | undefined;
  setSelectedSubCategory: (v: string | undefined) => void;

  /** price string olarak yönetiliyor */
  price: string;
  /** parent içinde currency normalize edip string veriyoruz */
  setPrice: (v: string) => void;

  /** 🔹 ÜRÜN KODU (NO:1 vs) */
  productCode: string;
  setProductCode: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  isActive: boolean | 0 | 1;
  setIsActive: (v: boolean) => void;

  isFeatured: boolean | 0 | 1;
  setIsFeatured: (v: boolean) => void;
};

export function BasicsSection(props: Props) {
  const {
    title,
    setTitle,
    slug,
    setSlug,
    autoSlug,
    setAutoSlug,
    categories,
    subcats,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    price,
    setPrice,
    productCode,
    setProductCode,
    description,
    setDescription,
    isActive,
    setIsActive,
    isFeatured,
    setIsFeatured,
  } = props;

  return (
    <Section title="Temel Bilgiler">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Başlık */}
        <div className="space-y-2">
          <Label>Başlık</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ürün başlığı"
          />
        </div>

        {/* Slug + otomatik switch */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label>Slug</Label>
            <label className="flex items-center gap-2 text-xs text-gray-500">
              <Switch
                checked={!!autoSlug}
                onCheckedChange={setAutoSlug}
                className="data-[state=checked]:bg-indigo-600"
              />
              otomatik
            </label>
          </div>
          <Input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setAutoSlug(false);
            }}
            placeholder="urun-slug"
          />
        </div>

        {/* Kategori */}
        <div className="space-y-2">
          <Label>Kategori</Label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedCategory ?? ""}
            onChange={(e) => {
              setSelectedCategory(e.target.value || undefined);
              setSelectedSubCategory(undefined);
            }}
          >
            <option value="">Seçiniz</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Alt kategori */}
        <div className="space-y-2">
          <Label>Alt Kategori</Label>
          <select
            disabled={!selectedCategory}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedSubCategory ?? ""}
            onChange={(e) => setSelectedSubCategory(e.target.value || undefined)}
          >
            <option value="">Seçiniz</option>
            {subcats?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fiyat */}
        <div className="space-y-2">
          <Label>Fiyat (TRY)</Label>
          <Input
            value={price}
            inputMode="decimal"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>

        {/* 🔹 ÜRÜN KODU */}
        <div className="space-y-2">
          <Label>Ürün Kodu</Label>
          <Input
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="Örn: NO:1"
          />
          <p className="text-xs text-gray-500">
            Müşteriye görünen ürün kodu (ör: NO:1, NO:12).
          </p>
        </div>

        {/* Durumlar */}
        <div className="space-y-2 sm:col-span-2">
          <Label>Durumlar</Label>
          <div className="flex flex-wrap items-center gap-6 rounded-md border p-3">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={!!isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-emerald-600"
              />
              Aktif
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={!!isFeatured}
                onCheckedChange={setIsFeatured}
                className="data-[state=checked]:bg-amber-500"
              />
              Anasayfa
            </label>
          </div>
        </div>

        {/* Açıklama */}
        <div className="sm:col-span-2 space-y-2">
          <Label>Açıklama</Label>
          <Textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </Section>
  );
}
