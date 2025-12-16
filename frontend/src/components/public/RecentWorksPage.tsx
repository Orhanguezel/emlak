// =============================================================
// FILE: src/components/public/RecentWorksPage.tsx
// =============================================================
"use client";

import { useMemo, useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";
import heroImg from "figma:asset/ea63b76f8fbdbdcea873602cb1397bbff2654df4.png";
import { useListRecentWorksQuery } from "@/integrations/rtk/endpoints/recent_works.endpoints";
import type { RecentWorkView } from "@/integrations/rtk/types/recent_works";

interface RecentWorksPageProps {
  onNavigate: (page: string) => void;
}

function pickWorkImage(w?: Partial<RecentWorkView> | null) {
  return (
    w?.image_effective_url ||
    w?.image_url ||
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop"
  );
}

export function RecentWorksPage({ onNavigate }: RecentWorksPageProps) {
  const {
    data: works = [],
    isLoading,
    isError,
    refetch,
  } = useListRecentWorksQuery({
    sort: "display_order",
    orderDir: "asc",
    limit: 200,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const selectedWork = useMemo(
    () =>
      (works as RecentWorkView[]).find((w) => String(w.id) === selectedId) ||
      null,
    [works, selectedId],
  );

  const selectedImages: string[] = useMemo(() => {
    const anyW = selectedWork as any;
    if (anyW?.images && Array.isArray(anyW.images) && anyW.images.length) {
      return anyW.images.filter((x: unknown) => typeof x === "string" && x);
    }
    const one = pickWorkImage(selectedWork || undefined);
    return one ? [one] : [];
  }, [selectedWork]);

  const nextImage = () => {
    if (!selectedImages.length) return;
    setCurrentImageIndex((p) =>
      p === selectedImages.length - 1 ? 0 : p + 1,
    );
  };
  const prevImage = () => {
    if (!selectedImages.length) return;
    setCurrentImageIndex((p) =>
      p === 0 ? selectedImages.length - 1 : p - 1,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-teal-500 text-white py-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="relative container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl mb-4">SON ÇALIŞMALARIMIZ</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              Mezar yapımı alanında gerçekleştirdiğimiz son projeler ve
              çalışmalarımız.
              {" "}
              Kaliteli mezar modelleri ve profesyonel işçilik örnekleri.
            </p>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="mb-8">
          <Button
            onClick={() => onNavigate("home")}
            variant="outline"
            className="mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skel-${i}`}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="w-full h-64 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
                  <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Kayıtlar yüklenemedi. Lütfen tekrar deneyin.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Yenile
            </Button>
          </div>
        )}

        {/* Grid view */}
        {!isLoading && !isError && !selectedWork && (
          <>
            {(works as RecentWorkView[]).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(works as RecentWorkView[]).map((w) => {
                  const img = pickWorkImage(w);
                  const imgCount =
                    (w as any)?.images && Array.isArray((w as any).images)
                      ? (w as any).images.length
                      : 1;

                  return (
                    <div
                      key={`work-${w.id}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedId(String(w.id));
                        setCurrentImageIndex(0);
                      }}
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={img}
                          alt={w.alt ?? w.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-sm">
                          {imgCount} Fotoğraf
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          {!!w.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {w.date}
                            </div>
                          )}
                          {!!w.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {w.location}
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl mb-3 text-teal-600">
                          {w.title}
                        </h3>
                        {!!w.description && (
                          <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-3">
                            {w.description}
                          </p>
                        )}

                        <div className="border-t pt-3">
                          <p className="text-xs text-teal-500 mb-2 font-semibold">
                            Proje Detayları:
                          </p>
                          {!!w.category && (
                            <p className="text-xs text-gray-500">
                              {w.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-16">
                Kayıt bulunamadı.
              </div>
            )}
          </>
        )}

        {/* Detail view */}
        {!isLoading && !isError && selectedWork && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <Button
                onClick={() => setSelectedId(null)}
                variant="outline"
                className="mb-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Projelere Geri Dön
              </Button>

              {selectedWork && (
                <div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {!!selectedWork.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {selectedWork.date}
                      </div>
                    )}
                    {!!selectedWork.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedWork.location}
                      </div>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-3xl mb-4 text-teal-600">
                    {selectedWork.title}
                  </h1>

                  {/* Carousel */}
                  <div className="mb-8">
                    <div className="relative">
                      <ImageWithFallback
                        src={
                          selectedImages[currentImageIndex] ||
                          pickWorkImage(selectedWork)
                        }
                        alt={selectedWork.alt ?? selectedWork.title}
                        className="w-full h-96 object-cover rounded-lg"
                      />

                      {selectedImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>

                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {selectedImages.map((_, index) => (
                              <button
                                key={`dot-${index}`}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                  index === currentImageIndex
                                    ? "bg-white"
                                    : "bg-white bg-opacity-50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl mb-4 text-teal-600">
                        Proje Açıklaması
                      </h3>
                      {!!selectedWork.description && (
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {selectedWork.description}
                        </p>
                      )}

                      {!!selectedWork.category && (
                        <div className="bg-teal-50 p-4 rounded-lg">
                          <h4 className="text-teal-600 mb-2">Kategori</h4>
                          <p className="text-sm text-gray-600">
                            {selectedWork.category}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl mb-4 text-teal-600">
                        Proje Özellikleri
                      </h3>
                      <ul className="space-y-3">
                        {!!selectedWork.details?.dimensions && (
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">
                              Boyutlar: {selectedWork.details.dimensions}
                            </span>
                          </li>
                        )}
                        {!!selectedWork.details?.workTime && (
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">
                              Çalışma Süresi: {selectedWork.details.workTime}
                            </span>
                          </li>
                        )}
                        {!!selectedWork.material && (
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">
                              Malzeme: {selectedWork.material}
                            </span>
                          </li>
                        )}
                        {Array.isArray(selectedWork.details?.specialFeatures) &&
                          selectedWork.details!.specialFeatures.map(
                            (detail, index) => (
                              <li
                                key={`feat-${index}`}
                                className="flex items-start gap-3"
                              >
                                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-700">
                                  {detail}
                                </span>
                              </li>
                            ),
                          )}
                      </ul>

                      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                        <h4 className="text-lg mb-4 text-teal-600">
                          Bu Proje Hakkında Bilgi Alın
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Benzer bir proje için bilgi almak veya teklif
                          istemek için bizimle iletişime geçin.
                        </p>
                        <Button
                          onClick={() =>
                            window.open("tel:+905334838971", "_self")
                          }
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Hemen Ara: 0533 483 89 71
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
