// FILE: src/pages/.../ModelsPage.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useActiveSlidesRtk } from "../../data/sliderData";

// ✅ METAHUB PUBLIC RTK
import { useListCategoriesQuery } from "@/integrations/rtk/endpoints/categories.endpoints";
import { useListSubCategoriesQuery } from "@/integrations/rtk/endpoints/sub_categories.endpoints";
import { useListProductsQuery } from "@/integrations/rtk/endpoints/products.endpoints";

import backgroundImage from "figma:asset/0a9012ca17bfb48233c0877277b7fb8427a12d4c.png";

interface ModelsPageProps {
  onNavigate: (page: string) => void;
  /** Detay sayfasına gidiş – YALNIZCA slug ile /product/:slug (ileride kullanmak istersen) */
  onProductDetail?: (slug: string) => void;
}

interface TombstoneModel {
  id: number;
  /** bağlı sub-category id (BE) */
  subCategoryId?: string;
  /** ürün slug'ı (public detay sayfası için) */
  slug?: string;
  name: string;
  /** UI filtresi: "mermer" | "granit" | "sutunlu" */
  category: "mermer" | "granit" | "sutunlu";
  material: string;
  price: string;
  image: string;
  description: string;
  featured?: boolean;
  dimensions?: string;
  weight?: string;
  thickness?: string;
  finish?: string;
  warranty?: string;
  installationTime?: string;
}

/* ================= helpers ================= */

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop";

const normalize = (s: unknown): string =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    // @ts-ignore unicode diacritics
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/_/g, "-");

type SpecDict = Record<string, string>;

const toSpecDict = (specs: any): SpecDict => {
  if (!specs) return {};
  if (Array.isArray(specs)) {
    const out: SpecDict = {};
    for (const it of specs) {
      const k = (it?.name ?? "").toString().trim().toLowerCase();
      const v = it?.value;
      if (k) out[k] = v == null ? "" : String(v);
    }
    return out;
  }
  if (typeof specs === "object") {
    const out: SpecDict = {};
    for (const [k, v] of Object.entries(specs as Record<string, unknown>)) {
      out[k.toLowerCase()] = v == null ? "" : String(v);
    }
    return out;
  }
  return {};
};

const getSpec = (d: SpecDict, keys: string[]): string => {
  for (const k of keys) {
    const v = d[k.toLowerCase()];
    if (v) return v;
  }
  return "";
};

const pickImage = (r: any): string => {
  const img =
    r?.image_effective_url ||
    r?.image_url ||
    r?.image ||
    r?.cover_image ||
    r?.cover_url;
  if (typeof img === "string" && img.trim()) return img;

  if (Array.isArray(r?.images) && r.images[0]) {
    const i0 = r.images[0];
    if (typeof i0 === "string") return i0;
    if (i0?.image_effective_url) return i0.image_effective_url;
    if (i0?.image_url) return i0.image_url;
  }
  return PLACEHOLDER_IMG;
};

const normalizePrice = (r: any): string => {
  const p = r?.price;
  const pm = r?.price_minor;
  if (typeof p === "string" && p.trim()) return p;
  if (typeof p === "number" && Number.isFinite(p) && p > 0) {
    try {
      return p.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      });
    } catch {
      return `${Math.round(p)} TL`;
    }
  }
  if (typeof pm === "number" && Number.isFinite(pm) && pm > 0) {
    const tl = Math.round(pm / 100);
    try {
      return tl.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      });
    } catch {
      return `${tl} TL`;
    }
  }
  return "Fiyat İçin Arayınız";
};

// Kök kategori: "MEZAR BAŞ TAŞI MODELLERİ"
const isTombstoneBaseCategory = (cat: any): boolean => {
  const nName = normalize(cat?.name);
  const nSlug = normalize(cat?.slug);
  return (
    nName.includes("mezar-bas-tasi-modelleri") ||
    nSlug.includes("mezar-bas-tasi-modelleri") ||
    nName.includes("mezar-bas-tasi") ||
    nSlug.includes("mezar-bas-tasi")
  );
};

// Alt kategori adından tip çıkar: mermer / granit / sutunlu
const inferSubType = (sc: any): "mermer" | "granit" | "sutunlu" => {
  const txt = normalize(sc?.slug || sc?.name);
  if (txt.includes("granit")) return "granit";
  if (txt.includes("sutun") || txt.includes("sütun")) return "sutunlu";
  // default: mermer
  return "mermer";
};

/* ================= component ================= */

export function ModelsPage({ onNavigate, onProductDetail }: ModelsPageProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<"tümü" | "mermer" | "granit" | "sutunlu">("tümü");
  const [selectedModel, setSelectedModel] = useState<TombstoneModel | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Slider RTK (lokal helper)
  const { slides, isError: isSlidesError } = useActiveSlidesRtk();

  // ✅ Kategoriler (MEZAR BAŞ TAŞI MODELLERİ kategori id'si için)
  const {
    data: categories = [],
    isFetching: loadingCats,
    refetch: refetchCats,
  } = useListCategoriesQuery({
    is_active: true,
    limit: 200,
    offset: 0,
    sort: "display_order",
    order: "asc",
  });

  // ✅ Alt kategoriler (tüm aktif sub-category, FE'de filtreleyeceğiz)
  const {
    data: subCategoriesRes = [],
    isFetching: loadingSubs,
    refetch: refetchSubs,
  } = useListSubCategoriesQuery({
    is_active: true,
    limit: 200,
    offset: 0,
    sort: "display_order",
    order: "asc",
  });

  // ✅ Ürünler (public mezar ürünleri)
  const {
    data: productsRes = [],
    isFetching: loadingProducts,
    refetch: refetchProducts,
  } = useListProductsQuery({
    is_active: true,
    limit: 500,
    offset: 0,
    // RTK tipine göre sadece: "price" | "rating" | "created_at" geçerli
    sort: "created_at",
    order: "asc",
  });

  // Kök kategori id'leri (MEZAR BAŞ TAŞI MODELLERİ)
  const baseCategoryIds = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return (categories as any[])
      .filter(isTombstoneBaseCategory)
      .map((c) => String(c.id));
  }, [categories]);

  // Bu kök kategorilere bağlı alt kategoriler
  const tombstoneSubcategoryIds = useMemo(() => {
    if (!Array.isArray(subCategoriesRes) || !baseCategoryIds.length) return [];
    return (subCategoriesRes as any[])
      .filter((sc) =>
        baseCategoryIds.includes(
          String(sc.category_id ?? sc.categoryId ?? "")
        )
      )
      .map((sc) => String(sc.id));
  }, [subCategoriesRes, baseCategoryIds]);

  // subCategory map (id -> kayıt)
  const subcategoryMap = useMemo(() => {
    const map = new Map<string, any>();
    (subCategoriesRes as any[]).forEach((sc) => {
      map.set(String(sc.id), sc);
    });
    return map;
  }, [subCategoriesRes]);

  // RTK değişince tekrar çek
  useEffect(() => {
    const onAnyUpdate = () => {
      refetchCats();
      refetchSubs();
      refetchProducts();
    };
    window.addEventListener(
      "mezarisim-categories-updated",
      onAnyUpdate as any
    );
    window.addEventListener(
      "mezarisim-subcategories-updated",
      onAnyUpdate as any
    );
    window.addEventListener(
      "mezarisim-products-updated",
      onAnyUpdate as any
    );
    return () => {
      window.removeEventListener(
        "mezarisim-categories-updated",
        onAnyUpdate as any
      );
      window.removeEventListener(
        "mezarisim-subcategories-updated",
        onAnyUpdate as any
      );
      window.removeEventListener(
        "mezarisim-products-updated",
        onAnyUpdate as any
      );
    };
  }, [refetchCats, refetchSubs, refetchProducts]);

  // ✅ Tüm mezar baş taşı MODELLERİNİ ÜRÜNLERDEN üret
  const allModels: TombstoneModel[] = useMemo(() => {
    if (!Array.isArray(productsRes)) return [];

    // Eğer MEZAR BAŞ TAŞI kök kategorisini bulabildiysek,
    // sadece o alt kategorilere bağlı ürünleri filtrele.
    // Bulamadıysak bütün ürünleri kullan (fallback).
    const rawProducts: any[] =
      tombstoneSubcategoryIds.length > 0
        ? (productsRes as any[]).filter((p) => {
            const sid = String(
              p.sub_category_id ?? (p as any).subCategoryId ?? ""
            );
            return tombstoneSubcategoryIds.includes(sid);
          })
        : (productsRes as any[]);

    return rawProducts.map((p) => {
      const sid = String(p.sub_category_id ?? (p as any).subCategoryId ?? "");
      const sc = subcategoryMap.get(sid);

      const specs = toSpecDict(p.specifications ?? sc?.specifications);
      const dimensions = getSpec(specs, [
        "dimensions",
        "ölçü",
        "olcu",
        "boyut",
        "size",
      ]);
      const weight = getSpec(specs, ["weight", "ağırlık", "agirlik"]);
      const thickness = getSpec(specs, ["thickness", "kalınlık", "kalinlik"]);
      const finish = getSpec(specs, [
        "finish",
        "surfacefinish", // ProductSpecifications.surfaceFinish → "surfacefinish"
        "yüzey",
        "surface",
        "polisaj",
        "polish",
      ]);
      const warranty = getSpec(specs, ["warranty", "garanti"]);
      const installationTime = getSpec(specs, [
        "installationtime",
        "kurulum süresi",
        "montaj süresi",
        "montaj",
      ]);

      const subType = sc ? inferSubType(sc) : "mermer";
      const material =
        subType === "granit"
          ? "Granit Mezar Taşı"
          : subType === "sutunlu"
          ? "Sütunlu Mezar"
          : "Mermer Mezar Taşı";

      const img = pickImage(p);
      const price = normalizePrice(p);

      const backendId = String(p.id ?? "");
      const idNum = Number(backendId);
      const safeId = Number.isFinite(idNum)
        ? idNum
        : Math.floor(Math.random() * 1_000_000);

      const name =
        p.title ?? p.name ?? sc?.name ?? "Mezar Baş Taşı Modeli";

      const desc =
        p.description ??
        p.short_description ??
        sc?.description ??
        sc?.short_description ??
        "";

      const rawSlug = String(
        p.slug ??
          (p as any).slug_tr ??
          (p as any).slug_en ??
          (p as any).slug_de ??
          ""
      ).trim();

      const featured =
        Boolean(p.is_featured) ||
        Boolean((p as any).is_featured_homepage) ||
        Boolean((p as any).featured);

      const model: TombstoneModel = {
        id: safeId,
        ...(sid ? { subCategoryId: sid } : {}),
        name: String(name),
        category: subType,
        material,
        price,
        image: img,
        description: String(desc),
        featured,
        dimensions,
        weight,
        thickness,
        finish,
        warranty,
        installationTime,
      };

      if (rawSlug) model.slug = rawSlug;

      return model;
    });
  }, [productsRes, tombstoneSubcategoryIds, subcategoryMap]);

  // Slider autoplay
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (slides.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [slides.length]);

  // Bir sonraki slider görselini preload et
  useEffect(() => {
    if (slides.length === 0) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    const next = slides[nextIndex];
    if (!next) return;
    const img = new Image();
    img.src = next.image;
  }, [currentSlide, slides]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % (slides.length || 1));
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + (slides.length || 1)) % (slides.length || 1)
    );

  // Chip tanımları: sabit
  const chipDefs = [
    { id: "tümü" as const, label: "Tüm Modeller" },
    { id: "mermer" as const, label: "Mermer Mezar Taşları" },
    { id: "granit" as const, label: "Granit Mezar Taşları" },
    { id: "sutunlu" as const, label: "Sütunlu Mezar Taşları" },
  ];

  // Kategori sayıları
  const categoriesUi = useMemo(() => {
    const counts: Record<string, number> = {
      mermer: allModels.filter((m) => m.category === "mermer").length,
      granit: allModels.filter((m) => m.category === "granit").length,
      sutunlu: allModels.filter((m) => m.category === "sutunlu").length,
    };
    const total = allModels.length;

    return chipDefs
      .map((c) => ({
        id: c.id,
        name: c.label,
        count: c.id === "tümü" ? total : counts[c.id] ?? 0,
      }))
      .filter((cat) => cat.id === "tümü" || cat.count > 0);
  }, [chipDefs, allModels]);

  // Filtrelenmiş modeller
  const filteredModels: TombstoneModel[] =
    selectedCategory === "tümü"
      ? allModels
      : allModels.filter((m) => m.category === selectedCategory);

  // Öne çıkanlar
  const featuredModels: TombstoneModel[] = useMemo(() => {
    const featured = allModels.filter((m) => m.featured);
    const source = featured.length ? featured : allModels;
    return source.slice(0, 12);
  }, [allModels]);

  const handleImageClick = (model: TombstoneModel) => {
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  const canNavigateToProduct = (model: TombstoneModel) =>
    typeof model.slug === "string" && model.slug.trim().length > 0;

  const handleProductDetail = (model: TombstoneModel) => {
    if (!onProductDetail) return;
    if (!canNavigateToProduct(model)) return;
    onProductDetail(model.slug!.trim());
  };

  const isLoading = loadingCats || loadingSubs || loadingProducts;

  return (
    <div className="min-h-screen">
      {/* Hero */}
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
              <span>Mezar Baş Taşı Modelleri</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Slider */}
      {slides.length > 0 && !isSlidesError && (
        <div className="relative bg-black">
          <div className="relative w-full h-96 overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
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
                    onClick={() => {
                      const gridElement =
                        document.getElementById("products-grid");
                      if (gridElement)
                        gridElement.scrollIntoView({ behavior: "smooth" });
                    }}
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
              {slides.map((_, index) => (
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

      {/* Kategoriler */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              {categoriesUi.map((category) => (
                <Button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(
                      category.id as "tümü" | "mermer" | "granit" | "sutunlu"
                    )
                  }
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  className={`px-5 py-2.5 rounded-full transition-all duration-300 text-sm ${
                    selectedCategory === category.id
                      ? "bg-teal-500 hover:bg-teal-600 text-white shadow-lg"
                      : "border-teal-500 text-teal-600 hover:bg-teal-50 bg-white"
                  }`}
                >
                  {category.name}
                  <Badge
                    variant="secondary"
                    className={`ml-2 text-xs ${
                      selectedCategory === category.id
                        ? "bg-teal-400 text-teal-900"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            <div className="md:hidden grid grid-cols-2 gap-3">
              {categoriesUi.map((category) => (
                <Button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(
                      category.id as "tümü" | "mermer" | "granit" | "sutunlu"
                    )
                  }
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  className={`px-3 py-3 h-auto rounded-lg transition-all duration-300 text-center ${
                    selectedCategory === category.id
                      ? "bg-teal-500 hover:bg-teal-600 text-white shadow-lg"
                      : "border-teal-500 text-teal-600 hover:bg-teal-50 bg-white"
                  }`}
                >
                  <span className="text-base font-bold leading-tight text-center break-words hyphens-auto">
                    {category.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ürün grid */}
      <div id="products-grid" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-gray-800 mb-4">
                {selectedCategory === "tümü"
                  ? "Tüm Mezar Baş Taşı Modelleri"
                  : categoriesUi.find(
                      (cat) => cat.id === selectedCategory
                    )?.name}
              </h2>
              <p className="text-gray-600">
                Kaliteli malzeme ve işçilikle hazırlanmış mezar baş taşı
                modelleri
              </p>
            </div>

            {isLoading && (
              <div className="text-center text-gray-500 py-12">
                Modeller yükleniyor…
              </div>
            )}

            {!isLoading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredModels.map((model, index) => (
                    <Card
                      key={`model-${model.id}-${index}`}
                      className="group hover:shadow-xl transition-all duration-300 bg-white border-0 overflow-hidden"
                    >
                      <div
                        className="relative cursor-pointer"
                        onClick={() => handleImageClick(model)}
                      >
                        <div className="relative aspect-[4/3] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          <ImageWithFallback
                            src={model.image}
                            alt={model.name}
                            className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          {model.featured && (
                            <Badge className="absolute top-3 right-3 bg-teal-500 text-white">
                              Öne Çıkan
                            </Badge>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3">
                              <span className="text-gray-800 text-sm">
                                🔍 Detayları Gör
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="mb-3">
                          <Badge
                            variant="outline"
                            className="text-teal-600 border-teal-600 mb-2"
                          >
                            {model.material}
                          </Badge>
                        </div>

                        <h3 className="text-lg text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                          {model.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {model.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-teal-600">
                            {model.price}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <Button
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                            disabled={!canNavigateToProduct(model)}
                            onClick={() => handleProductDetail(model)}
                          >
                            🔍 Detayları Görüntüle
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full text-teal-500 border-teal-500 hover:bg-teal-50"
                            onClick={() => onNavigate("contact")}
                          >
                            Fiyat Teklifi Al
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => {
                              const whatsappMessage = `Merhaba, ${model.name} hakkında bilgi almak istiyorum.`;
                              window.open(
                                `https://wa.me/905334838971?text=${encodeURIComponent(
                                  whatsappMessage
                                )}`,
                                "_blank"
                              );
                            }}
                          >
                            💬 WhatsApp&apos;tan Sor
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredModels.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📷</div>
                    <h3 className="text-xl text-gray-600 mb-2">
                      Bu kategoride henüz model bulunmuyor
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Diğer kategorileri inceleyebilir veya bizimle iletişime
                      geçebilirsiniz.
                    </p>
                    <Button
                      onClick={() => setSelectedCategory("tümü")}
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      Tüm Modelleri Görüntüle
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mezar Yapım Sürecimiz */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-gray-800 mb-4">
                Mezar Yapım Sürecimiz
              </h2>
              <p className="text-gray-600">
                Mezar yapım sürecimizde izlediğimiz adımlar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-xl text-gray-800 mb-2">1. Tasarım</h3>
                <p className="text-gray-600">
                  İsteklerinize göre özel mezar tasarımı hazırlığı ve onay
                  süreci
                </p>
              </div>

              <div className="text-center">
                <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔨</span>
                </div>
                <h3 className="text-xl text-gray-800 mb-2">2. Üretim</h3>
                <p className="text-gray-600">
                  Seçilen malzemede uzman ekibimizle kaliteli mezar üretimi
                </p>
              </div>

              <div className="text-center">
                <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📍</span>
                </div>
                <h3 className="text-xl text-gray-800 mb-2">3. Kurulum</h3>
                <p className="text-gray-600">
                  Mezarlıkta profesyonel mezar kurulumu ve son kontrol
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Öne Çıkan Mezar Modelleri */}
      <div className="bg-gray-50 py-16">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredModels.map((model, index) => (
                <Card
                  key={`featured-${model.id}-${index}`}
                  className="group hover:shadow-xl transition-all duration-300 bg-white border-0 overflow-hidden"
                >
                  <div
                    className="relative cursor-pointer"
                    onClick={() => handleImageClick(model)}
                  >
                    <div className="relative aspect-[4/3] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <ImageWithFallback
                        src={model.image}
                        alt={model.name}
                        className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-teal-500 text-white">
                        Öne Çıkan
                      </Badge>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3">
                          <span className="text-gray-800 text-sm">
                            🔍 Detayları Gör
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-3">
                      <Badge
                        variant="outline"
                        className="text-teal-600 border-teal-600 mb-2"
                      >
                        {model.material}
                      </Badge>
                    </div>

                    <h3 className="text-lg text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                      {model.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {model.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-teal-600">
                        {model.price}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                        disabled={!canNavigateToProduct(model)}
                        onClick={() => handleProductDetail(model)}
                      >
                        🔍 Detayları Görüntüle
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-teal-500 border-teal-500 hover:bg-teal-50"
                        onClick={() => onNavigate("contact")}
                      >
                        Fiyat Teklifi Al
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => {
                          const whatsappMessage = `Merhaba, ${model.name} hakkında bilgi almak istiyorum.`;
                          window.open(
                            `https://wa.me/905334838971?text=${encodeURIComponent(
                              whatsappMessage
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        💬 WhatsApp&apos;tan Sor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal-500 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl mb-4">
              Özel Tasarım Mezar Baş Taşı İstiyorsanız
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Size özel tasarım mezar baş taşı modelleri için uzman ekibimizle
              iletişime geçin. Ölçülerinize ve isteklerinize göre özel çözümler
              sunuyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onNavigate("contact")}
                className="bg-white text-teal-500 hover:bg-gray-100 px-8 py-3"
              >
                Özel Tasarım Talebi
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

      {/* Modal — quick view */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-2xl bg-gray-50 max-h-[90vh] overflow-y-auto"
          aria-describedby={
            selectedModel
              ? `model-description-${selectedModel.id}`
              : "modal-content"
          }
        >
          {selectedModel && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-teal-600">
                  {selectedModel.name}
                </DialogTitle>
                <DialogDescription
                  id={`model-description-${selectedModel.id}`}
                  className="text-gray-600"
                >
                  {selectedModel.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Görsel (oran korumalı) */}
                <div className="relative bg-white rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                    <ImageWithFallback
                      src={selectedModel.image}
                      alt={selectedModel.name}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                    {selectedModel.featured && (
                      <Badge className="absolute top-4 left-4 bg-teal-500 text-white">
                        Öne Çıkan Model
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Etiketler + Fiyat */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-teal-600 border-teal-600"
                    >
                      {selectedModel.material}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-700"
                    >
                      {selectedModel.category.charAt(0).toUpperCase() +
                        selectedModel.category.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-2xl text-teal-600">
                    {selectedModel.price}
                  </div>
                </div>

                {/* Aksiyonlar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                    onClick={() => onNavigate("contact")}
                  >
                    📞 Fiyat Teklifi Al
                  </Button>
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => {
                      const msg = `Merhaba, ${selectedModel.name} hakkında bilgi almak istiyorum.`;
                      window.open(
                        `https://wa.me/905334838971?text=${encodeURIComponent(
                          msg
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    💬 WhatsApp&apos;tan Sor
                  </Button>
                  {canNavigateToProduct(selectedModel) && (
                    <Button
                      variant="outline"
                      className="text-teal-600 border-teal-600 hover:bg-teal-50"
                      onClick={() => handleProductDetail(selectedModel)}
                    >
                      🔍 Ürün Sayfasına Git
                    </Button>
                  )}
                </div>

                {/* Teknik Özellikler */}
                <div>
                  <h3 className="text-lg text-gray-800 mb-4 text-center">
                    Teknik Özellikler
                  </h3>
                  <div className="space-y-3">
                    {selectedModel.dimensions && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Boyutlar:</span>
                        <span className="text-gray-800">
                          {selectedModel.dimensions}
                        </span>
                      </div>
                    )}
                    {selectedModel.weight && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Ağırlık:</span>
                        <span className="text-gray-800">
                          {selectedModel.weight}
                        </span>
                      </div>
                    )}
                    {selectedModel.thickness && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Kalınlık:</span>
                        <span className="text-gray-800">
                          {selectedModel.thickness}
                        </span>
                      </div>
                    )}
                    {selectedModel.finish && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Yüzey İşlemi:</span>
                        <span className="text-gray-800">
                          {selectedModel.finish}
                        </span>
                      </div>
                    )}
                    {selectedModel.warranty && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Garanti:</span>
                        <span className="text-gray-800">
                          {selectedModel.warranty}
                        </span>
                      </div>
                    )}
                    {selectedModel.installationTime && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Kurulum Süresi:</span>
                        <span className="text-gray-800">
                          {selectedModel.installationTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
