// src/components/public/properties/PropertiesGallery.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, MapPin, Home as HomeIcon, BadgeCheck } from "lucide-react";

import { Button } from "../../ui/button";
import { SkeletonLoader } from "../SkeletonLoader";
import { ImageOptimized } from "../ImageOptimized";

import {
  useListPropertiesQuery,
  useListPropertyCitiesQuery,
  useListPropertyDistrictsQuery,
  useListPropertyNeighborhoodsQuery,
  useListPropertyStatusesQuery,
  useListPropertyTypesQuery,
} from "@/integrations/rtk/endpoints/properties.endpoints";

import { PropertiesFiltersPanel } from "./PropertiesFiltersPanel";
import { usePropertiesFilters } from "./usePropertiesFilters";
import { FeaturedPropertiesSection } from "./FeaturedPropertiesSection";

import {
  toSelectOptions,
  unwrapList,
  toUiProperty,
  normalizeStatusLabel,
  normalizeTypeLabel,
} from "./properties.selectors";
import type { Properties as PropertyView } from "@/integrations/rtk/types/properties";

export function PropertiesGallery(props: {
  searchTerm: string;
  showSearchResults: boolean;
  onClearSearch: () => void;
  onPropertyDetail: (slug: string) => void;
  refreshKey?: number;
}) {
  const { searchTerm, showSearchResults, onClearSearch, onPropertyDetail, refreshKey } = props;

  const [visibleItems, setVisibleItems] = useState(12);
  const [softLoading, setSoftLoading] = useState(true);

  const { filters, setFilters, showAdvanced, setShowAdvanced, clearLocalFilters, queryParams } =
    usePropertiesFilters({ showSearchResults, searchTerm });

  // Search mode’da input’u senkronla (istersen kaldır)
  useEffect(() => {
    if (showSearchResults) {
      setFilters((p) => ({ ...p, search: searchTerm || "" }));
    }
  }, [showSearchResults, searchTerm, setFilters]);

  const { data: citiesRaw = [] } = useListPropertyCitiesQuery();
  const { data: districtsRaw = [] } = useListPropertyDistrictsQuery();
  const { data: neighborhoodsRaw = [] } = useListPropertyNeighborhoodsQuery();
  const { data: typesRaw = [] } = useListPropertyTypesQuery();
  const { data: statusesRaw = [] } = useListPropertyStatusesQuery();

  const options = useMemo(
    () => ({
      cities: toSelectOptions(citiesRaw),
      districts: toSelectOptions(districtsRaw),
      neighborhoods: toSelectOptions(neighborhoodsRaw),
      types: toSelectOptions(typesRaw),
      statuses: toSelectOptions(statusesRaw),
    }),
    [citiesRaw, districtsRaw, neighborhoodsRaw, typesRaw, statusesRaw],
  );

  const { data: listRes, isFetching } = useListPropertiesQuery(queryParams);

  useEffect(() => {
    setSoftLoading(true);
    const t = setTimeout(() => setSoftLoading(false), 250);
    return () => clearTimeout(t);
  }, [queryParams, showSearchResults, searchTerm, refreshKey]);

  const uiProps = useMemo(() => {
    const arr = unwrapList<PropertyView>(listRes);
    return arr.map(toUiProperty).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [listRes]);

  const isLoading = isFetching || softLoading;
  const displayed = useMemo(() => uiProps.slice(0, visibleItems), [uiProps, visibleItems]);

  useEffect(() => setVisibleItems(12), [queryParams, showSearchResults, searchTerm]);

  const loadMore = () => setVisibleItems((p) => p + 12);

  const onCardClick = (slug: string) => {
    const s = (slug || "").trim();
    if (s) onPropertyDetail(s);
  };

  const formatPrice = (price?: string | null, currency?: string | null) => {
    if (!price) return null;
    return `${price} ${currency || "TRY"}`;
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
          <>
            <FeaturedPropertiesSection onPropertyDetail={onPropertyDetail} />
            <PropertiesFiltersPanel
              filters={filters}
              setFilters={setFilters}
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              clearLocalFilters={clearLocalFilters}
              options={options}
            />
          </>
        )}

        {isLoading ? (
          <SkeletonLoader type="grid" count={12} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
              {displayed.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => onCardClick(p.slug)}
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

                    {p.images.length > 1 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-white/95 text-slate-900 px-3 py-1 text-xs font-semibold border border-gray-200">
                          {p.images.length} fotoğraf
                        </span>
                      </div>
                    )}
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
                        <div className="text-gray-600">
                          {p.neighborhood ? `${p.neighborhood} • ` : ""}
                          {p.address}
                        </div>
                      </div>
                    </div>

                    {(p.price || p.rooms || p.gross_m2) && (
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        {p.price && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800 font-semibold">
                            {formatPrice(p.price, p.currency)}
                          </span>
                        )}
                        {p.rooms && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800 font-semibold">
                            {p.rooms}
                          </span>
                        )}
                        {typeof p.gross_m2 === "number" && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800 font-semibold">
                            {p.gross_m2} m²
                          </span>
                        )}
                      </div>
                    )}

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
