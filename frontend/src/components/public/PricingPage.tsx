// =============================================================
// FILE: src/components/public/PricingPage.tsx
// =============================================================
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useActiveSlidesRtk } from "../../data/sliderData";
import backgroundImage from "figma:asset/0a9012ca17bfb48233c0877277b7fb8427a12d4c.png";

// RTK hooks (PUBLIC)
import { useListProductsQuery } from "@/integrations/rtk/endpoints/products.endpoints";
import { useListCategoriesQuery } from "@/integrations/rtk/endpoints/categories.endpoints";
import { useListSubCategoriesQuery } from "@/integrations/rtk/endpoints/sub_categories.endpoints";

import type { Product as ApiProduct } from "@/integrations/rtk/types/products.rows";
import type { Category } from "@/integrations/rtk/types/categories.rows";
import type { SubCategory } from "@/integrations/rtk/types/sub_categories.rows";

/* =========================== helpers =========================== */

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop";

const normalize = (s: unknown): string =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    // @ts-ignore – Unicode diacritics
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/_/g, "-");

function normalizeSpecs(specs: unknown): Record<string, string> {
  if (!specs) return {};
  if (typeof specs === "string") {
    try {
      return normalizeSpecs(JSON.parse(specs));
    } catch {
      return {};
    }
  }
  if (Array.isArray(specs)) {
    const out: Record<string, string> = {};
    for (const it of specs as any[]) {
      if (it && typeof it === "object" && (it as any).name) {
        const v = (it as any).value;
        out[String((it as any).name)] = Array.isArray(v)
          ? v.join(", ")
          : v != null
          ? String(v)
          : "";
      }
    }
    return out;
  }
  if (typeof specs === "object") {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(specs as Record<string, any>)) {
      if (v == null) continue;
      out[k] = Array.isArray(v) ? v.join(", ") : String(v);
    }
    return out;
  }
  return {};
}

type SpecDict = Record<string, string>;

const toSpecDict = (specs: unknown): SpecDict => {
  return normalizeSpecs(specs);
};

const getSpec = (d: SpecDict, keys: string[]): string => {
  for (const k of keys) {
    const v = d[k] ?? d[k.toLowerCase()] ?? d[k.replace(/\s+/g, "")];
    if (v) return v;
  }
  return "";
};

const pickImage = (p: any): string => {
  // images array
  if (Array.isArray(p.images) && p.images.length > 0) {
    const i0 = p.images[0];
    if (typeof i0 === "string") return i0;
    if (i0?.image_effective_url) return i0.image_effective_url;
    if (i0?.image_url) return i0.image_url;
  }

  const img =
    p.image_effective_url ||
    p.image_url ||
    p.cover_url ||
    p.main_image ||
    null;

  if (typeof img === "string" && img.trim()) return img;
  return PLACEHOLDER_IMG;
};

const normalizePrice = (r: any): string => {
  const p = r?.price;
  const pm = r?.price_minor;

  // Eğer string olarak geliyorsa, içindeki TL / ₺ vs. temizle, kendi formatımızı bas
  if (typeof p === "string") {
    const cleaned = p
      .replace("₺", "")
      .replace(/TL/gi, "")
      .trim();

    if (cleaned) {
      return `${cleaned} TL`;
    }
  }

  // price: number
  if (typeof p === "number" && Number.isFinite(p) && p > 0) {
    const v = Math.round(p);
    // Örn: 26400 TL
    return `${v.toString()} TL`;
  }

  // price_minor: kuruş cinsinden (opsiyonel)
  if (typeof pm === "number" && Number.isFinite(pm) && pm > 0) {
    const tl = Math.round(pm / 100);
    return `${tl.toString()} TL`;
  }

  return "Fiyat İçin Arayınız";
};

// Kök kategori: "Mezar Modelleri" / "Mezar Baş Taşı Modelleri"
const isTombstoneModelsCategory = (cat: any): boolean => {
  const nName = normalize(cat?.name);
  const nSlug = normalize(cat?.slug);
  return (
    nName.includes("mezar-modelleri") ||
    nSlug.includes("mezar-modelleri") ||
    nName.includes("mezar-bas-tasi-modelleri") ||
    nSlug.includes("mezar-bas-tasi-modelleri") ||
    nName.includes("mezar-bas-tasi") ||
    nSlug.includes("mezar-bas-tasi")
  );
};

/* =========================== types =========================== */

interface PricingPageProps {
  onNavigate: (page: string) => void;
  /** App.tsx içinde onProductDetail(slug: string) olarak kullanılıyor */
  onProductDetail?: (productSlug: string) => void;
}

interface TombstoneModel {
  /** Gerçek id / uuid vs. – sadece key için kullanıyoruz */
  id: string;
  /** URL’de kullanılacak slug */
  slug: string;
  name: string;
  categoryId: string; // gerçek category_id (string)
  subCategory?: string; // sub-category slug
  material: string;
  price: string;
  image: string;
  description: string;
  featured?: boolean;
  productCode: string;
  dimensions?: string;
  weight?: string;
  thickness?: string;
  finish?: string;
  warranty?: string;
  installationTime?: string;
}

/* ======================= mappers (RTK -> UI) ======================= */

function productToModel(
  p: ApiProduct,
  categoryNameById: Record<string, string>,
  subCategorySlugById: Record<string, string>
): TombstoneModel {
  const anyP = p as any;

  const realId = String(anyP.id ?? anyP.uuid ?? Math.random());
  const slug = String(
    anyP.slug ??
      anyP.slug_tr ??
      anyP.slug_en ??
      anyP.slug_de ??
      anyP.product_code ??
      realId
  ).trim();

  const catId = String(anyP.category_id ?? "");
  const subId = String(anyP.sub_category_id ?? "");
  const subSlug = subCategorySlugById[subId] || "";
  const catName = (categoryNameById[catId] || "").toLowerCase();

  // specs -> dict
  const specs = toSpecDict(anyP.specifications);
  const dimensions = getSpec(specs, ["dimensions", "ölçü", "olcu", "boyut", "size"]);
  const weight = getSpec(specs, ["weight", "ağırlık", "agirlik"]);
  const thickness = getSpec(specs, ["thickness", "kalınlık", "kalinlik"]);
  const finish = getSpec(specs, [
    "surfaceFinish",
    "finish",
    "yüzey",
    "surface",
    "polisaj",
    "polish",
  ]);
  const warranty = getSpec(specs, ["warranty", "garanti"]);
  const installationTime = getSpec(specs, [
    "installationTime",
    "installationtime",
    "kurulum süresi",
    "montaj süresi",
    "montaj",
  ]);

  const material = catName.includes("granit")
    ? "Granit"
    : catName.includes("mermer")
    ? "Mermer"
    : "Ürün";

  const priceText = normalizePrice(anyP);
  const primaryImage = pickImage(anyP);

  return {
    id: realId,
    slug,
    name: String(anyP.title ?? anyP.product_code ?? "Ürün Adı Yok"),
    categoryId: catId,
    ...(subSlug ? { subCategory: subSlug } : {}),
    material,
    price: priceText,
    image: primaryImage,
    description: String(anyP.description ?? ""),
    featured: Boolean(anyP.is_featured),
    productCode: String(anyP.product_code ?? ""),
    ...(dimensions ? { dimensions } : {}),
    ...(weight ? { weight } : {}),
    ...(thickness ? { thickness } : {}),
    ...(finish ? { finish } : {}),
    ...(warranty ? { warranty } : {}),
    ...(installationTime ? { installationTime } : {}),
  };
}

/* ============================= component ============================= */

export function PricingPage({ onNavigate, onProductDetail }: PricingPageProps) {
  // Bu sayfa sadece MEZAR MODELLERİ için
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("tümü");

  // HERO slider
  const { slides: heroSlides, isError: isSlidesError } = useActiveSlidesRtk();
  const [currentSlide, setCurrentSlide] = useState(0);

  // === RTK DATA ===
  const { data: categoriesRes = [], refetch: refetchCats } =
    useListCategoriesQuery({
      is_active: true,
      sort: "display_order",
      order: "asc",
      limit: 200,
    });

  const { data: subCategoriesRes = [], refetch: refetchSubs } =
    useListSubCategoriesQuery({
      is_active: true,
      sort: "display_order",
      order: "asc",
      limit: 200,
    });

  const { data: productsRes = [], refetch: refetchProducts } =
    useListProductsQuery({
      is_active: 1,
      limit: 200,
      sort: "created_at",
      order: "desc",
    });

  // Root kategori: Mezar Modelleri / Mezar Baş Taşı Modelleri
  const tombstoneCategory = useMemo(() => {
    const cats = categoriesRes as Category[];

    // 1) slug "mezar-modelleri"
    const directSlug = cats.find(
      (c) => normalize(c.slug) === "mezar-modelleri"
    );
    if (directSlug) return directSlug;

    // 2) isim/slug içerisinde "mezar modelleri"
    const byName = cats.find((c) =>
      normalize(c.name).includes("mezar-modelleri")
    );
    if (byName) return byName;

    // 3) Mezar Baş Taşı Modelleri (ModelsPage ile uyum)
    const base = cats.find(isTombstoneModelsCategory);
    if (base) return base;

    // 4) fallback – isim/slug "mezar" geçen ilk kategori
    const fallback =
      cats.find((c) => normalize(c.slug).includes("mezar")) ||
      cats.find((c) => normalize(c.name).includes("mezar")) ||
      null;

    return fallback;
  }, [categoriesRes]);

  const tombstoneCategoryId = tombstoneCategory
    ? String(tombstoneCategory.id)
    : null;

  // Map'ler
  const categoryNameById = useMemo(() => {
    const m: Record<string, string> = {};
    (categoriesRes as Category[]).forEach((c) => {
      m[String(c.id)] = c.name;
    });
    return m;
  }, [categoriesRes]);

  const subCategorySlugById = useMemo(() => {
    const m: Record<string, string> = {};
    (subCategoriesRes as SubCategory[]).forEach((s) => {
      m[String(s.id)] = s.slug;
    });
    return m;
  }, [subCategoriesRes]);

  // Sadece MEZAR MODELLERİ kategorisindeki ürünleri UI modeline çevir
  const productModels: TombstoneModel[] = useMemo(() => {
    if (!Array.isArray(productsRes)) return [];

    const rawProducts: ApiProduct[] =
      tombstoneCategoryId != null
        ? (productsRes as ApiProduct[]).filter(
            (p: any) =>
              String(p.category_id ?? p.categoryId ?? "") ===
              tombstoneCategoryId
          )
        : (productsRes as ApiProduct[]); // fallback: tüm ürünler

    return rawProducts.map((p) =>
      productToModel(p, categoryNameById, subCategorySlugById)
    );
  }, [productsRes, categoryNameById, subCategorySlugById, tombstoneCategoryId]);

  // Mezar Modelleri alt kategorileri
  const tombstoneSubCategories = useMemo(() => {
    if (!tombstoneCategory) return [] as SubCategory[];
    return (subCategoriesRes as SubCategory[]).filter(
      (s) => String(s.category_id) === String(tombstoneCategory.id)
    );
  }, [subCategoriesRes, tombstoneCategory]);

  // Sub-category bazlı ürün sayıları
  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    productModels.forEach((m) => {
      if (!m.subCategory) return;
      counts[m.subCategory] = (counts[m.subCategory] || 0) + 1;
    });
    return counts;
  }, [productModels]);

  // UI kategorileri: Tümü + mezar modelleri alt kategorileri
  const uiCategories = useMemo(
    () => [
      {
        id: "tümü",
        name: "Tüm Modeller",
        count: productModels.length,
      },
      ...tombstoneSubCategories.map((s) => ({
        id: s.slug,
        name: s.name,
        count: subCategoryCounts[s.slug] || 0,
      })),
    ],
    [productModels.length, tombstoneSubCategories, subCategoryCounts]
  );

  // Filtrelenmiş modeller
  const filteredModels = useMemo(() => {
    if (selectedSubCategory === "tümü") return productModels;
    return productModels.filter((m) => m.subCategory === selectedSubCategory);
  }, [productModels, selectedSubCategory]);

  // Öne çıkanlar
  const featuredModels: TombstoneModel[] = useMemo(() => {
    const featured = productModels.filter((m) => m.featured);
    const source = featured.length ? featured : productModels;
    return source.slice(0, 12);
  }, [productModels]);

  // HERO slider autoplay & preload
  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    const t = window.setInterval(
      () => setCurrentSlide((p) => (p + 1) % heroSlides.length),
      5000
    );
    return () => window.clearInterval(t);
  }, [heroSlides?.length]);

  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    const next = (currentSlide + 1) % heroSlides.length;
    const nextSlideObj = heroSlides[next];
    if (!nextSlideObj) return;
    const img = new Image();
    img.src = nextSlideObj.image;
  }, [currentSlide, heroSlides]);

  const nextSlide = () =>
    setCurrentSlide((p) => (p + 1) % (heroSlides?.length || 1));
  const prevSlide = () =>
    setCurrentSlide(
      (p) => (p - 1 + (heroSlides?.length || 1)) % (heroSlides?.length || 1)
    );

  // Refetch triggers
  useEffect(() => {
    const onAnyUpdate = () => {
      refetchProducts();
      refetchCats();
      refetchSubs();
    };
    window.addEventListener("mezarisim-products-updated", onAnyUpdate as any);
    window.addEventListener("mezarisim-force-rerender", onAnyUpdate as any);
    window.addEventListener("mezarisim-product-changed", onAnyUpdate as any);
    return () => {
      window.removeEventListener(
        "mezarisim-products-updated",
        onAnyUpdate as any
      );
      window.removeEventListener(
        "mezarisim-force-rerender",
        onAnyUpdate as any
      );
      window.removeEventListener(
        "mezarisim-product-changed",
        onAnyUpdate as any
      );
    };
  }, [refetchProducts, refetchCats, refetchSubs]);

  // Detail navigate -> slug
  const handleProductDetail = (model: TombstoneModel) => {
    if (!onProductDetail) return;
    const slug = model.slug || model.id;
    onProductDetail(slug);
  };

  const currentCategoryName =
    selectedSubCategory === "tümü"
      ? "Tüm Mezar Modelleri"
      : uiCategories.find((c) => c.id === selectedSubCategory)?.name ??
        "Mezar Modelleri";

  return (
    <div className="min-h-screen">
      {/* Hero + Breadcrumb */}
      <div
        className="relative bg-teal-500 py-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/95 to-teal-500/90" />
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <nav className="flex items-center justify-center space-x-2 text-sm">
              <button
                onClick={() => onNavigate("home")}
                className="hover:text-teal-200 transition-colors"
              >
                Anasayfa
              </button>
              <span>{">"}</span>
              <span>Mezar Modelleri</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Slider */}
      {heroSlides && heroSlides.length > 0 && !isSlidesError && (
        <div className="relative bg-black">
          <div className="relative w-full h-96 overflow-hidden">
            {heroSlides.map((slide, index) => (
              <div
                key={String(slide.id ?? slide.image ?? index)}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                  index === currentSlide
                    ? "translate-x-0"
                    : index < currentSlide
                    ? "-translate-x-full"
                    : "translate-x-full"
                }`}
              >
                <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                  <ImageWithFallback
                    src={slide.image}
                    alt={slide.alt ?? slide.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain opacity-40"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60" />
                </div>

                <div className="absolute bottom-16 right-6 text-right text-white max-w-sm">
                  <h2 className="text-lg md:text-xl mb-3 text-white font-normal">
                    {slide.title}
                  </h2>
                  <button
                    onClick={() =>
                      document
                        .getElementById("products-grid")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 border border-white border-opacity-50 text-black px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    İNCELE
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white scale-125"
                      : "bg-white bg-opacity-40 hover:bg-opacity-70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kategori (Mezar Modelleri alt kategorileri) */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Desktop */}
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              {uiCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedSubCategory(category.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    selectedSubCategory === category.id
                      ? "bg-teal-500 text-white border-teal-500 shadow-lg hover:bg-teal-600"
                      : "bg-white text-teal-600 border-teal-300 hover:border-teal-400 hover:bg-teal-50"
                  }`}
                >
                  <span>{category.name}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedSubCategory === category.id
                        ? "bg-white bg-opacity-20 text-white"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              {uiCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedSubCategory(category.id)}
                  className={`px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 border text-center ${
                    selectedSubCategory === category.id
                      ? "bg-teal-500 text-white border-teal-500 shadow-lg"
                      : "bg-white text-teal-600 border-teal-300 hover:border-teal-400 hover:bg-teal-50"
                  }`}
                >
                  <div className="text-center leading-tight break-words font-bold">
                    {category.name}
                  </div>
                  <div
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedSubCategory === category.id
                        ? "bg-white bg-opacity-20 text-white"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {category.count}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div id="products-grid" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-gray-800 mb-4">
                {currentCategoryName}
              </h2>
              <p className="text-gray-600">
                Kaliteli malzeme ve işçilikle hazırlanmış mezar modelleri
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer"
                  onClick={() => handleProductDetail(model)}
                >
                  {/* 🔹 Oran koruma: aspect + object-contain */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 flex items-center justify-center">
                    <ImageWithFallback
                      src={model.image}
                      alt={model.name}
                      className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 uppercase leading-tight">
                      {model.name}
                    </h3>

                    <div className="flex items-center justify-between gap-2">
                      {model.productCode ? (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-500 text-blue-600 text-xs font-bold rounded">
                          {model.productCode}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-50 border border-gray-300 text-gray-600 text-xs font-semibold rounded">
                          KOD YOK
                        </span>
                      )}
                      <span className="text-sm font-bold text-gray-800">
                        {model.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredModels.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📷</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Bu kategoride henüz model bulunmuyor
                </h3>
                <p className="text-gray-500 mb-6">
                  Diğer kategorileri inceleyebilir veya bizimle iletişime
                  geçebilirsiniz.
                </p>
                <Button
                  onClick={() => setSelectedSubCategory("tümü")}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Tüm Modelleri Göster
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Öne Çıkanlar (ürün) */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-gray-800 mb-4">
                Öne Çıkan Mezar Modelleri
              </h2>
              <p className="text-gray-600">
                En popüler ve kaliteli mezar modellerimizi keşfedin
              </p>
            </div>

            <Carousel className="w-full max-w-5xl mx-auto"
              opts={{ align: "start", loop: true }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredModels.map((model) => (
                  <CarouselItem
                    key={model.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card
                      className="group hover:shadow-xl transition-all duration-300 bg-white border-0 overflow-hidden h-full cursor-pointer"
                      onClick={() => handleProductDetail(model)}
                    >
                      {/* 🔹 Oran koruma: aspect + object-contain */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 flex items-center justify-center">
                        <ImageWithFallback
                          src={model.image}
                          alt={model.name}
                          className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <CardContent className="p-4">
                        <h3 className="text-base font-bold text-gray-800 mb-3 line-clamp-2 uppercase">
                          {model.name}
                        </h3>

                        <div className="flex items-center justify-between gap-2">
                          {model.productCode ? (
                            <span className="inline-block px-3 py-1 border-2 border-blue-500 text-blue-600 text-xs font-bold rounded">
                              {model.productCode}
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 border-2 border-gray-300 text-gray-600 text-xs font-semibold rounded">
                              KOD YOK
                            </span>
                          )}
                          <span className="text-lg font-bold text-gray-800">
                            {model.price}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-white mb-6">
              Kaliteli Mezar Yapımı İçin Hemen İletişime Geçin
            </h2>
            <p className="text-teal-100 mb-8 text-lg">
              Uzman ekibimizle birlikte en uygun mezar modelini seçin ve
              profesyonel hizmet alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onNavigate("contact")}
                className="bg-white text-teal-500 hover:bg-gray-100 px-8 py-3"
              >
                İletişime Geç
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-teal-500 px-8 py-3"
                onClick={() => window.open("tel:+905334838971")}
              >
                📞 Hemen Ara
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
