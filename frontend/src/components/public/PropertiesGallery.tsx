// =============================================================
// FILE: src/components/public/PropertiesGallery.tsx
// X Emlak – Emlak Listesi (Properties)
// =============================================================
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, MapPin, Home as HomeIcon, BadgeCheck } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SkeletonLoader } from "./SkeletonLoader";
import { ImageOptimized } from "./ImageOptimized";

import {
  useListPropertiesQuery,
  useListPropertyCitiesQuery,
  useListPropertyDistrictsQuery,
  useListPropertyStatusesQuery,
  useListPropertyTypesQuery,
} from "@/integrations/rtk/endpoints/properties.endpoints";

import type { Properties as PropertyView } from "@/integrations/rtk/types/properties";

// ----------------------------- types -----------------------------

type UiProperty = {
  id: string;
  slug: string;
  title: string;

  type: string;
  status: string;

  address: string;
  district: string;
  city: string;

  description?: string | null;

  created_at: string;
  display_order: number;

  image: string; // ✅ her zaman string
};

type Filters = {
  search: string;
  city: string;
  district: string;
  type: string;
  status: string;
};

// ----------------------------- helpers -----------------------------

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

function safeImage(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : PLACEHOLDER_IMG;
}

function toUiProperty(p: PropertyView): UiProperty {
  // Backend ileride image döndürürse: image / image_url / cover gibi alanları da yakala
  const img = safeImage((p as any).image ?? (p as any).image_url ?? (p as any).cover);

  return {
    id: String((p as any).id),
    slug: String((p as any).slug ?? ""),
    title: String((p as any).title ?? ""),

    type: String((p as any).type ?? ""),
    status: String((p as any).status ?? ""),

    address: String((p as any).address ?? ""),
    district: String((p as any).district ?? ""),
    city: String((p as any).city ?? ""),

    description: (p as any).description ?? null,

    created_at: String((p as any).created_at ?? ""),
    display_order: Number((p as any).display_order ?? 0),

    image: img,
  };
}

function normalizeStatusLabel(v: string): string {
  const s = (v || "").toLowerCase();
  if (s === "sold") return "Satıldı";
  if (s === "new") return "Yeni";
  if (s === "in_progress") return "Süreçte";
  return v || "Durum";
}

function normalizeTypeLabel(v: string): string {
  return v || "Tür";
}

function toSelectOptions(arr: unknown): string[] {
  return Array.isArray(arr) ? (arr as any[]).map((x) => String(x)) : [];
}

// ----------------------------- props -----------------------------

interface PropertiesGalleryProps {
  searchTerm: string;
  showSearchResults: boolean;
  onClearSearch: () => void;

  onPropertyDetail: (slug: string) => void;

  refreshKey?: number;
}

// ----------------------------- component -----------------------------

export function PropertiesGallery({
  searchTerm,
  showSearchResults,
  onClearSearch,
  onPropertyDetail,
  refreshKey,
}: PropertiesGalleryProps) {
  const [visibleItems, setVisibleItems] = useState(12);
  const [softLoading, setSoftLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    city: "",
    district: "",
    type: "",
    status: "",
  });

  useEffect(() => {
    if (showSearchResults) {
      setFilters((p) => ({ ...p, search: searchTerm || "" }));
    }
  }, [showSearchResults, searchTerm]);

  const { data: citiesRaw = [] } = useListPropertyCitiesQuery();
  const { data: districtsRaw = [] } = useListPropertyDistrictsQuery();
  const { data: typesRaw = [] } = useListPropertyTypesQuery();
  const { data: statusesRaw = [] } = useListPropertyStatusesQuery();

  const cities = useMemo(() => toSelectOptions(citiesRaw), [citiesRaw]);
  const districts = useMemo(() => toSelectOptions(districtsRaw), [districtsRaw]);
  const types = useMemo(() => toSelectOptions(typesRaw), [typesRaw]);
  const statuses = useMemo(() => toSelectOptions(statusesRaw), [statusesRaw]);

  const queryParams = useMemo(() => {
    const q: any = { active: true, limit: 60, offset: 0 };

    if (showSearchResults && searchTerm.trim()) {
      q.search = searchTerm.trim();
      return q;
    }

    if (filters.search.trim()) q.search = filters.search.trim();
    if (filters.city) q.city = filters.city;
    if (filters.district) q.district = filters.district;
    if (filters.type) q.type = filters.type;
    if (filters.status) q.status = filters.status;

    return q;
  }, [filters, showSearchResults, searchTerm]);

  const { data: listRes, isFetching } = useListPropertiesQuery(queryParams);

  useEffect(() => {
    setSoftLoading(true);
    const t = setTimeout(() => setSoftLoading(false), 250);
    return () => clearTimeout(t);
  }, [filters, showSearchResults, searchTerm, refreshKey]);

  const uiProps: UiProperty[] = useMemo(() => {
    const arr = Array.isArray(listRes) ? listRes : [];
    return arr
      .map(toUiProperty)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [listRes]);

  const isLoading = isFetching || softLoading;
  const displayed = useMemo(() => uiProps.slice(0, visibleItems), [uiProps, visibleItems]);

  useEffect(() => {
    setVisibleItems(12);
  }, [
    filters.city,
    filters.district,
    filters.type,
    filters.status,
    filters.search,
    showSearchResults,
    searchTerm,
  ]);

  const loadMore = () => setVisibleItems((p) => p + 12);

  const clearLocalFilters = () => {
    setFilters({ search: "", city: "", district: "", type: "", status: "" });
  };

  const onCardClick = (p: UiProperty) => {
    if (p.slug) onPropertyDetail(p.slug);
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50" id="properties">
      <div className="container mx-auto px-4 max-w-7xl">
        {showSearchResults && (
          <div className="text-center mb-10">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  “{searchTerm}” için Arama Sonuçları
                </h2>
                <Button
                  onClick={onClearSearch}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  <X className="w-4 h-4" />
                  Temizle
                </Button>
              </div>
              <p className="text-base md:text-lg text-gray-600">{uiProps.length} ilan bulundu</p>
            </div>
          </div>
        )}

        {!showSearchResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <div className="text-lg font-semibold text-slate-900">Filtreler</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearLocalFilters}
                  className="border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  Filtreleri Temizle
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <Input
                    value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                    placeholder="İlan ara (başlık, adres, ilçe...)"
                    className="pr-10"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <select
                value={filters.city}
                onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
              >
                <option value="">Şehir</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={filters.district}
                onChange={(e) => setFilters((p) => ({ ...p, district: e.target.value }))}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
              >
                <option value="">İlçe</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
              >
                <option value="">Tür</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {normalizeTypeLabel(t)}
                  </option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
              >
                <option value="">Durum</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {normalizeStatusLabel(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {isLoading ? (
          <SkeletonLoader type="grid" count={12} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
              {displayed.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => onCardClick(p)}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <ImageOptimized
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={index < 6}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                    />

                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        {normalizeStatusLabel(p.status)}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 text-slate-900 px-3 py-1 text-xs font-semibold border border-gray-200">
                        <HomeIcon className="w-3.5 h-3.5" />
                        {normalizeTypeLabel(p.type)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                      {p.title}
                    </h3>

                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                      <div className="line-clamp-2">
                        <div className="font-medium">
                          {p.district}, {p.city}
                        </div>
                        <div className="text-gray-600">{p.address}</div>
                      </div>
                    </div>

                    {p.description && (
                      <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                        {p.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {visibleItems < uiProps.length && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  Daha Fazla Göster ({uiProps.length - visibleItems} ilan daha)
                </Button>
              </div>
            )}

            {uiProps.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Search className="w-14 h-14 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {showSearchResults ? "Arama sonucu bulunamadı" : "İlan bulunamadı"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {showSearchResults
                      ? `“${searchTerm}” ile eşleşen ilan bulunamadı.`
                      : "Seçtiğiniz filtrelerde ilan bulunmuyor. Filtreleri değiştirip tekrar deneyin."}
                  </p>
                </div>

                {showSearchResults ? (
                  <Button onClick={onClearSearch} className="bg-slate-900 hover:bg-slate-800 text-white">
                    Tüm İlanları Görüntüle
                  </Button>
                ) : (
                  <Button onClick={clearLocalFilters} className="bg-slate-900 hover:bg-slate-800 text-white">
                    Filtreleri Temizle
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
