// src/components/public/InfoCards.tsx
import React from "react";
import {
  HelpCircle,
  MapPin,
  Phone,
  FileText,
  Settings,
  Users,
  Calendar,
  Shield,
  Star,
} from "lucide-react";
import { useListInfoCardsQuery } from "@/integrations/rtk/endpoints/info_cards.endpoints";
import type { InfoCardView } from "@/integrations/rtk/types/infoCards";

interface InfoCardsProps {
  onNavigate: (page: string) => void;
}

// Basit bir ikon registry (BE'den gelen lucide_icon isimlerini bu map ile eşliyoruz)
const iconRegistry: Record<string, React.ComponentType<any>> = {
  helpcircle: HelpCircle,
  mappin: MapPin,
  phone: Phone,
  filetext: FileText,
  settings: Settings,
  users: Users,
  calendar: Calendar,
  shield: Shield,
  star: Star,
};

function resolveLucide(name?: string | null) {
  if (!name) return HelpCircle;
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  return iconRegistry[key] || HelpCircle;
}

export function InfoCards({ onNavigate }: InfoCardsProps) {
  const {
    data = [],
    isFetching,
    isError,
  } = useListInfoCardsQuery(undefined, {
    // endpoint seviyesinde değil, hook opsiyonunda kullan
    refetchOnMountOrArgChange: 30,
  });

  // Sadece aktif olanlar + display_order'a göre sıralama
  const cards: InfoCardView[] = (data as InfoCardView[])
    .filter((c) => c.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const handleCardClick = (link: string) => {
    // Özel yönlendirme kuralı (mevcut davranış korunur)
    if (link === "contact" || link === "cemetery-addresses") {
      onNavigate("cemeteries");
      return;
    }
    onNavigate(link);
  };

  // Loading skeleton
  if (isFetching) {
    return (
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl p-8 border bg-white">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 rounded-full w-16 h-16 animate-pulse" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Hata durumu
  if (isError) {
    return (
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center text-red-600">
            <p>Bilgi kartları yüklenemedi.</p>
          </div>
        </div>
      </section>
    );
  }

  // Boş durum
  if (!cards.length) {
    return (
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center text-gray-500">
            <p>Henüz bilgi kartı eklenmemiş.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card) => {
            const Icon = card.icon_type === "lucide" ? resolveLucide(card.lucide_icon) : HelpCircle;
            const bgColor = card.bg_color || "bg-white";
            const hoverColor = card.hover_color || "hover:bg-gray-50";
            const iconColor = card.icon_color || "text-emerald-600";
            const textColor = card.text_color || "text-slate-800";
            const borderColor = card.border_color || "border-slate-200";

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.link)}
                className={`${bgColor} ${hoverColor} rounded-xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border ${borderColor}`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white rounded-full p-4 shadow-md">
                      {card.icon_type === "emoji" ? (
                        <span className="text-2xl md:text-3xl">{card.icon}</span>
                      ) : (
                        <Icon className={`w-8 h-8 md:w-10 md:h-10 ${iconColor}`} />
                      )}
                    </div>
                  </div>
                  <h3 className={`text-base md:text-lg ${textColor} leading-tight`}>{card.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default InfoCards;
