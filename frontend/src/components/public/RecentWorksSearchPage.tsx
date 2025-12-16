// =============================================================
// FILE: src/components/public/RecentWorksSearchPage.tsx
// =============================================================
"use client";

import React, { useMemo, useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
  Search,
  MapPin,
  Package,
  ChevronLeft,
} from "lucide-react";
import { useListRecentWorksQuery } from "@/integrations/rtk/endpoints/recent_works.endpoints";
import type { RecentWorkView } from "@/integrations/rtk/types/recent_works";

interface RecentWorksSearchPageProps {
  onNavigate: (page: string) => void;
  onWorkSelect?: (work: RecentWorkView) => void;
}

function pickWorkImage(w?: Partial<RecentWorkView> | null) {
  return (
    w?.image_effective_url ||
    w?.image_url ||
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop"
  );
}

function matchWork(w: RecentWorkView, q: string) {
  const tokens = q
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (!tokens.length) return true;
  const hay = [
    w.title,
    w.description,
    w.category,
    w.material,
    w.location,
    w.date,
    ...(Array.isArray(w.seo_keywords) ? w.seo_keywords : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return tokens.every((t) => hay.includes(t));
}

const RecentWorksSearchPage: React.FC<RecentWorksSearchPageProps> = ({
  onNavigate,
  onWorkSelect,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    data: works = [],
    isLoading,
    isError,
    refetch,
  } = useListRecentWorksQuery({
    sort: "display_order",
    orderDir: "asc",
    limit: 300,
  });

  const filteredWorks = useMemo(() => {
    if (!works.length) return [];
    if (!searchKeyword.trim()) return works;
    return (works as RecentWorkView[]).filter((w) =>
      matchWork(w, searchKeyword),
    );
  }, [works, searchKeyword]);

  const handleWorkClick = (work: RecentWorkView) => onWorkSelect?.(work);

  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-teal-800 mb-4">Son Çalışmalarımız</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Yıllarca aile ve sevdiklerinize saygıyla hizmet eden, kaliteli ve
            özel tasarım mezar taşı çalışmalarımızı keşfedin.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="mb-12">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=500&fit=crop"
                alt="Mezar taşı çalışmaları"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl mb-2">Başarılı Projelerimiz</h3>
                <p className="text-lg opacity-90">
                  15+ yıllık deneyim ile kaliteli hizmet
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="text-center mb-12">
            <h2 className="text-2xl text-teal-700 mb-6">
              Çalışmalarımızı Keşfedin
            </h2>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Anahtar kelime girin (örn: granit şile 2024)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // ekstra bir şey yapmaya gerek yok; filtre zaten input’a bağlı
                    }
                  }}
                  className="w-full pl-4 pr-12 py-3 text-lg border-2 border-teal-200 focus:border-teal-500 rounded-lg"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-400 w-5 h-5" />
              </div>
              <p className="mt-4 text-slate-600">
                {isLoading
                  ? "Yükleniyor..."
                  : `${filteredWorks.length} çalışma bulundu`}
              </p>
            </div>
          </div>

          {/* States & Grid */}
          {isError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">
                Kayıtlar yüklenemedi. Lütfen tekrar deneyin.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Yenile
              </Button>
            </div>
          ) : (
            <div className="mb-12">
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={`skel-${i}`} className="overflow-hidden">
                      <div className="w-full h-[200px] bg-gray-200 animate-pulse" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                        <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
                        <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredWorks.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(filteredWorks as RecentWorkView[]).map((work) => (
                    <Card
                      key={work.id}
                      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      onClick={() => handleWorkClick(work)}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <ImageWithFallback
                            src={pickWorkImage(work)}
                            alt={work.alt ?? work.title}
                            className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {!!work.date && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-teal-600 text-white">
                                {work.date}
                              </Badge>
                            </div>
                          )}
                          {!!work.category && (
                            <div className="absolute top-3 left-3">
                              <Badge
                                variant="secondary"
                                className="bg-white/90 text-teal-800"
                              >
                                {work.category}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
                            {work.title}
                          </h3>

                          {!!work.description && (
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {work.description}
                            </p>
                          )}

                          <div className="space-y-2 text-xs text-slate-500">
                            {!!work.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                <span>{work.location}</span>
                              </div>
                            )}
                            {!!work.material && (
                              <div className="flex items-center gap-2">
                                <Package className="w-3 h-3" />
                                <span>{work.material}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 pt-3 border-t">
                            <span className="text-xs text-teal-600 group-hover:text-teal-700 transition-colors">
                              Detayları görüntüle →
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-slate-500 mb-4">
                    Aradığınız kriterlere uygun çalışma bulunamadı.
                  </p>
                  <Button
                    onClick={() => setSearchKeyword("")}
                    variant="outline"
                    className="border-teal-200 text-teal-700 hover:bg-teal-50"
                  >
                    Tüm Çalışmaları Görüntüle
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Back button */}
          <div className="text-center mb-8">
            <Button
              onClick={() => onNavigate("home")}
              className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentWorksSearchPage;
