"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Variant = "gardening" | "soil" | "default";

type ServicesEmptyStateProps = {
  variant?: Variant;
  title?: string;
  message?: string;
  phone?: string; // "tel:+90..." şeklinde
  onShowAll?: () => void;   // "Tüm Hizmetleri Görüntüle"
  onContact?: () => void;   // "Fiyat Teklifi Al" ya da iletişim sayfasına git
  className?: string;
};

const defaults: Record<Variant, { emoji: string; title: string; message: string; showAllLabel: string; contactLabel: string; }> = {
  gardening: {
    emoji: "🌸",
    title: "Bu kategoride henüz hizmet bulunmuyor",
    message: "Diğer kategorileri inceleyebilir veya bizimle iletişime geçebilirsiniz.",
    showAllLabel: "Tüm Hizmetleri Görüntüle",
    contactLabel: "Fiyat Teklifi Al",
  },
  soil: {
    emoji: "🏗️",
    title: "Bu kategoride henüz hizmet bulunmuyor",
    message: "Diğer kategorileri inceleyebilir veya bizimle iletişime geçebilirsiniz.",
    showAllLabel: "Tüm Hizmetleri Görüntüle",
    contactLabel: "Fiyat Teklifi Al",
  },
  default: {
    emoji: "ℹ️",
    title: "Kayıt bulunamadı",
    message: "Filtreleri temizleyebilir veya bizimle iletişime geçebilirsiniz.",
    showAllLabel: "Tümünü Göster",
    contactLabel: "İletişime Geç",
  },
};

export function ServicesEmptyState({
  variant = "default",
  title,
  message,
  phone,
  onShowAll,
  onContact,
  className,
}: ServicesEmptyStateProps) {
  const d = defaults[variant];

  return (
    <Card className={`text-center py-12 shadow-none border-0 bg-transparent ${className || ""}`}>
      <CardContent>
        <div className="mx-auto max-w-md">
          <div className="text-gray-400 text-6xl mb-4">{d.emoji}</div>
          <h3 className="text-xl text-gray-700 mb-2">
            {title ?? d.title}
          </h3>
          <p className="text-gray-500 mb-6">
            {message ?? d.message}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onShowAll && (
              <Button
                onClick={onShowAll}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                {d.showAllLabel}
              </Button>
            )}
            {onContact && (
              <Button
                variant="outline"
                className="text-teal-600 border-teal-600 hover:bg-teal-50"
                onClick={onContact}
              >
                {d.contactLabel}
              </Button>
            )}
            {phone && (
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => window.open(phone.startsWith("tel:") ? phone : `tel:${phone}`)}
              >
                📞 Hemen Ara
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
