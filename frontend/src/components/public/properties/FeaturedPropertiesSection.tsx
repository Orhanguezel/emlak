// src/components/public/properties/FeaturedPropertiesSection.tsx
"use client";

import { useMemo } from "react";
import { BadgeCheck, Home as HomeIcon, MapPin } from "lucide-react";

import { Button } from "../../ui/button";
import { ImageOptimized } from "../ImageOptimized";

import { useListPropertiesQuery } from "@/integrations/rtk/endpoints/properties.endpoints";
import {
  normalizeStatusLabel,
  normalizeTypeLabel,
  toUiProperty,
  unwrapList,
} from "./properties.selectors";
import type { Properties as PropertyView } from "@/integrations/rtk/types/properties";

export function FeaturedPropertiesSection(props: { onPropertyDetail: (slug: string) => void }) {
  const { onPropertyDetail } = props;

  const { data: featuredRaw, isFetching } = useListPropertiesQuery({
    active: true,
    featured: true,
    limit: 6,
    offset: 0,
  });

  const featured = useMemo(() => {
    const arr = unwrapList<PropertyView>(featuredRaw);
    return arr.map(toUiProperty).slice(0, 6);
  }, [featuredRaw]);

  if (isFetching) return null;
  if (!featured.length) return null;

  return (
    <div className="mb-10">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Öne Çıkan İlanlar</h2>
          <p className="text-gray-600">Sizin için seçilen ilanlar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {featured.map((p, index) => (
          <div
            key={p.id}
            onClick={() => p.slug && onPropertyDetail(p.slug)}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <ImageOptimized
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                priority={index < 3}
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
                  <div className="text-gray-600">
                    {p.neighborhood ? `${p.neighborhood} • ` : ""}
                    {p.address}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Button
                  variant="outline"
                  className="w-full border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  Detay
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
