// =============================================================
// FILE: src/components/public/GardeningPage.tsx
// =============================================================
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
import { useActiveSlidesRtk, type SlideData } from "../../data/sliderData";
import backgroundImage from "figma:asset/0a9012ca17bfb48233c0877277b7fb8427a12d4c.png";

import { useListServicesPublicQuery } from "@/integrations/rtk/endpoints/services_public.endpoints";
import type { ServiceView } from "@/integrations/rtk/types/services.types";
import ProcessSection from "./ProcessSection";

/* =========================== types =========================== */
interface GardeningPageProps {
  onNavigate: (page: string) => void;
}

type GardenCat = "mevsimlik" | "surekli" | "ozel" | "genel";
type UiCat = "tümü" | GardenCat;

interface GardeningService {
  id: number; // numeric, deterministic
  uuid: string;
  slug: string;
  name: string;
  category: GardenCat; // mevsimlik | surekli | ozel | genel
  material?: string;
  price?: string;
  image: string;
  description?: string;
  featured?: boolean;
  area?: string;
  duration?: string;
  maintenance?: string;
  season?: string;
  warranty?: string;
  includes?: string;
}

/* =========================== helpers =========================== */

function keyOfSlide(slide: Partial<SlideData>, i: number) {
  return String(slide.id ?? slide.image ?? slide.title ?? i);
}

/** uuid -> deterministic numeric key */
function hashToNumericKey(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  h = Math.abs(h);
  return h === 0 ? 1 : h;
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop";

/** Birçok olası alan adından görsel seç (image öncelikli) */
function pickImageUrl(s: any): string {
  const cand = [
    s.image, // public alan
    s.image_url,
    s.featured_image,
    s.cover_url,
    s.cover,
    s.thumbnail_url,
    s.thumb_url,
    s.photo_url,
    s.photo,
    s.picture_url,
    s.picture,
    s.main_image_url,
    s.mainImageUrl,
    s.asset_url,
    s.asset?.url,
    s.media_url,
    s.media?.url,
    s.images?.[0]?.url,
    s.images?.[0],
    s.photos?.[0],
    s.media?.[0]?.url,
    s.storage_assets?.[0]?.public_url,
    s.storage?.[0]?.public_url,
  ];
  const url = cand.find((x) => typeof x === "string" && x.trim().length > 0);
  return url || PLACEHOLDER;
}

/** BE’den dönen listeyi normalize et */
function normalizeListPayload<T = any>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  if (!res || typeof res !== "object") return [];
  const o = res as any;
  return (o.rows || o.data || o.items || o.result || o.list || []) as T[];
}

/** Sadece çiçeklendirme (gardening) tipini kabul et; yanlışlıkla soil gelirse ayıkla */
function isGardening(s: any): boolean {
  const type = String(s?.type ?? "").toLowerCase();
  if (type === "gardening") return true;
  if (type === "soil") return false;
  // emniyet: metin içeriği
  const text = `${s?.category ?? ""} ${s?.slug ?? ""} ${s?.name ?? ""} ${s?.description ?? ""}`.toLowerCase();
  return /(çiçek|cicek|flower|plant)/.test(text);
}

/** DB row -> UI model */
function toGardeningModel(s: ServiceView): GardeningService {
  const baseKeyStr = String(
    (s as any).uuid ??
      (s as any).id ??
      (s as any).slug ??
      (s as any).name ??
      JSON.stringify(s),
  );

  // fiyatı metne çevir
  let priceText: string | undefined = (s as any).price;
  if (typeof (s as any).price === "number") {
    priceText = (s as any).price.toLocaleString("tr-TR");
  } else if (typeof (s as any).price === "string") {
    const n = Number((s as any).price);
    priceText = Number.isFinite(n)
      ? n.toLocaleString("tr-TR")
      : (s as any).price;
  }
  if (!priceText || !String(priceText).trim())
    priceText = "Fiyat İçin Arayınız";

  const rawCat = String((s as any).category).trim().toLowerCase();
  const normalizedCat: GardenCat =
    rawCat === "mevsimlik" ||
    rawCat === "surekli" ||
    rawCat === "özel" ||
    rawCat === "ozel"
      ? (rawCat === "özel" ? "ozel" : (rawCat as GardenCat))
      : "ozel";

  return {
    id: hashToNumericKey(baseKeyStr),
    uuid: baseKeyStr,
    slug: String((s as any).slug ?? ""),
    name: String((s as any).name ?? ""),
    category: normalizedCat,
    material: (s as any).material || undefined,
    price: priceText,
    image: pickImageUrl(s),
    description: (s as any).description || "",
    featured: Boolean((s as any).is_featured ?? (s as any).featured),
    area: (s as any).area || undefined,
    duration: (s as any).duration || undefined,
    maintenance: (s as any).maintenance || undefined,
    season: (s as any).season || undefined,
    warranty: (s as any).warranty || undefined,
    includes: (s as any).includes || undefined,
  };
}

/* Kategori başlıkları (slug -> görünen ad) */
const CATEGORY_LABELS: Record<GardenCat, string> = {
  mevsimlik: "Mevsimlik Çiçek",
  surekli: "Sürekli Bitki",
  ozel: "Özel Peyzaj",
  genel: "Genel Bakım",
};

/* =========================== component =========================== */
export function GardeningPage({ onNavigate }: GardeningPageProps) {
  // === UI state
  const [selectedCategory, setSelectedCategory] = useState<UiCat>("tümü");
  const [selectedService, setSelectedService] =
    useState<GardeningService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const {
    slides: activeSlides = [],
    isError: isSlidesError,
  } = useActiveSlidesRtk();

  useEffect(() => setSlides(activeSlides ?? []), [activeSlides]);

  // auto-rotate
  useEffect(() => {
    if (!slides.length) return;
    const t = window.setInterval(
      () => setCurrentSlide((p) => (p + 1) % slides.length),
      5000,
    );
    return () => window.clearInterval(t);
  }, [slides.length]);

  // prefetch next image
  useEffect(() => {
    if (!slides.length) return;
    const next = (currentSlide + 1) % slides.length;
    const src = slides[next]?.image;
    if (src) {
      const img = new Image();
      img.src = src;
    }
  }, [currentSlide, slides]);

  const nextSlide = () =>
    setCurrentSlide((p) => (p + 1) % (slides.length || 1));
  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + (slides.length || 1)) % (slides.length || 1));

  // === Services (PUBLIC)
  const {
    data: servicesRes,
    isLoading: isServicesLoading,
    isError: isServicesError,
    refetch: refetchServices,
  } = useListServicesPublicQuery({
    limit: 200,
    orderBy: "display_order",
    order: "asc",
  });

  // UI veri modeli (normalize + type guard)
  const allServices: GardeningService[] = useMemo(() => {
    const list = normalizeListPayload<ServiceView>(servicesRes);
    return list.filter(isGardening).map(toGardeningModel);
  }, [servicesRes]);

  // Kategori sayıları
  const countsByCategory = useMemo(() => {
    const m: Record<GardenCat, number> = {
      mevsimlik: 0,
      surekli: 0,
      ozel: 0,
      genel: 0,
    };
    for (const s of allServices) m[s.category] = (m[s.category] || 0) + 1;
    return m;
  }, [allServices]);

  // UI kategori listesi
  const uiCategories = useMemo(
    () => [
      {
        id: "tümü" as const,
        name: "Tüm Hizmetler",
        count: allServices.length,
      },
      {
        id: "mevsimlik" as const,
        name: CATEGORY_LABELS.mevsimlik,
        count: countsByCategory.mevsimlik,
      },
      {
        id: "surekli" as const,
        name: CATEGORY_LABELS.surekli,
        count: countsByCategory.surekli,
      },
      {
        id: "ozel" as const,
        name: CATEGORY_LABELS.ozel,
        count: countsByCategory.ozel,
      },
    ],
    [allServices.length, countsByCategory],
  );

  // Filtre
  const filteredServices = useMemo(() => {
    if (selectedCategory === "tümü") return allServices;
    return allServices.filter((s) => s.category === selectedCategory);
  }, [allServices, selectedCategory]);

  const openModal = (s: GardeningService) => {
    setSelectedService(s);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Breadcrumb */}
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
              <span>&gt;</span>
              <span>Mezar Çiçeklendirme</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Slider Section - Modern Design */}
      {slides.length > 0 && !isSlidesError && (
        <div className="relative bg-black">
          <div className="relative w-full h-96 overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={keyOfSlide(slide, index)}
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
                    alt={slide.alt ?? slide.title ?? `slide-${index}`}
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
                        document.getElementById("services-grid");
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

            {/* Dots Indicator - Modern Style */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
              {slides.map((slide, index) => (
                <button
                  key={`dot-${keyOfSlide(slide, index)}`}
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

      {/* Category Filters - Under Slider */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Desktop Version - Flex Layout */}
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              {uiCategories.map((category) => (
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
              {uiCategories.map((category) => (
                <Button
                  key={`m-${category.id}`}
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

      {/* Services Grid */}
      <div id="services-grid" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-gray-800 mb-4">
                {selectedCategory === "tümü"
                  ? "Tüm Çiçeklendirme Hizmetleri"
                  : uiCategories.find((cat) => cat.id === selectedCategory)
                      ?.name}
              </h2>
              <p className="text-gray-600">
                Profesyonel peyzaj ekibimizle mezar alanlarınızı
                güzelleştiriyoruz.
              </p>
            </div>

            {isServicesLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card
                    key={`skel-${i}`}
                    className="h-80 animate-pulse bg-white/60"
                  />
                ))}
              </div>
            )}

            {isServicesError && (
              <div className="text-center text-red-600 mb-8">
                Hizmetler yüklenemedi.
                <button
                  className="ml-2 underline"
                  onClick={() => refetchServices()}
                >
                  Tekrar dene
                </button>
              </div>
            )}

            {!isServicesLoading && !isServicesError && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredServices.map((service) => (
                    <Card
                      key={`svc-${service.id}`}
                      className="group hover:shadow-xl transition-all duration-300 bg-white border-0 overflow-hidden"
                    >
                      <div
                        className="relative cursor-pointer"
                        onClick={() => openModal(service)}
                      >
                        <ImageWithFallback
                          src={service.image}
                          alt={service.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {service.featured && (
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
                        {!!service.material && (
                          <div className="mb-3">
                            <Badge
                              variant="outline"
                              className="text-teal-600 border-teal-600 mb-2"
                            >
                              {service.material}
                            </Badge>
                          </div>
                        )}

                        <h3 className="text-lg text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                          {service.name}
                        </h3>

                        {!!service.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {service.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-teal-600">
                            {service.price || "Fiyat İçin Arayınız"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
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
                              const whatsappMessage = `Merhaba, ${service.name} hakkında bilgi almak istiyorum.`;
                              window.open(
                                `https://wa.me/905334838971?text=${encodeURIComponent(
                                  whatsappMessage,
                                )}`,
                                "_blank",
                              );
                            }}
                          >
                            WhatsApp&apos;tan Sor
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🌸</div>
                    <h3 className="text-xl text-gray-600 mb-2">
                      Bu kategoride henüz hizmet bulunmuyor
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Diğer kategorileri inceleyebilir veya bizimle iletişime
                      geçebilirsiniz.
                    </p>
                    <Button
                      onClick={() => setSelectedCategory("tümü")}
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      Tüm Hizmetleri Görüntüle
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Process Section ( dışarıdan component ) */}
      <ProcessSection />

      {/* Call to Action Section */}
      <div className="bg-teal-500 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl mb-4">Özel Peyzaj Tasarımı İstiyorsanız</h2>
            <p className="text-lg opacity-90 mb-8">
              Size özel peyzaj tasarımı için uzman ekibimizle iletişime geçin.
              Alanınıza uygun özel çözümler sunuyoruz.
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

      {/* Service Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white"
          aria-describedby={
            selectedService
              ? `service-description-${selectedService.id}`
              : "modal-content"
          }
        >
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-teal-600">
                  {selectedService.name}
                </DialogTitle>
                {!!selectedService.description && (
                  <DialogDescription
                    id={`service-description-${selectedService.id}`}
                    className="text-gray-600"
                  >
                    {selectedService.description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-6">
                {/* Main Image - Centered */}
                <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedService.image}
                    alt={selectedService.name}
                    className="w-full h-80 object-cover"
                  />
                  {selectedService.featured && (
                    <Badge className="absolute top-4 left-4 bg-teal-500 text-white">
                      Öne Çıkan Hizmet
                    </Badge>
                  )}
                </div>

                {/* Price and Category Info - Centered */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    {!!selectedService.material && (
                      <Badge
                        variant="outline"
                        className="text-teal-600 border-teal-600"
                      >
                        {selectedService.material}
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-700"
                    >
                      {CATEGORY_LABELS[selectedService.category] ??
                        selectedService.category}
                    </Badge>
                  </div>

                  <div className="text-2xl text-teal-600">
                    {selectedService.price || "Fiyat İçin Arayınız"}
                  </div>
                </div>

                {/* Service Specifications */}
                <div>
                  <h3 className="text-lg text-gray-800 mb-4 text-center">
                    Hizmet Detayları
                  </h3>
                  <div className="space-y-3">
                    {!!selectedService.area && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Alan:</span>
                        <span className="text-gray-800">
                          {selectedService.area}
                        </span>
                      </div>
                    )}
                    {!!selectedService.duration && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Süre:</span>
                        <span className="text-gray-800">
                          {selectedService.duration}
                        </span>
                      </div>
                    )}
                    {!!selectedService.maintenance && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Bakım:</span>
                        <span className="text-gray-800">
                          {selectedService.maintenance}
                        </span>
                      </div>
                    )}
                    {!!selectedService.season && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Mevsim:</span>
                        <span className="text-gray-800">
                          {selectedService.season}
                        </span>
                      </div>
                    )}
                    {!!selectedService.warranty && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Garanti:</span>
                        <span className="text-gray-800">
                          {selectedService.warranty}
                        </span>
                      </div>
                    )}
                    {!!selectedService.includes && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Dahil Olanlar:</span>
                        <span className="text-gray-800">
                          {selectedService.includes}
                        </span>
                      </div>
                    )}
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
                      const whatsappMessage = `Merhaba, ${selectedService.name} hakkında bilgi almak istiyorum.`;
                      window.open(
                        `https://wa.me/905334838971?text=${encodeURIComponent(
                          whatsappMessage,
                        )}`,
                        "_blank",
                      );
                    }}
                  >
                    💬 WhatsApp&apos;tan Sor
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
