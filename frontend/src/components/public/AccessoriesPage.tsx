// src/pages/AccessoriesPage.tsx
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
// Sadece tipini al (dosya ismi aynı kalıyor)
import type { SlideData } from "../../data/sliderData";
import backgroundImage from "figma:asset/0a9012ca17bfb48233c0877277b7fb8427a12d4c.png";

// — Tipler
import type {
  AccessoryPublic,
  AccessoryKey,
  AccessoriesListParams,
} from "@/integrations/rtk/types/accessories";

// — RTK PUBLIC endpoints
import { useListAccessoriesPublicQuery } from "@/integrations/rtk/endpoints/accessories.endpoints";
import { useListSlidesPublicQuery } from "@/integrations/rtk/endpoints/slider_public.endpoints";

/* ================= helpers ================= */
const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1589894403421-1c4b0c6b3b6e?w=800&h=600&fit=crop";

// Public liste çağrısı için param builder (is_active YOK!)
const buildPublicParams = (
  cat: "tümü" | AccessoryKey
): AccessoriesListParams => ({
  limit: 200,
  offset: 0,
  order: "asc",
  sort: "display_order",
  ...(cat === "tümü" ? {} : { category: cat }),
});

// Kategori string → AccessoryKey
const toKey = (v: unknown): AccessoryKey => {
  const c = String(v || "").toLowerCase();
  if (c.includes("şuluk") || c.includes("suluk")) return "suluk";
  if (c.includes("sütun") || c.includes("sutun")) return "sutun";
  if (c.includes("vazo")) return "vazo";
  return "aksesuar";
};

// Görsel seçimi: image | image_effective_url | image_url | images[0]
const pickImage = (r: any): string => {
  if (r?.image) return r.image as string;
  if (r?.image_effective_url) return r.image_effective_url as string;
  if (r?.image_url) return r.image_url as string;
  if (Array.isArray(r?.images) && r.images[0]) return String(r.images[0]);
  return PLACEHOLDER_IMG;
};

// Fiyat normalize
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

// Backend hangi şekli dönerse dönsün FE aradığı AccessoryPublic’e çevir
const toUIAccessory = (r: any): AccessoryPublic => ({
  id: Number(r?.id ?? Math.random()),
  name: String(r?.name ?? r?.title ?? "Ürün"),
  category: toKey(r?.category ?? r?.category_name),
  material: String(r?.material ?? "Özel Malzeme"),
  price: normalizePrice(r),
  image: pickImage(r),
  description: String(r?.description ?? ""),
  featured: Boolean(r?.featured),
  dimensions: r?.dimensions ?? undefined,
  weight: r?.weight ?? undefined,
  thickness: r?.thickness ?? undefined,
  finish: r?.finish ?? undefined,
  warranty: r?.warranty ?? undefined,
  installationTime: r?.installationTime ?? r?.installation_time ?? undefined,
});

// SliderPublic -> SlideData map (public API zaten aktifleri döner; yine de guard koyduk)
const toSlideData = (s: any): SlideData => ({
  id: String(s?.id ?? s?.uuid ?? Math.random()),
  title: String(s?.title ?? s?.name ?? ""),
  description: String(s?.description ?? ""),
  image: String(
    s?.image ?? s?.image_effective_url ?? s?.image_url ?? PLACEHOLDER_IMG
  ),
  alt: s?.alt ?? undefined,
  buttonText: String(s?.buttonText ?? "İncele"),
  buttonLink: String(s?.buttonLink ?? "contact"),
  isActive: Boolean(s?.isActive ?? s?.is_active ?? true),
  order: Number(s?.order ?? s?.display_order ?? 0),
  priority: "high",
  showOnMobile: true,
  showOnDesktop: true,
});

interface AccessoriesPageProps {
  onNavigate: (page: string) => void;
}

export function AccessoriesPage({ onNavigate }: AccessoriesPageProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<"tümü" | AccessoryKey>("tümü");
  const [selectedModel, setSelectedModel] = useState<AccessoryPublic | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ========== SLIDER ========== */
  const {
    data: slidesApi = [],
    isFetching: loadingSlides,
    isError: slidesError,
    refetch: refetchSlides,
  } = useListSlidesPublicQuery({
    limit: 200,
    offset: 0,
    sort: "display_order",
    order: "asc",
  });

  const activeSlides: SlideData[] = useMemo(() => {
    const arr = Array.isArray(slidesApi) ? slidesApi : [];
    return arr
      .map(toSlideData)
      .filter((s) => s.isActive)
      .sort((a, b) => a.order - b.order);
  }, [slidesApi]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>([]);

  useEffect(() => {
    setSlides(activeSlides);
    setCurrentSlide(0);
  }, [activeSlides]);

  useEffect(() => {
    const onUpd = () => refetchSlides();
    window.addEventListener("slider-data-updated", onUpd);
    return () => window.removeEventListener("slider-data-updated", onUpd);
  }, [refetchSlides]);

  useEffect(() => {
    if (!slides.length) return;
    const t = window.setInterval(
      () => setCurrentSlide((p) => (p + 1) % slides.length),
      5000
    );
    return () => window.clearInterval(t);
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    const nextImgUrl = slides[nextIndex]?.image;
    if (nextImgUrl) {
      const img = new Image();
      img.src = nextImgUrl;
    }
  }, [currentSlide, slides]);

  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);

  /* ========== ACCESSORIES ========== */
  const {
    data: accessoriesRes = [],
    isFetching,
    isError,
    refetch,
  } = useListAccessoriesPublicQuery(buildPublicParams("tümü"));

  useEffect(() => {
    const upd = () => refetch();
    window.addEventListener("mezarisim-products-updated", upd);
    window.addEventListener("mezarisim-force-rerender", upd);
    return () => {
      window.removeEventListener("mezarisim-products-updated", upd);
      window.removeEventListener("mezarisim-force-rerender", upd);
    };
  }, [refetch]);

  const allModels: AccessoryPublic[] = useMemo(
    () => (accessoriesRes as any[]).map(toUIAccessory),
    [accessoriesRes]
  );

  const categories = useMemo(() => {
    const counts = {
      suluk: allModels.filter((m) => m.category === "suluk").length,
      sutun: allModels.filter((m) => m.category === "sutun").length,
      vazo: allModels.filter((m) => m.category === "vazo").length,
      aksesuar: allModels.filter((m) => m.category === "aksesuar").length,
    };
    const total = allModels.length;
    return [
      { id: "tümü" as const, name: "Tüm Aksesuarlar", count: total },
      { id: "suluk" as const, name: "Suluk Modelleri", count: counts.suluk },
      { id: "sutun" as const, name: "Sütun Modelleri", count: counts.sutun },
      { id: "vazo" as const, name: "Vazo Modelleri", count: counts.vazo },
      {
        id: "aksesuar" as const,
        name: "Diğer Aksesuarlar",
        count: counts.aksesuar,
      },
    ].filter((c) => c.id === "tümü" || c.count > 0);
  }, [allModels]);

  const filteredModels: AccessoryPublic[] = useMemo(() => {
    if (selectedCategory === "tümü") return allModels;
    return allModels.filter((m) => m.category === selectedCategory);
  }, [allModels, selectedCategory]);

  const handleImageClick = (m: AccessoryPublic) => {
    setSelectedModel(m);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Breadcrumb */}
      <div
        className="relative bg-teal-500 py-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/95 to-teal-500/90"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <nav className="flex items-center justify-center space-x-2 text-sm">
              <button
                onClick={() => onNavigate("home")}
                className="hover:text-teal-200 transition-colors"
              >
                Anasayfa
              </button>
              <span>&gt;</span>
              <span>Mezar Aksesuarları</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Slider Section - Modern Design */}
      {!slidesError && slides.length > 0 && (
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
                {/* Background Image with Overlay */}
                <div className="relative w-full h-full">
                  <ImageWithFallback
                    src={slide.image}
                    alt={slide.alt || slide.title}
                    className="w-full h-96 object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60" />
                </div>

                {/* Content Overlay - Bottom Right Minimal */}
                <div className="absolute bottom-16 right-6 text-right text-white max-w-sm">
                  <h2 className="text-lg md:text-xl mb-3 text-white font-normal">
                    {slide.title}
                  </h2>
                  <button
                    onClick={() => {
                      const gridElement =
                        document.getElementById("products-grid");
                      if (gridElement) {
                        gridElement.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 border border-white border-opacity-50 text-black px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    İNCELE
                  </button>
                </div>
              </div>
            ))}

            {/* Navigation Arrows - Sleek Design */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Dots Indicator - Modern Style */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
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

            {loadingSlides && (
              <div className="absolute inset-0 flex items-center justify-center text-white/80">
                Slider yükleniyor…
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Filters - Under Slider */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Desktop Version - Flex Layout */}
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
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

            {/* Mobile Version - Grid Layout */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
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

      {/* Products Grid */}
      <div id="products-grid" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-gray-800 mb-4">
                {selectedCategory === "tümü"
                  ? "Tüm Mezar Aksesuarları"
                  : categories.find((cat) => cat.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600">
                Kaliteli malzeme ve işçilikle hazırlanmış mezar aksesuarları
              </p>
            </div>

            {isFetching && (
              <div className="text-center text-gray-500 py-12">
                Yükleniyor…
              </div>
            )}

            {!isFetching && isError && (
              <div className="text-center text-red-500 py-12">
                Veri alınamadı.{" "}
                <button
                  onClick={() => refetch()}
                  className="underline font-medium"
                >
                  Tekrar dene
                </button>
              </div>
            )}

            {!isFetching && !isError && filteredModels.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredModels.map((model) => (
                  <Card
                    key={model.id}
                    className="group hover:shadow-xl transition-all duration-300 bg-white border-0 overflow-hidden"
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={() => handleImageClick(model)}
                    >
                      <ImageWithFallback
                        src={model.image}
                        alt={model.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {model.featured && (
                        <Badge className="absolute top-3 right-3 bg-teal-500 text-white">
                          Öne Çıkan
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Click to view indicator */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3">
                          <span className="text-gray-800 text-sm">
                            🔍 Detayları Gör
                          </span>
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
                          onClick={() => onNavigate("contact")}
                        >
                          Fiyat Teklifi Al
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-teal-500 border-teal-500 hover:bg-teal-50"
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
                          WhatsApp'tan Sor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isFetching && !isError && filteredModels.length === 0 && (
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
          </div>
        </div>
      </div>

      {/* Enhanced Process Section - İstanbul Mezar Aksesuarı Üretim Süreci */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-teal-50 py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-teal-300 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            {/* SEO Optimized Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6">
                <span className="text-2xl">🏺</span>
              </div>
              <h2 className="text-4xl text-gray-800 mb-6">
                <strong>İstanbul Mezar Aksesuarı</strong> Üretim Sürecimiz
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                <strong>Mezar şuluk, mezar vazosu, mezar sütunu</strong> ve{" "}
                <em>özel mezar aksesuarları</em> üretiminde
                <strong> 25+ yıllık deneyimimizle</strong>{" "}
                <em>İstanbul&apos;da kaliteli hizmet</em>.{" "}
                <strong>A+ sınıf malzemelerle</strong> üretim sürecimiz.
              </p>
            </div>

            {/* Process Steps - Modern Card Design */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1: Tasarım ve Keşif */}
              <div className="group relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-24 left-full w-12 h-0.5 bg-gradient-to-r from-teal-500 to-transparent z-10"></div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-10">
                    1
                  </div>

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-md">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-teal-300 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform scale-110"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                      <strong>Tasarım ve Keşif</strong>
                    </h3>

                    <div className="space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        <strong>Ücretsiz mezar keşfi</strong> ve{" "}
                        <em>ölçüm hizmeti</em> ile başlar.{" "}
                        <strong>Mezar şuluk, vazo, sütun</strong>
                        tasarımında <em>müşteri isteklerine özel</em>{" "}
                        <strong>3D tasarım hazırlama</strong> süreci.
                      </p>

                      <div className="bg-teal-50 p-4 rounded-xl">
                        <h4 className="text-sm text-teal-700 mb-2">
                          📋 Bu Aşamada Yapılanlar:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1 text-left">
                          <li>
                            • <strong>Mezar alanı ölçümü</strong> ve aksesuar
                            yerleşimi
                          </li>
                          <li>
                            • <strong>A+ sınıf malzeme</strong> seçimi (mermer,
                            granit)
                          </li>
                          <li>
                            • <em>Şuluk, vazo, sütun</em> tasarım seçenekleri
                          </li>
                          <li>
                            • <strong>3D görselleştirme</strong> ve onay süreci
                          </li>
                          <li>
                            • <em>Şeffaf fiyat teklifi</em> hazırlama
                          </li>
                        </ul>
                      </div>

                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <p className="text-xs text-green-700">
                          ⏱️ <strong>Süre:</strong> 1-2 gün • 🆓{" "}
                          <strong>Keşif Ücretsiz</strong> • 📞{" "}
                          <strong>7/24 Destek</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Üretim ve İşçilik */}
              <div className="group relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-24 left-full w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent z-10"></div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-10">
                    2
                  </div>

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-md">
                      <span className="text-4xl">🔨</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform scale-110"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      <strong>Üretim ve İşçilik</strong>
                    </h3>

                    <div className="space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        <strong>25+ yıl deneyimli ustalarımız</strong> ile{" "}
                        <em>A+ kalite malzemede</em> üretim.{" "}
                        <strong>
                          Mezar şuluk yapımı, mermer vazo üretimi, granit sütun
                        </strong>{" "}
                        işçiliğinde <em>hassas çalışma</em> ve{" "}
                        <strong>kalite kontrolü</strong>.
                      </p>

                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h4 className="text-sm text-blue-700 mb-2">
                          🏭 Üretim Aşamaları:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1 text-left">
                          <li>
                            • <strong>A+ sınıf malzeme</strong> tedarik ve
                            kalite kontrolü
                          </li>
                          <li>• <em>Profesyonel kesim ve şekillendirme</em></li>
                          <li>
                            • <strong>El işçiliği ve özel detaylar</strong>
                          </li>
                          <li>
                            • <em>Cilalama ve yüzey işlemleri</em>
                          </li>
                          <li>
                            • <strong>Final kalite kontrol</strong> ve onay
                            süreci
                          </li>
                        </ul>
                      </div>

                      <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                        <p className="text-xs text-orange-700">
                          ⏱️ <strong>Süre:</strong> 3-7 gün • 🛡️{" "}
                          <strong>5-10 Yıl Garanti</strong> • ✅{" "}
                          <strong>Kalite Onayı</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Kurulum ve Teslim */}
              <div className="group relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-10">
                    3
                  </div>

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-md">
                      <span className="text-4xl">📍</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform scale-110"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                      <strong>Kurulum ve Teslim</strong>
                    </h3>

                    <div className="space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        <strong>Mezarlıkta profesyonel kurulum</strong>,{" "}
                        <em>
                          şuluk yerleştirme, vazo montajı, sütun dikimi
                        </em>{" "}
                        ile teslim. <em>İstanbul mezarlıklarında</em>{" "}
                        <strong>garantili montaj hizmeti</strong> sunuyoruz.
                      </p>

                      <div className="bg-green-50 p-4 rounded-xl">
                        <h4 className="text-sm text-green-700 mb-2">
                          🏗️ Kurulum Detayları:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1 text-left">
                          <li>
                            • <strong>Mezarlık alanı hazırlığı</strong> ve
                            temizlik
                          </li>
                          <li>
                            • <em>Profesyonel aksesuar montajı</em> ve sabitleme
                          </li>
                          <li>
                            • <strong>Şuluk, vazo yerleştirme</strong> ve
                            hizalama
                          </li>
                          <li>
                            • <em>Sütun dikimi</em> ve estetik düzenleme
                          </li>
                          <li>
                            • <strong>Final kontrolü</strong> ve teslim belgesi
                          </li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                        <p className="text-xs text-purple-700">
                          ⏱️ <strong>Süre:</strong> 1 gün • 🎯{" "}
                          <strong>Garantili Kurulum</strong> • 📋{" "}
                          <strong>Teslim Belgesi</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Summary */}
            <div className="mt-16">
              <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-20 h-20 border border-white rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 border border-white rounded-full"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl mb-4">
                      🏆{" "}
                      <strong>İstanbul&apos;da Güvenilir Mezar Aksesuarı Üretimi</strong>
                    </h3>
                    <p className="text-lg opacity-90 max-w-4xl mx-auto">
                      <strong>Mezar şuluk, mezar vazosu, mezar sütunu</strong>{" "}
                      ve <em>özel aksesuar üretiminde</em>
                      <strong> %98 müşteri memnuniyeti</strong> ile{" "}
                      <em>İstanbul&apos;un en güvenilir</em> aksesuar üreticisi
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="bg-white bg-opacity-10 rounded-xl p-4">
                      <div className="text-3xl mb-2">25+</div>
                      <div className="text-sm opacity-90">Yıl Deneyim</div>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-xl p-4">
                      <div className="text-3xl mb-2">2000+</div>
                      <div className="text-sm opacity-90">Aksesuar Üretimi</div>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-xl p-4">
                      <div className="text-3xl mb-2">7/24</div>
                      <div className="text-sm opacity-90">Destek Hattı</div>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-xl p-4">
                      <div className="text-3xl mb-2">%98</div>
                      <div className="text-sm opacity-90">Memnuniyet</div>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <button
                      onClick={() => window.open("tel:+905334838971")}
                      className="bg-white text-teal-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                    >
                      📞 <strong>Hemen Arayın:</strong> 0533 483 89 71
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Local SEO Section */}
            <div className="mt-12 text-center">
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg text-gray-700 mb-3">
                  🏙️{" "}
                  <strong>İstanbul Mezarlıklarında Aksesuar Hizmetlerimiz</strong>
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <em>
                    Karaca Ahmet Mezarlığı, Zincirlikuyu Mezarlığı, Eyüp Sultan
                    Mezarlığı, Edirnekapı Mezarlığı, Kilyos Mezarlığı, Ulus
                    Mezarlığı
                  </em>{" "}
                  ve <strong>İstanbul&apos;un tüm mezarlıklarında</strong>
                  <em> profesyonel mezar aksesuarı hizmeti</em> sunuyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-teal-500 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl mb-4">
              Özel Tasarım Mezar Aksesuarı İstiyorsanız
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Size özel tasarım mezar aksesuarları için uzman ekibimizle
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

      {/* Product Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          aria-describedby={
            selectedModel
              ? `accessory-description-${selectedModel.id}`
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
                  id={`accessory-description-${selectedModel.id}`}
                  className="text-gray-600"
                >
                  {selectedModel.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Main Image - Centered */}
                <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedModel.image}
                    alt={selectedModel.name}
                    className="w-full h-80 object-cover"
                  />
                  {selectedModel.featured && (
                    <Badge className="absolute top-4 left-4 bg-teal-500 text-white">
                      Öne Çıkan Model
                    </Badge>
                  )}
                </div>

                {/* Price and Category Info - Centered */}
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
                      {String(selectedModel.category).charAt(0).toUpperCase() +
                        String(selectedModel.category).slice(1)}
                    </Badge>
                  </div>

                  <div className="text-2xl text-teal-600">
                    {selectedModel.price}
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="grid grid-cols-2 gap-4">
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
                      const whatsappMessage = `Merhaba, ${selectedModel.name} hakkında bilgi almak istiyorum.`;
                      window.open(
                        `https://wa.me/905334838971?text=${encodeURIComponent(
                          whatsappMessage
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    💬 WhatsApp'tan Sor
                  </Button>
                </div>

                {/* Product Specifications */}
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
