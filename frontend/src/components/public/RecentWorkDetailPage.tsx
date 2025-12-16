// =============================================================
// FILE: src/components/public/RecentWorkDetailPage.tsx
// =============================================================
"use client";

import React from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  useGetRecentWorkBySlugQuery,
  useGetRecentWorkQuery,
} from "@/integrations/rtk/endpoints/recent_works.endpoints";
import type { RecentWorkView } from "@/integrations/rtk/types/recent_works";

type Props = {
  onBack: () => void;
  /** Tercihen id gönder; yoksa slug gönder. İkisi birden gelirse id öncelikli. */
  id?: string | number | undefined;
  slug?: string | undefined;
  /** Modal’den geçici veri gelebilir; id/slug yoksa bundan render ederiz. */
  work?: Partial<RecentWorkView> | null | undefined;
};

function pickWorkImage(w?: Partial<RecentWorkView> | null) {
  return (
    w?.image_effective_url ||
    w?.image_url ||
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop"
  );
}

export const RecentWorkDetailPage: React.FC<Props> = ({
  slug,
  id,
  onBack,
  work: hint,
}) => {
  // Prop’lardan ve hint’ten olası kimlikleri topla
  const idStr =
    id != null ? String(id) : hint?.id != null ? String(hint.id) : undefined;
  const slugStr = (slug ?? hint?.slug ?? "").trim() || undefined;

  // ID varsa onu kullan, yoksa slug
  const useId = !!idStr;
  const useSlug = !useId && !!slugStr;

  const byId = useGetRecentWorkQuery(idStr!, { skip: !useId });
  const bySlug = useGetRecentWorkBySlugQuery(slugStr!, { skip: !useSlug });

  const isFetching =
    (useId && byId.isFetching) || (useSlug && bySlug.isFetching);
  const isError = (useId && byId.isError) || (useSlug && bySlug.isError);

  // Önce canlı veri, yoksa hint ile render et
  const work: Partial<RecentWorkView> | undefined =
    (useId ? byId.data : undefined) ??
    (useSlug ? bySlug.data : undefined) ??
    hint ??
    undefined;

  if (isFetching && !work) {
    // Skeleton: kart genişliğini de koruyalım
    return (
      <div className="bg-white max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="text-center space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded mx-auto animate-pulse" />
          <div className="h-7 w-3/4 bg-gray-200 rounded mx-auto animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded mx-auto animate-pulse" />
        </div>
        <div className="flex justify-center">
          <div className="w-80 h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="h-4 w-2/3 bg-gray-200 rounded mx-auto animate-pulse" />
      </div>
    );
  }

  if (isError && !work) {
    return (
      <div className="bg-white max-w-2xl mx-auto p-6 space-y-6 text-center">
        <p className="text-red-600">Çalışma yüklenirken bir hata oluştu.</p>
        <Button variant="outline" onClick={onBack}>
          ← Geri
        </Button>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="bg-white max-w-2xl mx-auto p-6 space-y-6 text-center">
        <p className="text-gray-600">Kayıt bulunamadı.</p>
        <Button variant="outline" onClick={onBack}>
          ← Geri
        </Button>
      </div>
    );
  }

  const img = pickWorkImage(work);
  const price = work.price || "Fiyat İçin Arayınız";
  const features = Array.isArray(work.details?.specialFeatures)
    ? work.details!.specialFeatures
    : [];

  return (
    <div className="bg-white max-w-2xl mx-auto p-6 space-y-6">
      {/* Back button */}
      <div className="flex">
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Geri
        </Button>
      </div>

      {/* Header with Category Badge */}
      <div className="text-center space-y-4">
        <Badge className="bg-teal-500 text-white px-3 py-1 text-sm">
          Öne Çıkan Model
        </Badge>

        <h1 className="text-xl text-teal-600 leading-tight">
          {work.title}
        </h1>

        {!!work.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {work.description}
          </p>
        )}
      </div>

      {/* Main Image */}
      <div className="flex justify-center">
        <div className="w-80 h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          <ImageWithFallback
            src={img}
            alt={work.alt ?? work.title ?? "Çalışma görseli"}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Material Badges */}
      <div className="flex justify-center gap-2">
        {!!work.material && (
          <Badge
            variant="outline"
            className="text-teal-600 border-teal-300 px-3 py-1"
          >
            {work.material}
          </Badge>
        )}
        {!!work.category && (
          <Badge
            variant="outline"
            className="text-teal-600 border-teal-300 px-3 py-1"
          >
            {work.category}
          </Badge>
        )}
      </div>

      {/* Price Section */}
      <div className="text-center">
        <p className="text-lg text-teal-600 mb-4">{price}</p>

        <div className="flex gap-3 justify-center">
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white px-6"
            onClick={() => {
              const m = `Merhaba, "${work.title}" için fiyat teklifi almak istiyorum.`;
              window.open(
                `https://wa.me/905334838971?text=${encodeURIComponent(m)}`,
                "_blank",
              );
            }}
          >
            Fiyat Teklifi Al
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 px-6"
            onClick={() => {
              const m = `Merhaba, "${work.title}" hakkında bilgi almak istiyorum.`;
              window.open(
                `https://wa.me/905334838971?text=${encodeURIComponent(m)}`,
                "_blank",
              );
            }}
          >
            📱 WhatsApp&apos;tan Sor
          </Button>
        </div>
      </div>

      {/* Technical Details */}
      <div className="space-y-3">
        <h3 className="text-center text-gray-800 mb-4">Teknik Özellikler</h3>

        <div className="grid grid-cols-2 gap-y-2 text-sm">
          {!!work.details?.dimensions && (
            <div className="flex justify-between">
              <span className="text-gray-600">Boyutlar:</span>
              <span className="text-gray-800">
                {work.details.dimensions}
              </span>
            </div>
          )}

          {!!work.details?.workTime && (
            <div className="flex justify-between">
              <span className="text-gray-600">Çalışma Süresi:</span>
              <span className="text-gray-800">
                {work.details.workTime}
              </span>
            </div>
          )}

          {!!work.location && (
            <div className="flex justify-between">
              <span className="text-gray-600">Lokasyon:</span>
              <span className="text-gray-800">{work.location}</span>
            </div>
          )}

          {!!work.date && (
            <div className="flex justify-between">
              <span className="text-gray-600">Yıl:</span>
              <span className="text-gray-800">{work.date}</span>
            </div>
          )}
        </div>
      </div>

      {/* Special Features */}
      {features.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-center text-gray-800 text-sm">
            Özel Özellikler
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {features.map((feature, index) => (
              <Badge
                key={`${feature}-${index}`}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
