// =============================================================
// FILE: src/components/public/PropertiesGallery.tsx
// X Emlak – Emlak Listesi (Properties) – FULL FILTER + MULTI IMAGE
// =============================================================
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, MapPin, Home as HomeIcon, BadgeCheck, SlidersHorizontal } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { SkeletonLoader } from "./SkeletonLoader";
import { ImageOptimized } from "./ImageOptimized";

import {
  useListPropertiesQuery,
  useListPropertyCitiesQuery,
  useListPropertyDistrictsQuery,
  useListPropertyNeighborhoodsQuery,
  useListPropertyStatusesQuery,
  useListPropertyTypesQuery,
} from "@/integrations/rtk/endpoints/properties.endpoints";

import type { Properties as PropertyView, PropertyAssetPublic } from "@/integrations/rtk/types/properties";

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
  neighborhood?: string | null;

  description?: string | null;

  price?: string | null;
  currency?: string | null;

  rooms?: string | null;
  gross_m2?: number | null;

  created_at: string;
  display_order: number;

  image: string;  // ✅ cover image string
  images: string[]; // ✅ at least 1
};

type Filters = {
  // base
  search: string;
  city: string;
  district: string;
  neighborhood: string;
  type: string;
  status: string;

  // range
  price_min: string;
  price_max: string;

  gross_m2_min: string;
  gross_m2_max: string;

  // room
  rooms: string;
  bedrooms_min: string;
  bedrooms_max: string;

  building_age: string;

  // heating/usage
  heating: string;
  usage_status: string;

  // bools
  featured: boolean;
  furnished: boolean;
  in_site: boolean;
  has_elevator: boolean;
  has_parking: boolean;
  has_balcony: boolean;
  has_garden: boolean;
  has_terrace: boolean;
  credit_eligible: boolean;
  swap: boolean;
  has_virtual_tour: boolean;
  accessible: boolean;
};

// ----------------------------- helpers -----------------------------

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

function safeImage(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : PLACEHOLDER_IMG;
}

function pickFirstImageFromAssets(assets: PropertyAssetPublic[] | undefined): string | null {
  if (!Array.isArray(assets) || !assets.length) return null;

  const images = assets
    .filter((a) => (a?.kind || "image") === "image")
    .sort((a, b) => (a.is_cover === b.is_cover ? (a.display_order ?? 0) - (b.display_order ?? 0) : a.is_cover ? -1 : 1));

  const first = images[0];
  const u = first?.url ? String(first.url) : "";
  return u.trim().length ? u.trim() : null;
}

function pickImagesFromAssets(assets: PropertyAssetPublic[] | undefined): string[] {
  if (!Array.isArray(assets) || !assets.length) return [PLACEHOLDER_IMG];

  const images = assets
    .filter((a) => (a?.kind || "image") === "image")
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((a) => safeImage(a?.url))
    .filter(Boolean);

  return images.length ? images : [PLACEHOLDER_IMG];
}

function toUiProperty(p: PropertyView): UiProperty {
  const assets = Array.isArray((p as any).assets) ? ((p as any).assets as PropertyAssetPublic[]) : undefined;

  const imagesFromAssets = pickImagesFromAssets(assets);

  const cover =
    safeImage(
      (p as any).image_effective_url ??
        (p as any).image_url ??
        pickFirstImageFromAssets(assets) ??
        imagesFromAssets[0] ??
        PLACEHOLDER_IMG,
    );

  return {
    id: String((p as any).id),
    slug: String((p as any).slug ?? ""),
    title: String((p as any).title ?? ""),

    type: String((p as any).type ?? ""),
    status: String((p as any).status ?? ""),

    address: String((p as any).address ?? ""),
    district: String((p as any).district ?? ""),
    city: String((p as any).city ?? ""),
    neighborhood: typeof (p as any).neighborhood !== "undefined" ? ((p as any).neighborhood ?? null) : null,

    description: (p as any).description ?? null,

    price: typeof (p as any).price !== "undefined" ? ((p as any).price ?? null) : null,
    currency: typeof (p as any).currency !== "undefined" ? String((p as any).currency ?? "TRY") : "TRY",

    rooms: typeof (p as any).rooms !== "undefined" ? ((p as any).rooms ?? null) : null,
    gross_m2: typeof (p as any).gross_m2 !== "undefined" ? (Number.isFinite(Number((p as any).gross_m2)) ? Number((p as any).gross_m2) : null) : null,

    created_at: String((p as any).created_at ?? ""),
    display_order: Number((p as any).display_order ?? 0),

    image: cover,
    images: imagesFromAssets,
  };
}

function normalizeStatusLabel(v: string): string {
  const s = (v || "").toLowerCase();
  if (s === "sold") return "Satıldı";
  if (s === "new") return "Yeni";
  if (s === "in_progress") return "Süreçte";
  if (s === "satilik") return "Satılık";
  if (s === "kiralik") return "Kiralık";
  return v || "Durum";
}

function normalizeTypeLabel(v: string): string {
  return v || "Tür";
}

function toSelectOptions(arr: unknown): string[] {
  return Array.isArray(arr) ? (arr as any[]).map((x) => String(x)).filter(Boolean) : [];
}

const toNumOrUndef = (s: string): number | undefined => {
  const t = (s || "").trim();
  if (!t) return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    city: "",
    district: "",
    neighborhood: "",
    type: "",
    status: "",

    price_min: "",
    price_max: "",
    gross_m2_min: "",
    gross_m2_max: "",

    rooms: "",
    bedrooms_min: "",
    bedrooms_max: "",
    building_age: "",

    heating: "",
    usage_status: "",

    featured: false,
    furnished: false,
    in_site: false,
    has_elevator: false,
    has_parking: false,
    has_balcony: false,
    has_garden: false,
    has_terrace: false,
    credit_eligible: false,
    swap: false,
    has_virtual_tour: false,
    accessible: false,
  });

  useEffect(() => {
    if (showSearchResults) {
      setFilters((p) => ({ ...p, search: searchTerm || "" }));
    }
  }, [showSearchResults, searchTerm]);

  const { data: citiesRaw = [] } = useListPropertyCitiesQuery();
  const { data: districtsRaw = [] } = useListPropertyDistrictsQuery();
  const { data: neighborhoodsRaw = [] } = useListPropertyNeighborhoodsQuery();
  const { data: typesRaw = [] } = useListPropertyTypesQuery();
  const { data: statusesRaw = [] } = useListPropertyStatusesQuery();

  const cities = useMemo(() => toSelectOptions(citiesRaw), [citiesRaw]);
  const districts = useMemo(() => toSelectOptions(districtsRaw), [districtsRaw]);
  const neighborhoods = useMemo(() => toSelectOptions(neighborhoodsRaw), [neighborhoodsRaw]);
  const types = useMemo(() => toSelectOptions(typesRaw), [typesRaw]);
  const statuses = useMemo(() => toSelectOptions(statusesRaw), [statusesRaw]);

  const queryParams = useMemo(() => {
    const q: any = { active: true, limit: 200, offset: 0, sort: "display_order" }; // sort backend enum’da yok; orderParam ile de verebilirsin
    // Backend tarafında "sort" enumu fixed; burada sadece param olarak göndermeyelim:
    delete q.sort;

    if (showSearchResults && searchTerm.trim()) {
      q.search = searchTerm.trim();
      return q;
    }

    // base
    if (filters.search.trim()) q.search = filters.search.trim();
    if (filters.city) q.city = filters.city;
    if (filters.district) q.district = filters.district;
    if (filters.neighborhood) q.neighborhood = filters.neighborhood;
    if (filters.type) q.type = filters.type;
    if (filters.status) q.status = filters.status;

    if (filters.featured) q.featured = true;

    // ranges
    const priceMin = toNumOrUndef(filters.price_min);
    const priceMax = toNumOrUndef(filters.price_max);
    if (typeof priceMin !== "undefined") q.price_min = priceMin;
    if (typeof priceMax !== "undefined") q.price_max = priceMax;

    const gm2Min = toNumOrUndef(filters.gross_m2_min);
    const gm2Max = toNumOrUndef(filters.gross_m2_max);
    if (typeof gm2Min !== "undefined") q.gross_m2_min = Math.trunc(gm2Min);
    if (typeof gm2Max !== "undefined") q.gross_m2_max = Math.trunc(gm2Max);

    // room filters
    if (filters.rooms.trim()) q.rooms = filters.rooms.trim();

    const bdMin = toNumOrUndef(filters.bedrooms_min);
    const bdMax = toNumOrUndef(filters.bedrooms_max);
    if (typeof bdMin !== "undefined") q.bedrooms_min = Math.trunc(bdMin);
    if (typeof bdMax !== "undefined") q.bedrooms_max = Math.trunc(bdMax);

    if (filters.building_age.trim()) q.building_age = filters.building_age.trim();

    // heating/usage
    if (filters.heating.trim()) q.heating = filters.heating.trim();
    if (filters.usage_status.trim()) q.usage_status = filters.usage_status.trim();

    // bool toggles (only send when true to keep query clean)
    const pushTrue = (key: string, v: boolean) => {
      if (v) q[key] = true;
    };
    pushTrue("furnished", filters.furnished);
    pushTrue("in_site", filters.in_site);
    pushTrue("has_elevator", filters.has_elevator);
    pushTrue("has_parking", filters.has_parking);
    pushTrue("has_balcony", filters.has_balcony);
    pushTrue("has_garden", filters.has_garden);
    pushTrue("has_terrace", filters.has_terrace);
    pushTrue("credit_eligible", filters.credit_eligible);
    pushTrue("swap", filters.swap);
    pushTrue("has_virtual_tour", filters.has_virtual_tour);
    pushTrue("accessible", filters.accessible);

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

  useEffect(() => setVisibleItems(12), [
    filters.city,
    filters.district,
    filters.neighborhood,
    filters.type,
    filters.status,
    filters.search,
    filters.featured,
    filters.price_min,
    filters.price_max,
    filters.gross_m2_min,
    filters.gross_m2_max,
    filters.rooms,
    filters.bedrooms_min,
    filters.bedrooms_max,
    filters.building_age,
    filters.heating,
    filters.usage_status,
    filters.furnished,
    filters.in_site,
    filters.has_elevator,
    filters.has_parking,
    filters.has_balcony,
    filters.has_garden,
    filters.has_terrace,
    filters.credit_eligible,
    filters.swap,
    filters.has_virtual_tour,
    filters.accessible,
    showSearchResults,
    searchTerm,
  ]);

  const loadMore = () => setVisibleItems((p) => p + 12);

  const clearLocalFilters = () => {
    setFilters({
      search: "",
      city: "",
      district: "",
      neighborhood: "",
      type: "",
      status: "",

      price_min: "",
      price_max: "",
      gross_m2_min: "",
      gross_m2_max: "",

      rooms: "",
      bedrooms_min: "",
      bedrooms_max: "",
      building_age: "",

      heating: "",
      usage_status: "",

      featured: false,
      furnished: false,
      in_site: false,
      has_elevator: false,
      has_parking: false,
      has_balcony: false,
      has_garden: false,
      has_terrace: false,
      credit_eligible: false,
      swap: false,
      has_virtual_tour: false,
      accessible: false,
    });
  };

  const onCardClick = (p: UiProperty) => {
    const s = (p.slug || "").trim();
    if (s) onPropertyDetail(s);
  };

  const formatPrice = (price?: string | null, currency?: string | null) => {
    if (!price) return null;
    const c = currency || "TRY";
    return `${price} ${c}`;
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
                  onClick={() => setShowAdvanced((p) => !p)}
                  className="border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Gelişmiş
                </Button>
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

            {/* Basic row */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
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
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={filters.district}
                onChange={(e) => setFilters((p) => ({ ...p, district: e.target.value }))}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
              >
                <option value="">İlçe</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
              >
                <option value="">Tür</option>
                {types.map((t) => (
                  <option key={t} value={t}>{normalizeTypeLabel(t)}</option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
              >
                <option value="">Durum</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{normalizeStatusLabel(s)}</option>
                ))}
              </select>
            </div>

            {/* Advanced */}
            {showAdvanced && (
              <div className="mt-5 border-t border-gray-100 pt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <select
                    value={filters.neighborhood}
                    onChange={(e) => setFilters((p) => ({ ...p, neighborhood: e.target.value }))}
                    className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800 md:col-span-2"
                  >
                    <option value="">Mahalle</option>
                    {neighborhoods.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>

                  <Input
                    value={filters.price_min}
                    onChange={(e) => setFilters((p) => ({ ...p, price_min: e.target.value }))}
                    placeholder="Min fiyat"
                    className="md:col-span-1"
                  />
                  <Input
                    value={filters.price_max}
                    onChange={(e) => setFilters((p) => ({ ...p, price_max: e.target.value }))}
                    placeholder="Max fiyat"
                    className="md:col-span-1"
                  />

                  <Input
                    value={filters.gross_m2_min}
                    onChange={(e) => setFilters((p) => ({ ...p, gross_m2_min: e.target.value }))}
                    placeholder="Min brüt m²"
                    className="md:col-span-1"
                  />
                  <Input
                    value={filters.gross_m2_max}
                    onChange={(e) => setFilters((p) => ({ ...p, gross_m2_max: e.target.value }))}
                    placeholder="Max brüt m²"
                    className="md:col-span-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <Input
                    value={filters.rooms}
                    onChange={(e) => setFilters((p) => ({ ...p, rooms: e.target.value }))}
                    placeholder="Oda (örn: 2+1)"
                    className="md:col-span-2"
                  />
                  <Input
                    value={filters.bedrooms_min}
                    onChange={(e) => setFilters((p) => ({ ...p, bedrooms_min: e.target.value }))}
                    placeholder="Min yatak odası"
                    className="md:col-span-1"
                  />
                  <Input
                    value={filters.bedrooms_max}
                    onChange={(e) => setFilters((p) => ({ ...p, bedrooms_max: e.target.value }))}
                    placeholder="Max yatak odası"
                    className="md:col-span-1"
                  />
                  <Input
                    value={filters.building_age}
                    onChange={(e) => setFilters((p) => ({ ...p, building_age: e.target.value }))}
                    placeholder="Bina yaşı (örn: 0-5, 10+)"
                    className="md:col-span-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <Input
                    value={filters.heating}
                    onChange={(e) => setFilters((p) => ({ ...p, heating: e.target.value }))}
                    placeholder="Isıtma (Kombi, Merkezi...)"
                    className="md:col-span-3"
                  />
                  <Input
                    value={filters.usage_status}
                    onChange={(e) => setFilters((p) => ({ ...p, usage_status: e.target.value }))}
                    placeholder="Kullanım (Boş, Kiracılı...)"
                    className="md:col-span-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    ["featured", "Öne Çıkan"] as const,
                    ["furnished", "Eşyalı"] as const,
                    ["in_site", "Site İçinde"] as const,
                    ["has_elevator", "Asansör"] as const,
                    ["has_parking", "Otopark"] as const,
                    ["has_balcony", "Balkon"] as const,
                    ["has_garden", "Bahçe"] as const,
                    ["has_terrace", "Teras"] as const,
                    ["credit_eligible", "Krediye Uygun"] as const,
                    ["swap", "Takas"] as const,
                    ["has_virtual_tour", "Sanal Tur"] as const,
                    ["accessible", "Erişilebilir"] as const,
                  ].map(([k, label]) => (
                    <div key={k} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                      <Label className="text-sm text-slate-900">{label}</Label>
                      <Switch
                        checked={(filters as any)[k]}
                        onCheckedChange={(v) => setFilters((p) => ({ ...p, [k]: Boolean(v) } as any))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
