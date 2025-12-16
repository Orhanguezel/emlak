// =============================================================
// FILE: src/components/admin/AdminPanel/helpers.ts
// =============================================================
import categoriesJson from "./data/categories.json";
import subCatsJson from "./data/subCategories.json";
import type { Category, SubCategory } from "./types";

// JSON importlarını kesin tipe oturt + fallback
export const categories: Category[] =
  (categoriesJson as Category[]) ?? [];

export const subCategories: Record<string, SubCategory[]> =
  (subCatsJson as Record<string, SubCategory[]>) ?? {};

// Kategori label'ı
export const getCategoryLabel = (value: string): string =>
  categories.find((c) => c.value === value)?.label ?? value;

// Alt kategori label'ı (undefined guard ile)
export const getSubCategoryLabel = (value: string): string => {
  for (const key of Object.keys(subCategories)) {
    const list = subCategories[key] ?? []; // <-- guard
    const found = list.find((sc: SubCategory) => sc.value === value);
    if (found) return found.label;
  }
  return value;
};

// Admin alt-kategori -> web category eşlemesi
export const getWebCategoryFromSubCategory = (sub: string): string => {
  const map: Record<string, string> = {
    "tek-kisilik-mermer-mezar": "tek-kisilik-mermer",
    "tek-kisilik-granit-mezar": "tek-kisilik-granit",
    "iki-kisilik-mermer-mezar": "iki-kisilik-mermer",
    "iki-kisilik-granit-mezar": "iki-kisilik-granit",
    "katli-lahit-mezar": "lahit",
    "ozel-yapim-mezar": "ozel-yapim",
    "sutunlu-mezar": "sutunlu",
    "mermer-bas-tasi": "tek-kisilik-mermer",
    "granit-bas-tasi": "tek-kisilik-granit",
    "sutunlu-bas-tasi": "sutunlu",
    "mezar-susleri": "ozel-yapim",
    "sutun-modelleri": "sutunlu",
    "vazo-modelleri": "ozel-yapim",
    "diger-modeller": "ozel-yapim",
    "mevsimlik-bitki": "ciceklendirme",
    "surekli-bitki": "ciceklendirme",
    "topik-peyzaj": "ciceklendirme",
    "toprak-dolumu": "toprak-dolumu",
    "ozel-toprak-karisimi": "toprak-dolumu",
    "restorasyon": "toprak-dolumu",
  };
  return map[sub] ?? "tek-kisilik-mermer";
};

// Alt-kategori listesini güvenli döndür
export const getSubCategoriesForCategory = (cat: string): SubCategory[] =>
  subCategories?.[cat] ?? [];
