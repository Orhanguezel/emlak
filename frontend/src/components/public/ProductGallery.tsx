// src/components/public/ProductGallery.tsx
import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom"; // artık kullanmıyoruz
import { ImageOptimized } from "./ImageOptimized";
import { SkeletonLoader } from "./SkeletonLoader";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";

import { useListProductsQuery } from "@/integrations/rtk/endpoints/products.endpoints";
import type { Product as ApiProduct } from "@/integrations/rtk/types/products.rows";

/* ========================== constants & types ========================== */

/** Ana kategori: MEZAR MODELLERİ */
const TOP_CATEGORY_ID = "aaaa0001-1111-4111-8111-aaaaaaaa0001";

/** Başlangıçta “hepsi” gösterimi için sanal durum */
const ALL_KEY = "ALL";

const SUBCATS: Array<{ id: string; label: string }> = [
  { id: "bbbb0001-2222-4222-8222-bbbbbbbb0001", label: "Tek Kişilik Mermer Modeller" },
  { id: "bbbb0002-2222-4222-8222-bbbbbbbb0002", label: "Tek Kişilik Granit Modeller" },
  { id: "bbbb0003-2222-4222-8222-bbbbbbbb0003", label: "İki Kişilik Mermer Modeller" },
  { id: "bbbb0004-2222-4222-8222-bbbbbbbb0004", label: "İki Kişilik Granit Modeller" },
  { id: "bbbb0005-2222-4222-8222-bbbbbbbb0005", label: "Katlı Lahit Mezar Modelleri" },
  { id: "bbbb0006-2222-4222-8222-bbbbbbbb0006", label: "Özel Yapım Mezar Modelleri" },
  { id: "bbbb0007-2222-4222-8222-bbbbbbbb0007", label: "Sütunlu Mezar Modelleri" },
];

type UiProduct = {
  id: string;
  slug: string; // slug ile detay sayfasına gideceğiz
  title: string;
  productCode?: string | null;
  price: number | string;
  image: string;
  description: string;
  category_id: string;
  sub_category_id?: string | null;
};

type UiCard = UiProduct & { kind: "product" };

type UiCategory = {
  id: string;
  label: string;
  isHeader: boolean;
};

/** Sidebar için UI kategorileri (header + alt kategoriler) */
const CATEGORIES: UiCategory[] = [
  {
    id: ALL_KEY,
    label: "MEZAR MODELLERİ",
    isHeader: true,
  },
  ...SUBCATS.map((c) => ({
    id: c.id,
    label: c.label,
    isHeader: false,
  })),
];

/* ========================== mappers ========================== */

function toUiProduct(p: ApiProduct): UiProduct {
  const primaryImage =
    (Array.isArray((p as any).images) && (p as any).images.length
      ? (p as any).images[0]
      : null) ||
    (p as any).image_url ||
    "";

  return {
    id: String((p as any).id),
    slug: String((p as any).slug ?? ""),
    title: String((p as any).title ?? ""),
    productCode: (p as any).product_code ?? null,
    price:
      typeof (p as any).price === "number"
        ? (p as any).price
        : Number((p as any).price) || 0,
    image: primaryImage,
    description: (p as any).description ?? "",
    category_id: String((p as any).category_id ?? ""),
    sub_category_id: (p as any).sub_category_id ?? null,
  };
}

/* ---------- helpers: price format ---------- */
function formatPrice(price: number | string | null | undefined): string {
  const num = typeof price === "number" ? price : Number(price);

  if (!Number.isFinite(num) || num <= 0) {
    return "Fiyat İçin Arayınız";
  }

  const rounded = Math.round(num);
  return `${rounded} TL`;
}

/* =============================== component =============================== */

interface ProductGalleryProps {
  searchTerm: string;
  showSearchResults: boolean;
  onClearSearch: () => void;
  /** slug ile detail açıyoruz */
  onProductDetail: (slug: string) => void;
  refreshKey?: number;
}

export function ProductGallery({
  searchTerm,
  showSearchResults,
  onClearSearch,
  onProductDetail,
  refreshKey,
}: ProductGalleryProps) {
  // const navigate = useNavigate(); // kullanılmıyor

  /** ALL_KEY = tüm alt kategoriler; yoksa seçilen alt kategori id’si */
  const [selectedSubCat, setSelectedSubCat] = useState<string>(ALL_KEY);
  const [visibleItems, setVisibleItems] = useState(12);
  const [softLoading, setSoftLoading] = useState(true);

  /* ---------- Query params (yalnız MEZAR MODELLERİ kapsamı) ---------- */
  const currentQueryParams = useMemo(() => {
    const params: any = {
      is_active: true,
      limit: 60,
    };

    if (showSearchResults && searchTerm.trim()) {
      params.q = searchTerm.trim();
      // Arama da sadece bu üst kategoride olsun
      params.category_id = TOP_CATEGORY_ID;
      return params;
    }

    if (selectedSubCat !== ALL_KEY) {
      params.sub_category_id = selectedSubCat; // BE bunu destekliyorsa
    } else {
      params.category_id = TOP_CATEGORY_ID;
    }
    return params;
  }, [showSearchResults, searchTerm, selectedSubCat]);

  const { data: listRes, isFetching: fetchingList } =
    useListProductsQuery(currentQueryParams);

  /* ---------- Soft skeleton UX ---------- */
  useEffect(() => {
    setSoftLoading(true);
    const t = setTimeout(() => setSoftLoading(false), 250);
    return () => clearTimeout(t);
  }, [selectedSubCat, searchTerm, showSearchResults, refreshKey]);

  /* ---------- Transform to UI ---------- */
  const uiListedProducts: UiCard[] = useMemo(() => {
    const serverArr = Array.isArray(listRes) ? listRes.map(toUiProduct) : [];
    return serverArr.map((p) => ({ ...p, kind: "product" as const }));
  }, [listRes]);

  /* ---------- Loading state ---------- */
  const isLoading = fetchingList || softLoading;

  /* ---------- Visible list ---------- */
  const displayedCards = useMemo(
    () => uiListedProducts.slice(0, visibleItems),
    [uiListedProducts, visibleItems]
  );

  useEffect(() => {
    setVisibleItems(12);
  }, [selectedSubCat, searchTerm, showSearchResults]);

  const loadMore = () => setVisibleItems((p) => p + 12);

  const navigateFromCard = (card: UiCard) => {
    if (card.kind === "product" && card.slug) {
      onProductDetail(card.slug); // slug ile yönlendir
    }
  };

  /* --------------------------------- render --------------------------------- */

  return (
    <section className="py-16 bg-gray-50" id="products">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search Header */}
        {showSearchResults && (
          <div className="text-center mb-12">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <h2 className="text-4xl font-bold text-gray-800">
                  "{searchTerm}" için Arama Sonuçları
                </h2>
                <Button
                  onClick={onClearSearch}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-teal-500 text-teal-600 hover:bg-teal-50"
                >
                  <X className="w-4 h-4" />
                  Temizle
                </Button>
              </div>
              <p className="text-xl text-gray-600">
                {uiListedProducts.length} ürün bulundu
              </p>
            </div>
          </div>
        )}

        {/* Main Content - Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol sidebar – kategoriler (sadece arama yokken) */}
          {!showSearchResults && (
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                {/* Mobile Layout - 2 kolon grid */}
                <div className="lg:hidden">
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => setSelectedSubCat(category.id)}
                        className={`px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 text-sm ${
                          category.isHeader
                            ? selectedSubCat === category.id
                              ? "bg-teal-600 text-white"
                              : "bg-teal-500 text-white hover:bg-teal-600"
                            : selectedSubCat === category.id
                            ? "bg-teal-100 text-teal-700"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-center">{category.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Layout - üstte header, altta satırlar */}
                <div className="hidden lg:block">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {CATEGORIES.map((category) =>
                      category.isHeader ? (
                        <div
                          key={category.id}
                          className="bg-teal-500 text-white px-6 py-4 cursor-pointer hover:bg-teal-600 transition-colors duration-200"
                          onClick={() => setSelectedSubCat(category.id)}
                        >
                          <h3 className="font-bold text-lg text-center">
                            {category.label}
                          </h3>
                        </div>
                      ) : (
                        <div
                          key={category.id}
                          onClick={() => setSelectedSubCat(category.id)}
                          className={`px-6 py-4 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                            selectedSubCat === category.id
                              ? "bg-teal-50 text-teal-700 font-medium"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="text-sm">{category.label}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sağ taraf – ürün grid */}
          <div className={showSearchResults ? "w-full" : "lg:w-3/4"}>
            {isLoading ? (
              <SkeletonLoader type="grid" count={12} />
            ) : (
              <>
                {/* 2 kolon mobil, 3 kolon desktop – stil static ProductGallery ile uyumlu */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                 {displayedCards.map((card, index) => (
                    <div
                      key={`${card.kind}-${card.id}`}
                       className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer"
                      onClick={() => navigateFromCard(card)}
                    >
                      {/* Image Container */}
                     <div className="relative aspect-[4/3] lg:aspect-[4/3] sm:aspect-[3/4] overflow-hidden bg-gray-100">
                        <ImageOptimized
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          priority={index < 6}
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          quality={85}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-800 mb-3 line-clamp-2 uppercase">
                          {card.title}
                        </h3>

                        {/* Code + Price */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-block px-3 py-1 border-2 border-blue-500 text-blue-600 text-xs font-bold rounded">
                            {card.productCode ?? "KOD-YOK"}
                          </span>
                          <span className="text-lg font-bold text-gray-800">
                            {formatPrice(card.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {visibleItems < uiListedProducts.length && (
                  <div className="text-center">
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      size="lg"
                      className="px-8 py-3 border-teal-500 text-teal-600 hover:bg-teal-50"
                    >
                      Daha Fazla Göster (
                      {uiListedProducts.length - visibleItems} öğe daha)
                    </Button>
                  </div>
                )}

                {/* No Results */}
                {uiListedProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {showSearchResults
                          ? "Arama sonucu bulunamadı"
                          : "Bu kategoride içerik yok"}
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        {showSearchResults
                          ? `"${searchTerm}" ile eşleşen ürün bulunamadı.`
                          : "Seçilen kategoride henüz içerik bulunmuyor."}
                      </p>
                    </div>

                    {showSearchResults && (
                      <Button
                        onClick={onClearSearch}
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        Tüm Ürünleri Görüntüle
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
